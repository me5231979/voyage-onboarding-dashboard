/* =====================================================================
   VOYAGE — i18n (EN / ES)
   Spanish covers the interface chrome: navigation, gate, lane titles,
   pills, actions, labels, and empty states. Course and program titles
   remain in English — they are the actual Oracle Learning item names.
   ===================================================================== */

(function () {
  'use strict';

  /* dynamic strings used by the renderers */
  var TS = {
    'Not started': 'Sin iniciar', 'Opened': 'Abierto', 'Complete': 'Completado',
    '✓ Verified': '✓ Verificado', 'Opted out': 'Exento',
    'Start': 'Iniciar', 'Open': 'Abrir', 'Revisit': 'Repasar', 'Verify': 'Verificar',
    'Take survey': 'Responder encuesta', 'How-to guide (PDF)': 'Guía práctica (PDF)',
    'Mark as done': 'Marcar como completado', 'Confirm complete': 'Confirmar completado',
    'Save for later': 'Guardar para después', 'Opt out': 'Solicitar exención',
    'Reopen': 'Reabrir', 'Reinstate': 'Restablecer', 'Cancel': 'Cancelar',
    'Record opt-out': 'Registrar exención', 'About': 'Más información',
    '★ Recommended': '★ Recomendado',
    'Compliance': 'Cumplimiento', 'Course': 'Curso', 'Setup task': 'Tarea inicial',
    'Meeting': 'Reunión', 'Survey': 'Encuesta', 'Read & watch': 'Leer y ver',
    'Verify & Validate': 'Verificar y validar', 'Covered in Voyage Classroom': 'Cubierto en Voyage (Presencial)',
    'You completed these during Vanderbilt Voyage (Classroom). Open each one to verify it carried over, then confirm it here.':
      'Completaste esto durante Vanderbilt Voyage (Presencial). Abre cada uno para verificar que se registró y confírmalo aquí.',
    'Week 1': 'Semana 1', 'Land well': 'Buen aterrizaje',
    'Weeks 2–4': 'Semanas 2–4', 'Build momentum': 'Gana impulso',
    'Weeks 5–6': 'Semanas 5–6', 'Through Day 45': 'Hasta el día 45',
    'Days 46–90': 'Días 46–90', 'Grow into the role': 'Crece en tu puesto',
    'Good morning': 'Buenos días', 'Good afternoon': 'Buenas tardes', 'Good evening': 'Buenas noches',
    'Welcome back': 'Bienvenido de nuevo',
    'min': 'min',
    'All caught up. Well sailed.': 'Todo al día. ¡Buen viaje!',
    'Nothing saved yet.': 'Aún no hay nada guardado.',
    'Nothing viewed yet.': 'Aún no has visto nada.',
    'Nothing completed yet.': 'Aún no has completado nada.',
    'Nothing in progress — everything you opened is complete.': 'Nada en curso: todo lo que abriste está completado.',
    'You’re fully current. New items land here as they publish.': 'Estás al día. Los nuevos elementos aparecerán aquí al publicarse.',
    'Opt out — write a brief justification. It is recorded and reportable, like a quiz response.':
      'Exención: escribe una breve justificación. Queda registrada y es reportable, como la respuesta de un cuestionario.',
    'e.g., Completed equivalent training at my previous employer in May 2026.':
      'p. ej., Completé una capacitación equivalente con mi empleador anterior en mayo de 2026.',
    'Opt-out needs a written justification.': 'La exención requiere una justificación escrita.',
    'Opted out — justification recorded.': 'Exención registrada con su justificación.',
    'Reopened — status reset to Not started.': 'Reabierto: el estado vuelve a Sin iniciar.',
    'Reinstated — back on your path.': 'Restablecido: vuelve a tu ruta.',
    'Filter your path by category': 'Filtra tu ruta por categoría',
    '✕ Show everything': '✕ Mostrar todo',
    '⚓ Manager’s Voyage only': '⚓ Solo Manager’s Voyage',
    '⚓ Manager’s Voyage': '⚓ Manager’s Voyage',
    'Deadlines': 'Plazos',
    'Up next': 'A continuación',
    'AI — deeper dive': 'IA — nivel avanzado',
    'Manager development': 'Desarrollo gerencial', 'Professional development': 'Desarrollo profesional',
    'Skills that matter in your sub-family': 'Habilidades clave en tu subfamilia',
    'Skills that matter here': 'Habilidades clave aquí',
    'items': 'elementos', 'to go': 'pendientes',
    'Renews in': 'Se renueva en', 'days': 'días',
    'Guide opened — schedule the meeting, then mark it complete with the ✓.':
      'Guía abierta: agenda la reunión y márcala como completada con ✓.',
    'Your first 90 days are complete — recorded in Oracle Learning. Well sailed.':
      'Tus primeros 90 días están completos y registrados en Oracle Learning. ¡Buen viaje!',
    'Nothing to renew yet.': 'Aún no hay renovaciones.',
    'RENEW_EMPTY_BODY': 'Los requisitos anuales y bienales (prevención del acoso, ciberseguridad, preparación para emergencias) reaparecerán aquí automáticamente después de completarlos, contando desde tu fecha de finalización. En producción, las asignaciones de renovación de Oracle Learning también se sincronizan aquí.',
    'DAY_BEYOND': '<b>Del día 91 en adelante: Más allá de los 90 días.</b> Cuando termines la ruta, Voyage será el lugar para encontrar cualquier curso, seguir tus renovaciones y continuar creciendo con Programas, Eventos y Alianzas.',
    'Preview it now →': 'Ver ahora →',
    'Renew': 'Renovar'
  };

  var lang = 'en';
  window.VoyageT = function (s) { return (lang === 'es' && TS[s]) || s; };
  window.VoyageLang = {
    get: function () { return lang; },
    set: function (l) { lang = l === 'es' ? 'es' : 'en'; document.documentElement.lang = lang; applyStatic(); }
  };

  /* static chrome: [selector, en, es, isHTML] */
  var S = [
    ['#navDash', 'My first 90 days', 'Mis primeros 90 días'],
    ['#navReturn', 'Beyond 90 Days', 'Más allá de los 90 días'],
    ['#navEngage', 'Programs & Partnerships', 'Programas y alianzas'],
    ['.hero--voyage .eyebrow', 'Vanderbilt · Voyage · Staff Onboarding', 'Vanderbilt · Voyage · Incorporación del personal'],
    ['.hero--voyage h1', 'Welcome. Your path is <em class="gold-text">already&nbsp;built</em>.', 'Bienvenido. Tu ruta <em class="gold-text">ya está&nbsp;lista</em>.', 1],
    ['.hero--voyage .lead', "You've finished Vanderbilt Voyage (Classroom) — this is what comes next. A few quick questions tune your first 90 days to your campus, your department, and your role, then every task, course, and contact lives on one dashboard. We know you. We're ready for you.",
      'Terminaste Vanderbilt Voyage (Presencial); esto es lo que sigue. Unas preguntas rápidas ajustan tus primeros 90 días a tu campus, tu área y tu puesto, y cada tarea, curso y contacto vive en un solo tablero. Te conocemos. Estamos listos para ti.'],
    ['#beginBtn', "Let's tailor your first weeks", 'Personalicemos tus primeras semanas'],
    ['#idMeta', 'Demo profile — at launch this card is pre-populated from your Oracle HCM record via single sign-on', 'Perfil de demostración: en producción esta tarjeta se completa desde tu registro de Oracle HCM mediante inicio de sesión único'],
    ['#renameBtn', 'Not Alex? Use your name', '¿No eres Alex? Usa tu nombre'],
    ['.gate__step[data-step="1"] .eyebrow', 'Step 1 of 3 · Location', 'Paso 1 de 3 · Ubicación'],
    ['.gate__step[data-step="1"] h2', 'Where will you <em class="gold-text">anchor</em>?', '¿Dónde vas a <em class="gold-text">anclar</em>?', 1],
    ['.gate__step[data-step="1"] .lead', 'Your campus sets your parking vendor, safety contacts, state compliance track, and local benefits.', 'Tu campus define el estacionamiento, los contactos de seguridad, el cumplimiento estatal y los beneficios locales.'],
    ['.gate__step[data-step="2"] .eyebrow', 'Step 2 of 3 · Job family', 'Paso 2 de 3 · Familia laboral'],
    ['.gate__step[data-step="2"] h2', 'Find your <em class="gold-text">job family</em>.', 'Encuentra tu <em class="gold-text">familia laboral</em>.', 1],
    ['.gate__step[data-step="2"] .lead', "From Vanderbilt's Skills-Based Job Architecture — 18 families, 95 sub-families. Start typing, or browse by family.", 'De la Arquitectura de Puestos por Habilidades de Vanderbilt: 18 familias, 95 subfamilias. Escribe para buscar o navega por familia.'],
    ['.gate__step[data-step="3"] .eyebrow', 'Step 3 of 3 · Role', 'Paso 3 de 3 · Puesto'],
    ['.gate__step[data-step="3"] h2', 'What kind of <em class="gold-text">work</em>?', '¿Qué tipo de <em class="gold-text">trabajo</em>?', 1],
    ['.gate__step[data-step="3"] .lead', 'Auto-suggested from your Oracle job code — confirm or change it. This sets the depth of your path.', 'Sugerido según tu código de puesto en Oracle: confírmalo o cámbialo. Esto define la profundidad de tu ruta.'],
    ['#studentQ', '<b>I have the potential to work with students or minors.</b> A yes — or an unsure — adds Protection of Minors 101 and Clery Act training to your path. This stacks with any role.', '<b>Podría trabajar con estudiantes o menores.</b> Un sí —o un no estoy seguro— añade Protection of Minors 101 y la capacitación de la Ley Clery a tu ruta. Aplica a cualquier puesto.', 1],
    ['.studentopts [data-student="yes"]', 'Yes', 'Sí'],
    ['.studentopts [data-student="no"]', 'No', 'No'],
    ['.studentopts [data-student="unsure"]', 'Unsure', 'No estoy seguro'],
    ['.gate__step[data-step="4"] .eyebrow', 'Your custom path', 'Tu ruta personalizada'],
    ['.gate__step[data-step="4"] h2', "Here's your <em class=\"gold-text\">voyage</em>.", 'Este es tu <em class="gold-text">viaje</em>.', 1],
    ['#gateFinish', "Let's begin", 'Comencemos'],
    ['#locNext', 'Continue', 'Continuar'], ['#deptNext', 'Continue', 'Continuar'], ['#roleNext', 'Continue', 'Continuar'],
    ['#dashEyebrow', 'Voyage · Your first 90 days', 'Voyage · Tus primeros 90 días'],
    ['#view-dashboard .howline', 'This dashboard continues where <b>Vanderbilt Voyage (Classroom)</b> left off. Every card links straight into its source system — <b>the click is your completion signal</b>. Systems with an API verify true completion overnight and upgrade the card to <b>✓ Verified</b>.', 'Este tablero continúa donde terminó <b>Vanderbilt Voyage (Presencial)</b>. Cada tarjeta enlaza directamente con su sistema de origen: <b>el clic es tu señal de avance</b>. Los sistemas con API verifican la finalización real cada noche y actualizan la tarjeta a <b>✓ Verificado</b>.', 1],
    ['.filterlabel > span:first-child', 'Filter your path by category', 'Filtra tu ruta por categoría'],
    ['#filterClear', '✕ Show everything', '✕ Mostrar todo'],
    ['#mvFilter', '⚓ Manager’s Voyage only', '⚓ Solo Manager’s Voyage'],
    ['#profileBtn', 'Change role / campus', 'Cambiar puesto / campus'],
    ['#railBenefits h4', 'Benefits window', 'Plazo de beneficios'],
    ['#railBenefits .countdown span', 'days left to enroll', 'días para inscribirte'],
    ['#railBenefits a[data-open]', 'Go to enrollment →', 'Ir a la inscripción →'],
    ['#view-dashboard .railbox:nth-of-type(2) h4', 'Up next', 'A continuación'],
    ['#view-dashboard .railbox:nth-of-type(3) h4', 'Saved for later', 'Guardado para después'],
    ['#view-dashboard .railbox:nth-of-type(4) h4', 'Announcements', 'Avisos'],
    ['#view-returning .dashhead .eyebrow', 'Voyage · Beyond 90 Days', 'Voyage · Más allá de los 90 días'],
    ['#growTitle', 'Grow my <em>career</em>', 'Impulsa mi <em>carrera</em>', 1],
    ['.growmatrix div', '<b>Not sure where to start?</b> Build your path with the Skill Matrix — map your sub-family’s skills to courses.', '<b>¿No sabes por dónde empezar?</b> Construye tu ruta con la Matriz de Habilidades: conecta las habilidades de tu subfamilia con cursos.', 1],
    ['.growmatrix a.btn', 'Build your path →', 'Construye tu ruta →'],
    ['#view-engage .eyebrow', 'Programs, Events & Partnerships', 'Programas, eventos y alianzas'],
    ['#view-engage h1', 'Ways to <em class="gold-text">engage</em>.', 'Formas de <em class="gold-text">participar</em>.', 1],
    ['#view-engage .lead', "Onboarding ends; belonging doesn't. These are the programs, councils, and communities open to you as a Vanderbilt staff member — from day one and for your whole career.", 'La incorporación termina; la pertenencia no. Estos son los programas, consejos y comunidades abiertos para ti como miembro del personal de Vanderbilt, desde el primer día y durante toda tu carrera.'],
    ['.footer .brandline', 'Every journey, well begun.', 'Todo viaje, bien comenzado.']
  ];

  function applyStatic() {
    S.forEach(function (row) {
      var el = document.querySelector(row[0]);
      if (!el) return;
      var val = lang === 'es' ? row[2] : row[1];
      if (row[3]) el.innerHTML = val; else el.textContent = val;
    });
  }
})();
