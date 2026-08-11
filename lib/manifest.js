(function () {
  "use strict";

  window.__BRAND__ = {
    name: "Argent IA",
    legal: "Argent IA",
    tagline: "Vendemos tiempo.",
    hook: "¿Quién dijo que el tiempo no se vende?",
    email: "contacto@argentia.com.ar",
    whatsapp: "https://wa.me/5491100000000",
    year: 2026,

    nav: [
      { href: "#problema", label: "Problema" },
      { href: "#soluciones", label: "Soluciones" },
      { href: "#comparador", label: "Comparador" },
      { href: "#calculadora", label: "Calculadora" },
      { href: "#casos", label: "Casos" },
      { href: "#proceso", label: "Cómo trabajamos" },
      { href: "#tecnologia", label: "Tecnología" },
      { href: "#faq", label: "FAQ" }
    ],

    problemExample: {
      employees: 10,
      hoursPerDay: 2,
      hourlyCost: 6000
    },

    solutions: [
      {
        icon: "invoice",
        tag: "Administración",
        title: "Automatización de facturas",
        desc: "La IA lee cada factura, la clasifica y la carga directo en tu sistema contable, sin que nadie la toque.",
        before: ["Empleado recibe factura", "Descarga el PDF", "Carga a mano en el sistema", "Controla campo por campo", "Corrige errores de tipeo", "Archiva"],
        after: ["Factura llega (PDF o mail)", "La IA la lee y clasifica", "Se carga sola en tu ERP", "Queda lista para pagar"],
        timeBefore: "15 minutos",
        timeAfter: "15 segundos",
        savingsHours: 59,
        savingsLabel: "≈ 59 horas/año por cada 200 facturas mensuales"
      },
      {
        icon: "chat",
        tag: "Atención al cliente",
        title: "Respuesta automática de WhatsApp",
        desc: "Un agente de IA responde consultas frecuentes al instante, 24/7, y deriva a una persona cuando hace falta.",
        before: ["Cliente escribe por WhatsApp", "Espera en la cola", "Empleado se desocupa", "Busca la información", "Responde (a veces al otro día)"],
        after: ["Cliente escribe por WhatsApp", "El agente IA responde al instante", "Deriva a un humano solo si es necesario"],
        timeBefore: "hasta 4 horas",
        timeAfter: "8 segundos",
        savingsLabel: "Primera respuesta 1.800x más rápida"
      },
      {
        icon: "mail",
        tag: "Administración",
        title: "Respuesta inteligente de mails",
        desc: "Clasifica la bandeja, responde lo repetitivo y arma un borrador para lo que necesita criterio humano.",
        before: ["Bandeja saturada", "Lectura y clasificación manual", "Se repite la misma respuesta a mano", "Se pierden mails importantes"],
        after: ["La IA clasifica por prioridad", "Responde consultas frecuentes", "Arma borrador para las complejas"],
        timeBefore: "20 minutos por mail",
        timeAfter: "20 segundos",
        savingsLabel: "Bandeja en cero, todos los días"
      },
      {
        icon: "chart",
        tag: "Reportes",
        title: "Generación automática de reportes",
        desc: "Los datos se actualizan solos y el reporte se arma y se envía sin que nadie abra un Excel.",
        before: ["Exportar de 3 sistemas distintos", "Pegar todo en Excel", "Armar tablas y gráficos", "Revisar y enviar por mail"],
        after: ["Los sistemas se conectan solos", "El reporte se arma automáticamente", "Se envía en el horario que definas"],
        timeBefore: "3 horas por semana",
        timeAfter: "2 minutos",
        savingsHours: 144,
        savingsLabel: "≈ 144 horas/año de un analista"
      },
      {
        icon: "database",
        tag: "Datos",
        title: "Carga automática de datos",
        desc: "Lectura de planillas, formularios y PDFs con OCR + IA, cargados directo donde tienen que estar.",
        before: ["Planilla o formulario en papel/PDF", "Tipeo manual campo por campo", "Doble chequeo por errores"],
        after: ["El documento se escanea o se sube", "La IA extrae y valida los datos", "Se carga solo en tu sistema"],
        timeBefore: "40 minutos por lote",
        timeAfter: "40 segundos",
        savingsLabel: "Cero tipeo, cero error de transcripción"
      },
      {
        icon: "bank",
        tag: "Finanzas",
        title: "Conciliaciones bancarias",
        desc: "Cruza automáticamente tus movimientos bancarios contra tu contabilidad y te deja solo las diferencias reales.",
        before: ["Descargar extracto bancario", "Comparar línea por línea a mano", "Marcar diferencias en Excel", "Corregir manualmente"],
        after: ["El extracto se importa solo", "La IA cruza cada movimiento", "Quedan listas para aprobar en un clic"],
        timeBefore: "2 horas",
        timeAfter: "3 minutos",
        savingsHours: 98,
        savingsLabel: "≈ 98 horas/año en un cierre mensual"
      },
      {
        icon: "document",
        tag: "Documentos",
        title: "Clasificación de documentos y contratos",
        desc: "Lee contratos, remitos y comprobantes, extrae los datos clave y los archiva donde corresponde.",
        before: ["Abrir cada documento", "Leer y decidir dónde va", "Archivar carpeta por carpeta", "Volver a buscarlo cuando se necesita"],
        after: ["El documento entra al sistema", "La IA lo lee y extrae los datos clave", "Se archiva y queda buscable al instante"],
        timeBefore: "25 minutos por documento",
        timeAfter: "5 segundos",
        savingsLabel: "Archivo 100% buscable, sin esfuerzo"
      },
      {
        icon: "budget",
        tag: "Comercial",
        title: "Generación de presupuestos",
        desc: "El cliente completa un formulario simple y recibe un presupuesto profesional en menos de dos minutos.",
        before: ["Buscar precios y condiciones", "Armar el presupuesto en Excel", "Convertir a PDF con diseño", "Enviar por mail a mano"],
        after: ["Cliente completa un formulario", "La IA arma el presupuesto con tu marca", "Se envía automáticamente"],
        timeBefore: "45 minutos",
        timeAfter: "90 segundos",
        savingsLabel: "Cotizás mientras el cliente todavía tiene ganas de comprar"
      },
      {
        icon: "crm",
        tag: "Comercial",
        title: "CRM inteligente y seguimiento de clientes",
        desc: "Cada interacción queda registrada sola, los leads calientes se priorizan y nadie se olvida de nadie.",
        before: ["Seguimiento en una planilla suelta", "Leads que se enfrían sin que nadie note", "Llamados y mensajes sin registrar"],
        after: ["Cada contacto se registra automáticamente", "La IA prioriza los leads más calientes", "Recordatorios automáticos de seguimiento"],
        timeBefore: "seguimiento inconsistente",
        timeAfter: "seguimiento 100% automático",
        savingsLabel: "Ningún lead se pierde por olvido"
      }
    ],

    comparatorTabs: [
      {
        id: "general", label: "General",
        metrics: [
          { label: "Tiempo dedicado a la tarea", before: 100, after: 8 },
          { label: "Costo operativo", before: 100, after: 18 },
          { label: "Errores humanos", before: 100, after: 4 },
          { label: "Velocidad de respuesta", before: 6, after: 100 }
        ]
      },
      {
        id: "facturacion", label: "Facturación",
        metrics: [
          { label: "Tiempo de carga", before: 100, after: 5 },
          { label: "Costo por factura procesada", before: 100, after: 20 },
          { label: "Errores de carga", before: 100, after: 3 },
          { label: "Velocidad de proceso", before: 8, after: 100 }
        ]
      },
      {
        id: "atencion", label: "Atención al cliente",
        metrics: [
          { label: "Tiempo de primera respuesta", before: 100, after: 2 },
          { label: "Costo de atención por consulta", before: 100, after: 25 },
          { label: "Consultas sin responder", before: 100, after: 6 },
          { label: "Disponibilidad horaria", before: 35, after: 100 }
        ]
      },
      {
        id: "conciliaciones", label: "Conciliaciones",
        metrics: [
          { label: "Tiempo de cierre mensual", before: 100, after: 12 },
          { label: "Costo administrativo", before: 100, after: 22 },
          { label: "Errores de conciliación", before: 100, after: 3 },
          { label: "Velocidad de detección de diferencias", before: 10, after: 100 }
        ]
      }
    ],

    cases: [
      {
        company: "Estudio Rivadavia & Asociados",
        sector: "Estudio contable · 35 personas · CABA",
        problem: "Tres personas full-time cargaban comprobantes a mano y perseguían vencimientos de AFIP en un calendario compartido que nadie miraba a tiempo.",
        solution: "Automatización de carga de comprobantes + agente de vencimientos impositivos con alertas automáticas.",
        result: "120 horas al mes recuperadas, cero vencimientos vencidos en 8 meses, el equipo de carga pasó a hacer asesoría a clientes.",
        metric: "120 hs/mes",
        metricLabel: "recuperadas"
      },
      {
        company: "Costanera Sur Propiedades",
        sector: "Inmobiliaria · 22 personas · Rosario",
        problem: "Los leads de portales y WhatsApp se enfriaban antes de que un vendedor los contactara. El seguimiento vivía en una planilla de Excel personal de cada agente.",
        solution: "CRM inteligente centralizado + agente de WhatsApp para primera respuesta y calificación automática de leads.",
        result: "34% más de leads convertidos a visita. El tiempo de primera respuesta bajó de 3 horas a 40 segundos.",
        metric: "+34%",
        metricLabel: "conversión a visita"
      },
      {
        company: "Transportes del Litoral",
        sector: "Logística · 140 personas · Santa Fe",
        problem: "Dos administrativos full-time cargaban remitos a mano y conciliaban gastos de combustible con errores frecuentes de tipeo.",
        solution: "Lectura automática de remitos con OCR + IA y conciliación automática de gastos de flota.",
        result: "95 horas al mes recuperadas. El error de facturación bajó del 6% al 0,4%.",
        metric: "6% → 0,4%",
        metricLabel: "error de facturación"
      },
      {
        company: "Clínica San Martín",
        sector: "Salud · 60 personas · Córdoba",
        problem: "La recepción telefónica se saturaba en horas pico y los recordatorios de turno se mandaban (o no) a mano, con alto ausentismo.",
        solution: "Agente de WhatsApp para gestión de turnos + recordatorios automáticos 24 y 2 horas antes.",
        result: "El ausentismo bajó del 22% al 9%. Recepción liberó 25 horas semanales para atención presencial.",
        metric: "22% → 9%",
        metricLabel: "ausentismo"
      }
    ],

    process: [
      { n: "01", title: "Reunión", desc: "30 minutos, sin costo. Nos contás cómo trabaja tu equipo hoy y dónde sentís que se pierde tiempo." },
      { n: "02", title: "Análisis", desc: "Auditamos tus procesos y te entregamos un informe con el ahorro potencial en horas y pesos, con números concretos." },
      { n: "03", title: "Automatización", desc: "Diseñamos y construimos la solución con nuestra biblioteca de automatizaciones probadas, adaptada a tu operación." },
      { n: "04", title: "Implementación", desc: "Integramos con los sistemas que ya usás. Probamos en paralelo antes de apagar el proceso manual." },
      { n: "05", title: "Capacitación", desc: "Tu equipo aprende a usar y confiar en la herramienta. Nada queda como caja negra." },
      { n: "06", title: "Soporte", desc: "Monitoreo, mejora continua y un panel de métricas en tiempo real: horas ahorradas, errores evitados, dinero recuperado." }
    ],

    tech: [
      "OpenAI", "Claude", "Gemini", "n8n", "Make", "Python", "FastAPI",
      "Docker", "PostgreSQL", "WhatsApp Business API", "Google Workspace",
      "Microsoft 365", "Power BI", "Zapier"
    ],

    faqs: [
      { q: "¿Qué es exactamente lo que hace Argent IA?", a: "Diseñamos e implementamos automatizaciones con Inteligencia Artificial que reemplazan tareas manuales y repetitivas en tu empresa — carga de datos, atención al cliente, reportes, conciliaciones — y medimos el tiempo y el dinero que te devuelven." },
      { q: "¿Necesito saber de tecnología para trabajar con ustedes?", a: "No. Vos nos contás el proceso como lo vivís hoy. Nosotros traducimos eso a una solución técnica y te la entregamos lista para usar, con capacitación incluida." },
      { q: "¿Cuánto cuesta una automatización?", a: "Depende del alcance. Tenemos paquetes desde Starter (una automatización puntual) hasta Enterprise (múltiples procesos integrados). Después de la auditoría gratuita te damos un número concreto, no un rango genérico." },
      { q: "¿Cuánto tarda en implementarse?", a: "Una automatización simple (por ejemplo, respuesta de WhatsApp) puede estar funcionando en 1 a 2 semanas. Proyectos con integración a varios sistemas toman entre 3 y 6 semanas." },
      { q: "¿La auditoría inicial es realmente gratis?", a: "Sí. Analizamos tu proceso y te entregamos un informe con el ahorro potencial estimado en horas y en pesos, sin costo y sin obligación de contratar." },
      { q: "¿Van a reemplazar a mis empleados?", a: "No es el objetivo ni el resultado habitual. La automatización saca la tarea repetitiva, no a la persona: la mayoría de nuestros clientes reubica a ese empleado en trabajo de mayor valor (atención, análisis, ventas)." },
      { q: "¿Es seguro darles acceso a mis sistemas y datos?", a: "Trabajamos con accesos limitados al mínimo necesario, encriptación de datos en tránsito y en reposo, y firmamos acuerdo de confidencialidad antes de tocar cualquier sistema." },
      { q: "¿Qué pasa si la automatización comete un error?", a: "Toda automatización crítica queda con un punto de control humano al principio (podés revisar antes de que se aplique) hasta que el equipo confía plenamente en el resultado. Además, todo queda registrado y es auditable." },
      { q: "¿Funciona con los sistemas que ya uso (ERP, CRM, contable)?", a: "En la mayoría de los casos sí, sin migrar de sistema. Nos integramos con los ERPs y sistemas contables más usados en Argentina, Google Workspace, Microsoft 365 y decenas de herramientas más." },
      { q: "¿Qué pasa si mi empresa es muy chica?", a: "Por eso existe el paquete Starter: una sola automatización de alto impacto, con inversión acotada y retorno rápido, pensada para equipos de 5 a 20 personas." },
      { q: "¿Y si mi empresa es grande y ya tiene un área de IT?", a: "Trabajamos como equipo extendido de IT: nos enfocamos en automatización e IA aplicada mientras tu equipo interno sigue enfocado en la infraestructura. Nos integramos a su forma de trabajar, no la reemplazamos." },
      { q: "¿Cómo miden el ahorro real?", a: "Cada automatización se entrega con un panel de métricas propio: horas ahorradas, tareas automatizadas, errores evitados y dinero recuperado, actualizado en tiempo real." },
      { q: "¿Qué pasa después de implementada la automatización, me dejan solo?", a: "No. El abono mensual incluye monitoreo, mantenimiento y mejoras continuas. Si un proceso cambia, la automatización se ajusta con vos." },
      { q: "¿Trabajan con WhatsApp Business real o es un bot genérico?", a: "Integramos con la API oficial de WhatsApp Business. El agente responde con el tono de tu marca y puede consultar tus sistemas en tiempo real, no son respuestas armadas de antemano." },
      { q: "¿Puedo cancelar el servicio cuando quiera?", a: "Sí, el abono de mantenimiento y mejora continua es mensual y sin permanencia forzosa. La automatización que ya implementamos sigue siendo tuya." },
      { q: "¿Qué industrias atienden?", a: "Estudios contables, inmobiliarias, constructoras, logística y transporte, salud, retail y servicios profesionales son los sectores donde más implementamos, pero cualquier empresa con tareas repetitivas es candidata." },
      { q: "¿Cómo se calcula el ROI que muestran en la web?", a: "Es una estimación orientativa basada en horas recuperadas por costo hora cargado, comparada contra una inversión de implementación típica para ese volumen. El número final y comprometido se define en la propuesta comercial, después de la auditoría." },
      { q: "¿Qué diferencia a Argent IA de contratar un freelancer de automatización?", a: "Una biblioteca propia de automatizaciones ya probadas (implementamos más rápido), soporte y mejora continua garantizados, y un panel de métricas que te permite auditar el resultado en cualquier momento." },
      { q: "¿Necesito comprar licencias de IA por separado (ChatGPT, etc.)?", a: "No necesariamente. En la mayoría de los proyectos el costo de los modelos de IA está incluido en el servicio. Si tu volumen es muy alto, te lo dejamos explícito y transparente desde la propuesta." },
      { q: "¿Cómo empiezo?", a: "Pedí tu auditoría gratuita desde el botón de esta página. Coordinamos una reunión de 30 minutos y en menos de una semana tenés un informe con el ahorro potencial de tu empresa." }
    ]
  };
})();
