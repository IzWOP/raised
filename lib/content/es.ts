import type { Content } from "./types";

// Spanish — seeded from the prototype's i18nDict() (operator voice).
// NOTE: this is a solid first draft; have a native speaker review before launch.
export const es: Content = {
  meta: {
    title: "Raised Agency — Sistemas operativos para empresas de servicios en crecimiento",
    description:
      "Raised Agency construye los sistemas operativos que sostienen a las agencias y empresas de servicios en crecimiento: flujos conectados, automatización, IA donde el trabajo exige criterio, y medición que lo demuestra.",
  },

  nav: {
    links: [
      { label: "SISTEMAS", href: "#systems" },
      { label: "PROCESO", href: "#process" },
      { label: "POR QUÉ RAISED", href: "#why" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Reserva una Auditoría",
  },

  rail: [
    { label: "01 INICIO", href: "#hero" },
    { label: "02 PROBLEMA", href: "#problem" },
    { label: "03 PUNTOS DE QUIEBRE", href: "#breaking" },
    { label: "04 SISTEMAS", href: "#systems" },
    { label: "05 POR QUÉ RAISED", href: "#why" },
    { label: "06 PROCESO", href: "#process" },
    { label: "07 AUDITORÍA", href: "#audit" },
    { label: "08 EMPEZAR", href: "#final" },
  ],

  boot: [
    { label: "INITIALIZING SYSTEMS", caret: true },
    { label: "LOADING OPERATIONAL GRID —", tail: "OK" },
    { label: "SYS.STATUS —", tail: "OPERATIVO", ok: true },
  ],

  hud: { scroll: "DESPLAZA", status: "SYS.STATUS — OPERATIVO" },

  hero: {
    eyebrow: "SISTEMAS OPERATIVOS — CONSTRUIDOS, AUTOMATIZADOS, MEDIDOS",
    h1: ["Tus herramientas no se hablan entre sí.", "Y tu equipo lo paga a diario."],
    sub: "Raised Agency construye los sistemas operativos que sostienen a las agencias y empresas de servicios en crecimiento: flujos de trabajo conectados, automatización y scripts donde el trabajo se repite, IA donde el trabajo exige criterio, y medición que demuestra que todo funciona de verdad.",
    cta: "Reserva una Auditoría de Operaciones",
    support:
      "Menos trabajo manual. Entregas más limpias. Visibilidad real. Sistemas en los que puedes confiar.",
  },

  problem: {
    eyebrow: "02 — DEGRADACIÓN DE SEÑAL",
    h2: "El crecimiento expone los sistemas rotos.",
    copy: "Tu equipo no es el problema. Lo son los sistemas que tiene debajo. Lo que funcionaba con 3 personas se desmorona en silencio con 10. Nadie lo decidió — simplemente pasó. Y las grietas siempre se ven igual:",
    gridHeading: "¿TE SUENA?",
    vignettes: [
      {
        title: "El lead que se quedó tres días parado",
        body: "Llegó. Cayó en la bandeja de entrada. Nadie supo que era suyo. Para cuando alguien le dio seguimiento, el prospecto ya había firmado con quien respondió primero.",
      },
      {
        title: "La entrega que vive en un mensaje directo",
        body: "Ventas lo cerró. El equipo de entrega se enteró en un hilo de Slack dos días después. El arranque empezó con «espera, ¿qué le prometimos?».",
      },
      {
        title: "La reconstrucción del reporte de los viernes",
        body: "Cada semana, alguien pasa medio día exportando, pegando y limpiando los mismos números — para que la dirección mire datos que ya están desactualizados.",
      },
      {
        title: "El CRM en el que nadie confía",
        body: "La mitad de los negocios están desactualizados. Las etapas significan cosas distintas para cada quien. Así que todos preguntan en Slack y el CRM se vuelve un cementerio.",
      },
    ],
    cost: {
      eyebrow: "COSTO EN CURSO — EN VIVO",
      h3: "Ya lo estás pagando.",
      copy: "No en software. En tiempo, en ingresos perdidos y en contrataciones que haces solo para administrar el caos. Cada nuevo lead, cliente, miembro del equipo y herramienta multiplica los lugares donde el trabajo se atasca. La cuenta aparece donde es más fácil ignorarla:",
      cards: [
        {
          label: "TRABAJO DE PEGAMENTO / EQUIPO / SEM",
          value: 14,
          suffix: " HRS",
          title: "Horas quemadas en trabajo de pegamento",
          body: "Copiar entre herramientas, perseguir estados, reconstruir reportes. Un salario de medio tiempo repartido de forma invisible por todo tu equipo.",
        },
        {
          label: "SEGUIMIENTOS PERDIDOS / MES",
          value: 38,
          title: "Ingresos que se fugan en silencio",
          body: "Las respuestas lentas y los seguimientos perdidos no aparecen en ningún reporte — y por eso mismo siguen pasando.",
        },
        {
          label: "CAOS EN NÓMINA / AÑO",
          value: 68,
          prefix: "$",
          suffix: "K",
          title: "Contratar como curita",
          body: "Cuando el sistema está roto, la solución se vuelve «contratar a alguien que lo administre». Ahora el caos tiene sueldo y prestaciones.",
        },
        {
          label: "REPORTES REHECHOS A MANO / AÑO",
          value: 52,
          title: "Decisiones tomadas por intuición",
          body: "Cuando los reportes son manuales y el CRM es un desorden, la dirección se guía por corazonadas y por quien habló al último en Slack.",
        },
      ],
      footnote:
        "COSTOS OPERATIVOS REPRESENTATIVOS — LOS TUYOS SE MIDEN CON PRECISIÓN EN LA AUDITORÍA",
    },
  },

  breaking: {
    eyebrow: "03 — BARRIDO DIAGNÓSTICO",
    h2: "Se rompe en los mismos cinco puntos. Siempre.",
    sub: "Tras suficiente tiempo dentro de agencias y empresas de servicios en crecimiento, el patrón es aburrido en el mejor sentido — predecible. Lo que significa que tiene arreglo.",
    cards: [
      {
        tag: "BRK.01 — ENTRADA",
        status: "warn",
        title: "Gestión de Leads",
        body: "Los leads llegan, pero nada los enruta, califica, enriquece ni asigna. La velocidad de respuesta depende de quién revise la bandeja.",
      },
      {
        tag: "BRK.02 — PIPELINE",
        status: "crit",
        title: "Ventas y Operaciones de Pipeline",
        body: "El pipeline del CRM y el pipeline real son dos pipelines distintos. Los negocios se estancan en silencio porque nada los marca.",
      },
      {
        tag: "BRK.03 — FLUJO",
        status: "warn",
        title: "Flujos de Trabajo Internos",
        body: "Tareas, aprobaciones y actualizaciones funcionan a base de memoria y Slack. El proceso existe — solo que vive en la cabeza de la gente.",
      },
      {
        tag: "BRK.04 — VISIBILIDAD",
        status: "crit",
        title: "Reportes y Visibilidad",
        body: "Los datos existen repartidos en cinco herramientas. Convertirlos en una respuesta requiere una persona, una hoja de cálculo y una tarde entera.",
      },
      {
        tag: "BRK.05 — ENTREGA",
        status: "warn",
        title: "Entrega de Ventas a Delivery",
        body: "El negocio se cierra y el onboarding empieza desde cero: volver a preguntar, volver a buscar contexto, volver a fijar expectativas.",
      },
    ],
  },

  systems: {
    eyebrow: "04 — EL GIRO",
    interstitial: "REORGANIZANDO — ARQUITECTURA DE SISTEMA EN LÍNEA",
    h2: "Los sistemas que construimos.",
    sub: "No vendemos automatizaciones sueltas. Diseñamos el flujo de trabajo, limpiamos los datos, conectamos las herramientas, programamos los pasos repetibles, sumamos IA donde hace falta criterio — y luego lo instrumentamos para que veas que funciona.",
    cards: [
      {
        tag: "SYS.01",
        title: "Sistemas de Gestión de Leads",
        body: "Enrutamiento, calificación, enriquecimiento y asignación de responsable al instante en que entra un lead. La IA redacta el resumen del lead y sugiere el siguiente paso; tu representante solo ejecuta. Nada espera en una bandeja.",
        fixes: { tag: "RESUELVE: 01 — ENTRADA", from: "warn" },
      },
      {
        tag: "SYS.02",
        title: "Sistemas de Operaciones de Ingresos",
        body: "Automatización de pipeline que mantiene honesto al CRM: disparadores por etapa, alertas de negocios estancados con contexto escrito por IA sobre por qué se estancaron, entrega de propuestas y onboarding que arranca solo en cuanto se cierra un negocio.",
        fixes: { tag: "RESUELVE: 02 — OPS DE PIPELINE", from: "crit" },
      },
      {
        tag: "SYS.03",
        title: "Sistemas de Operaciones Internas",
        body: "Procesos recurrentes que corren sin niñera — tareas, aprobaciones, actualizaciones de estado y notificaciones disparadas por triggers en vez de por memoria. Scripts a medida donde las herramientas de catálogo se quedan cortas.",
        fixes: { tag: "RESUELVE: 03 — FLUJO", from: "warn" },
      },
      {
        tag: "SYS.04",
        title: "Sistemas de Reportes y Visibilidad",
        body: "Tableros que se alimentan en vivo de tus herramientas reales — cobertura de pipeline, capacidad del equipo, salud del cliente — más resúmenes semanales generados por IA en Slack. Construidos sobre infraestructura de medición real: GA4, BigQuery, Looker Studio. Deja de preguntar «¿cómo vamos?».",
        fixes: { tag: "RESUELVE: 04 — VISIBILIDAD", from: "crit" },
      },
      {
        tag: "SYS.05 — CAPA DE IA",
        title: "IA Donde Se Gana Su Lugar",
        body: "No IA para la demo. IA para las decisiones de criterio que los scripts no pueden tomar: resumir hilos caóticos en entregas limpias, señalar excepciones antes de que se vuelvan incendios, revisar la calidad de los datos, redactar seguimientos para revisión humana. Monitoreada, documentada y medida como todo lo que entregamos.",
        fixes: { tag: "RESUELVE: 05 — ENTREGA", from: "warn" },
      },
    ],
  },

  whyRaised: {
    eyebrow: "05 — POR QUÉ RAISED",
    h2: "Cualquiera puede conectar dos herramientas. Casi nadie puede demostrar que funcionó.",
    intro:
      "Los freelancers de automatización entregan Zaps. Nosotros entregamos sistemas con una capa de medición — porque venimos de CRO y analítica, donde si no lo puedes medir, no sucedió.",
    left: {
      heading: "EL PROYECTO DE AUTOMATIZACIÓN TÍPICO",
      items: [
        "Zaps sueltos apilados sobre Zaps",
        "IA atornillada para justificar la factura",
        "Nadie limpió el proceso primero",
        "Sin documentación",
        "Sin monitoreo — te enteras de que se rompió cuando lo hace un cliente",
        "Sin medición, así que «funciona» es una sensación",
      ],
      result: "Más herramientas. Flujos más frágiles. El mismo caos, ahora automatizado.",
    },
    right: {
      heading: "UN SISTEMA RAISED",
      items: [
        "El proceso se diseña antes de construir nada",
        "Arquitectura de flujo entre herramientas, personas y entregas",
        "Scripts y automatización para lo repetible, IA para las decisiones de criterio",
        "CRM y datos limpios para que el sistema funcione sobre la verdad",
        "Monitoreado, documentado y con dueño",
        "Instrumentado de punta a punta — los tableros muestran que funciona",
      ],
      result: "Un negocio que funciona con más fluidez — y la prueba de que así es.",
    },
    resultLabel: "RESULTADO",
    operator: {
      eyebrow: "HISTORIAL DEL OPERADOR",
      h2: "Construido por un operador, no por un ejecutivo de cuenta.",
      copy: "Raised está liderada por Isaac «Izzy» Vazquez — un operador de CRO y analítica que pasó años en el caos del medio de las agencias en crecimiento: el tracking que miente, los CRMs en los que nadie confía, los reportes rehechos a mano cada viernes, las automatizaciones que todos temen tocar. Cuando trabajas con Raised, la persona que diseñó el sistema es la persona que lo construye. Sin pasarlo a un junior. Sin teléfono descompuesto.",
      receipts: [
        {
          tag: "R.01",
          text: "Infraestructura de analítica multicliente que sirve a un portafolio de marcas desde un solo sistema",
        },
        {
          tag: "R.02",
          text: "Tracking entre dominios y limpieza de GTM de doble contenedor para un SaaS de salud",
        },
        {
          tag: "R.03",
          text: "Tracking del lado del servidor y migraciones a Meta CAPI para clientes de e-commerce y generación de leads",
        },
        {
          tag: "R.04",
          text: "Herramientas de análisis de pruebas A/B construidas sobre segmentación de GA4",
        },
        {
          tag: "R.05",
          text: "Automatización de pipeline inbound y limpieza de flujos de CRM para agencias",
        },
        {
          tag: "R.06",
          text: "Sistemas de reportes que la dirección de verdad abre — GA4, BigQuery, Looker Studio",
        },
        {
          tag: "R.07",
          text: "Trayectoria en experimentación CRO: cada implementación ligada al impacto en ingresos",
        },
      ],
    },
  },

  process: {
    eyebrow: "06 — MÉTODO",
    h2: "Cómo reconstruimos el sistema.",
    sub: "Cuatro fases. Cada una termina con algo que puedes sostener.",
    phases: [
      {
        tag: "FASE 01 — DESCUBRIR",
        title: "Descubrir",
        body: "Mapeamos cómo se mueve realmente el trabajo por tu negocio. No la versión del organigrama. La real, con hilos de Slack y todo.",
      },
      {
        tag: "FASE 02 — DIAGNOSTICAR",
        title: "Diagnosticar",
        body: "Encontramos los cuellos de botella, el trabajo manual de pegamento, las automatizaciones frágiles y los datos sucios. Calificamos cada uno por impacto en ingresos, no por lo divertido que sea automatizarlo.",
      },
      {
        tag: "FASE 03 — ARQUITECTURA",
        title: "Arquitectura",
        body: "Diseñamos el sistema futuro: flujos de trabajo, conexiones entre herramientas, lógica de automatización, dónde corren los scripts, dónde asiste la IA y cómo se mide todo.",
      },
      {
        tag: "FASE 04 — CONSTRUIR",
        title: "Construir",
        body: "Implementamos, probamos, documentamos, desplegamos. Cada sistema se entrega con monitoreo y un tablero — no con un video de Loom y un rezo.",
      },
    ],
    ongoingLabel: "CONTINUO",
    ongoing:
      "Tras el lanzamiento lo vigilamos, lo afinamos y lo ampliamos a medida que creces. Los sistemas no son un proyecto. Son infraestructura.",
  },

  audit: {
    eyebrow: "07 — PUNTO DE ENTRADA",
    h2: "Empieza con la Auditoría de Operaciones.",
    copy: "Antes de construir nada, mapeamos cómo se mueve realmente el trabajo por tu negocio — y te mostramos exactamente dónde está la palanca. Te vas con un plan que es tuyo. Constrúyelo con nosotros, constrúyelo en casa o guárdalo. La hoja de ruta es tuya de cualquier forma.",
    terminalTitle: "AUDIT.SCOPE — VERIFICANDO",
    checklist: [
      "Mapeo de flujos de trabajo",
      "Revisión de herramientas y datos",
      "Revisión de CRM y pipeline",
      "Flujo de leads y entregas",
      "Inventario de tareas manuales",
      "Oportunidades de automatización calificadas por impacto en ingresos",
      "Revisión de riesgo operativo",
      "Hoja de ruta de sistemas recomendada",
    ],
    deliverablesLabel: "ENTREGABLES — TUYOS PARA QUEDARTE",
    deliverables: [
      {
        tag: "DOC.01",
        title: "Hoja de Ruta de Growth Ops",
        body: "Qué está roto, cuánto te cuesta y qué arreglar primero.",
      },
      {
        tag: "DOC.02",
        title: "Plano de Sistemas",
        body: "Qué construir, cómo funciona, qué herramientas conecta, dónde los scripts y la IA generan palanca, y cómo lo mediremos.",
      },
    ],
    cta: "Reserva una Auditoría de Operaciones",
    pricing: "",
    faq: {
      h3: "Antes de que preguntes.",
      items: [
        {
          q: "¿Para quién es esto?",
          a: "Empresas de servicios y agencias en crecimiento, de unas 5 a 50 personas, con leads inbound, un CRM, demasiadas herramientas y un backend que empieza a resquebrajarse con el crecimiento. Si eres un operador en solitario o un negocio local, probablemente seamos demasiado — por ahora.",
        },
        {
          q: "¿Esto es solo Zapier con pasos extra?",
          a: "No. Herramientas como Zapier, Make y n8n pueden aparecer dentro de una implementación, junto a scripts a medida y trabajo directo con APIs. La diferencia es todo lo que las rodea: diseño de proceso primero, datos limpios, documentación, monitoreo y medición. Un Zap es un cable. Nosotros construimos el circuito.",
        },
        {
          q: "¿Dónde encaja realmente la IA?",
          a: "Donde se gana su lugar. Los scripts manejan los pasos repetibles; la IA maneja las decisiones de criterio intermedias — resumir hilos en entregas, redactar seguimientos, señalar negocios estancados con contexto, atrapar excepciones. Siempre monitoreada, siempre medida, nunca IA para la demo.",
        },
        {
          q: "¿Con qué herramientas trabajan?",
          a: "Tu stack, no el nuestro. CRMs (HubSpot, Pipedrive, etc.), herramientas de gestión de proyectos, Slack, hojas de cálculo, facturación — más la capa de medición que la mayoría no puede tocar: GA4, GTM, BigQuery, Looker Studio. Si tus herramientas tienen API, podemos hacer que cooperen.",
        },
        {
          q: "¿También pueden arreglar nuestra analítica y reportes?",
          a: "Ese es nuestro terreno. La limpieza de tracking, la construcción de tableros y la automatización de reportes vienen de años de trabajo práctico en CRO y analítica — es la razón por la que nuestros sistemas se entregan con la medición integrada en vez de atornillada.",
        },
        {
          q: "¿Qué pasa después de la auditoría?",
          a: "Te quedas con la Hoja de Ruta y el Plano pase lo que pase. La mayoría de los clientes avanza a una implementación donde construimos en orden de prioridad; algunos se llevan el plano para hacerlo en casa. De cualquier forma, nunca compras a ciegas.",
        },
      ],
    },
  },

  finalCta: {
    h2: "No necesitas más herramientas. Necesitas un sistema.",
    copy: "Tu stack está bien. Lo que falta es la arquitectura por debajo — los flujos de trabajo, la automatización y la visibilidad que hacen que las herramientas actúen como un solo negocio en vez de diez pestañas. Eso es lo que construimos. Y te mostraremos la prueba en un tablero.",
    cta: "Reserva una Auditoría de Operaciones",
    subline: "AUDITORÍA → HOJA DE RUTA → CONSTRUIR → MEDIR",
  },

  footer: {
    domain: "RAISEDAGENCY.COM",
    copyright: "© 2026 RAISED AGENCY",
  },
};
