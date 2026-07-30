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

  /* Job architecture comes from SBJA (assets/js/sbja.js): 18 families, 95 sub-families */
  deptStats: { lead: 'Taylor Morgan', recentJoiners: 12 },

  /* Futures Learning Hub program portfolio (from FLH_Programs.xlsx).
     aud: 'all' | 'manager' (people leaders) | 'exec' | 'esl' */
  programs: [
    { name: 'CHART', aud: 'all', who: 'All staff',
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
    { name: 'Talent Marketplace', aud: 'all', who: 'All staff',
      what: 'Oracle Grow-based staff talent platform.',
      value: 'Connects staff to growth opportunities and surfaces internal talent for mobility.' },
    { name: 'VAULT', aud: 'exec', who: 'Executive stakeholders',
      what: 'Bi-monthly community of practice and enterprise governance council.',
      value: 'Guides talent and learning strategy at the executive level.' },
    { name: 'Summit', aud: 'all', who: 'All staff',
      what: 'Structured program for retaining, developing, and moving staff: Oracle, change management, a 5-business-day internal search process, and deliberate people practices. Transfer Portal is the employee front door.',
      value: 'Gives committed staff a visible path forward before a vacancy forces the conversation.' },
    { name: 'Navigators Session', aud: 'all', who: 'Facilitators & aspiring facilitators',
      what: "FLH's facilitator network and facilitation education program.",
      value: "Builds internal facilitation capability, extending FLH's reach." },
    { name: 'Compliance', aud: 'all', who: 'All staff',
      what: 'Ongoing and annual compliance education and delivery, with role-dependent content where needed.',
      value: 'Keeps the workforce current on required compliance and manages institutional risk.' },
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
    { id: 'faculty', name: 'Faculty / academic', kicker: 'Teaching & scholarship', p: 'Adds academic policy, FERPA depth, and faculty governance orientation.' },
    { id: 'clinical', name: 'Clinical / patient-facing', kicker: 'VUMC', p: 'Adds HIPAA depth, infection control, and credentialing links.' },
    { id: 'research', name: 'Research', kicker: 'Labs & studies', p: 'Adds IRB, IACUC, lab safety, and export control.' },
    { id: 'student', name: 'Student-facing', kicker: 'Student services', p: 'Adds FERPA and Title IX depth and Student Care Network orientation.' }
  ],

  /* lanes: pre | w1 | w24 · due: hard | soft | null · api: true = completion verified nightly */
  items: [
    /* ---- Universal ---- */
    { id: 'alertvu',   title: 'Sign up for AlertVU emergency notifications', cat: 'safety', lane: 'pre', mins: 5,  src: 'SharePoint', api: false, due: 'hard', dueLabel: 'Before Day 1', href: 'https://emergency.vanderbilt.edu/alertvu/' },
    { id: 'ferpa',     title: 'FERPA Tutorial', cat: 'compliance', lane: 'w1', mins: 15, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 10', href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001262145866' },
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

    /* ---- Compliance (from the Compliance Training Matrix — one entry per Master Matrix row) ---- */
    { id: 'R-001', title: "NY Sexual Harassment Prevention \u2014 Employees", course: "Harassment Prevention for New York State & New York City Employees \u2013 Office v2.0", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Legal', cite: "NY Lab Law \u00a7201-g", aud: { loc: ["ny"], role: ["ic", "faculty", "clinical", "research", "student"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002733136981" },
    { id: 'R-002', title: "NY Sexual Harassment Prevention \u2014 Supervisors", course: "Harassment Prevention for New York State & New York City Managers \u2013 Office v2.0", cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire/promo", cadence: "Annual", legal: 'Legal', cite: "NY Lab Law \u00a7201-g", aud: { loc: ["ny"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002733137061" },
    { id: 'R-003', title: "NY Retail Worker Safety Act \u2014 Employees", course: "Workplace Violence Prevention (New York - Non-Supervisor - Retail)", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual (50+) / Biennial (10\u201349)", legal: 'Legal', cite: "NY Lab Law \u00a727-e", aud: { loc: ["ny"], role: ["ic", "faculty", "clinical", "research", "student"] }, cond: "Applies only at NY retail sites with 10+ retail employees", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003105384706" },
    { id: 'R-004', title: "NY Retail Worker Safety Act \u2014 Supervisors", course: "Workplace Violence Prevention (New York - Non-Supervisor - Retail)", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire/promo", cadence: "Annual (50+) / Biennial (10\u201349)", legal: 'Legal', cite: "NY Lab Law \u00a727-e", aud: { loc: ["ny"], role: ["manager"] }, cond: "Applies only to supervisors of NY retail staff", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003105384706" },
    { id: 'R-005', title: "CA Sexual Harassment Prevention \u2014 Employees (SB 1343)", course: "Sexual Harassment Prevention Training for Employees in the State of California", cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 6 months of hire", cadence: "Every 2 years", legal: 'Legal', cite: "CA Gov Code \u00a712950.1 (SB 1343)", aud: { loc: ["ca"], role: ["ic", "faculty", "clinical", "research", "student"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653139" },
    { id: 'R-006', title: "CA Sexual Harassment Prevention \u2014 Supervisors (SB 1343)", course: "California Sexual Harassment Prevention Training (Supervisors)", cat: 'compliance', lane: 'w24', mins: 120, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 6 months of hire/promo", cadence: "Every 2 years", legal: 'Legal', cite: "CA Gov Code \u00a712950.1 (SB 1343)", aud: { loc: ["ca"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653184" },
    { id: 'R-007', title: "CA Workplace Violence Prevention \u2014 Employees (SB 553)", course: "California Workplace Violence Prevention (Employee)", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "On hire / on plan update", cadence: "Annual", legal: 'Legal', cite: "CA Lab Code \u00a76401.9 (SB 553)", aud: { loc: ["ca"], role: ["ic", "faculty", "clinical", "research", "student"] }, cond: "Must train on Vanderbilt's actual WVPP, not generic content", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653279" },
    { id: 'R-008', title: "CA Workplace Violence Prevention \u2014 Supervisors (SB 553)", course: "California Workplace Violence Prevention (Employer)", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "On hire / on plan update", cadence: "Annual", legal: 'Legal', cite: "CA Lab Code \u00a76401.9 (SB 553)", aud: { loc: ["ca"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003116653230" },
    { id: 'R-009', title: "FL Human Trafficking Awareness \u2014 Lodging Staff", course: "Human Trafficking Awareness", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 60 days of hire", cadence: "Annual", legal: 'Legal', cite: "FL Stat. \u00a7509.096", aud: { loc: ["fl"], role: ["ic", "faculty", "clinical", "research", "student"] }, cond: "Triggers only for FL lodging operations staff", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001864004385" },
    { id: 'R-010', title: "FL Human Trafficking Awareness \u2014 Supervisors", course: "Global Human Trafficking Awareness", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 60 days of hire/promo", cadence: "Annual", legal: 'Legal', cite: "FL Stat. \u00a7509.096", aud: { loc: ["fl"], role: ["manager"] }, cond: "Triggers only for FL lodging supervisors", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002076110784" },
    { id: 'R-011', title: "FL Harassment Prevention \u2014 Employees (Advisory)", course: "Addressing Harassment and Discrimination at Vanderbilt", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: "Within 60 days of hire", cadence: "Annual (policy)", legal: 'Advisory', cite: "Title VII baseline (no FL mandate)", aud: { loc: ["fl"], role: ["ic", "faculty", "clinical", "research", "student"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003032113079" },
    { id: 'R-012', title: "FL Harassment Prevention \u2014 Supervisors (Advisory)", course: "Avoiding Discrimination, Harassment, & Retaliation Risks for Managers", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: "Within 60 days of hire/promo", cadence: "Annual (policy)", legal: 'Advisory', cite: "Title VII; EEOC supervisor liability", aud: { loc: ["fl"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003038039435" },
    { id: 'R-013', title: "TN Harassment Prevention \u2014 Employees (Advisory)", course: "Addressing Harassment and Discrimination at Vanderbilt", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: "Within 60 days of hire", cadence: "Annual (policy)", legal: 'Advisory', cite: "THRA / Title VII baseline", aud: { loc: ["tn"], role: ["ic", "faculty", "clinical", "research", "student"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003032113079" },
    { id: 'R-014', title: "TN Harassment Prevention \u2014 Supervisors (Advisory)", course: "Avoiding Discrimination, Harassment, & Retaliation Risks for Managers", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: "Within 60 days of hire/promo", cadence: "Annual (policy)", legal: 'Advisory', cite: "THRA / Title VII", aud: { loc: ["tn"], role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003038039435" },
    { id: 'R-015', title: "Code of Conduct \u2014 Vanderbilt", course: "Code of Conduct Awareness", cat: 'compliance', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Advisory', cite: "Vanderbilt HR Policy", aud: { role: ["ic", "faculty", "clinical", "research", "student"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002733138981" },
    { id: 'R-016', title: "Code of Conduct \u2014 Vanderbilt (Managers)", course: "Code of Conduct Awareness", cat: 'compliance', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire/promo", cadence: "Annual", legal: 'Advisory', cite: "Vanderbilt HR Policy", aud: { role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002733138981" },
    { id: 'R-017', title: "Cybersecurity Awareness", course: "Enhanced Cybersecurity Training for VU employees", cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Advisory', cite: "VU IT Policy; cyber-insurance requirement", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001966018198" },
    { id: 'R-018', title: "HIPAA Privacy & Security (Workforce)", course: "HIPAA - Privacy Rule for Covered Entities", cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Legal', cite: "45 CFR \u00a7164.530(b) / \u00a7164.308(a)(5)", aud: { role: ["clinical", "research"] }, cond: "Triggered by PHI access (role/job code), not by state", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001863994802" },
    { id: 'R-019', title: "Title IX / Clery / VAWA", course: "Foundations of Title IX", cat: 'compliance', lane: 'w24', mins: 35, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: "Within 30 days of hire", cadence: "Annual", legal: 'Legal', cite: "20 USC \u00a71681 (Title IX); \u00a71092(f) (Clery)", href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002866731145" },
    { id: 'R-020', title: "Reasonable Accommodations & Disability Awareness (Mgr)", course: "Disability Readiness for Leaders and Managers", cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: "Within 60 days of hire/promo", cadence: "Every 2 years", legal: 'Advisory', cite: "ADA / state parallel statutes", aud: { role: ["manager"] }, href: "https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002857231652" },

    /* ---- Location-driven ---- */
    { id: 'vupd',      title: 'VUPD, evacuation routes & campus safety', cat: 'safety', lane: 'w1', mins: 12, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 3', aud: { loc: ['tn'] }, href: 'https://police.vanderbilt.edu/' },
    { id: 'localpd',   title: 'Local site safety contacts & evacuation routes', cat: 'safety', lane: 'w1', mins: 10, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 3', aud: { loc: ['ny', 'fl', 'ca'] }, href: 'https://emergency.vanderbilt.edu/' },
    { id: 'park-tn',   title: 'Register for parking — VU Parking Services', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['tn'] }, href: 'https://www.vanderbilt.edu/parking/' },
    { id: 'park-ny',   title: 'Partnered garage & commuter benefits — New York', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['ny'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'park-fl',   title: 'On-site lot registration — Florida', cat: 'parking', lane: 'pre', mins: 8, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['fl'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'park-ca',   title: 'Commuter benefits & transit pass — California', cat: 'parking', lane: 'pre', mins: 10, src: 'Parking Vendor', api: false, due: 'soft', dueLabel: 'Before Day 1', aud: { loc: ['ca'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'kaiser',    title: 'Kaiser plan options & state disability — California', cat: 'benefits', lane: 'w1', mins: 15, src: 'Oracle HCM', api: false, due: 'soft', dueLabel: 'Day 30', aud: { loc: ['ca'] }, href: 'https://hr.vanderbilt.edu/benefits/' },
    { id: 'stateadd',  title: 'State employment law addenda for your site', cat: 'policies', lane: 'w24', mins: 15, src: 'SharePoint', api: false, due: 'soft', dueLabel: 'Day 21', aud: { loc: ['ny', 'fl', 'ca'] }, href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'traditions',title: 'Campus traditions — Anchor Down 101', cat: 'mission', lane: 'w24', mins: 10, src: 'SharePoint', api: false, due: null, aud: { loc: ['tn'] }, href: 'https://www.vanderbilt.edu/about/' },

    /* ---- Role-driven ---- */
    { id: 'mgr-safety',title: 'Manager safety obligations & incident reporting', cat: 'safety', lane: 'w24', mins: 25, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/policies/' },
    { id: 'mgr-comp',  title: 'Leading at VU — Compliance & Supervisory Fundamentals', cat: 'compliance', lane: 'w24', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002258801629' },
    { id: 'mgr-fmla',  title: 'Family and Medical Leave Act (FMLA) for Managers', cat: 'benefits', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 30', aud: { role: ['manager'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003110215584' },
    { id: 'mgr-ca',    title: 'Culture Amp manager kit — 1:1s & check-ins', cat: 'systems', lane: 'w24', mins: 25, src: 'Culture Amp', api: true, due: 'soft', dueLabel: 'Day 21', aud: { role: ['manager'] }, href: 'https://www.cultureamp.com/' },
    { id: 'mgr-oracle',title: 'Oracle approvals: timecards, requisitions, expenses', cat: 'systems', lane: 'w24', mins: 20, src: 'Oracle HCM', api: true, due: 'soft', dueLabel: 'Day 14', aud: { role: ['manager'] }, href: 'https://hr.vanderbilt.edu/oracle/' },
    { id: 'infection', title: 'Bloodborne Pathogen Awareness 2.0', cat: 'safety', lane: 'w1', mins: 30, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', aud: { role: ['clinical'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001633833959' },
    { id: 'epic',      title: 'Epic access & clinical systems setup', cat: 'systems', lane: 'w1', mins: 45, src: 'IT Portal', api: false, due: 'hard', dueLabel: 'Day 5', aud: { role: ['clinical'] }, href: 'https://www.vumc.org/', prereq: 'vunetid' },
    { id: 'labsafety', title: 'Laboratory Safety', cat: 'safety', lane: 'w1', mins: 40, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 7', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001633958517' },
    { id: 'biosafety', title: 'Biosafety 101 — Standard Microbiological Practices (VU EHS)', cat: 'safety', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002424826840' },
    { id: 'irb',       title: 'IRB Basics Course', cat: 'compliance', lane: 'w24', mins: 45, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001523737433' },
    { id: 'export',    title: 'Global Export Compliance', cat: 'compliance', lane: 'w24', mins: 20, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 30', aud: { role: ['research'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002733138581' },
    { id: 'redcap',    title: 'REDCap & research data tools', cat: 'systems', lane: 'w24', mins: 25, src: 'IT Portal', api: false, due: 'soft', dueLabel: 'Day 21', aud: { role: ['research'] }, href: 'https://projectredcap.org/' },
    { id: 'minors',    title: 'Protection of Minors 101', cat: 'compliance', lane: 'w24', mins: 60, src: 'Oracle Learn', api: true, due: 'hard', dueLabel: 'Day 30', aud: { role: ['student'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001392072066' },
    { id: 'clery',     title: 'Clery Act 2025', cat: 'compliance', lane: 'w24', mins: 25, src: 'Oracle Learn', api: true, due: 'soft', dueLabel: 'Day 30', aud: { role: ['student'] }, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300002941776929' },
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
    { title: 'Annual HIPAA refresher', src: 'Oracle Learn', days: 21, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300001863994802' },
    { title: 'Harassment prevention recertification', src: 'Oracle Learn', days: 48, href: 'https://ecsr.fa.us2.oraclecloud.com/fscmUI/redwood/learner/learn/redirect?learningItemType=ORA_COURSE&learningItemId=300003032113079' },
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
