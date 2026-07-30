/* =====================================================================
   VOYAGE — content catalog & personalization data
   Every card: audience rules (loc / role / dept), lane, source system,
   click-tracked deep link, due type. null audience = universal.
   ===================================================================== */

const VOYAGE = {

  user: { first: 'Alex', last: 'Rivera', vunetid: 'riveraa1', manager: 'Jordan Blake', startOffsetDays: 4 },

  locations: [
    { id: 'tn', name: 'Tennessee — Nashville', kicker: 'Main campus · VUMC',
      detail: 'Kirkland Hall · Medical Center North · One Hundred Oaks', p: 'Main campus and Medical Center. VUPD, VU Parking Services, TN compliance track.' },
    { id: 'ny', name: 'New York', kicker: 'Satellite · Clinical & research',
      detail: 'Partnered garage · Local PD coordination', p: 'Satellite clinical and research site. NY state compliance and commuter benefits.' },
    { id: 'fl', name: 'Florida', kicker: 'Satellite · Clinical',
      detail: 'On-site lot · Local safety contacts', p: 'Satellite clinical site. FL compliance track and local benefits nuances.' },
    { id: 'ca', name: 'California', kicker: 'Satellite · Research',
      detail: 'Commuter benefits · Kaiser plans available', p: 'Satellite research site. CA 2-hour harassment prevention and state disability.' }
  ],

  departments: [
    { group: 'Academic Affairs', items: ['Provost Office', 'Peabody College', 'School of Engineering', 'College of Arts & Science'] },
    { group: 'Medical Center', items: ['VUMC Nursing', 'VUMC Clinical Operations', 'VUMC Research Administration'] },
    { group: 'Finance & Administration', items: ['Human Resources', 'Finance & Accounting', 'Facilities & Campus Services', 'Information Technology'] },
    { group: 'Athletics & Student Life', items: ['Athletics', 'Dean of Students', 'Student Care Network'] }
  ],
  deptStats: { lead: 'Taylor Morgan', recentJoiners: 12 },

  roles: [
    { id: 'manager', name: 'People manager', kicker: 'Leads a team', p: 'Adds manager modules, approvals, Culture Amp manager kit, FMLA administration.' },
    { id: 'ic', name: 'Individual contributor', kicker: 'Core path', p: 'The standard staff path: systems, benefits, culture, and role learning.' },
    { id: 'faculty', name: 'Faculty / academic', kicker: 'Teaching & scholarship', p: 'Adds academic policy, FERPA depth, and faculty governance orientation.' },
    { id: 'clinical', name: 'Clinical / patient-facing', kicker: 'VUMC', p: 'Adds HIPAA depth, infection control, and credentialing links.' },
    { id: 'research', name: 'Research', kicker: 'Labs & studies', p: 'Adds IRB, IACUC, lab safety, and export control.' },
    { id: 'student', name: 'Student-facing', kicker: 'Student services', p: 'Adds FERPA and Title IX depth and Student Care Network orientation.' }
  ],

  /* lanes: pre | w1 | w24 · due: hard | soft | null · api: true = completion verified nightly */
  items: [
    /* ---- Universal ---- */
    { id: 'alertvu',   title: 'Sign up for AlertVU emergency notifications', cat: 'safety', lane: 'pre', mins: 5,  src: 'SharePoint', api: false, due: 'hard', dueLabel: 'Before Day 1', href: 'https://emergency.vanderbilt.edu/alertvu/' },
    { id: 'conduct',   title: 'Code of Conduct acknowledgment', cat: 'compliance', lane: 'w1', mins: 20, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'ferpa',     title: 'FERPA basics', cat: 'compliance', lane: 'w1', mins: 15, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 10', href: 'https://registrar.vanderbilt.edu/ferpa/' },
    { id: 'benefits',  title: 'Enroll in medical, dental & vision', cat: 'benefits', lane: 'w1', mins: 35, src: 'Oracle HCM', api: true, due: 'hard', dueLabel: 'Day 30 — enrollment window', href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'retire',    title: 'Retirement plan election', cat: 'benefits', lane: 'w24', mins: 25, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 30', href: 'https://hr.vanderbilt.edu/benefits/retirement.php' },
    { id: 'chancellor',title: 'Chancellor welcome video', cat: 'mission', lane: 'pre', mins: 8, src: 'SharePoint', api: false, due: null, href: 'https://www.vanderbilt.edu/chancellor/' },
    { id: 'daretogrow',title: '“Dare to Grow” — the strategic plan', cat: 'mission', lane: 'w1', mins: 18, src: 'SharePoint', api: false, due: null, href: 'https://www.vanderbilt.edu/strategicplan/' },
    { id: 'vunetid',   title: 'Activate VUnetID & multi-factor login', cat: 'systems', lane: 'pre', mins: 10, src: 'IT Portal', api: false, due: 'hard', dueLabel: 'Before Day 1', href: 'https://it.vanderbilt.edu/' },
    { id: 'ms365',     title: 'Set up Microsoft 365, Teams & OneDrive', cat: 'systems', lane: 'w1', mins: 20, src: 'Microsoft 365', api: true, due: 'soft', dueLabel: 'Day 3', href: 'https://www.office.com/' },
    { id: 'oraclehcm', title: 'Oracle HCM self-service tour — pay, W-4, direct deposit', cat: 'systems', lane: 'w1', mins: 15, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 5', href: 'https://hr.vanderbilt.edu/oracle/' },
    { id: 'badge',     title: 'Campus ID badge & building access', cat: 'systems', lane: 'w1', mins: 15, src: 'IT Portal', api: false, due: 'soft', dueLabel: 'Day 2', href: 'https://cardservices.vanderbilt.edu/' },
    { id: 'handbook',  title: 'Staff handbook — the essentials', cat: 'policies', lane: 'w1', mins: 30, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 14', href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'neo',       title: 'New Employee Orientation (live or on-demand)', cat: 'courses', lane: 'w1', mins: 120, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 14', href: 'https://hr.vanderbilt.edu/onboarding/' },
    { id: 'pulse7',    title: 'Day-7 onboarding pulse survey', cat: 'mission', lane: 'w1', mins: 4, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 7', href: 'https://www.cultureamp.com/' },
    { id: 'pulse30',   title: 'Day-30 onboarding pulse survey', cat: 'mission', lane: 'w24', mins: 5, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 30', href: 'https://www.cultureamp.com/' },

    /* ---- Location-driven ---- */
    { id: 'vupd',      title: 'VUPD, evacuation routes & campus safety', cat: 'safety', lane: 'w1', mins: 12, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 3', aud: { loc: ['tn'] }, href: 'https://police.vanderbilt.edu/' },
    { id: 'localpd',   title: 'Local site safety contacts & evacuation routes', cat: 'safety', lane: 'w1', mins: 10, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 3', aud: { loc: ['ny', 'fl', 'ca'] }, href: 'https://emergency.vanderbilt.edu/' },
    { id: 'harass-tn', title: 'Harassment prevention — Tennessee (1 hr)', cat: 'compliance', lane: 'w24', mins: 60, src: 'Vector Solutions', api: true, due: 'hard', dueLabel: 'Day 30', aud: { loc: ['tn', 'ny', 'fl'] }, href: 'https://www.vectorsolutions.com/' },
    { id: 'harass-ca', title: 'Harassment prevention — California (2 hr mandatory)', cat: 'compliance', lane: 'w24', mins: 120, src: 'Vector Solutions', api: true, due: 'hard', dueLabel: 'Day 30', aud: { loc: ['ca'] }, href: 'https://www.vectorsolutions.com/' },
    { id: 'park-tn',   title: 'Register for parking — VU Parking Services', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['tn'] }, href: 'https://www.vanderbilt.edu/parking/' },
    { id: 'park-ny',   title: 'Partnered garage & commuter benefits — New York', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['ny'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'park-fl',   title: 'On-site lot registration — Florida', cat: 'parking', lane: 'pre', mins: 8, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['fl'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'park-ca',   title: 'Commuter benefits & transit pass — California', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['ca'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'kaiser',    title: 'Kaiser plan options & state disability — California', cat: 'benefits', lane: 'w1', mins: 15, src: 'Oracle HCM', api: false, due: 'soft', dueLabel: 'Day 30', aud: { loc: ['ca'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'stateadd',  title: 'State employment law addenda for your site', cat: 'policies', lane: 'w24', mins: 15, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 21', aud: { loc: ['ny', 'fl', 'ca'] }, href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'traditions',title: 'Campus traditions — Anchor Down 101', cat: 'mission', lane: 'w24', mins: 10, src: 'SharePoint', api: false, due: null, aud: { loc: ['tn'] }, href: 'https://www.vanderbilt.edu/about/' },

    /* ---- Role-driven ---- */
    { id: 'mgr-safety',title: 'Manager safety obligations & incident reporting', cat: 'safety', lane: 'w24', mins: 25, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'mgr-comp',  title: 'Manager compliance duties & I-9 reverification', cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/' },
    { id: 'mgr-fmla',  title: 'FMLA administration for managers', cat: 'benefits', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 30', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'mgr-ca',    title: 'Culture Amp manager kit — 1:1s & check-ins', cat: 'systems', lane: 'w24', mins: 25, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://www.cultureamp.com/' },
    { id: 'mgr-oracle',title: 'Oracle approvals: timecards, requisitions, expenses', cat: 'systems', lane: 'w24', mins: 20, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 14', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/oracle/' },
    { id: 'hipaa',     title: 'HIPAA foundations for clinical staff', cat: 'compliance', lane: 'w1', mins: 22, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', aud: { role: ['clinical'] }, href: 'https://www.vumc.org/' },
    { id: 'infection', title: 'Infection control & credentialing links', cat: 'safety', lane: 'w1', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', aud: { role: ['clinical'] }, href: 'https://www.vumc.org/' },
    { id: 'epic',      title: 'Epic access & clinical systems setup', cat: 'systems', lane: 'w1', mins: 45, src: 'IT Portal', api: false, due: 'hard', dueLabel: 'Day 5', aud: { role: ['clinical'] }, href: 'https://www.vumc.org/', prereq: 'vunetid' },
    { id: 'labsafety', title: 'Lab safety orientation', cat: 'safety', lane: 'w1', mins: 40, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', aud: { role: ['research'] }, href: 'https://www.vanderbilt.edu/ehs/' },
    { id: 'irb',       title: 'IRB & IACUC essentials', cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://www.vanderbilt.edu/irb/' },
    { id: 'export',    title: 'Export control basics', cat: 'compliance', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 30', aud: { role: ['research'] }, href: 'https://www.vanderbilt.edu/' },
    { id: 'redcap',    title: 'REDCap & research data tools', cat: 'systems', lane: 'w24', mins: 25, src: 'IT Portal', api: false, due: 'soft', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://projectredcap.org/' },
    { id: 'titleix',   title: 'Title IX & FERPA depth for student-facing staff', cat: 'compliance', lane: 'w1', mins: 35, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 10', aud: { role: ['student', 'faculty'] }, href: 'https://www.vanderbilt.edu/title-ix/' },
    { id: 'facgov',    title: 'Faculty governance & academic policy orientation', cat: 'policies', lane: 'w24', mins: 30, src: 'SharePoint', api: false, due: null, aud: { role: ['faculty'] }, href: 'https://www.vanderbilt.edu/provost/' },
    { id: 'leadexp',   title: 'Leadership expectations at Vanderbilt', cat: 'mission', lane: 'w24', mins: 15, src: 'SharePoint', api: false, due: null, aud: { role: ['manager', 'faculty'] }, href: 'https://hr.vanderbilt.edu/' },

    /* ---- Department-driven ---- */
    { id: 'deptsop',   title: 'Your department’s SOPs & mission', cat: 'policies', lane: 'w1', mins: 25, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 10', href: '#dept' },
    { id: 'depttools', title: 'Department tools & systems checklist', cat: 'systems', lane: 'w1', mins: 20, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 10', href: '#dept', prereq: 'vunetid' },
    { id: 'deptcur',   title: 'Department learning track — first courses', cat: 'courses', lane: 'w24', mins: 90, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 30', href: '#dept', prereq: 'neo' }
  ],

  cats: {
    safety:     { label: 'Safety & Compliance', hard: true },
    compliance: { label: 'Safety & Compliance', hard: true },
    benefits:   { label: 'Benefits' },
    mission:    { label: 'Mission, Values & Culture' },
    systems:    { label: 'Systems & Access' },
    parking:    { label: 'Parking, Commute & Workplace' },
    policies:   { label: 'Your Role & Department' },
    courses:    { label: 'Your Role & Department' }
  },

  /* Six primary dashboard tiles — filter keys map onto item cats */
  tiles: [
    { id: 'safetycomp', label: 'Safety & Compliance', cats: ['safety', 'compliance'], hard: true },
    { id: 'benefits',   label: 'Benefits', cats: ['benefits'] },
    { id: 'mission',    label: 'Mission, Values & Culture', cats: ['mission'] },
    { id: 'systems',    label: 'Systems & Access', cats: ['systems'] },
    { id: 'parking',    label: 'Parking, Commute & Workplace', cats: ['parking'] },
    { id: 'roledept',   label: 'Your Role & Department', cats: ['policies', 'courses'] }
  ],

  lanes: [
    { id: 'pre', title: 'Before Day 1', kicker: 'Get ready' },
    { id: 'w1',  title: 'Week 1', kicker: 'Land well' },
    { id: 'w24', title: 'Weeks 2–4', kicker: 'Build momentum' }
  ],

  people: [
    { name: 'Jordan Blake', role: 'Your manager', rel: 'Manager', init: 'JB' },
    { name: 'Sam Whitfield', role: 'Skip-level leader', rel: 'Skip-level', init: 'SW' },
    { name: 'Priya Natarajan', role: 'Peer · same team', rel: 'Peer', init: 'PN' },
    { name: 'Chris Okafor', role: 'Cross-functional partner', rel: 'Partner', init: 'CO' }
  ],

  announcements: [
    'Benefits open enrollment closes at the end of your first 30 days.',
    'New Employee Orientation runs live every other Tuesday — on-demand anytime.',
    'Building Brave Teams workshop enrollment opens next month.'
  ],

  renewals: [
    { title: 'Annual HIPAA refresher', src: 'Oracle Learn', days: 21, href: 'https://www.vumc.org/' },
    { title: 'Harassment prevention recertification', src: 'Vector Solutions', days: 48, href: 'https://www.vectorsolutions.com/' },
    { title: 'Benefits open enrollment window', src: 'Oracle HCM', days: 76, href: 'https://hr.vanderbilt.edu/benefits/' }
  ],

  explore: [
    { title: 'Futures Learning Hub — leadership development', desc: 'Programs that grow leaders at every level.', src: 'FLH', href: 'https://me5231979.github.io/Course_Library/' },
    { title: 'AI upskilling — AI Basics & AI 201', desc: 'From first prompt to governed workflows.', src: 'Learning Series', href: 'https://me5231979.github.io/AI_Classroom/' },
    { title: 'Building Brave Teams workshop', desc: 'Psychological safety, practiced live.', src: 'FLH', href: 'https://me5231979.github.io/Course_Library/' },
    { title: 'Mentoring, tuition benefits & wellness', desc: 'Grow beyond the role you were hired for.', src: 'HR', href: 'https://hr.vanderbilt.edu/' }
  ],

  quickSystems: [
    { name: 'Oracle HCM', href: 'https://hr.vanderbilt.edu/oracle/' },
    { name: 'Oracle Learn', href: 'https://hr.vanderbilt.edu/onboarding/' },
    { name: 'Microsoft 365', href: 'https://www.office.com/' },
    { name: 'Culture Amp', href: 'https://www.cultureamp.com/' },
    { name: 'VU Email & Zoom', href: 'https://it.vanderbilt.edu/' }
  ],

  quickPeople: [
    { name: 'Jordan Blake', sub: 'Manager' },
    { name: 'HR Business Partner', sub: 'People & culture' },
    { name: 'IT Support — 615-343-9999', sub: 'Tech help' },
    { name: 'Benefits contact', sub: 'Total Rewards' },
    { name: 'EAP', sub: 'Confidential support' }
  ]
};
