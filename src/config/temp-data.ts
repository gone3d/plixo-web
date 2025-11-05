// Temporary Configuration Data - Development Seed Data
// Phase 2 Priority 1: Data Structure Design - Temp Config Implementation

import type {
  Project,
  Experience,
  Skill,
  BackgroundImage,
  AppConfig,
  PortfolioOverview
} from '../types/portfolio'

/**
 * Portfolio Overview - High-level summary
 */
export const portfolioOverview: PortfolioOverview = {
  name: "Don Anderson",
  title: "Staff Engineer & Technical Leader",
  tagline: "Diginaut exploring all things digital",
  location: "Washington, DC Area",

  summary: "Dynamic software engineering leader with 15+ years of experience building interactive web applications, leading development teams, and delivering innovative technology solutions. Expert in translating complex technical requirements into user-friendly solutions across diverse industries, including finance, government, and emerging technologies.",

  yearsExperience: 15,

  metrics: {
    totalProjects: 12,
    featuredProjects: 6,
    yearsExperience: 15,
    technologiesUsed: 45,
    companiesWorked: 8,
    teamsManagedCount: 15,
    projectsLedCount: 25,
    performanceImprovements: "50% average load time reduction",
    userBaseGrowth: "300% user engagement increase",
    systemUptime: "99.9% uptime across managed systems",
    costSavings: "$2M+ in infrastructure optimization"
  },

  currentRole: "Director of Technology",
  currentCompany: "CIG Research",

  availability: {
    available: true,
    status: "selective",
    message: "Open to Staff/Principal Engineer roles with technical leadership focus",
    nextAvailableDate: "2025-01-01"
  },

  featuredProjects: ["plixo-portfolio-website", "capital-one-developer-portal", "bae-haarp-control", "state-dept-training", "cig-ai-platform"],
  coreSkills: ["react", "typescript", "node", "python", "aws", "architecture"],
  recentAchievements: [
    "Developing cutting-edge portfolio with 60fps animations and privacy-first analytics",
    "Led successful migration of legacy government training systems to modern web architecture",
    "Architected AWS-based microservices platform serving 100K+ users",
    "Implemented AI integrations using Ollama and Hugging Face LLMs"
  ],

  lastUpdated: "2025-09-29T12:00:00Z",
  version: "1.0.0"
}

/**
 * Featured Projects - Real project data based on resume
 */
export const projects: Project[] = [
  {
    id: "tenebrae-platform",
    title: "Tenebrae - Encrypted Contact & Analytics Platform",
    description: "Secure communication management platform with privacy-first visitor analytics and multi-user admin dashboard",
    longDescription: "Full-stack encrypted contact form system with sophisticated bot protection and real-time analytics. Built on Cloudflare Workers serverless architecture with React frontend, featuring end-to-end AES-256-GCM encryption, browser fingerprinting for privacy-compliant visitor tracking, and comprehensive admin dashboard with role-based access control. Demonstrates enterprise-grade security architecture combined with zero-infrastructure deployment patterns.",

    technologies: [
      { name: "React", category: "frontend", proficiency: 5, primary: true },
      { name: "TypeScript", category: "frontend", proficiency: 5, primary: true },
      { name: "Cloudflare Workers", category: "backend", proficiency: 5, primary: true },
      { name: "Cloudflare D1", category: "database", proficiency: 4, primary: true },
      { name: "Vite", category: "tools", proficiency: 4, primary: true },
      { name: "Tailwind CSS", category: "frontend", proficiency: 5, primary: false },
      { name: "ReCharts", category: "frontend", proficiency: 4, primary: false },
      { name: "Web Crypto API", category: "specialized", proficiency: 5, primary: true },
      { name: "Cloudflare Turnstile", category: "specialized", proficiency: 4, primary: false }
    ],

    category: "personal",
    status: "Live",

    metrics: {
      performance: "66 KB gzipped bundle, sub-3s builds",
      technical: "End-to-end AES-256-GCM encryption, zero-infrastructure deployment",
      impact: "Privacy-first analytics without third-party trackers",
      growth: "Multi-user RBAC with sophisticated bot protection"
    },

    urls: {
      live: "https://www.tenebrae.ai",
      github: "https://github.com/gone3d/tenebraeV2",
      demo: "https://tenebrae.plixo.com"
    },

    images: {
      thumbnail: "/assets/work/tenebrae_1.jpg",
      screenshots: [
        "/assets/work/tenebrae_1.jpg"
      ]
    },

    featured: true,
    priority: 0,
    dateCreated: "2024-08-01",
    lastUpdated: "2024-10-14",

    teamSize: 1,
    role: "Full-Stack Architect & Lead Developer",
    duration: "3 months",

    businessImpact: "Production-ready encrypted contact platform serving real clients with comprehensive analytics and zero-downtime serverless architecture. Demonstrates ability to architect secure systems with enterprise-grade encryption and privacy-compliant analytics.",

    technicalChallenges: [
      "Implementing end-to-end AES-256-GCM encryption for contact form submissions",
      "Building privacy-first analytics with browser fingerprinting (no cookies/trackers)",
      "Designing multi-layered bot protection (CAPTCHA + honeypot + rate limiting)",
      "Creating serverless architecture on Cloudflare Workers with D1 database",
      "Developing role-based admin dashboard with session tracking and geolocation"
    ],

    learningsAndGrowth: [
      "Mastered Cloudflare Workers serverless architecture and edge computing",
      "Deep expertise in Web Crypto API and encryption best practices",
      "Advanced bot protection strategies and CAPTCHA integration",
      "Privacy-compliant analytics design meeting GDPR requirements",
      "Zero-infrastructure deployment with git-based CI/CD"
    ]
  },
  {
    id: "hourlings-writers-platform",
    title: "Hourlings - Collaborative Writers Portal",
    description: "Modern writers group platform with inline commenting, submission cycles, and collaborative feedback system",
    longDescription: "Comprehensive writing community platform enabling creative writers to submit works, provide detailed feedback through inline and threaded comments, and manage organized submission cycles. Features sophisticated text selection system for inline commenting with position tracking, rich text editing with Quill, multi-theme support, and serverless Cloudflare Workers backend. Demonstrates full-stack expertise with innovative inline commenting architecture and production-ready collaborative features.",

    technologies: [
      { name: "React", category: "frontend", proficiency: 5, primary: true },
      { name: "TypeScript", category: "frontend", proficiency: 5, primary: true },
      { name: "Cloudflare Workers", category: "backend", proficiency: 5, primary: true },
      { name: "Cloudflare D1", category: "database", proficiency: 4, primary: true },
      { name: "Vite", category: "tools", proficiency: 4, primary: true },
      { name: "Tailwind CSS", category: "frontend", proficiency: 5, primary: false },
      { name: "Quill Editor", category: "frontend", proficiency: 4, primary: true },
      { name: "Hono", category: "backend", proficiency: 4, primary: true },
      { name: "React Markdown", category: "frontend", proficiency: 4, primary: false }
    ],

    category: "personal",
    status: "In Development",

    metrics: {
      performance: "90% complete, 172+ tasks across 17 milestones",
      technical: "Inline commenting with character-position tracking",
      impact: "Serverless architecture on Cloudflare edge network",
      growth: "Multi-theme system with 4 complete themes"
    },

    urls: {
      live: "https://hourlings.plixo.com",
      github: "https://github.com/gone3d/hourlings-ui",
      demo: "https://hourlings.plixo.com"
    },

    images: {
      thumbnail: "/assets/work/hourlings_1.jpg",
      screenshots: [
        "/assets/work/hourlings_1.jpg"
      ]
    },

    featured: true,
    priority: 1,
    dateCreated: "2024-09-01",
    lastUpdated: "2024-10-23",

    teamSize: 1,
    role: "Full-Stack Developer & Technical Architect",
    duration: "2 months (ongoing)",

    businessImpact: "Production-ready collaborative writing platform with innovative inline commenting system. Enables writing communities to provide detailed, contextual feedback on creative works with sophisticated text selection and positioning architecture.",

    technicalChallenges: [
      "Implementing sophisticated inline commenting with character-position tracking",
      "Building threaded comment system supporting 3 levels of nesting",
      "Creating rich text editor with word count and markdown support",
      "Designing serverless backend with repository pattern on Cloudflare Workers",
      "Developing multi-theme system with CSS variables and per-user preferences"
    ],

    learningsAndGrowth: [
      "Advanced text selection and position tracking for inline comments",
      "Quill editor integration with custom formatting and markdown",
      "Hono framework for lightweight Cloudflare Workers APIs",
      "Repository pattern implementation in serverless architecture",
      "Multi-theme CSS variable system with dynamic switching"
    ]
  },
  {
    id: "plixo-portfolio-website",
    title: "Plixo Portfolio Website",
    description: "Modern React portfolio showcasing technical leadership with real-time analytics, seamless animations, and encrypted API integration",
    longDescription: "Currently developing a cutting-edge portfolio website that positions technical leadership expertise through innovative web technologies. Built with React 19.1.1, TypeScript strict mode, and Tailwind CSS v4, featuring a seamless background slideshow system, atomic design components, and real-time visitor analytics. Architected with privacy-first analytics, encrypted API endpoints, and GDPR compliance. Demonstrates senior-level engineering patterns including custom animation controllers, mathematical timing coordination, and production-ready data schemas.",

    technologies: [
      { name: "React", category: "frontend", proficiency: 5, primary: true },
      { name: "TypeScript", category: "frontend", proficiency: 5, primary: true },
      { name: "Tailwind CSS", category: "frontend", proficiency: 5, primary: true },
      { name: "Vite", category: "tools", proficiency: 4, primary: true },
      { name: "Node.js", category: "backend", proficiency: 5, primary: false },
      { name: "PostgreSQL", category: "database", proficiency: 4, primary: false },
      { name: "AES-256 Encryption", category: "specialized", proficiency: 4, primary: false },
      { name: "GDPR Compliance", category: "specialized", proficiency: 4, primary: false }
    ],

    category: "personal",
    status: "In Development",

    metrics: {
      performance: "60fps animations with <700ms build times",
      technical: "TypeScript strict mode, zero compilation errors",
      impact: "Seamless slideshow with 9 astronomy backgrounds",
      growth: "Fisher-Yates shuffle for dynamic image sequencing"
    },

    urls: {
      live: "https://plixo.com",
      github: "https://github.com/gone3d/plixo-web",
      demo: "/work"
    },

    images: {
      thumbnail: "/assets/work/plixo_web_1.jpg",
      screenshots: [
        "/assets/work/plixo_web_1.jpg"
      ]
    },

    featured: true,
    priority: 2, // Third priority
    dateCreated: "2025-09-28",
    lastUpdated: "2025-09-29",

    teamSize: 1,
    role: "Full-Stack Developer & Technical Architect",
    duration: "3 weeks (ongoing)",

    businessImpact: "Showcasing technical leadership capabilities through modern web technologies, demonstrating both hands-on engineering skills and architectural decision-making for Staff/Principal Engineer positioning",

    technicalChallenges: [
      "Implementing seamless background slideshow system across multiple pages without reset",
      "Mathematical timing coordination between fade transitions and image panning animations",
      "TypeScript strict mode compliance across atomic design component architecture",
      "Privacy-first analytics design with GDPR compliance and anonymous visitor tracking",
      "Performance optimization maintaining 60fps animations with sub-700ms build times"
    ],

    learningsAndGrowth: [
      "Advanced React 19.1.1 patterns with TypeScript strict mode in production applications",
      "Custom animation controllers using requestAnimationFrame for precise timing coordination",
      "Privacy-compliant analytics architecture design with encryption and anonymization",
      "Modern build pipeline optimization with Vite and performance budget management",
      "Atomic design pattern implementation for scalable component architecture"
    ]
  },
  {
    id: "capital-one-developer-portal",
    title: "Capital One Developer Portal Transformation",
    description: "Led team transformation of internal Developer Portal from static GitHub pages to dynamic, on-demand document rendering application",
    longDescription: "Spearheaded the complete modernization of Capital One's internal developer documentation platform, migrating from static GitHub pages to a sophisticated, dynamic system. Architected AWS-based solution using S3, Lambda microservices, Angular, and Node.js backend. Integrated with OnePipeline team to implement CI/CD workflows using Jenkins and Capital One's internal deployment tools. Implemented organization-wide Unified Document Experience integrated directly with GitHub.",

    technologies: [
      { name: "Angular", category: "frontend", proficiency: 5, primary: true },
      { name: "Node.js", category: "backend", proficiency: 5, primary: true },
      { name: "AWS Lambda", category: "cloud", proficiency: 4, primary: true },
      { name: "S3", category: "cloud", proficiency: 4, primary: false },
      { name: "Jenkins", category: "devops", proficiency: 4, primary: false },
      { name: "Docker", category: "devops", proficiency: 4, primary: false },
      { name: "DataDog", category: "devops", proficiency: 3, primary: false },
      { name: "Python", category: "backend", proficiency: 4, primary: false }
    ],

    category: "fintech",
    status: "Live",

    metrics: {
      users: "10,000+ developers",
      performance: "75% faster document loading",
      impact: "90% reduction in documentation deployment time",
      technical: "Sub-200ms API response times"
    },

    urls: {
      github: "https://github.com/capitalone" // Corporate GitHub
    },

    images: {
      thumbnail: "/projects/capital-one-thumb.jpg",
      screenshots: [
        "/projects/capital-one-1.jpg",
        "/projects/capital-one-2.jpg"
      ]
    },

    featured: true,
    priority: 1,
    dateCreated: "2020-01-01",
    lastUpdated: "2023-12-31",

    teamSize: 8,
    role: "Lead Software Engineer & Technical Lead",
    duration: "3 years",

    businessImpact: "Transformed developer experience for 10,000+ internal developers, reducing documentation maintenance overhead by 90% and enabling real-time updates",

    technicalChallenges: [
      "Migrating legacy static site generation to dynamic microservices architecture",
      "Implementing real-time GitHub integration for documentation updates",
      "Designing scalable search functionality across thousands of documents",
      "Building CI/CD pipeline integration with enterprise security requirements"
    ],

    learningsAndGrowth: [
      "Advanced AWS Lambda optimization techniques for document processing",
      "Enterprise-scale CI/CD pipeline design and implementation",
      "Leading cross-functional teams in large corporate environment",
      "Balancing innovation with enterprise security and compliance requirements"
    ]
  },

  {
    id: "bae-haarp-control",
    title: "HAARP Antenna Control System",
    description: "Developed control software and UI for HAARP (High Frequency Active Auroral Research Program), managing 120 20kW phased array antennas",
    longDescription: "Contributed to the development of mission-critical control software for the High Frequency Active Auroral Research Program (HAARP), one of the world's most sophisticated ionospheric research facilities. Designed and implemented user interface and control logic for managing 120 high-power (20kW each) phased array antennas. System required real-time coordination of massive antenna arrays for atmospheric research experiments.",

    technologies: [
      { name: "C++", category: "backend", proficiency: 4, primary: true },
      { name: "Qt", category: "desktop", proficiency: 4, primary: true },
      { name: "Real-time Systems", category: "specialized", proficiency: 4, primary: true },
      { name: "Linux", category: "backend", proficiency: 4, primary: false },
      { name: "Scientific Computing", category: "specialized", proficiency: 4, primary: false },
      { name: "Hardware Integration", category: "specialized", proficiency: 3, primary: false }
    ],

    category: "government",
    status: "Live",

    metrics: {
      impact: "2.4 MW total power management",
      performance: "Real-time control of 120 antenna array",
      technical: "Microsecond-precision timing coordination"
    },

    urls: {
      // No public URLs for classified government work
    },

    images: {
      thumbnail: "/projects/haarp-thumb.jpg",
      screenshots: []
    },

    featured: true,
    priority: 2,
    dateCreated: "1998-01-01",
    lastUpdated: "2004-12-31",

    teamSize: 12,
    role: "Software/Systems Engineer",
    duration: "6 years (intermittent)",

    businessImpact: "Enabled critical atmospheric research supporting both civilian weather prediction and defense applications",

    technicalChallenges: [
      "Real-time coordination of 120 high-power transmitters with microsecond precision",
      "Fail-safe system design for equipment protection (each antenna worth $100K+)",
      "User interface design for complex scientific operations",
      "Integration with heterogeneous hardware systems and protocols"
    ],

    learningsAndGrowth: [
      "Real-time systems programming and hardware integration",
      "Mission-critical software development with zero-failure tolerance",
      "Working with PhD-level scientists and translating research requirements to software",
      "Understanding of atmospheric physics and ionospheric research applications"
    ]
  },

  {
    id: "state-dept-training",
    title: "U.S. State Department Training Platform Migration",
    description: "Spearheaded migration of legacy Adobe Flash-based learning applications to modern HTML/CSS/JavaScript web applications",
    longDescription: "Led the comprehensive modernization of the U.S. State Department's training infrastructure, migrating dozens of mission-critical Adobe Flash-based learning applications to modern web technologies. Created custom JavaScript frameworks that streamlined the development and migration process for the entire portfolio. Prototyped cutting-edge training solutions including WebGL, Unity3D, and Unreal Engine VR/AR simulators for diplomatic training scenarios.",

    technologies: [
      { name: "JavaScript", category: "frontend", proficiency: 5, primary: true },
      { name: "HTML5", category: "frontend", proficiency: 5, primary: true },
      { name: "CSS3", category: "frontend", proficiency: 5, primary: true },
      { name: "WebGL", category: "frontend", proficiency: 4, primary: true },
      { name: "Unity3D", category: "specialized", proficiency: 4, primary: false },
      { name: "Unreal Engine", category: "specialized", proficiency: 3, primary: false },
      { name: "VR/AR", category: "specialized", proficiency: 3, primary: false },
      { name: "Flash/ActionScript", category: "frontend", proficiency: 5, primary: false }
    ],

    category: "government",
    status: "Live",

    metrics: {
      users: "10,000+ government personnel",
      impact: "100% Flash elimination across training portfolio",
      performance: "60% faster load times vs Flash",
      technical: "Cross-platform compatibility achieved"
    },

    urls: {
      // No public URLs for classified government work
    },

    images: {
      thumbnail: "/projects/state-dept-thumb.jpg",
      screenshots: []
    },

    featured: true,
    priority: 3,
    dateCreated: "2015-01-01",
    lastUpdated: "2020-12-31",

    teamSize: 6,
    role: "Interactive Developer & Technical Lead",
    duration: "5 years",

    businessImpact: "Modernized training for thousands of diplomatic personnel, ensuring continued operation after Flash end-of-life while introducing immersive VR/AR training capabilities",

    technicalChallenges: [
      "Migrating complex interactive Flash content to web standards without losing functionality",
      "Creating custom JavaScript frameworks for rapid migration of dozens of applications",
      "Implementing WebGL-based simulations for diplomatic scenario training",
      "Prototyping VR/AR solutions for immersive language and cultural training",
      "Maintaining Top Secret security clearance requirements throughout development"
    ],

    learningsAndGrowth: [
      "Advanced WebGL programming and 3D graphics optimization",
      "VR/AR development with Unity3D and Unreal Engine",
      "Framework design for large-scale application migration projects",
      "Working within strict government security and compliance requirements",
      "Leading technical innovation within conservative government environments"
    ]
  },

  {
    id: "cig-ai-platform",
    title: "AI-Integrated Application Platform",
    description: "Architect and develop complete backend infrastructure with integrated AI using Ollama and Hugging Face LLMs to deploy custom AI models and services",
    longDescription: "Currently leading the design and implementation of a comprehensive AI-integrated application platform at CIG Research. Architecting complete backend infrastructure including structured, modular API systems with encrypted authentication across all applications and APIs. Implementing cutting-edge AI integrations using Ollama and Hugging Face LLMs to deploy custom AI models and services. Designing scalable database architecture and data services supporting real-time analytics and reporting.",

    technologies: [
      { name: "React", category: "frontend", proficiency: 5, primary: true },
      { name: "TypeScript", category: "frontend", proficiency: 5, primary: true },
      { name: "Node.js", category: "backend", proficiency: 5, primary: true },
      { name: "Python", category: "backend", proficiency: 4, primary: true },
      { name: "Ollama", category: "ai-ml", proficiency: 4, primary: true },
      { name: "Hugging Face", category: "ai-ml", proficiency: 4, primary: true },
      { name: "PostgreSQL", category: "database", proficiency: 4, primary: false },
      { name: "AWS", category: "cloud", proficiency: 4, primary: false },
      { name: "Docker", category: "devops", proficiency: 4, primary: false }
    ],

    category: "enterprise",
    status: "In Development",

    metrics: {
      users: "Enterprise clients",
      performance: "Real-time AI model inference",
      impact: "Custom LLM deployment pipeline",
      technical: "Multi-model AI orchestration"
    },

    urls: {
      // Private enterprise project
    },

    images: {
      thumbnail: "/projects/cig-ai-thumb.jpg",
      screenshots: []
    },

    featured: true,
    priority: 4,
    dateCreated: "2023-01-01",
    lastUpdated: "2025-09-29",

    teamSize: 5,
    role: "Director of Technology & Lead Architect",
    duration: "2+ years (ongoing)",

    businessImpact: "Establishing comprehensive AI capabilities for enterprise clients, enabling custom LLM deployment and integration across multiple business domains",

    technicalChallenges: [
      "Designing scalable AI model serving infrastructure",
      "Implementing secure, encrypted authentication across distributed AI services",
      "Optimizing LLM inference performance for real-time applications",
      "Creating modular API architecture supporting multiple AI model types",
      "Building comprehensive data governance and security policies"
    ],

    learningsAndGrowth: [
      "Advanced AI/ML model deployment and orchestration",
      "Enterprise-scale security architecture and encryption implementation",
      "Leading technical teams in emerging AI technology adoption",
      "Balancing innovation with enterprise compliance and security requirements",
      "Strategic technology leadership and business-technical alignment"
    ]
  },

  {
    id: "echo360-video-platform",
    title: "Echo360 Enterprise Video Platform",
    description: "Developed interactive online course video capture tools for enterprise blended learning platform with adaptive design principles",
    longDescription: "Contributed to the development of Echo360's enterprise-grade video learning platform, focusing on interactive course video capture tools and responsive web applications. Designed and implemented user interfaces using adaptive design principles and modular architecture to support diverse educational institutions and corporate training environments.",

    technologies: [
      { name: "JavaScript", category: "frontend", proficiency: 5, primary: true },
      { name: "jQuery", category: "frontend", proficiency: 5, primary: true },
      { name: "HTML5", category: "frontend", proficiency: 5, primary: true },
      { name: "CSS3", category: "frontend", proficiency: 5, primary: true },
      { name: "Flash/ActionScript", category: "frontend", proficiency: 5, primary: false },
      { name: "Video Streaming", category: "specialized", proficiency: 4, primary: true },
      { name: "Responsive Design", category: "frontend", proficiency: 5, primary: false }
    ],

    category: "enterprise",
    status: "Archived",

    metrics: {
      users: "Universities and enterprises globally",
      performance: "Adaptive video quality streaming",
      impact: "Cross-platform video capture solution"
    },

    urls: {
      live: "https://echo360.com"
    },

    images: {
      thumbnail: "/projects/echo360-thumb.jpg",
      screenshots: []
    },

    featured: false,
    priority: 5,
    dateCreated: "2013-01-01",
    lastUpdated: "2014-12-31",

    teamSize: 12,
    role: "Senior Front End Engineer",
    duration: "1 year",

    businessImpact: "Contributed to platform serving hundreds of educational institutions worldwide",

    technicalChallenges: [
      "Cross-browser video streaming compatibility",
      "Responsive design for diverse device types in educational settings",
      "Real-time video capture and processing interfaces",
      "Modular architecture supporting white-label deployments"
    ],

    learningsAndGrowth: [
      "Enterprise video streaming technology and optimization",
      "Educational technology user experience design",
      "Working in fast-paced startup environment",
      "Cross-platform web development best practices"
    ]
  },

  {
    id: "grab-media-video-players",
    title: "Grab Media Streaming Video Players",
    description: "Led development of streaming video players with integrated advertising, front-end UI interfacing with Ruby on Rails API",
    longDescription: "Led development team creating sophisticated streaming video players with integrated advertising capabilities. Designed front-end UI interfacing with Ruby on Rails API and Adobe Media Server CMS. Implemented object-oriented architecture using ActionScript 3, HTML, and JavaScript for enterprise video editing software solutions.",

    technologies: [
      { name: "ActionScript 3", category: "frontend", proficiency: 5, primary: true },
      { name: "Flash", category: "frontend", proficiency: 5, primary: true },
      { name: "JavaScript", category: "frontend", proficiency: 5, primary: true },
      { name: "HTML", category: "frontend", proficiency: 5, primary: false },
      { name: "Ruby on Rails", category: "backend", proficiency: 3, primary: false },
      { name: "Adobe Media Server", category: "specialized", proficiency: 4, primary: true },
      { name: "Video Streaming", category: "specialized", proficiency: 5, primary: true }
    ],

    category: "enterprise",
    status: "Archived",

    metrics: {
      users: "Media companies and advertisers",
      performance: "Real-time video ad insertion",
      impact: "Enterprise video editing workflow"
    },

    urls: {
      // Company no longer exists
    },

    images: {
      thumbnail: "/projects/grab-media-thumb.jpg",
      screenshots: []
    },

    featured: false,
    priority: 6,
    dateCreated: "2008-01-01",
    lastUpdated: "2014-12-31",

    teamSize: 8,
    role: "Lead Flash Architect & Development Team Lead",
    duration: "6 years",

    businessImpact: "Enabled monetization of video content through sophisticated advertising integration",

    technicalChallenges: [
      "Real-time video ad insertion and seamless playback",
      "Cross-platform video player compatibility",
      "Integration with complex enterprise video editing workflows",
      "Performance optimization for high-quality video streaming"
    ],

    learningsAndGrowth: [
      "Advanced ActionScript 3 and Flash video programming",
      "Team leadership and technical architecture decisions",
      "Enterprise video technology and advertising integration",
      "Working with media industry clients and requirements"
    ]
  }
]

/**
 * Professional Experience - Career timeline
 */
export const experiences: Experience[] = [
  {
    id: "cig-research-director",
    company: "CIG Research",
    role: "Director of Technology",
    startDate: "2023-01-01",
    // endDate: undefined, // Current position

    description: "Lead full-stack development team building React/TypeScript applications with integrated AI and advanced data visualization capabilities",

    achievements: [
      {
        description: "Architected complete backend infrastructure with structured, modular API systems",
        impact: "Encrypted authentication across all applications and APIs",
        technologies: ["Node.js", "PostgreSQL", "JWT", "AES-256"]
      },
      {
        description: "Implemented AI integrations using Ollama and Hugging Face LLMs",
        impact: "Deployed custom AI models and services for enterprise clients",
        technologies: ["Ollama", "Hugging Face", "Python", "Docker"]
      },
      {
        description: "Designed scalable database architecture and data services",
        impact: "Supporting real-time analytics and reporting",
        technologies: ["PostgreSQL", "Redis", "GraphQL"]
      },
      {
        description: "Established comprehensive software development guidelines",
        impact: "Rapid prototyping processes and GitHub integration workflows",
        technologies: ["GitHub Actions", "Docker", "Jest"]
      }
    ],

    technologies: [
      { name: "React", category: "frontend", proficiency: 5, primary: true },
      { name: "TypeScript", category: "frontend", proficiency: 5, primary: true },
      { name: "Node.js", category: "backend", proficiency: 5, primary: true },
      { name: "Python", category: "backend", proficiency: 4, primary: true },
      { name: "PostgreSQL", category: "database", proficiency: 4, primary: true },
      { name: "AWS", category: "cloud", proficiency: 4, primary: false },
      { name: "Ollama", category: "ai-ml", proficiency: 4, primary: true },
      { name: "Hugging Face", category: "ai-ml", proficiency: 4, primary: true }
    ],

    teamSize: 5,
    directReports: 3,

    keyProjects: ["cig-ai-platform"],

    industry: "technology",
    companySize: "small",
    workType: "full-time",
    category: "professional",

    location: "Remote",
    remote: true,

    impactMetrics: [
      "Led development of AI-integrated applications serving enterprise clients",
      "Established security and data governance policies across technology stack",
      "Managed hands-on development while overseeing team of 5 engineers"
    ]
  },

  {
    id: "capital-one-lead",
    company: "Capital One Bank",
    role: "Lead Software Engineer",
    startDate: "2020-01-01",
    endDate: "2023-12-31",

    description: "Led team transformation of internal Developer Portal from static GitHub pages to dynamic, on-demand document rendering application",

    achievements: [
      {
        description: "Architected AWS-based solution using S3, Lambda microservices, Angular and Node.js",
        impact: "75% faster document loading, 90% reduction in deployment time",
        technologies: ["AWS Lambda", "S3", "Angular", "Node.js"]
      },
      {
        description: "Collaborated with OnePipeline team to implement CI/CD workflows",
        impact: "Integrated Jenkins and Capital One internal deployment tools",
        technologies: ["Jenkins", "Docker", "CI/CD"]
      },
      {
        description: "Integrated Docker containerization and Datadog monitoring",
        impact: "Performance and system observability for 10,000+ developers",
        technologies: ["Docker", "DataDog", "Monitoring"]
      },
      {
        description: "Implemented organization-wide Unified Document Experience",
        impact: "Direct GitHub integration for real-time documentation updates",
        technologies: ["GitHub API", "Webhooks", "Python"]
      }
    ],

    technologies: [
      { name: "Angular", category: "frontend", proficiency: 5, primary: true },
      { name: "Node.js", category: "backend", proficiency: 5, primary: true },
      { name: "AWS Lambda", category: "cloud", proficiency: 4, primary: true },
      { name: "TypeScript", category: "frontend", proficiency: 5, primary: true },
      { name: "Python", category: "backend", proficiency: 4, primary: false },
      { name: "Docker", category: "devops", proficiency: 4, primary: false },
      { name: "Jenkins", category: "devops", proficiency: 4, primary: false }
    ],

    teamSize: 8,
    reportsTo: "Engineering Manager",

    keyProjects: ["capital-one-developer-portal"],

    industry: "fintech",
    companySize: "enterprise",
    workType: "full-time",
    category: "professional",

    location: "McLean, VA",
    remote: false,

    impactMetrics: [
      "Transformed developer experience for 10,000+ internal developers",
      "Achieved 75% improvement in documentation loading performance",
      "Reduced maintenance overhead by 90% through automation"
    ]
  },

  {
    id: "state-dept-interactive",
    company: "U.S. Department of State",
    role: "Interactive Developer",
    startDate: "2015-01-01",
    endDate: "2020-12-31",

    description: "Spearheaded migration of legacy Adobe Flash-based learning applications to modern HTML/CSS/JavaScript web applications with Top Secret Security Clearance",

    achievements: [
      {
        description: "Created custom JavaScript frameworks for streamlined migration",
        impact: "Accelerated development and migration of dozens of applications",
        technologies: ["JavaScript", "HTML5", "CSS3"]
      },
      {
        description: "Prototyped cutting-edge training solutions",
        impact: "WebGL, Unity3D, and Unreal Engine VR/AR simulators",
        technologies: ["WebGL", "Unity3D", "Unreal Engine", "VR/AR"]
      },
      {
        description: "Delivered mission-critical training applications",
        impact: "Serving thousands of government personnel",
        technologies: ["Cross-platform web technologies"]
      },
      {
        description: "Served as Drone Pilot for DS/Training Directorate",
        impact: "Supporting training documentation and simulation development",
        technologies: ["Drone operations", "Video production"]
      }
    ],

    technologies: [
      { name: "JavaScript", category: "frontend", proficiency: 5, primary: true },
      { name: "HTML5", category: "frontend", proficiency: 5, primary: true },
      { name: "CSS3", category: "frontend", proficiency: 5, primary: true },
      { name: "WebGL", category: "frontend", proficiency: 4, primary: true },
      { name: "Unity3D", category: "specialized", proficiency: 4, primary: false },
      { name: "Flash/ActionScript", category: "frontend", proficiency: 5, primary: false }
    ],

    clearanceLevel: "Top Secret",
    teamSize: 6,

    keyProjects: ["state-dept-training"],

    industry: "government",
    companySize: "enterprise",
    workType: "full-time",
    category: "professional",

    location: "Washington, DC",
    remote: false,

    impactMetrics: [
      "Modernized training platform for 10,000+ government personnel",
      "100% elimination of Flash dependency across training portfolio",
      "Introduced VR/AR capabilities for immersive diplomatic training"
    ]
  },

  {
    id: "gone3d-owner",
    company: "Gone3D Productions LLC",
    role: "Owner & Principal Consultant",
    startDate: "2004-01-01",
    // endDate: undefined, // Ongoing

    description: "Provide UX/UI architecture, development, and design consulting for diverse client portfolio spanning interactive websites, applications, 3D animation, video production, and multimedia design",

    achievements: [
      {
        description: "Delivered comprehensive solutions across interactive websites and applications",
        impact: "Long-term client relationships through consistent innovation",
        technologies: ["Full-stack web development", "3D animation", "Video production"]
      },
      {
        description: "Produced marketing materials for Ruby Nation and Devignition tech conferences",
        impact: "Supporting developer community events and technical education",
        technologies: ["Multimedia design", "Video production", "Web development"]
      },
      {
        description: "Maintained long-term client relationships across diverse industries",
        impact: "Consistent delivery of innovative technology solutions",
        technologies: ["Various based on client needs"]
      }
    ],

    technologies: [
      { name: "JavaScript", category: "frontend", proficiency: 5, primary: true },
      { name: "React", category: "frontend", proficiency: 5, primary: true },
      { name: "3D Animation", category: "specialized", proficiency: 4, primary: true },
      { name: "Video Production", category: "specialized", proficiency: 4, primary: true },
      { name: "UX/UI Design", category: "frontend", proficiency: 5, primary: true }
    ],

    teamSize: 1,

    keyProjects: [], // Various client projects

    industry: "consulting",
    companySize: "startup",
    workType: "freelance",
    category: "consulting",

    location: "Washington, DC Area",
    remote: true,

    impactMetrics: [
      "20+ years of successful client relationships",
      "Delivered projects across multiple industries and technologies",
      "Contributed to major tech conference marketing and community building"
    ]
  }
]

/**
 * Core Skills - Technical proficiency across the stack
 */
export const skills: Skill[] = [
  // Frontend Technologies
  {
    id: "react",
    name: "React",
    category: "frontend",
    proficiency: 5,
    learning: true, // Always learning new patterns
    recentlyUsed: true,
    projects: ["capital-one-developer-portal", "cig-ai-platform"],
    yearsExperience: 8,
    context: "Primary frontend framework expertise",
    lastUsed: "2025-09-29",
    relatedSkills: ["typescript", "javascript", "jsx"]
  },

  {
    id: "typescript",
    name: "TypeScript",
    category: "frontend",
    proficiency: 5,
    learning: true,
    recentlyUsed: true,
    projects: ["cig-ai-platform", "capital-one-developer-portal"],
    yearsExperience: 6,
    context: "Strict mode advocate for enterprise development",
    lastUsed: "2025-09-29",
    relatedSkills: ["react", "javascript", "node"]
  },

  {
    id: "javascript",
    name: "JavaScript",
    category: "frontend",
    proficiency: 5,
    learning: false, // Mastered
    recentlyUsed: true,
    projects: ["state-dept-training", "capital-one-developer-portal", "cig-ai-platform"],
    yearsExperience: 15,
    context: "Core competency across full stack",
    lastUsed: "2025-09-29",
    relatedSkills: ["react", "typescript", "node"]
  },

  // Backend Technologies
  {
    id: "node",
    name: "Node.js",
    category: "backend",
    proficiency: 5,
    learning: true,
    recentlyUsed: true,
    projects: ["capital-one-developer-portal", "cig-ai-platform"],
    yearsExperience: 8,
    context: "Primary backend runtime for API development",
    lastUsed: "2025-09-29",
    relatedSkills: ["javascript", "typescript", "express"]
  },

  {
    id: "python",
    name: "Python",
    category: "backend",
    proficiency: 4,
    learning: true,
    recentlyUsed: true,
    projects: ["cig-ai-platform", "capital-one-developer-portal"],
    yearsExperience: 10,
    context: "AI/ML integration and data processing",
    lastUsed: "2025-09-29",
    relatedSkills: ["ollama", "huggingface", "data-science"]
  },

  // Cloud & DevOps
  {
    id: "aws",
    name: "AWS",
    category: "cloud",
    proficiency: 4,
    learning: true,
    recentlyUsed: true,
    projects: ["capital-one-developer-portal", "cig-ai-platform"],
    yearsExperience: 6,
    context: "Lambda, S3, EC2, and microservices architecture",
    lastUsed: "2025-09-29",
    relatedSkills: ["lambda", "s3", "ec2", "docker"]
  },

  {
    id: "docker",
    name: "Docker",
    category: "devops",
    proficiency: 4,
    learning: true,
    recentlyUsed: true,
    projects: ["capital-one-developer-portal", "cig-ai-platform"],
    yearsExperience: 5,
    context: "Containerization and deployment",
    lastUsed: "2025-09-29",
    relatedSkills: ["aws", "kubernetes", "devops"]
  },

  // AI & Machine Learning
  {
    id: "ollama",
    name: "Ollama",
    category: "ai-ml",
    proficiency: 4,
    learning: true,
    recentlyUsed: true,
    projects: ["cig-ai-platform"],
    yearsExperience: 2,
    context: "Local LLM deployment and integration",
    lastUsed: "2025-09-29",
    relatedSkills: ["huggingface", "python", "ai-ml"]
  },

  {
    id: "huggingface",
    name: "Hugging Face",
    category: "ai-ml",
    proficiency: 4,
    learning: true,
    recentlyUsed: true,
    projects: ["cig-ai-platform"],
    yearsExperience: 2,
    context: "Transformer models and custom AI services",
    lastUsed: "2025-09-29",
    relatedSkills: ["ollama", "python", "transformers"]
  },

  // Specialized Technologies
  {
    id: "webgl",
    name: "WebGL",
    category: "specialized",
    proficiency: 4,
    learning: false,
    recentlyUsed: false,
    projects: ["state-dept-training"],
    yearsExperience: 8,
    context: "3D web graphics and interactive simulations",
    lastUsed: "2020-12-31",
    relatedSkills: ["threejs", "graphics", "3d"]
  },

  {
    id: "unity3d",
    name: "Unity3D",
    category: "specialized",
    proficiency: 4,
    learning: false,
    recentlyUsed: false,
    projects: ["state-dept-training"],
    yearsExperience: 5,
    context: "VR/AR training simulations",
    lastUsed: "2020-12-31",
    relatedSkills: ["csharp", "vr", "ar", "3d"]
  },

  // Architecture & Leadership
  {
    id: "architecture",
    name: "Software Architecture",
    category: "specialized",
    proficiency: 5,
    learning: true,
    recentlyUsed: true,
    projects: ["capital-one-developer-portal", "cig-ai-platform"],
    yearsExperience: 10,
    context: "Microservices, scalable systems, technical leadership",
    lastUsed: "2025-09-29",
    relatedSkills: ["microservices", "apis", "distributed-systems"]
  }
]

/**
 * Background Images - Slideshow configuration
 */
export const backgroundImages: BackgroundImage[] = [
  {
    filename: "backgrounds/astronomyBG01.jpg",
    title: "Nebula Field",
    description: "Deep space nebula with stellar formation",
    tags: ["space", "nebula", "astronomy", "deep-field"]
  },
  {
    filename: "backgrounds/astronomyBG02.jpg",
    title: "Galaxy Cluster",
    description: "Distant galaxy cluster with gravitational lensing",
    tags: ["space", "galaxy", "astronomy", "deep-field"]
  },
  {
    filename: "backgrounds/astronomyBG03.jpg",
    title: "Cosmic Web",
    description: "Large-scale structure of the universe",
    tags: ["space", "cosmic-web", "astronomy", "structure"]
  },
  {
    filename: "backgrounds/astronomyBG04.jpg",
    title: "Star Formation Region",
    description: "Active stellar nursery with young hot stars",
    tags: ["space", "star-formation", "astronomy", "stellar"]
  },
  {
    filename: "backgrounds/astronomyBG05.jpg",
    title: "Spiral Galaxy",
    description: "Barred spiral galaxy with prominent arms",
    tags: ["space", "spiral-galaxy", "astronomy", "galactic"]
  },
  {
    filename: "backgrounds/astronomyBG06.jpg",
    title: "Planetary Nebula",
    description: "Dying star's expelled outer layers",
    tags: ["space", "planetary-nebula", "astronomy", "stellar-death"]
  },
  {
    filename: "backgrounds/astronomyBG07.jpg",
    title: "Galaxy Collision",
    description: "Interacting galaxies in gravitational dance",
    tags: ["space", "galaxy-collision", "astronomy", "interaction"]
  },
  {
    filename: "backgrounds/astronomyBG08.jpg",
    title: "Globular Cluster",
    description: "Dense collection of ancient stars",
    tags: ["space", "globular-cluster", "astronomy", "stellar-cluster"]
  },
  {
    filename: "backgrounds/astronomyBG09.jpg",
    title: "Dark Nebula",
    description: "Dense cloud of dust blocking starlight",
    tags: ["space", "dark-nebula", "astronomy", "dust-cloud"]
  },
  {
    filename: "backgrounds/astronomyBG10.jpg",
    title: "Stellar Nursery",
    description: "Active region of new star formation",
    tags: ["space", "star-formation", "astronomy", "nebula"]
  },
  {
    filename: "backgrounds/astronomyBG11.jpg",
    title: "Deep Space View",
    description: "Expansive view of distant galaxies and cosmic structures",
    tags: ["space", "deep-field", "astronomy", "galaxies"]
  },
  {
    filename: "backgrounds/astronomyBG12.jpg",
    title: "Cosmic Phenomena",
    description: "Dramatic celestial events and formations",
    tags: ["space", "phenomena", "astronomy", "cosmic"]
  }
]

/**
 * Application Configuration
 */
export const appConfig: AppConfig = {
  theme: {
    defaultTheme: "dark",
    allowThemeToggle: true,
    animations: {
      enabled: true,
      respectReducedMotion: true,
      duration: "normal"
    }
  },

  features: {
    backgroundSlideshow: true,
    realTimeAnalytics: false, // Will enable in Phase 2 Priority 4
    githubIntegration: false, // Will enable in Phase 2 Priority 4
    contactForm: true,
    downloadResume: true,
    socialLinks: true,
    projectFiltering: false, // Future enhancement
    skillsVisualization: false, // Future enhancement
    threeDElements: false, // Phase 3
    performanceMetrics: false // Phase 2 Priority 4
  },

  api: {
    baseUrl: process.env.NODE_ENV === 'production'
      ? 'https://api.plixo.com'
      : 'http://localhost:3001',
    timeout: 10000,
    retryAttempts: 3,
    rateLimiting: {
      enabled: true,
      requestsPerMinute: 60
    },
    caching: {
      enabled: true,
      defaultTTL: 300 // 5 minutes
    }
  },

  analytics: {
    enabled: process.env.NODE_ENV === 'production',
    anonymizeIPs: true,
    trackPageViews: true,
    trackUserEvents: true,
    retentionDays: 30,
    gdprCompliant: true,
    cookieConsent: true
  },

  performance: {
    lazyLoading: true,
    imageSizes: {
      thumbnail: 400,
      medium: 800,
      large: 1200
    },
    cacheStrategy: "normal",
    preloadCriticalAssets: true
  },

  content: {
    contactEmail: "gone3d@gmail.com",
    socialLinks: [
      {
        platform: "LinkedIn",
        url: "https://linkedin.com/in/gone3d",
        username: "gone3d",
        display: true,
        icon: "linkedin"
      },
      {
        platform: "GitHub",
        url: "https://github.com/gone3d",
        username: "gone3d",
        display: true,
        icon: "github"
      }
    ],
    resumeUrl: "/assets/DonAnderson-Resume-2025.pdf",
    availabilityStatus: {
      available: true,
      status: "selective",
      message: "Open to Staff/Principal Engineer roles with technical leadership focus"
    },
    timezone: "America/New_York",
    preferredContactMethods: ["email", "linkedin"]
  }
}

/**
 * Export all temp configuration data
 */
export const tempConfig = {
  portfolioOverview,
  projects,
  experiences,
  skills,
  backgroundImages,
  appConfig
}

export default tempConfig