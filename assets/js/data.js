/* =========================================================
   SITE DATA — edit this file to update content everywhere.
   Add a new project: copy one object in `projects`, give it
   a new id, drop its screenshots in assets/img/, done.
   ========================================================= */
window.SITE = {
  name: 'Furqan Ali',
  social: {
    github: 'https://github.com/Furqan54',
    linkedin: 'https://www.linkedin.com/in/furqan-ali-b97b38219/'
  },

  nav: [
    { key: 'home', label: 'Home', href: 'index.html' },
    { key: 'about', label: 'About', href: 'about.html' },
    { key: 'projects', label: 'Projects', href: 'projects.html' }
  ],

  /* Shields in the 3D tech ring */
  stack: [
    { code: 'HTML', name: 'HTML5' }, { code: 'CSS', name: 'CSS3' }, { code: 'JS', name: 'JavaScript' },
    { code: 'TW', name: 'Tailwind CSS' }, { code: 'Re', name: 'React' }, { code: 'No', name: 'Node.js' },
    { code: 'Ex', name: 'Express' }, { code: 'Mo', name: 'MongoDB' }, { code: 'Py', name: 'Python' },
    { code: 'Git', name: 'Git & GitHub' }, { code: 'Ve', name: 'Vercel' }, { code: '3D', name: 'Three.js' },
    { code: 'GS', name: 'GSAP' },
    { code: 'AI', name: 'AI Agents' }, { code: 'Bot', name: 'Chatbots' },
    { code: 'Rx', name: 'AI Desk' }, { code: 'CRM', name: 'Automation' }
  ],

  marquee: ['Full-Stack Development', 'MERN Stack', 'AI Agents', 'AI Receptionists', 'Chatbots', 'CRM Automation', '3D Web Experiences', 'Team Leadership', 'Responsive Design', 'Interactive UI'],

  /* tier: 3 = Forged (confident), 2 = Sharpening (building), 1 = Exploring (learning) */
  skills: [
    { group: 'Blades', blurb: 'Core languages', items: [
      { n: 'HTML', t: 3 }, { n: 'CSS', t: 3 }, { n: 'JavaScript', t: 2 }, { n: 'Python', t: 2 } ] },
    { group: 'Armour', blurb: 'Frameworks & tooling', items: [
      { n: 'Tailwind CSS', t: 2 }, { n: 'React', t: 2 }, { n: 'Node.js & Express', t: 1 },
      { n: 'MongoDB', t: 1 }, { n: 'MERN stack', t: 1 }, { n: 'Git & GitHub', t: 2 }, { n: 'Vercel deployment', t: 2 } ] },
    { group: 'Sorcery', blurb: 'AI & automation', items: [
      { n: 'AI receptionists', t: 1 }, { n: 'Chatbots', t: 1 }, { n: 'AI agents', t: 1 },
      { n: 'CRM integrations', t: 1 }, { n: 'Workflow automation', t: 1 }, { n: 'AI-assisted development', t: 2 } ] },
    { group: 'Illusion', blurb: 'Motion & 3D', items: [
      { n: 'Three.js', t: 2 }, { n: 'GSAP', t: 1 }, { n: 'Scroll & motion design', t: 2 }, { n: 'Responsive layouts', t: 3 } ] }
  ],

  /* Honest, dateless “chapters” of the journey */
  timeline: [
    { ch: 'Chapter I', title: 'The Foundations', where: 'Roots International School · STEPS College',
      text: 'O-Levels at Roots International School, then an Intermediate in Computer Science at STEPS College (2019–2021) — the start of the road into computing.' },
    { ch: 'Chapter II', title: 'Higher National Diploma, Computing', where: 'Pearson HND · The Millennium Universal College (TMUC)',
      text: 'First deep dive into programming, databases, system architecture and security, studied at TMUC in Islamabad.' },
    { ch: 'Chapter III', title: 'BSc (Hons) Computer Science', where: 'Top-up degree · Univ. of Hertfordshire (UK) at TMUC',
      text: 'Completed the degree and turned theory into practice across software, robotics and security projects.' },
    { ch: 'Chapter IV', title: 'Football Coach (weekends)', where: 'Zaraj Football Academy · Jun 2024 – Nov 2025',
      text: 'Weekend coaching alongside work and study — discipline, patience and leadership learned on the pitch.' },
    { ch: 'Chapter V', title: 'Copywriter, then Team Lead', where: 'YT-Champs · Jun 2024 – Nov 2025',
      text: 'Started as a copywriter (Jun–Aug 2024), then led the team from Sep 2024: copywriting, client outreach and cold emailing.' },
    { ch: 'Chapter VI', title: 'Team Lead — now', where: 'CyberX Studio · joined Jun 2026',
      text: 'Joined as an intern and grew into Team Lead: coordinating the team and building the company website hands-on.', now: true },
    { ch: 'Chapter VII', title: 'Full-Stack Developer — now', where: '818 AI Agency · UAE & Gulf',
      text: 'Building the agency’s website with a three.js 3D logo, WhatsApp and email contact — and growing into AI receptionists, agents and CRM automation.', now: true },
    { ch: 'Chapter VIII', title: 'The Road Ahead', where: 'Full-stack mastery · AI · Master’s degree',
      text: 'Deeper JavaScript, Python and backend skills, real client work, and a Master’s programme with scholarship support.' }
  ],

  experience: [
    { role: 'Team Lead', org: 'CyberX Studio', when: 'Jun 2026 – now', now: true,
      text: 'Joined as an intern and progressed to Team Lead. I lead the team while contributing hands-on to the company website: turning designs into responsive interfaces, coordinating with frontend, backend and UI/UX, and protecting existing functionality as things change.',
      tags: ['Leadership', 'Front-End', 'Coordination'] },
    { role: 'Full-Stack Developer', org: '818 AI Agency', when: 'Current', now: true,
      text: 'Building the website for an AI and technology agency serving the UAE and wider Gulf region: HTML, CSS and JavaScript with a three.js 3D logo, plus WhatsApp and email contact. Also learning to build AI receptionists, agents and CRM automations for its clients.',
      tags: ['three.js', 'Front-End', 'AI Automation'] },
    { role: 'Copywriter → Team Lead (part-time)', org: 'YT-Champs', when: 'Jun 2024 – Nov 2025',
      text: 'A YouTube-focused agency. Joined as a Copywriter (Jun–Aug 2024), then led the team from Sep 2024. Responsibilities covered copywriting, client outreach and cold emailing.',
      tags: ['Copywriting', 'Outreach', 'Team Leadership'] },
    { role: 'Football Coach (weekends)', org: 'Zaraj Football Academy', when: 'Jun 2024 – Nov 2025',
      text: 'Coached on weekends, working closely with players. Taught me consistency, communication and how a team improves through feedback.',
      tags: ['Teamwork', 'Discipline', 'Mentoring'] }
  ],

  interests: [
    { title: 'Football & Sport', icon: 'ball', text: 'Football, cricket, badminton, table tennis, volleyball, paddle tennis and pickleball — competitive, collaborative and always in motion.' },
    { title: 'Gaming', icon: 'pad', text: 'PlayStation 5 and gaming culture. I love how games build worlds with progression, rewards and atmosphere — and I steal that thinking for the web.' },
    { title: 'AI Agents & Receptionists', icon: 'bot', text: 'AI receptionists that take bookings, chatbots, AI agents and CRM workflows that remove repetitive work and improve customer experience — the services 818 AI Agency offers.' },
    { title: '3D Web & Motion', icon: 'cube', text: 'Researching Three.js, GSAP, Motion.dev and more — motion that tells a story without hurting performance.' },
    { title: 'Security & Networks', icon: 'shield', text: 'Hands-on study with Nmap, DIRB, Nessus, Telnet and Netcat — examining systems in authorised environments.' },
    { title: 'Robotics', icon: 'gear', text: 'An academic object-finding project using an RGB camera and a simulated legged robot in Webots.' }
  ],

  /* Locked sections ready for future content */
  vault: [
    { title: 'Case Studies', text: 'Deep dives into how real projects were planned, built and shipped.' },
    { title: 'Certifications', text: 'Courses and credentials will be displayed here.' },
    { title: 'Achievements', text: 'Milestones, awards and wins as the journey continues.' },
    { title: 'Testimonials', text: 'Words from teammates and clients, when the time comes.' }
  ],

  /* ---------------- PROJECTS ---------------- */
  projects: [
    {
      id: 'agency818', num: 11, featured: true, wide: true,
      title: '818 AI Agency Website',
      tagline: 'The company website for an AI and technology agency serving the UAE and Gulf — with a three.js 3D logo.',
      status: 'Current · client work',
      cats: ['business', 'landing'],
      tags: ['HTML', 'CSS', 'JavaScript', 'three.js', 'GitHub & Vercel'],
      gallery: ['agency818-2', 'agency818-4', 'agency818-1', 'agency818-3', 'agency818-5', 'agency818-7', 'agency818-8', 'agency818-9'],
      role: 'Full-stack developer',
      summary: 'One of my most important current projects: the website for 818 AI Agency, which builds AI receptionists, chatbots, CRM integrations and custom AI agents for businesses in the UAE and wider Gulf region. I build the visual experience, the interactive elements and the contact channels, and I offer my full-stack skills to the agency’s clients.',
      highlights: [
        'Animated 3D logo and motion-based storytelling built with three.js',
        'WhatsApp and email contact channels so prospects can reach the agency quickly',
        'Services presented clearly: AI receptionists, chatbots, CRM integrations and custom AI agents',
        'Responsive on desktop and mobile; deployed with GitHub and Vercel — including fixing an animation that worked locally but broke in production'
      ],
      note: 'A live, ongoing project — the screenshots are frames from a recording of the site, so the page you see here keeps evolving.'
    },
    {
      id: 'pakistan', num: 12, featured: true,
      title: 'Guide to Pakistan',
      tagline: 'A React travel platform with a trip planner and a travel-safety (TISS) interface.',
      status: 'Current · client work',
      cats: ['fullstack', 'business'],
      tags: ['React', 'Vercel', 'Responsive UI'],
      live: 'https://guide-to-pakistan.vercel.app',
      gallery: ['pakistan-1', 'pakistan-2', 'pakistan-3', 'pakistan-4', 'pakistan-5'],
      role: 'Front-end developer (React)',
      summary: 'A travel platform for visitors to Pakistan. I built the whole front end in React: destination and region pages, curated tours, a step-by-step trip planner that generates a day-by-day itinerary, and a booking flow — plus the interface for its Travel Intelligence Support System (TISS).',
      highlights: [
        'Destination and region pages (such as Gilgit-Baltistan) with featured places and quick facts',
        'Trip planner that turns a step-by-step form into a day-by-day itinerary, and a booking flow',
        'TISS screens: destination and route checks, four risk levels, active advisories and a weekly tourist support report',
        'Designed so a backend can supply data later; deployed on Vercel'
      ],
      note: 'The interface runs on built-in sample data. A teammate, Ibrahim, is building the TISS backend and AI services, and they are not connected yet. Shop, Experiences, Help and Legal pages are placeholders.'
    },
    {
      id: 'devduo', num: 10, featured: true,
      title: 'DevDuo — SaaS Agency Site',
      tagline: 'My latest and most complete build: a one-page agency website with a working contact form.',
      status: 'Latest build',
      cats: ['business', 'landing'],
      tags: ['HTML', 'CSS', 'JavaScript', 'Email form'],
      gallery: ['devduo-1', 'devduo-2', 'devduo-3'],
      role: 'Designer & front-end developer',
      summary: 'The website for “Developers Duo”, a web-development and SaaS agency I plan to run with my brother Faizan Ali. One page with eight parts — hero, about, services, team, projects, testimonials, contact and footer — in a clean teal theme.',
      highlights: [
        'Hero with a clear promise, calls-to-action and headline figures',
        'Six service cards, “Meet the DevDuo” team profiles and a project showcase',
        'Contact form that sends enquiries straight to email — no application backend',
        'Soft teal palette with generous spacing and consistent components'
      ],
      note: 'The layout and form are complete, but some text (team size, headline figures, testimonials) is still placeholder and will be replaced with real content before launch.'
    },
    {
      id: 'gamezone', num: 9,
      title: 'The Game Zone',
      tagline: 'A neon-purple gaming site built to practise scroll animation and parallax.',
      cats: ['landing'], tags: ['HTML', 'CSS', 'JavaScript'],
      gallery: ['gamezone-1', 'gamezone-2', 'gamezone-3', 'gamezone-4'], role: 'Front-end developer',
      summary: 'A long gaming-store-themed page with a hero, game rows, a head-to-head “Grande Match” section, testimonials and a footer. My step from flat pages towards pages that feel alive.',
      highlights: ['Scroll-triggered animation and parallax backgrounds', 'Transparent colour layers over artwork', 'Purple, yellow and near-black theme with a repeated diagonal-cut motif', 'Consistent theme across one long page'],
      note: 'Static: the store look is only a theme — no cart, checkout or backend. Testimonials and player names are placeholders.',
      credit: 'Practice build of an existing design — footer credit: “Designed By Almarex 2021”. Game art and platform names belong to their owners.'
    },
    {
      id: 'nike', num: 8,
      title: 'Jordan Landing Page',
      tagline: 'A dark, single-screen sneaker landing page with outlined type.',
      cats: ['landing'], tags: ['HTML', 'CSS', 'JavaScript'],
      gallery: ['nike-1'], role: 'Front-end developer',
      summary: 'Outlined red typography layered behind a product image — a static practice project on layering, contrast and typography.',
      highlights: ['Oversized outlined headline behind the product', 'Minimal navigation and slide indicators', 'High-contrast red and black styling'],
      credit: 'Practice page for learning only. Nike, Jordan, the swoosh and the shoe photograph belong to their owners; not affiliated with or endorsed by Nike.'
    },
    {
      id: 'rentacar', num: 7,
      title: 'Ridex — Car Rental',
      tagline: 'A static car-rental landing page with search, fleet cards and a blog slider.',
      cats: ['landing'], tags: ['HTML', 'CSS', 'JavaScript'],
      gallery: ['rentacar-1', 'rentacar-2'], role: 'Front-end developer',
      summary: 'A multi-section car-rental landing page: hero with a search bar, a grid of featured car cards, a four-step guide, a blog slider and a full footer. A practice build of an existing design.',
      highlights: ['Hero with lease search bar', 'Featured car cards and a four-step guide', 'Blog slider and structured footer'],
      note: 'Static UI only — the search form and “Rent now” buttons do nothing yet; car names, prices and comment counts are sample values.',
      credit: 'Practice build of an existing design — footer credit: codewithsadee (2022).'
    },
    {
      id: 'netflix', num: 5,
      title: 'Netflix Clone',
      tagline: 'A partial recreation of the Netflix home page.',
      status: '~60% complete',
      cats: ['clone'], tags: ['HTML', 'CSS', 'JavaScript'],
      gallery: ['netflix-1'], role: 'Front-end developer',
      summary: 'A featured banner and seven horizontal category rows — an early learning project used to practise page structure, layout and styling.',
      highlights: ['Hero banner with synopsis', 'Seven horizontal rows by category', 'Dark, cinematic styling'],
      credit: 'Practice recreation for learning only. Netflix, its logo and the artwork belong to their owners; not affiliated with or endorsed by Netflix.'
    },
    {
      id: 'amazon', num: 2,
      title: 'Amazon-style Storefront',
      tagline: 'E-commerce homepage clone with category grids.',
      status: 'In progress',
      cats: ['clone'], tags: ['HTML', 'CSS'],
      gallery: ['amazon-1'], role: 'Front-end developer',
      summary: 'A storefront homepage clone practising dense layouts: header with search, promotional banner and category cards.',
      highlights: ['Category card grid', 'Promo banner and header search', 'Practice in complex layouts']
    },
    {
      id: 'cola', num: 3,
      title: 'Coca-Cola Landing',
      tagline: 'Red-and-black product landing page.',
      status: 'In progress',
      cats: ['landing', 'clone'], tags: ['HTML', 'CSS'],
      gallery: ['cola-1'], role: 'Front-end developer',
      summary: 'A bold product landing page with a sweeping red hero shape, product line-up and social links.',
      highlights: ['Large curved hero shape', 'Product line-up imagery', 'Minimal, high-impact copy'],
      credit: 'Practice page for learning only; brand names and imagery belong to their owners.'
    },
    {
      id: 'animlogin', num: 6,
      title: 'Animated Sign-In / Sign-Up',
      tagline: 'A sliding gradient panel that swaps between Sign In and Create Account.',
      cats: ['ui'], tags: ['HTML', 'CSS', 'JavaScript'],
      gallery: ['animlogin-1', 'animlogin-2'], role: 'Front-end developer',
      summary: 'A UI-only login interface with a sliding gradient overlay, social login icons and styled form fields — practice in animation, forms and gradients.',
      highlights: ['Sliding overlay transition', 'Social login icons', 'Clean, centred card design'],
      note: 'UI only: nothing is sent anywhere. Connecting the forms to a real backend is part of my backend learning.',
      credit: 'Social network names and logos belong to their owners and are used only as icons.'
    },
    {
      id: 'login', num: 1,
      title: 'Glass Login Page',
      tagline: 'Frosted-glass login card over an alpine landscape.',
      cats: ['ui'], tags: ['HTML', 'CSS'],
      gallery: ['login-1'], role: 'Front-end developer',
      summary: 'One of my first projects — a login form using a blurred glass panel over a full-bleed mountain photograph.',
      highlights: ['Glassmorphism card', 'Remember-me and forgot-password options', 'Full-screen photographic background']
    },
    {
      id: 'demo', num: 4,
      title: 'First Portfolio Demo',
      tagline: 'Single-page portfolio — where this journey began.',
      status: 'Demo',
      cats: ['ui', 'landing'], tags: ['HTML', 'CSS', 'JavaScript'],
      gallery: ['demo-1'], role: 'Front-end developer',
      summary: 'My first single-page portfolio, with a typed-text intro and social links. This site is its far bigger successor.',
      highlights: ['Typing-effect introduction', 'Social icon links', 'Purple and cyan colour scheme']
    }
  ]
};

/* Convenience: cover = first gallery image */
window.SITE.projects.forEach(function (p) { p.cover = p.gallery[0]; });
