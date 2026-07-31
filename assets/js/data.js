/* =====================================================================
   VOYAGE — content catalog & personalization data
   Every card: audience rules (loc / role / dept), lane, source system,
   click-tracked deep link, due type. null audience = universal.
   ===================================================================== */

const VOYAGE = {

  user: { first: 'Alex', last: 'Rivera', vunetid: 'riveraa1' },

  locations: [
    { id: 'tn', name: 'Tennessee — Nashville', kicker: 'Nashville campus',
      detail: 'Kirkland Hall · One Hundred Oaks', p: 'The Nashville campus. VUPD, VU Parking Services, and the TN compliance track.' },
    { id: 'ny', name: 'New York', kicker: 'New York campus',
      detail: 'Partnered garage · Local safety contacts', p: 'The New York campus. NY state compliance track and commuter benefits.' },
    { id: 'fl', name: 'Florida', kicker: 'Florida campus',
      detail: 'On-site lot · Local safety contacts', p: 'The Florida campus. FL compliance track and local benefits nuances.' },
    { id: 'ca', name: 'California', kicker: 'California campus',
      detail: 'Commuter benefits · Kaiser plans available', p: 'The California campus. CA harassment-prevention track and state disability coverage.' }
  ],

  /* Job architecture comes from SBJA (assets/js/sbja.js): 18 families, 95 sub-families */

  /* Futures Learning Hub program portfolio (from FLH_Programs.xlsx).
     aud: 'all' | 'manager' (people leaders) | 'exec' | 'esl' */
  programs: [
    { name: 'CHART', aud: 'all', who: 'All staff', href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003133195222&learningItemType=ORA_CLASS',
      what: "FLH's AI fluency program: a self-paced platform, a 4-week intensive, and an ongoing workshop series with VUIT.",
      value: 'Builds baseline AI capability across the workforce and drives AI enablement.' },
    { name: 'Leadership Redefined', aud: 'manager', who: 'M1–E1 leaders',
      what: "Vanderbilt's premier Chancellor-sponsored development program for senior leaders: six leadership modules, a capstone innovation project, three coaching sessions, and weekly synthesis sessions.",
      value: 'Prepares leaders to move with clarity, agility, and conviction.' },
    { name: 'Manager Voyage', aud: 'manager', who: 'Managers',
      what: 'Leadership program for new and newly promoted people managers.',
      value: 'Establishes a consistent management baseline early in the manager lifecycle.' },
    { name: 'SPEAK', aud: 'esl', who: 'Staff building English proficiency',
      what: 'Language literacy program powered via EdAssist.',
      value: 'Removes language barriers to participation and advancement.' },
    { name: 'Anchors Edge', aud: 'all', who: 'All staff',
      what: 'Weekly all-staff virtual lunch-and-learn series.',
      value: 'A low-barrier, recurring touchpoint for continuous learning.' },
    { name: 'Talent Marketplace', aud: 'all', who: 'All staff', href: 'https://www.vanderbilt.edu/pcb/talent-marketplace/',
      what: 'Oracle Grow-based staff talent platform.',
      value: 'Connects staff to growth opportunities and surfaces internal talent for mobility.' },
    { name: 'Navigators Session', aud: 'all', who: 'Facilitators & aspiring facilitators',
      what: "FLH's facilitator network and facilitation education program.",
      value: "Builds internal facilitation capability, extending FLH's reach." },
    { name: 'Cohort Certification Program', aud: 'all', who: 'All staff',
      what: 'Non-degree certification programs funded through the tuition reimbursement benefit, run as cohorts in partnership with EdAssist.',
      value: 'Reduces cost and builds community by moving through certifications together.' },
    { name: 'Coaching', aud: 'all', who: 'All staff',
      what: 'Professional coaching in partnership with Abroad (carries an additional cost).',
      value: 'Extends individualized development support across the workforce.' }
  ],

  roles: [
    { id: 'manager', name: 'People manager', kicker: 'Leads a team', p: 'Adds manager modules, approvals, Culture Amp manager kit, FMLA administration.' },
    { id: 'ic', name: 'Individual contributor', kicker: 'Core path', p: 'The standard staff path: systems, benefits, culture, and role learning.' },
    { id: 'research', name: 'Research', kicker: 'Labs & studies', p: 'Adds IRB, lab safety, biosafety, and export control.' }
  ],

  /* lanes: pre | w1 | w24 · due: hard | soft | null · api: true = completion verified nightly */
  items: [
    /* ---- Universal ---- */
    { id: 'alertvu', type: 'task',   title: 'Sign up for AlertVU emergency notifications', cat: 'safety', lane: 'pre', mins: 5,  src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Verify on Day 1', href: 'https://emergency.vanderbilt.edu/alertvu/' },
    { id: 'ferpa', type: 'compliance',     title: 'FERPA Tutorial', cat: 'compliance', lane: 'w1', mins: 15, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 10', href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001262145866' },
    { id: 'benefits', type: 'task',  title: 'Enroll in medical, dental & vision', cat: 'benefits', lane: 'w1', mins: 35, src: 'Oracle HCM', api: true, due: 'hard', dueLabel: 'Day 30 — enrollment window', href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'retire', type: 'task',    title: 'Retirement plan election', cat: 'benefits', lane: 'w56', mins: 25, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 45', href: 'https://hr.vanderbilt.edu/benefits/retirement.php' },
    { id: 'chancellor', type: 'read',title: 'Chancellor welcome video', cat: 'mission', lane: 'pre', mins: 8, src: 'SharePoint', api: false, due: null, href: 'https://www.vanderbilt.edu/chancellor/' },
    { id: 'daretogrow', type: 'read',title: '“Dare to Grow” — the strategic plan', cat: 'mission', lane: 'w1', mins: 18, src: 'SharePoint', api: false, due: null, href: 'https://www.vanderbilt.edu/strategicplan/' },
    { id: 'vunetid', type: 'task',   title: 'Activate VUnetID & multi-factor login', cat: 'systems', lane: 'pre', mins: 10, src: 'IT Portal', api: false, due: 'soft', dueLabel: 'Verify on Day 1', href: 'https://it.vanderbilt.edu/' },
    { id: 'ms365', type: 'task',     title: 'Set up Microsoft 365, Teams & OneDrive', cat: 'systems', lane: 'w1', mins: 20, src: 'Microsoft 365', api: true, due: 'soft', dueLabel: 'Day 3', href: 'https://www.office.com/' },
    { id: 'oraclehcm', type: 'task', title: 'Oracle HCM self-service tour — pay, W-4, direct deposit', cat: 'systems', lane: 'w1', mins: 15, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 5', href: 'https://hr.vanderbilt.edu/oracle/' },
    { id: 'badge', type: 'task',     title: 'Campus ID badge & building access', cat: 'systems', lane: 'w1', mins: 15, src: 'IT Portal', api: false, due: 'soft', dueLabel: 'Day 2', href: 'https://cardservices.vanderbilt.edu/' },
    { id: 'handbook', type: 'read',  title: 'Policies for review — staff handbook & key policies', cat: 'policies', lane: 'w24', mins: 30, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 21', href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'pulse7', type: 'survey',    title: 'Day-7 onboarding pulse survey', cat: 'mission', lane: 'w1', mins: 4, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 7', href: 'https://www.cultureamp.com/' },
    { id: 'pulse30', type: 'survey',   title: 'Day-30 onboarding pulse survey', cat: 'mission', lane: 'w24', mins: 5, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 30', href: 'https://www.cultureamp.com/' },

    /* ---- Compliance (from the Compliance Training Matrix — one entry per Master Matrix row) ---- */
    { id: 'R-001', type: 'compliance', title: "NY Sexual Harassment Prevention \u2014 Employees", course: "NY Sexual Harassment Prevention — Employees (OpenSesame via Oracle)", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Legal', cite: "NY Lab Law \u00a7201-g", aud: { loc: ["ny"], role: ["ic", "research"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003105384903&learningItemType=ORA_CLASS" },
    { id: 'R-002', type: 'compliance', title: "NY Sexual Harassment Prevention \u2014 Supervisors", course: "NY Sexual Harassment Prevention — Supervisors (OpenSesame via Oracle)", cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire/promo", cadence: "Annual", legal: 'Legal', cite: "NY Lab Law \u00a7201-g", aud: { loc: ["ny"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003075234491&learningItemType=ORA_CLASS" },
    { id: 'R-003', type: 'compliance', title: "NY Retail Worker Safety Act \u2014 Employees", course: "Workplace Violence Prevention (New York - Non-Supervisor - Retail)", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual (50+) / Biennial (10\u201349)", legal: 'Legal', cite: "NY Lab Law \u00a727-e", aud: { loc: ["ny"], role: ["ic", "research"] }, cond: "Applies only at NY retail sites with 10+ retail employees", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003105384706" },
    { id: 'R-004', type: 'compliance', title: "NY Retail Worker Safety Act \u2014 Supervisors", course: "Workplace Violence Prevention (New York - Non-Supervisor - Retail)", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire/promo", cadence: "Annual (50+) / Biennial (10\u201349)", legal: 'Legal', cite: "NY Lab Law \u00a727-e", aud: { loc: ["ny"], role: ["manager"] }, cond: "Applies only to supervisors of NY retail staff", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003105384706" },
    { id: 'R-005', type: 'compliance', title: "CA Sexual Harassment Prevention \u2014 Employees (SB 1343)", course: "Sexual Harassment Prevention Training for Employees in the State of California", cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 6 months of hire", cadence: "Every 2 years", legal: 'Legal', cite: "CA Gov Code \u00a712950.1 (SB 1343)", aud: { loc: ["ca"], role: ["ic", "research"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653139" },
    { id: 'R-006', type: 'compliance', title: "CA Sexual Harassment Prevention \u2014 Supervisors (SB 1343)", course: "California Sexual Harassment Prevention Training (Supervisors)", cat: 'compliance', lane: 'w24', mins: 120, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 6 months of hire/promo", cadence: "Every 2 years", legal: 'Legal', cite: "CA Gov Code \u00a712950.1 (SB 1343)", aud: { loc: ["ca"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653184" },
    { id: 'R-007', type: 'compliance', title: "CA Workplace Violence Prevention \u2014 Employees (SB 553)", course: "California Workplace Violence Prevention (Employee)", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "On hire / on plan update", cadence: "Annual", legal: 'Legal', cite: "CA Lab Code \u00a76401.9 (SB 553)", aud: { loc: ["ca"], role: ["ic", "research"] }, cond: "Must train on Vanderbilt's actual WVPP, not generic content", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653279" },
    { id: 'R-008', type: 'compliance', title: "CA Workplace Violence Prevention \u2014 Supervisors (SB 553)", course: "California Workplace Violence Prevention (Employer)", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "On hire / on plan update", cadence: "Annual", legal: 'Legal', cite: "CA Lab Code \u00a76401.9 (SB 553)", aud: { loc: ["ca"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653230" },
    { id: 'R-009', type: 'compliance', title: "FL Human Trafficking Awareness \u2014 Lodging Staff", course: "Human Trafficking Awareness", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 60 days of hire", cadence: "Annual", legal: 'Legal', cite: "FL Stat. \u00a7509.096", aud: { loc: ["fl"], role: ["ic", "research"] }, cond: "Triggers only for FL lodging operations staff", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001864004385" },
    { id: 'R-010', type: 'compliance', title: "FL Human Trafficking Awareness \u2014 Supervisors", course: "Global Human Trafficking Awareness", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 60 days of hire/promo", cadence: "Annual", legal: 'Legal', cite: "FL Stat. \u00a7509.096", aud: { loc: ["fl"], role: ["manager"] }, cond: "Triggers only for FL lodging supervisors", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002076110784" },
    { id: 'R-011', type: 'compliance', title: "FL Harassment Prevention \u2014 Employees (Advisory)", course: "Workplace Harassment (U.S. Multi-State)", cat: 'compliance', lane: 'w56', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: "Annual (policy)", legal: 'Advisory', cite: "Title VII baseline (no FL mandate)", aud: { loc: ["fl"], role: ["ic", "research"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002866689067&learningItemType=ORA_CLASS" },
    { id: 'R-012', type: 'compliance', title: "FL Harassment Prevention \u2014 Supervisors (Advisory)", course: "Workplace Harassment (U.S. Multi-State)", cat: 'compliance', lane: 'w56', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: "Annual (policy)", legal: 'Advisory', cite: "Title VII; EEOC supervisor liability", aud: { loc: ["fl"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002866689067&learningItemType=ORA_CLASS" },
    { id: 'R-013', type: 'compliance', title: "TN Harassment Prevention \u2014 Employees (Advisory)", course: "Workplace Harassment (U.S. Multi-State)", cat: 'compliance', lane: 'w56', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: "Annual (policy)", legal: 'Advisory', cite: "THRA / Title VII baseline", aud: { loc: ["tn"], role: ["ic", "research"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002866689067&learningItemType=ORA_CLASS" },
    { id: 'R-014', type: 'compliance', title: "TN Harassment Prevention \u2014 Supervisors (Advisory)", course: "Workplace Harassment (U.S. Multi-State)", cat: 'compliance', lane: 'w56', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: "Annual (policy)", legal: 'Advisory', cite: "THRA / Title VII", aud: { loc: ["tn"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002866689067&learningItemType=ORA_CLASS" },
    { id: 'R-017', type: 'compliance', title: "Cybersecurity Awareness", course: "Enhanced Cybersecurity Training for VU employees", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Advisory', cite: "VU IT Policy; cyber-insurance requirement", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001966018198" },
    { id: 'R-018', type: 'compliance', title: "HIPAA Privacy & Security (Workforce)", course: "HIPAA - Privacy Rule for Covered Entities", cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Legal', cite: "45 CFR \u00a7164.530(b) / \u00a7164.308(a)(5)", aud: { role: ["research"] }, cond: "Triggered by PHI access (role/job code), not by state", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001863994802" },
    { id: 'R-019', type: 'compliance', title: "Title IX / Clery / VAWA", course: "Addressing Harassment & Discrimination at Vanderbilt (Title IX)", cat: 'compliance', lane: 'w24', mins: 35, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Legal', cite: "20 USC \u00a71681 (Title IX); \u00a71092(f) (Clery)", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003032113101&learningItemType=ORA_CLASS" },
    { id: 'R-020', type: 'compliance', title: "Reasonable Accommodations & Disability Awareness (Mgr)", course: "Guidelines for Reasonable Accommodations in the Workplace", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: "Within 60 days of hire/promo", cadence: "Every 2 years", legal: 'Advisory', cite: "ADA / state parallel statutes", aud: { role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653418" },

    { id: 'talentmp', type: 'course', title: 'Talent Marketplace — get started', cat: 'systems', lane: 'w56', mins: 30, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003063355987&learningItemType=ORA_CLASS', info: 'https://www.vanderbilt.edu/pcb/talent-marketplace/' },

    /* ---- AI Enablement ---- */
    { id: 'chart', type: 'course', rec: true, title: 'CHART — AI fluency for every Vanderbilt role', cat: 'ai', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: null, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003133195222&learningItemType=ORA_CLASS' },
    { id: 'aibasics', type: 'course', rec: true, title: 'AI Basics: What Every Professional Needs to Know', cat: 'ai', lane: 'w56', mins: 60, src: 'Oracle Learn', api: true, due: null, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003100146415' },
    { id: 'ai201', type: 'course', rec: true, title: 'What Is Generative AI?', cat: 'ai', lane: 'w713', mins: 45, src: 'Oracle Learn', api: true, due: null, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857283770', prereq: 'aibasics' },

    { id: 'R-021', title: "VU Emergency Preparedness & Response", course: "PCB Compliance Module — emergency preparedness video & active assailant training", cat: 'safety', type: 'compliance', lane: 'w1', mins: 30, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 14', cadence: 'Annual', legal: 'Advisory', cite: "VU PCB compliance module", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002882491370&learningItemType=ORA_CLASS" },
    { id: 'R-022', title: "VU Emergency Preparedness — Supplemental Materials", course: "Emergency preparedness guide & simulation", cat: 'safety', type: 'compliance', lane: 'w56', mins: 15, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: 'Annual', legal: 'Advisory', cite: "VU PCB compliance module", prereq: 'R-021', href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002882442178&learningItemType=ORA_CLASS" },
    { id: 'R-023', title: "Conflicts of Interest — Managing Work & Personal Interests", course: "COI course & VU COI disclosure training video", cat: 'compliance', type: 'compliance', lane: 'w56', mins: 15, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: 'Annual', legal: 'Advisory', cite: "VU COI disclosure policy", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002869240974&learningItemType=ORA_CLASS" },
    { id: 'R-024', title: "Slips, Trips, and Falls", course: "Slips, Trips, and Falls (OpenSesame via Oracle)", cat: 'safety', type: 'compliance', lane: 'w56', mins: 15, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', cadence: 'Annual', legal: 'Advisory', cite: "VU workplace safety", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002865668674&learningItemType=ORA_CLASS" },
    { id: 'R-025', title: "Portable Fire Extinguisher Safety", course: "Portable Fire Extinguisher Safety (OpenSesame via Oracle)", cat: 'safety', type: 'compliance', lane: 'w713', mins: 15, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 60', cadence: 'Annual', legal: 'Advisory', cite: "VU workplace safety", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300002865668490&learningItemType=ORA_CLASS" },
    { id: 'R-026', title: "Institutional Neutrality Essentials", course: "Institutional Neutrality Essentials (Internal)", cat: 'compliance', type: 'compliance', lane: 'w713', mins: 15, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 60', cadence: 'Annual', legal: 'Advisory', cite: "VU policy", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003042872864&learningItemType=ORA_CLASS" },

    /* ---- Location-driven ---- */
    { id: 'vupd', type: 'read',      title: 'VUPD, evacuation routes & campus safety', cat: 'safety', lane: 'w1', mins: 12, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 3', aud: { loc: ['tn'] }, href: 'https://police.vanderbilt.edu/' },
    { id: 'localpd', type: 'read',   title: 'Local site safety contacts & evacuation routes', cat: 'safety', lane: 'w1', mins: 10, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 3', aud: { loc: ['ny', 'fl', 'ca'] }, href: 'https://emergency.vanderbilt.edu/' },
    { id: 'park-tn', type: 'task',   title: 'Register for parking — VU Parking Services', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Verify on Day 1', aud: { loc: ['tn'] }, href: 'https://www.vanderbilt.edu/parking/' },
    { id: 'park-ny', type: 'task',   title: 'Partnered garage & commuter benefits — New York', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Verify on Day 1', aud: { loc: ['ny'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'park-fl', type: 'task',   title: 'On-site lot registration — Florida', cat: 'parking', lane: 'pre', mins: 8, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Verify on Day 1', aud: { loc: ['fl'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'park-ca', type: 'task',   title: 'Commuter benefits & transit pass — California', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Verify on Day 1', aud: { loc: ['ca'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'kaiser', type: 'read',    title: 'Kaiser plan options & state disability — California', cat: 'benefits', lane: 'w56', mins: 15, src: 'Oracle HCM', api: false, due: 'soft', dueLabel: 'Day 40', aud: { loc: ['ca'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'stateadd', type: 'read',  title: 'State employment law addenda for your site', cat: 'policies', lane: 'w56', mins: 15, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 40', aud: { loc: ['ny', 'fl', 'ca'] }, href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'traditions', type: 'read',title: 'Campus traditions — Anchor Down 101', cat: 'mission', lane: 'w56', mins: 10, src: 'SharePoint', api: false, due: null, aud: { loc: ['tn'] }, href: 'https://www.vanderbilt.edu/about/' },

    /* ---- Role-driven ---- */
    { id: 'mgr-safety', type: 'compliance',title: 'Manager safety obligations & incident reporting', cat: 'safety', lane: 'w24', mins: 25, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'mgr-comp', type: 'compliance',  title: 'Leading at VU — Compliance & Supervisory Fundamentals', cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002258801629' },
    { id: 'mgr-fmla', type: 'course',  title: 'Family and Medical Leave Act (FMLA) for Managers', cat: 'benefits', lane: 'w56', mins: 20, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', aud: { role: ['manager'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003110215584' },
    { id: 'mgr-ca', type: 'course',    title: 'Culture Amp manager kit — 1:1s & check-ins', cat: 'systems', lane: 'w713', mins: 25, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 60', aud: { role: ['manager'] }, href: 'https://www.cultureamp.com/' },
    { id: 'mgr-oracle', type: 'course',title: 'Oracle approvals: timecards, requisitions, expenses', cat: 'systems', lane: 'w56', mins: 20, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 45', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/oracle/' },
    { id: 'labsafety', type: 'compliance', title: 'Laboratory Safety', cat: 'safety', lane: 'w1', mins: 40, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001633958517' },
    { id: 'biosafety', type: 'compliance', title: 'Biosafety 101 — Standard Microbiological Practices (VU EHS)', cat: 'safety', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002424826840' },
    { id: 'irb', type: 'compliance',       title: 'IRB Basics Course', cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001523737433' },
    { id: 'export', type: 'compliance',    title: 'Global Export Compliance', cat: 'compliance', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 30', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002733138581' },
    { id: 'redcap',    title: 'REDCap & research data tools', cat: 'systems', lane: 'w24', mins: 25, src: 'IT Portal', api: false, due: 'soft', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://projectredcap.org/' },
    { id: 'minors', type: 'compliance',    title: 'Protection of Minors 101', cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 30', aud: { student: true }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001392072066' },
    { id: 'clery', type: 'compliance',     title: 'Clery Act 2025', cat: 'compliance', lane: 'w56', mins: 25, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 45', aud: { student: true }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002941776929' },
    { id: 'leadexp', type: 'read',   title: 'Leadership expectations at Vanderbilt', cat: 'mission', lane: 'w713', mins: 15, src: 'SharePoint', api: false, due: null, aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/' },

    /* ---- Department-driven ---- */
    { id: 'deptsop', type: 'read',   title: 'Your department’s SOPs & mission', cat: 'policies', lane: 'w1', mins: 25, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 10', href: '#dept' },
    { id: 'depttools', type: 'task', title: 'Department tools & systems checklist', cat: 'systems', lane: 'w24', mins: 20, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 21', href: '#dept', prereq: 'vunetid' },
    { id: 'deptcur', type: 'course',   title: 'Department learning track — first courses', cat: 'courses', lane: 'w713', mins: 90, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 60', href: '#dept' }
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
    { id: 'benefits',   label: 'Benefits, Parking & Workplace', cats: ['benefits', 'parking'] },
    { id: 'mission',    label: 'Mission, Values & Culture', cats: ['mission'] },
    { id: 'systems',    label: 'Systems & Access', cats: ['systems'] },
    { id: 'aienable',   label: 'AI Enablement', cats: ['ai'] },
    { id: 'roledept',   label: 'Your Role, Team & Department', cats: ['policies', 'courses', 'people'] }
  ],

  /* Activity types — VU brand accent palette; red is compliance-only */
  typeDefs: {
    compliance: { label: 'Compliance',  edge: '#B0413E' },
    course:     { label: 'Course',      edge: '#CFAE70' },
    task:       { label: 'Setup task',  edge: '#B3C9CD' },
    meet:       { label: 'Meeting',     edge: '#8BA18E' },
    survey:     { label: 'Survey',      edge: '#ECB748' },
    read:       { label: 'Read & watch', edge: '#946E24' }
  },

  /* people lane placement: manager & peer in week 1, wider circle in weeks 2-4 */
  peopleLanes: ['w1', 'w24', 'w1', 'w24'],

  lanes: [
    { id: 'pre', title: 'Verify & Validate', kicker: 'Covered in Voyage Classroom',
      note: 'You completed these during Vanderbilt Voyage (Classroom). Open each one to verify it carried over, then confirm it here.' },
    { id: 'w1',  title: 'Week 1', kicker: 'Land well' },
    { id: 'w24', title: 'Weeks 2–4', kicker: 'Build momentum' },
    { id: 'w56', title: 'Weeks 5–6', kicker: 'Through Day 45' },
    { id: 'w713', title: 'Days 46–90', kicker: 'Grow into the role' }
  ],

  /* Introductions are role-based recommendations — Oracle HCM cannot yet
     tell us reliably who a person's manager or colleagues are, so no names. */
  people: [
    { who: 'your manager', rec: true },
    { who: 'your skip-level leader' },
    { who: 'a peer on your team', rec: true },
    { who: 'a cross-functional partner' }
  ],

  announcements: [
    'Benefits open enrollment closes at the end of your first 30 days.',
    'Building Brave Teams workshop enrollment opens next month.'
  ],

  explore: [
    { title: 'Futures Learning Hub — leadership development', desc: 'Programs that grow leaders at every level.', src: 'FLH', href: 'https://www.vanderbilt.edu/pcb/' },
    { title: 'AI upskilling — start with AI Basics', desc: 'From first prompt to governed workflows.', src: 'Oracle Learn', href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003100146415' },
    { title: 'Building Brave Teams workshop', desc: 'Psychological safety, practiced live.', src: 'FLH', href: 'https://www.vanderbilt.edu/pcb/' },
    { title: 'Mentoring, tuition benefits & wellness', desc: 'Grow beyond the role you were hired for.', src: 'HR', href: 'https://hr.vanderbilt.edu/' }
  ],

  /* Staff organizations & engagement channels (verified public pages) */
  groups: [
    { name: 'University Staff Advisory Council (USAC)', who: 'All university staff',
      what: 'More than 90 elected members from across campus advising the Chancellor and administration on the policies, benefits, and practices that matter to staff.',
      value: 'Find your group number, meet your representative, or run for a seat.',
      href: 'https://www.vanderbilt.edu/usac/' },
    { name: 'Employee Learning & Engagement (ELE)', who: 'All VU employees · free',
      what: 'No-cost workshops and experiences: CliftonStrengths, the Way of Work series, small-group life design, and the Vanderbilt Leadership Academy.',
      value: 'A standing invitation to keep learning beyond your role.',
      href: 'https://news.vanderbilt.edu/tag/employee-learning-and-engagement/' },
    { name: 'Staff events & volunteering', who: 'All staff',
      what: 'The annual Employee Celebration, Commencement volunteering, and campus events all year round.',
      value: 'Show up, cheer, serve — belonging is built in person.',
      href: 'https://events.vanderbilt.edu/' }
  ],

  /* Beyond 90 Days — Grow My Career (courses selected per request; Oracle links only) */
  growth: {
    skillMatrix: 'https://me5231979.github.io/skill_matrix/',
    marketplace: [
      { name: 'Talent Marketplace — get started', mins: 30, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemId=300003063355987&learningItemType=ORA_CLASS', info: 'https://www.vanderbilt.edu/pcb/talent-marketplace/' }
    ],
    ai: [
      { name: 'Generative AI: Introduction to Large Language Models', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857349970' },
      { name: 'Advanced Prompt Engineering Techniques', mins: 45, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857179267' }
    ],
    staff: [
      { name: 'Communication Foundations', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857348820' },
      { name: 'Critical Thinking', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857213040' },
      { name: 'Time Management Fundamentals', mins: 90, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002856551070' },
      { name: 'Developing Your Emotional Intelligence', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857072604' },
      { name: 'Managing Up', mins: 45, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857443385' }
    ],
    manager: [
      { name: 'Coaching and Developing Employees', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857289611' },
      { name: 'Giving and Receiving Feedback', mins: 45, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857240584' },
      { name: 'Delegating Tasks', mins: 45, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857593011' },
      { name: 'Conflict Resolution Foundations', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857627948' },
      { name: 'Leading with Emotional Intelligence', mins: 60, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857333623' }
    ]
  },

  quickSystems: [
    { name: 'Oracle HCM', href: 'https://hr.vanderbilt.edu/oracle/' },
    { name: 'Oracle Learn', href: 'https://hr.vanderbilt.edu/onboarding/' },
    { name: 'Talent Marketplace', href: 'https://www.vanderbilt.edu/pcb/talent-marketplace/' },
    { name: 'Microsoft 365', href: 'https://www.office.com/' },
    { name: 'Culture Amp', href: 'https://www.cultureamp.com/' },
    { name: 'VU Email & Zoom', href: 'https://it.vanderbilt.edu/' }
  ],

  quickPeople: [
    { name: 'Your manager', sub: 'Ask PCB if unsure who this is' },
    { name: 'PCB Business Partner', sub: 'People, Culture & Belonging' },
    { name: 'IT Support — 615-343-9999', sub: 'Tech help' },
    { name: 'Benefits contact', sub: 'Total Rewards' },
    { name: 'EAP', sub: 'Confidential support' }
  ]
};
