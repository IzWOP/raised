/* eslint-disable react-hooks/immutability --
   This is a Three.js render loop: useFrame mutates BufferAttribute arrays and sets
   .needsUpdate in place every frame by design (GPU buffer updates). The immutability
   rule fundamentally conflicts with imperative WebGL rendering. */
"use client";

import { useMemo, useRef } from "react";
import * as THREE from "three";
import { useFrame, useThree } from "@react-three/fiber";
import { sceneGeometry, MAX_DEBRIS } from "@/lib/scene/geometry";
import { sceneParams, pointer, sceneFlags } from "@/lib/scene/store";
import { updateSceneParams, updatePointer } from "@/lib/scene/params";

const C_EDGE = new THREE.Color("#D9D9D9"); // edges + nodes
const C_PACKET = new THREE.Color("#FFFFFF"); // packets
const C_DEBRIS = new THREE.Color("#8C8C8C"); // debris
const C_CRIT = new THREE.Color("#c08585"); // crit flicker — diagnostic only

// ---- materials: per-vertex alpha over black, no depth, normal blend ----
function pointMaterial(color: THREE.Color, size: number, round = false) {
  return new THREE.ShaderMaterial({
    uniforms: {
      uColor: { value: color },
      uSize: { value: size },
      uPixelRatio: { value: 1 },
    },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending,
    vertexShader: /* glsl */ `
      attribute float alpha;
      varying float vAlpha;
      uniform float uSize;
      uniform float uPixelRatio;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        gl_PointSize = uSize * uPixelRatio;
      }
    `,
    fragmentShader: /* glsl */ `
      precision mediump float;
      varying float vAlpha;
      uniform vec3 uColor;
      void main() {
        if (vAlpha <= 0.001) discard;
        ${round
          ? "if (length(gl_PointCoord - vec2(0.5)) > 0.5) discard;"
          : ""}
        gl_FragColor = vec4(uColor, vAlpha);
      }
    `,
  });
}

function lineMaterial(color: THREE.Color) {
  return new THREE.ShaderMaterial({
    uniforms: { uColor: { value: color } },
    transparent: true,
    depthTest: false,
    depthWrite: false,
    blending: THREE.NormalBlending,
    vertexShader: /* glsl */ `
      attribute float alpha;
      varying float vAlpha;
      void main() {
        vAlpha = alpha;
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
      }
    `,
    fragmentShader: /* glsl */ `
      precision mediump float;
      varying float vAlpha;
      uniform vec3 uColor;
      void main() {
        if (vAlpha <= 0.001) discard;
        gl_FragColor = vec4(uColor, vAlpha);
      }
    `,
  });
}

interface DebrisP {
  x: number;
  y: number;
  vx: number;
  vy: number;
  a: number;
  rest: number;
}

export default function Field() {
  const { gl } = useThree();
  const { nodes, chaosEdges, latticeEdges, packets } = sceneGeometry;
  const N = nodes.length;
  const nC = chaosEdges.length;
  const nL = latticeEdges.length;

  // per-frame screen-space scratch (sx, sy in CSS px, k = depth scale)
  const sx = useMemo(() => new Float32Array(N), [N]);
  const sy = useMemo(() => new Float32Array(N), [N]);
  const sk = useMemo(() => new Float32Array(N), [N]);

  // mutable packet copy (t advances)
  const pk = useMemo(
    () => packets.map((p) => ({ ...p })),
    [packets],
  );
  const debris = useRef<DebrisP[]>([]);

  // ---- build geometry objects once ----
  const built = useMemo(() => {
    const mk = (count: number) => {
      const pos = new Float32Array(count * 3);
      const alpha = new Float32Array(count);
      const geo = new THREE.BufferGeometry();
      geo.setAttribute("position", new THREE.BufferAttribute(pos, 3));
      geo.setAttribute("alpha", new THREE.BufferAttribute(alpha, 1));
      return { pos, alpha, geo };
    };

    const nodeG = mk(N); // node points
    const critG = { // crit shares node positions, own alpha
      pos: nodeG.pos,
      alpha: new Float32Array(N),
      geo: new THREE.BufferGeometry(),
    };
    critG.geo.setAttribute("position", nodeG.geo.getAttribute("position"));
    critG.geo.setAttribute("alpha", new THREE.BufferAttribute(critG.alpha, 1));

    const chaosG = mk(nC * 2);
    const latticeG = mk(nL * 2);
    const headG = mk(packets.length);
    const trailG = mk(packets.length * 2);
    const debrisG = mk(MAX_DEBRIS);

    const nodePts = new THREE.Points(nodeG.geo, pointMaterial(C_EDGE, 2));
    const critPts = new THREE.Points(critG.geo, pointMaterial(C_CRIT, 5, true));
    const chaosLines = new THREE.LineSegments(chaosG.geo, lineMaterial(C_EDGE));
    const latticeLines = new THREE.LineSegments(latticeG.geo, lineMaterial(C_EDGE));
    const trailLines = new THREE.LineSegments(trailG.geo, lineMaterial(C_PACKET));
    const headPts = new THREE.Points(headG.geo, pointMaterial(C_PACKET, 2.4));
    const debrisPts = new THREE.Points(debrisG.geo, pointMaterial(C_DEBRIS, 2));

    chaosLines.renderOrder = 0;
    latticeLines.renderOrder = 1;
    nodePts.renderOrder = 2;
    critPts.renderOrder = 3;
    trailLines.renderOrder = 4;
    headPts.renderOrder = 5;
    debrisPts.renderOrder = 6;
    [nodePts, critPts, chaosLines, latticeLines, trailLines, headPts, debrisPts].forEach(
      (o) => {
        o.frustumCulled = false;
      },
    );

    return {
      nodeG, critG, chaosG, latticeG, headG, trailG, debrisG,
      objects: [chaosLines, latticeLines, nodePts, critPts, trailLines, headPts, debrisPts],
    };
  }, [N, nC, nL, packets.length]);

  // push device pixel ratio into the point materials
  useMemo(() => {
    const pr = gl.getPixelRatio();
    built.objects.forEach((o) => {
      const m = (o as THREE.Points).material as THREE.ShaderMaterial;
      if (m.uniforms.uPixelRatio) m.uniforms.uPixelRatio.value = pr;
    });
  }, [built, gl]);

  useFrame((state) => {
    const { width: cw, height: ch } = state.size;
    if (cw === 0 || ch === 0) return;

    // ---- reduced-motion: skip scroll-driven state, render final lattice static ----
    if (sceneFlags.reduced) {
      // Force resting lattice values — oe=1, no wobble, no degrade, no dim, no parallax
      const oe = 1; // full lattice (order=1 smoothstepped)
      const dimm = 1; // dim=0 → 1-0*0.68 = 1
      const breathe = 1; // breathe=0 → 1+0*... = 1
      // Camera at lattice resting: rotY = 0*0.045 + 0 + 0 + 1*0.4 = 0.4, tilt = 0.16+0.36+0 = 0.52
      const rotY = oe * 0.4; // = 0.4
      const tilt = 0.16 + oe * 0.36; // = 0.52
      const cR = Math.cos(rotY), sR = Math.sin(rotY);
      const cT = Math.cos(tilt), sT = Math.sin(tilt);
      const halfW = cw / 2, halfH = ch / 2;

      const nodePos = built.nodeG.pos;
      const nodeAlpha = built.nodeG.alpha;
      const critAlpha = built.critG.alpha;
      for (let i = 0; i < N; i++) {
        const n = nodes[i];
        // Fully lattice position, no wobble (wAmp = 1-oe = 0)
        const px = n.lx, py = n.ly, pz = n.lz;
        const X = px * cR - pz * sR;
        let Z = px * sR + pz * cR;
        const Y = py * cT - Z * sT;
        Z = py * sT + Z * cT;
        const k = 1100 / (1500 + Z);
        const px2 = halfW + X * k;
        const py2 = halfH + Y * k;
        sx[i] = px2; sy[i] = py2; sk[i] = k;
        nodePos[i * 3] = px2 - halfW;
        nodePos[i * 3 + 1] = halfH - py2;
        nodePos[i * 3 + 2] = 0;
        nodeAlpha[i] = (0.22 + k * 0.3) * dimm * breathe;
        critAlpha[i] = 0; // no crit flicker in reduced
      }

      // Chaos edges hidden (oe=1 → base = (1-1)*0.12 = 0)
      built.chaosG.alpha.fill(0);
      // Lattice edges fully visible (oe=1 → base = 1*0.17 = 0.17)
      const latticeBase = oe * 0.17 * dimm * breathe; // 0.17
      const lPos = built.latticeG.pos, lAl = built.latticeG.alpha;
      for (let i = 0; i < latticeEdges.length; i++) {
        const ai = latticeEdges[i][0], bi = latticeEdges[i][1];
        const alpha = latticeBase * (0.6 + 0.4 * Math.min(sk[ai], sk[bi]));
        const o0 = i * 6;
        lPos[o0] = sx[ai] - halfW; lPos[o0 + 1] = halfH - sy[ai]; lPos[o0 + 2] = 0;
        lPos[o0 + 3] = sx[bi] - halfW; lPos[o0 + 4] = halfH - sy[bi]; lPos[o0 + 5] = 0;
        lAl[i * 2] = alpha; lAl[i * 2 + 1] = alpha;
      }

      // Packets on lattice edges (oe > 0.55, so ordered=true; t=0 → static positions)
      const pa = (0.5 + oe * 0.4) * dimm * breathe; // 0.9
      const headPos = built.headG.pos, headAlpha = built.headG.alpha;
      const trailPos = built.trailG.pos, trailAlpha = built.trailG.alpha;
      for (let i = 0; i < pk.length; i++) {
        const p = pk[i];
        const e = latticeEdges[p.li % latticeEdges.length];
        const A = e[0], B = e[1];
        const hx = sx[A] + (sx[B] - sx[A]) * p.t;
        const hy = sy[A] + (sy[B] - sy[A]) * p.t;
        const tb = Math.max(0, p.t - 0.08);
        const tx = sx[A] + (sx[B] - sx[A]) * tb;
        const ty = sy[A] + (sy[B] - sy[A]) * tb;
        headPos[i * 3] = hx - halfW; headPos[i * 3 + 1] = halfH - hy; headPos[i * 3 + 2] = 0;
        headAlpha[i] = pa;
        const o0 = i * 6;
        trailPos[o0] = tx - halfW; trailPos[o0 + 1] = halfH - ty; trailPos[o0 + 2] = 0;
        trailPos[o0 + 3] = hx - halfW; trailPos[o0 + 4] = halfH - hy; trailPos[o0 + 5] = 0;
        trailAlpha[i * 2] = pa * 0.35; trailAlpha[i * 2 + 1] = pa * 0.35;
      }

      // No debris in reduced
      built.debrisG.alpha.fill(0);

      // flush
      built.nodeG.geo.getAttribute("position").needsUpdate = true;
      built.nodeG.geo.getAttribute("alpha").needsUpdate = true;
      built.critG.geo.getAttribute("alpha").needsUpdate = true;
      built.chaosG.geo.getAttribute("alpha").needsUpdate = true;
      built.latticeG.geo.getAttribute("position").needsUpdate = true;
      built.latticeG.geo.getAttribute("alpha").needsUpdate = true;
      built.headG.geo.getAttribute("position").needsUpdate = true;
      built.headG.geo.getAttribute("alpha").needsUpdate = true;
      built.trailG.geo.getAttribute("position").needsUpdate = true;
      built.trailG.geo.getAttribute("alpha").needsUpdate = true;
      built.debrisG.geo.getAttribute("alpha").needsUpdate = true;
      return;
    }

    updateSceneParams(ch);
    updatePointer();

    const t = state.clock.elapsedTime;
    const P = sceneParams;
    const o = Math.min(1, Math.max(0, P.order));
    const oe = o * o * (3 - 2 * o); // smoothstep
    const degrade = P.degrade;
    const dimm = 1 - P.dim * 0.68;
    const breathe = 1 + P.breathe * 0.22 * (0.5 + 0.5 * Math.sin(t * 1.4));
    const rotY = t * 0.045 + pointer.smx * 0.07 + P.orbit * 2.0 + oe * 0.4;
    const tilt = 0.16 + oe * 0.36 + pointer.smy * 0.05;
    const cR = Math.cos(rotY), sR = Math.sin(rotY);
    const cT = Math.cos(tilt), sT = Math.sin(tilt);
    const wAmp = 1 - oe;
    const halfW = cw / 2, halfH = ch / 2;

    // ---- 1. project nodes to screen space ----
    const nodePos = built.nodeG.pos;
    const nodeAlpha = built.nodeG.alpha;
    const critAlpha = built.critG.alpha;
    for (let i = 0; i < N; i++) {
      const n = nodes[i];
      const wob = Math.sin(t * n.sp + n.ph) * n.amp * wAmp;
      const px = n.cx + (n.lx - n.cx) * oe;
      const py = n.cy + (n.ly - n.cy) * oe + wob;
      const pz = n.cz + (n.lz - n.cz) * oe;
      const X = px * cR - pz * sR;
      let Z = px * sR + pz * cR;
      const Y = py * cT - Z * sT;
      Z = py * sT + Z * cT;
      const k = 1100 / (1500 + Z);
      const px2 = halfW + X * k;
      const py2 = halfH + Y * k;
      sx[i] = px2;
      sy[i] = py2;
      sk[i] = k;
      // screen → world (y flipped); z layered slightly by depth for stable order
      nodePos[i * 3] = px2 - halfW;
      nodePos[i * 3 + 1] = halfH - py2;
      nodePos[i * 3 + 2] = 0;
      nodeAlpha[i] = (0.22 + k * 0.3) * dimm * breathe;

      // crit flicker (diagnostic) — only while degrading
      let ca = 0;
      if (degrade > 0.2 && n.crit && Math.sin(t * 7 + n.ph * 13) > 0.92) {
        ca = degrade * 0.85;
      }
      critAlpha[i] = ca;
    }

    // ---- 2. edges ----
    const writeEdges = (
      edges: readonly (readonly [number, number])[],
      g: { pos: Float32Array; alpha: Float32Array },
      base: number,
      flicker: boolean,
    ) => {
      const pos = g.pos, al = g.alpha;
      if (base <= 0.004) {
        al.fill(0);
        return;
      }
      for (let i = 0; i < edges.length; i++) {
        let a = base;
        if (flicker && degrade > 0.02) {
          const fl = 0.5 + 0.5 * Math.sin(t * 11 + i * 7.31);
          a *= 1 - degrade * (fl < 0.4 ? 0.92 : 0.25);
        }
        const ai = edges[i][0], bi = edges[i][1];
        const alpha = a * (0.6 + 0.4 * Math.min(sk[ai], sk[bi]));
        const o0 = i * 6;
        pos[o0] = sx[ai] - halfW;
        pos[o0 + 1] = halfH - sy[ai];
        pos[o0 + 2] = 0;
        pos[o0 + 3] = sx[bi] - halfW;
        pos[o0 + 4] = halfH - sy[bi];
        pos[o0 + 5] = 0;
        al[i * 2] = alpha;
        al[i * 2 + 1] = alpha;
      }
    };
    writeEdges(chaosEdges, built.chaosG, (1 - oe) * 0.12 * dimm * breathe, true);
    writeEdges(latticeEdges, built.latticeG, oe * 0.17 * dimm * breathe, false);

    // ---- 3. packets ----
    const ordered = oe > 0.55;
    const edges = ordered ? latticeEdges : chaosEdges;
    const headPos = built.headG.pos, headAlpha = built.headG.alpha;
    const trailPos = built.trailG.pos, trailAlpha = built.trailG.alpha;
    const pa = (0.5 + oe * 0.4) * dimm * breathe;
    for (let i = 0; i < pk.length; i++) {
      const p = pk[i];
      const e = edges[(ordered ? p.li : p.ci) % edges.length];
      const A = e[0], B = e[1];
      let sp = p.sp * (0.5 + oe * 1.3);
      let dropped = false;
      if (degrade > 0.05) {
        const st = 0.5 + 0.5 * Math.sin(t * 3 + p.ph);
        sp *= 1 - degrade * 0.85 * st;
        if (Math.random() < degrade * 0.01 && debris.current.length < MAX_DEBRIS) {
          debris.current.push({
            x: sx[A] + (sx[B] - sx[A]) * p.t,
            y: sy[A] + (sy[B] - sy[A]) * p.t,
            vx: (Math.random() - 0.5) * 0.6,
            vy: 0.3,
            a: 0.55,
            rest: ch - 6 - Math.random() * 26,
          });
          p.t = 0;
          dropped = true;
        }
      }
      if (!dropped) {
        p.t += sp * 0.016;
        if (p.t >= 1) {
          p.t = 0;
          if (ordered) p.li = (Math.random() * latticeEdges.length) | 0;
          else p.ci = (Math.random() * chaosEdges.length) | 0;
        }
      }

      const hx = sx[A] + (sx[B] - sx[A]) * p.t;
      const hy = sy[A] + (sy[B] - sy[A]) * p.t;
      const tb = Math.max(0, p.t - 0.08);
      const tx = sx[A] + (sx[B] - sx[A]) * tb;
      const ty = sy[A] + (sy[B] - sy[A]) * tb;

      headPos[i * 3] = hx - halfW;
      headPos[i * 3 + 1] = halfH - hy;
      headPos[i * 3 + 2] = 0;
      headAlpha[i] = dropped ? 0 : pa;

      const o0 = i * 6;
      trailPos[o0] = tx - halfW;
      trailPos[o0 + 1] = halfH - ty;
      trailPos[o0 + 2] = 0;
      trailPos[o0 + 3] = hx - halfW;
      trailPos[o0 + 4] = halfH - hy;
      trailPos[o0 + 5] = 0;
      const ta = dropped ? 0 : pa * 0.35;
      trailAlpha[i * 2] = ta;
      trailAlpha[i * 2 + 1] = ta;
    }

    // ---- 4. debris ----
    const dPos = built.debrisG.pos, dAlpha = built.debrisG.alpha;
    const list = debris.current;
    for (let i = list.length - 1; i >= 0; i--) {
      const d = list[i];
      if (d.y < d.rest) {
        d.vy += 0.18;
        d.y += d.vy;
        d.x += d.vx;
        if (d.y > d.rest) d.y = d.rest;
      }
      d.a -= 0.0006 + oe * 0.012;
      if (d.a <= 0) {
        list.splice(i, 1);
      }
    }
    for (let i = 0; i < MAX_DEBRIS; i++) {
      if (i < list.length) {
        const d = list[i];
        dPos[i * 3] = d.x - halfW;
        dPos[i * 3 + 1] = halfH - d.y;
        dPos[i * 3 + 2] = 0;
        dAlpha[i] = d.a * dimm;
      } else {
        dAlpha[i] = 0;
      }
    }

    // ---- flush ----
    built.nodeG.geo.getAttribute("position").needsUpdate = true;
    built.nodeG.geo.getAttribute("alpha").needsUpdate = true;
    built.critG.geo.getAttribute("alpha").needsUpdate = true;
    built.chaosG.geo.getAttribute("position").needsUpdate = true;
    built.chaosG.geo.getAttribute("alpha").needsUpdate = true;
    built.latticeG.geo.getAttribute("position").needsUpdate = true;
    built.latticeG.geo.getAttribute("alpha").needsUpdate = true;
    built.headG.geo.getAttribute("position").needsUpdate = true;
    built.headG.geo.getAttribute("alpha").needsUpdate = true;
    built.trailG.geo.getAttribute("position").needsUpdate = true;
    built.trailG.geo.getAttribute("alpha").needsUpdate = true;
    built.debrisG.geo.getAttribute("position").needsUpdate = true;
    built.debrisG.geo.getAttribute("alpha").needsUpdate = true;
  });

  return (
    <>
      {built.objects.map((obj, i) => (
        <primitive key={i} object={obj} />
      ))}
    </>
  );
}
