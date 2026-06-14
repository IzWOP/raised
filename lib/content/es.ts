import type { Content } from "./types";

// Spanish — seeded from the prototype's i18nDict() (operator voice).
// NOTE: this is a solid first draft; have a native speaker review before launch.
export const es: Content = {
  meta: {
    title: "Raised Agency — Sistemas operativos para empresas de servicios en crecimiento",
    description:
      "Raised Agency construye la capa operativa que sostiene a las agencias y empresas de servicios en crecimiento: flujos conectados, automatización, IA donde el trabajo exige criterio, y medición que lo demuestra.",
  },

  nav: {
    links: [
      { label: "SISTEMAS", href: "#systems" },
      { label: "POR QUÉ RAISED", href: "#why" },
      { label: "AUDITORÍA", href: "#audit" },
      { label: "FAQ", href: "#faq" },
    ],
    cta: "Reserva una Auditoría",
  },

  rail: [
    { label: "01 INICIO", href: "#hero" },
    { label: "02 COSTO", href: "#problem" },
    { label: "03 SISTEMAS", href: "#systems" },
    { label: "04 POR QUÉ RAISED", href: "#why" },
    { label: "05 AUDITORÍA", href: "#audit" },
    { label: "06 EMPEZAR", href: "#final" },
  ],

  boot: [
    { label: "INITIALIZING SYSTEMS", caret: true },
    { label: "LOADING OPERATIONAL GRID —", tail: "OK" },
    { label: "SYS.STATUS —", tail: "OPERATIVO", ok: true },
  ],

  hud: { scroll: "DESPLAZA", status: "SYS.STATUS — OPERATIVO" },

  hero: {
    eyebrow: "SISTEMAS OPERATIVOS. CONSTRUIDOS, AUTOMATIZADOS, MEDIDOS.",
    h1: ["Tus herramientas no se hablan entre sí.", "Y tu equipo lo paga a diario."],
    sub: "Raised construye la capa operativa que sostiene a las empresas de servicios en crecimiento. Flujos de trabajo conectados, automatización donde el trabajo se repite, IA donde el trabajo exige criterio, y medición que demuestra que todo funciona de verdad.",
    cta: "Reserva una Auditoría de Operaciones",
  },

  problem: {
    eyebrow: "02 — COSTO EN CURSO",
    h2: "Ya lo estás pagando.",
    copy: "No en software. En tiempo, en ingresos perdidos y en la contratación que hiciste solo para administrar el caos. Cada nuevo lead, cliente y herramienta multiplica los lugares donde el trabajo se atasca. Un lead se queda tres días parado. Una entrega vive en un mensaje directo. La cuenta aparece donde es más fácil ignorarla.",
    cards: [
      {
        label: "HRS / EQUIPO / SEM",
        value: 14,
        title: "Horas quemadas en trabajo de pegamento.",
        body: "Copiar entre herramientas, perseguir estados, reconstruir reportes.",
      },
      {
        label: "SEGUIMIENTOS PERDIDOS / MES",
        value: 38,
        title: "Ingresos que se fugan en silencio.",
        body: "Las respuestas lentas nunca aparecen en un reporte, y por eso siguen pasando.",
      },
      {
        label: "EN NÓMINA / AÑO",
        value: 68,
        prefix: "$",
        suffix: "K",
        title: "Contratar como curita.",
        body: "Cuando el sistema se rompe, la solución se vuelve «contratar a alguien que lo administre».",
      },
      {
        label: "REPORTES REHECHOS / AÑO",
        value: 52,
        title: "Decisiones tomadas por intuición.",
        body: "Reportes manuales más un CRM desordenado hacen que la dirección se guíe por corazonadas.",
      },
    ],
    footnote:
      "COSTOS OPERATIVOS REPRESENTATIVOS. LOS TUYOS SE MIDEN CON PRECISIÓN EN LA AUDITORÍA.",
  },

  breaksFixes: {
    eyebrow: "03 — BARRIDO DIAGNÓSTICO",
    h2: "Se rompe en los mismos cinco puntos. Siempre.",
    sub: "Tras suficiente tiempo dentro de empresas de servicios en crecimiento, el patrón es aburrido en el mejor sentido. Predecible. Lo que significa que tiene arreglo. Aquí es donde se rompe, y el sistema que construimos para arreglarlo.",
    cta: "Reserva una Auditoría de Operaciones",
    cards: [
      {
        tag: "01 — ENTRADA",
        status: "warn",
        breakTitle: "Gestión de Leads",
        breakBody:
          "Los leads llegan, pero nada los enruta, califica, enriquece ni asigna. La velocidad de respuesta depende de quién revise la bandeja.",
        fixBody:
          "Enrutamiento, calificación, enriquecimiento y asignación de responsable al instante en que entra un lead. La IA redacta el resumen y el siguiente paso. Tu representante solo ejecuta. Nada espera en una bandeja.",
      },
      {
        tag: "02 — PIPELINE",
        status: "crit",
        breakTitle: "Ventas y Operaciones de Pipeline",
        breakBody:
          "El pipeline del CRM y el pipeline real son dos pipelines distintos. Los negocios se estancan en silencio porque nada los marca.",
        fixBody:
          "Automatización de pipeline que mantiene honesto al CRM. Disparadores por etapa, alertas de negocios estancados con contexto escrito por IA sobre por qué se estancaron, y onboarding que arranca solo en cuanto se cierra un negocio.",
      },
      {
        tag: "03 — FLUJO",
        status: "warn",
        breakTitle: "Flujos de Trabajo Internos",
        breakBody:
          "Tareas, aprobaciones y actualizaciones funcionan a base de memoria y Slack. El proceso existe. Solo que vive en la cabeza de la gente.",
        fixBody:
          "Procesos recurrentes que corren sin niñera. Tareas, aprobaciones, actualizaciones de estado y notificaciones disparadas por triggers en vez de por memoria. Scripts a medida donde las herramientas de catálogo se quedan cortas.",
      },
      {
        tag: "04 — VISIBILIDAD",
        status: "crit",
        breakTitle: "Reportes y Visibilidad",
        breakBody:
          "Los datos existen repartidos en cinco herramientas. Convertirlos en una respuesta requiere una persona, una hoja de cálculo y una tarde entera.",
        fixBody:
          "Tableros que se alimentan en vivo de tus herramientas reales. Cobertura de pipeline, capacidad del equipo, salud del cliente, más resúmenes semanales por IA en Slack. Construidos sobre infraestructura de medición real: GA4, BigQuery, Looker Studio. Deja de preguntar «¿cómo vamos?».",
      },
      {
        tag: "05 — ENTREGA",
        status: "warn",
        breakTitle: "Entrega de Ventas a Delivery",
        breakBody:
          "El negocio se cierra y el onboarding empieza desde cero. Volver a preguntar, volver a buscar contexto, volver a fijar expectativas.",
        fixBody:
          "Una entrega limpia sin teléfono descompuesto. Y la capa de IA que está sobre todo ello: resumir hilos caóticos en entregas limpias, señalar excepciones antes de que se vuelvan incendios, revisar la calidad de los datos, redactar seguimientos para revisión humana. No IA para la demo. IA para las decisiones de criterio que los scripts no pueden tomar.",
      },
    ],
  },

  whyRaised: {
    eyebrow: "04 — POR QUÉ RAISED",
    h2: "Cualquiera puede conectar dos herramientas. Casi nadie puede demostrar que funcionó.",
    intro:
      "Los freelancers de automatización entregan Zaps. Nosotros entregamos sistemas con una capa de medición, porque venimos de CRO y analítica, donde si no lo puedes medir, no sucedió.",
    left: {
      heading: "EL PROYECTO DE AUTOMATIZACIÓN TÍPICO",
      items: [
        "Zaps sueltos apilados sobre Zaps",
        "Nadie limpió el proceso primero",
        "Sin monitoreo. Te enteras de que se rompió cuando lo hace un cliente.",
        "Sin medición, así que «funciona» es una sensación",
      ],
      result: "Más herramientas. Flujos más frágiles. El mismo caos, ahora automatizado.",
    },
    right: {
      heading: "UN SISTEMA RAISED",
      items: [
        "El proceso se diseña antes de construir nada",
        "Scripts para lo repetible, IA para las decisiones de criterio",
        "Monitoreado, documentado y con dueño",
        "Instrumentado de punta a punta. Los tableros muestran que funciona.",
      ],
      result: "Un negocio que funciona con más fluidez, y la prueba de que así es.",
    },
    resultLabel: "RESULTADO",
    operator: {
      eyebrow: "HISTORIAL DEL OPERADOR",
      h2: "Construido por un operador, no por un ejecutivo de cuenta.",
      name: "Isaac «Izzy» Vazquez",
      role: "Operador de CRO y Analítica",
      photo: "",
      copy: "Raised está liderada por Isaac «Izzy» Vazquez, un operador de CRO y analítica que pasó años en el caos del medio de las agencias en crecimiento: el tracking que miente, los CRMs en los que nadie confía, los reportes rehechos a mano cada viernes. La persona que diseña tu sistema es la persona que lo construye. Sin pasarlo a un junior. Sin teléfono descompuesto.",
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
          text: "Liderazgo de sistemas de reportes en GA4, BigQuery y Looker Studio",
        },
        {
          tag: "R.05",
          text: "Trayectoria en experimentación CRO. Cada implementación ligada al impacto en ingresos.",
        },
      ],
    },
  },

  process: {
    label: "EL PROCESO — QUÉ PASA DESPUÉS DE RESERVAR",
    steps: [
      {
        label: "DESCUBRIR",
        body: "Mapeamos cómo se mueve realmente el trabajo. La versión real, con hilos de Slack y todo.",
      },
      {
        label: "DIAGNOSTICAR",
        body: "Encontramos los cuellos de botella y los datos sucios. Calificamos cada uno por impacto en ingresos, no por lo divertido que sea automatizarlo.",
      },
      {
        label: "ARQUITECTURA",
        body: "Diseñamos el sistema futuro. Flujos, conexiones, lógica de automatización, dónde asiste la IA, cómo se mide.",
      },
      {
        label: "CONSTRUIR",
        body: "Implementamos, probamos, documentamos, desplegamos. Cada sistema se entrega con monitoreo y un tablero, no con un video de Loom y un rezo.",
      },
      {
        label: "CONTINUO",
        body: "Lo vigilamos, lo afinamos y lo ampliamos a medida que creces. Los sistemas no son un proyecto. Son infraestructura.",
      },
    ],
  },

  audit: {
    eyebrow: "05 — PUNTO DE ENTRADA",
    h2: "Empieza con la Auditoría de Operaciones.",
    copy: "Antes de construir nada, mapeamos cómo se mueve el trabajo por tu negocio y te mostramos exactamente dónde está la palanca. Te vas con un plan que es tuyo. Constrúyelo con nosotros, constrúyelo en casa o guárdalo. La hoja de ruta es tuya de cualquier forma.",
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
          a: "Fundadores y líderes de operaciones en agencias y empresas de servicios, de unas 5 a 50 personas, donde el crecimiento superó a los sistemas que tiene debajo.",
        },
        {
          q: "¿Esto es solo Zapier con pasos extra?",
          a: "No. Diseñamos el proceso primero, construimos scripts donde los Zaps se quedan cortos, sumamos IA para las decisiones de criterio, e instrumentamos todo para que puedas demostrar que funciona.",
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
    copy: "Tu stack está bien. Lo que falta es la arquitectura por debajo: los flujos de trabajo, la automatización y la visibilidad que hacen que las herramientas actúen como un solo negocio en vez de diez pestañas. Eso es lo que construimos. Y te mostraremos la prueba en un tablero.",
    cta: "Reserva una Auditoría de Operaciones",
    subline: "AUDITORÍA → HOJA DE RUTA → CONSTRUIR → MEDIR",
  },

  footer: {
    domain: "RAISEDAGENCY.COM",
    copyright: "© 2026 RAISED AGENCY",
  },
};
