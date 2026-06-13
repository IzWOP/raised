// Deterministic scene geometry — a 1:1 port of the prototype's initScene().
// Built once at module load with a fixed LCG seed so EN/ES, SSR and reloads
// all produce the identical node field. (HANDOFF §1)

export interface SceneNode {
  // lattice (ordered) position
  lx: number;
  ly: number;
  lz: number;
  // chaos position
  cx: number;
  cy: number;
  cz: number;
  // wobble
  ph: number;
  sp: number;
  amp: number;
  crit: boolean;
}

export interface Packet {
  t: number;
  sp: number;
  ph: number;
  ci: number; // chaos-edge index
  li: number; // lattice-edge index
}

export type Edge = [number, number];

export interface SceneGeometry {
  nodes: SceneNode[];
  chaosEdges: Edge[];
  latticeEdges: Edge[];
  packets: Packet[];
}

const NX = 8;
const NY = 5;
const NZ = 4;
const SP = 132;

function buildGeometry(): SceneGeometry {
  let seed = 7;
  const rnd = () => {
    seed = (seed * 16807) % 2147483647;
    return seed / 2147483647;
  };

  const nodes: SceneNode[] = [];
  for (let ix = 0; ix < NX; ix++) {
    for (let iy = 0; iy < NY; iy++) {
      for (let iz = 0; iz < NZ; iz++) {
        const a = rnd() * 6.283;
        const b = Math.acos(2 * rnd() - 1);
        const r = Math.pow(rnd(), 0.55) * 600;
        nodes.push({
          lx: (ix - (NX - 1) / 2) * SP,
          ly: (iy - (NY - 1) / 2) * SP * 0.92,
          lz: (iz - (NZ - 1) / 2) * SP,
          cx: Math.sin(b) * Math.cos(a) * r * 1.25,
          cy: Math.sin(b) * Math.sin(a) * r * 0.6,
          cz: Math.cos(b) * r * 0.95,
          ph: rnd() * 6.283,
          sp: 0.4 + rnd() * 0.9,
          amp: 12 + rnd() * 24,
          crit: rnd() < 0.07,
        });
      }
    }
  }

  // chaos edges: 2-nearest-neighbour graph (deduped)
  const seen: Record<string, 1> = {};
  const chaosEdges: Edge[] = [];
  for (let i = 0; i < nodes.length; i++) {
    const dists: [number, number][] = [];
    for (let j = 0; j < nodes.length; j++) {
      if (j === i) continue;
      const dx = nodes[i].cx - nodes[j].cx;
      const dy = nodes[i].cy - nodes[j].cy;
      const dz = nodes[i].cz - nodes[j].cz;
      dists.push([dx * dx + dy * dy + dz * dz, j]);
    }
    dists.sort((p, q) => p[0] - q[0]);
    for (let q = 0; q < 2; q++) {
      const j = dists[q][1];
      const key = Math.min(i, j) + "_" + Math.max(i, j);
      if (!seen[key]) {
        seen[key] = 1;
        chaosEdges.push([i, j]);
      }
    }
  }

  // lattice edges: grid neighbours with parity rules
  const latticeEdges: Edge[] = [];
  const idx = (x: number, y: number, z: number) => (x * NY + y) * NZ + z;
  for (let ix = 0; ix < NX; ix++) {
    for (let iy = 0; iy < NY; iy++) {
      for (let iz = 0; iz < NZ; iz++) {
        if (ix < NX - 1) latticeEdges.push([idx(ix, iy, iz), idx(ix + 1, iy, iz)]);
        if (iy < NY - 1 && (ix + iz) % 2 === 0)
          latticeEdges.push([idx(ix, iy, iz), idx(ix, iy + 1, iz)]);
        if (iz < NZ - 1 && (ix + iy) % 2 === 0)
          latticeEdges.push([idx(ix, iy, iz), idx(ix, iy, iz + 1)]);
      }
    }
  }

  const packets: Packet[] = [];
  for (let i = 0; i < 64; i++) {
    packets.push({
      t: rnd(),
      sp: 0.18 + rnd() * 0.4,
      ph: rnd() * 6.283,
      ci: (rnd() * chaosEdges.length) | 0,
      li: (rnd() * latticeEdges.length) | 0,
    });
  }

  return { nodes, chaosEdges, latticeEdges, packets };
}

export const sceneGeometry: SceneGeometry = buildGeometry();
export const MAX_DEBRIS = 130;
