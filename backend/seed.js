const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Mock data
// Update skill icons
const SKILLS = [
  { id: "html", name: "HTML", category: "Web", mastery: 90, icon: "/images/skills/html.png" },
  { id: "sql", name: "SQL", category: "Database", mastery: 90, icon: "/images/skills/sql.png" },
  { id: "mongodb", name: "MongoDB", category: "Database", mastery: 90, icon: "/images/skills/mongodb.png" },
  { id: "xml", name: "XML", category: "Data", mastery: 90, icon: "/images/skills/xml.png" },
  { id: "css", name: "CSS", category: "Web", mastery: 85, icon: "/images/skills/css.png" },
  { id: "js", name: "JavaScript", category: "Web", mastery: 80, icon: "/images/skills/javascript.png" },
  { id: "git", name: "Git", category: "Tools", mastery: 80, icon: "/images/skills/git.png" },
  { id: "tailwind", name: "Tailwind CSS", category: "Web", mastery: 80, icon: "/images/skills/tailwind css.png" },
  { id: "java", name: "Java", category: "Backend", mastery: 75, icon: "/images/skills/java.png" },
  { id: "c", name: "C", category: "System", mastery: 75, icon: "/images/skills/c.png" },
  { id: "csharp", name: "C#", category: "Backend", mastery: 75, icon: "/images/skills/c-sharp.png" },
  { id: "kotlin", name: "Kotlin", category: "Mobile", mastery: 75, icon: "/images/skills/kotlin.png" },
  { id: "svelte", name: "Svelte", category: "Web", mastery: 70, icon: "/images/skills/svelte.png" },
  { id: "dotnet", name: ".NET 9", category: "Backend", mastery: 60, icon: "/images/skills/net9.png" },
  { id: "php", name: "PHP", category: "Backend", mastery: 60, icon: "/images/skills/php.png" },
  { id: "symfony", name: "Symfony", category: "Backend", mastery: 60, icon: "/images/skills/symfony.png" },
];

const SOFT_SKILLS = [
  { id: "ss1", name: "Communication", nameEn: "Communication" },
  { id: "ss2", name: "Travail en équipe", nameEn: "Teamwork" },
  { id: "ss3", name: "Rigueur", nameEn: "Rigor" },
  { id: "ss4", name: "Adaptabilité", nameEn: "Adaptability" },
  { id: "ss5", name: "Résolution de problèmes", nameEn: "Problem Solving" },
  { id: "ss6", name: "Autonomie", nameEn: "Autonomy" }
];

const IUT_COMPETENCES = [
  { id: "comp1", name: "Réaliser un développement d'application", name_en: "Develop Applications", description: "Concevoir, coder, tester et intégrer des solutions logicielles.", description_en: "Design, code, test, and integrate software solutions.", level: 85 },
  { id: "comp2", name: "Optimiser des applications", name_en: "Optimize Applications", description: "Proposer des applications informatiques performantes et optimisées.", description_en: "Propose high-performance and optimized software applications.", level: 75 },
  { id: "comp3", name: "Administrer des systèmes communicants", name_en: "Administer Systems", description: "Installer, configurer et maintenir des infrastructures informatiques.", description_en: "Install, configure, and maintain IT infrastructures.", level: 70 },
  { id: "comp4", name: "Gérer des données de l'information", name_en: "Manage Information Data", description: "Concevoir et administrer des bases de données complexes.", description_en: "Design and administer complex databases.", level: 80 },
  { id: "comp5", name: "Conduire un projet", name_en: "Project Management", description: "Organiser et piloter un projet informatique avec des méthodes agiles.", description_en: "Organize and lead an IT project using agile methods.", level: 90 },
  { id: "comp6", name: "Collaborer au sein d'une équipe", name_en: "Team Collaboration", description: "Travailler efficacement dans une équipe informatique.", description_en: "Work effectively within an IT team.", level: 85 }
];

const PROJECTS = [
  {
    id: "appliparam",
    title: "AppliParam (Desautel)",
    titleEn: "AppliParam (Desautel)",
    description: "Refonte d'un logiciel WPF/.NET de paramétrage de centrales incendie avec cryptographie.",
    descriptionEn: "Refactoring of a WPF/.NET software for configuring fire alarm systems with cryptography.",
    longDescription: "Lors de mon stage de 12 semaines au sein de l’équipe R&D de Desautel, j’ai été chargé de la refonte complète de l’interface Niveau 4 du logiciel AppliParam, utilisé pour la configuration avancée des centrales incendie INISE16.\n\nL’ancienne interface souffrait d’un manque d’ergonomie et d’une absence de validation. J’ai conçu une nouvelle IHM en WPF/XAML synchronisée en temps réel (pattern Observer). J’ai également développé un système de cryptage dynamique à clé multiple pour sécuriser les fichiers XML et enrichi la génération de rapports PDF techniques.",
    longDescriptionEn: "During my 12-week internship within Desautel's R&D team, I was responsible for the complete redesign of the Level 4 interface of the AppliParam software, used for advanced configuration of INISE16 fire alarm systems.\n\nThe old interface suffered from poor ergonomics and lack of validation. I designed a new GUI in WPF/XAML synchronized in real time (Observer pattern). I also developed a dynamic multi-key encryption system to secure XML files and enhanced the generation of technical PDF reports.",
    techStack: ["C#", ".NET 9", "WPF", "Design Patterns", "Git", "Cryptographie", "XML"],
    skillsIds: ["csharp", "dotnet", "xml", "git"],
    competencesIds: ["comp1", "comp2", "comp4"],
    imageUrl: "/images/projects/AppliParam/1.jpg",
    images: ["/images/projects/AppliParam/1.jpg", "/images/projects/AppliParam/2.jpg", "/images/projects/AppliParam/3.jpg"],
    category: "SOFTWARE",
    status: "ARCHIVED",
    startDate: "2025-04"
  },
  {
    id: "smartdesk",
    title: "SmartDesk",
    titleEn: "SmartDesk",
    description: "Application web de productivité (Svelte/Node.js) avec widgets personnalisables.",
    descriptionEn: "Productivity web application (Svelte/Node.js) with customizable widgets.",
    longDescription: "SmartDesk est une application web collaborative de gestion d’agenda et de productivité développée en équipe. Elle regroupe calendrier, tâches, notes et widgets (musique, etc.) dans une interface responsive.\n\nMa contribution a porté sur le design global et le développement complet du système de widgets interactifs. Nous avons utilisé Svelte, Node.js et MySQL, avec un déploiement sur VPS et une gestion de projet agile sur GitHub.",
    longDescriptionEn: "SmartDesk is a collaborative web application for agenda and productivity management developed in a team. It combines calendar, tasks, notes, and widgets (music, etc.) in a responsive interface.\n\nMy contribution focused on the overall design and complete development of the interactive widget system. We used Svelte, Node.js, and MySQL, with deployment on VPS and agile project management on GitHub.",
    techStack: ["Svelte", "Node.js", "TailwindCSS", "MySQL", "VPS"],
    skillsIds: ["svelte", "tailwind", "sql", "js"],
    competencesIds: ["comp1", "comp2", "comp5"],
    imageUrl: "/images/projects/SmartDesk/1.png",
    images: ["/images/projects/SmartDesk/1.png", "/images/projects/SmartDesk/2.png"],
    category: "WEB",
    status: "ARCHIVED",
    startDate: "2024-05"
  },
  {
    id: "paniervip",
    title: "PanierVIP",
    titleEn: "PanierVIP",
    description: "Gestion collaborative de listes de courses en temps réel avec PHP/Symfony.",
    descriptionEn: "Real-time collaborative shopping list management with PHP/Symfony.",
    longDescription: "PanierVIP permet à plusieurs utilisateurs de partager des listes de courses avec suivi des achats et statistiques. Développé sous Symfony avec Twig et MySQL.\n\nJ'ai réalisé l'authentification et la gestion des rôles (SecurityBundle), ainsi que les fonctionnalités CRUD pour les produits et utilisateurs. Le projet a permis de maîtriser les migrations et la validation des formulaires dans un environnement collaboratif.",
    longDescriptionEn: "PanierVIP allows multiple users to share shopping lists with purchase tracking and statistics. Developed with Symfony, Twig, and MySQL.\n\nI implemented authentication and role management (SecurityBundle), as well as CRUD functionalities for products and users. The project allowed me to master migrations and form validation in a collaborative environment.",
    techStack: ["PHP", "Symfony", "Twig", "MySQL", "CSS", "Git"],
    skillsIds: ["php", "symfony", "sql", "css"],
    competencesIds: ["comp1", "comp4", "comp6"],
    imageUrl: "/images/projects/PanierVIP/1.png",
    images: ["/images/projects/PanierVIP/1.png", "/images/projects/PanierVIP/2.png", "/images/projects/PanierVIP/3.png"],
    category: "WEB",
    status: "DEPLOYED",
    startDate: "2024-01"
  },
  {
    id: "lootboxhunter",
    title: "LootBoxHunter",
    titleEn: "LootBoxHunter",
    description: "Simulateur mobile d'ouverture de caisses (Kotlin/Firebase) avec API REST.",
    descriptionEn: "Mobile simulator for opening cosmetic boxes (Kotlin/Firebase) with REST API.",
    longDescription: "Application Android native permettant de simuler l'ouverture de caisses de cosmétiques. Utilisation d'une API REST pour les données et de Firebase pour l'authentification et le stockage cloud.\n\nDesign complet de l'IHM sous Android Studio et gestion asynchrone des flux de données. Le système gère l'inventaire des utilisateurs et la synchronisation en temps réel.",
    longDescriptionEn: "Native Android application to simulate opening cosmetic boxes. Uses a REST API for data and Firebase for authentication and cloud storage.\n\nComplete UI design in Android Studio and asynchronous data flow management. The system manages user inventory and real-time synchronization.",
    techStack: ["Kotlin", "Android Studio", "Firebase", "API REST"],
    skillsIds: ["kotlin"],
    competencesIds: ["comp1", "comp4", "comp3"],
    imageUrl: "/images/projects/LootBoxHunter/1.png",
    images: ["/images/projects/LootBoxHunter/1.png", "/images/projects/LootBoxHunter/2.png", "/images/projects/LootBoxHunter/3.png", "/images/projects/LootBoxHunter/4.png"],
    category: "MOBILE",
    status: "DEPLOYED",
    startDate: "2023-11"
  },
  {
    id: "dimensionalmatrix",
    title: "DimensionalMatrix",
    titleEn: "DimensionalMatrix",
    description: "Jeu labyrinthe Python sur Raspberry Pi avec capteurs SenseHat.",
    descriptionEn: "Python maze game on Raspberry Pi with SenseHat sensors.",
    longDescription: "Développement d'un jeu interactif utilisant la matrice LED et le gyroscope du SenseHat. Le joueur doit s'échapper d'un labyrinthe en inclinant le boîtier.\n\nProjet réalisé en équipe dans un contexte international (ateliers en anglais), mettant l'accent sur l'optimisation pour hardware embarqué et la gestion des entrées/sorties temps réel.",
    longDescriptionEn: "Development of an interactive game using the SenseHat's LED matrix and gyroscope. The player must escape a maze by tilting the case.\n\nProject carried out in a team in an international context (workshops in English), focusing on optimization for embedded hardware and real-time input/output management.",
    techStack: ["Python", "Raspberry Pi", "SenseHat", "Gyroscope"],
    skillsIds: ["python"],
    competencesIds: ["comp1", "comp2", "comp3"],
    imageUrl: "/images/projects/DimensionalMatrix/1.png",
    images: ["/images/projects/DimensionalMatrix/1.png"],
    category: "SYSTEM",
    status: "ARCHIVED",
    startDate: "2023-03"
  },
  {
    id: "sae-java",
    title: "SAE JAVA - Coloration",
    titleEn: "SAE JAVA - Coloring",
    description: "Visualisation de graphes et évitement de collision d'avions (Java Swing).",
    descriptionEn: "Graph visualization and aircraft collision avoidance (Java Swing).",
    longDescription: "Modélisation de l'espace aérien et simulation d'évitement de collisions à l'aide d'algorithmes de coloration de graphes. Développement d'une interface graphique interactive permettant de manipuler les trajectoires.\n\nJ’ai conçu toute la partie IHM interactive (Java Swing) et l’intégration des fonctionnalités d'import/export de données complexes (CSV/JSON).",
    longDescriptionEn: "Modeling of airspace and collision avoidance simulation using graph coloring algorithms. Development of an interactive graphical interface to manipulate trajectories.\n\nI designed the entire interactive GUI part (Java Swing) and the integration of complex data import/export functionalities (CSV/JSON).",
    techStack: ["Java Swing", "Algorithmes de Graphes", "JUnit"],
    skillsIds: ["java"],
    competencesIds: ["comp1", "comp2", "comp5"],
    imageUrl: "/images/projects/SAE_JAVA/4.png",
    images: ["/images/projects/SAE_JAVA/4.png", "/images/projects/SAE_JAVA/1.png", "/images/projects/SAE_JAVA/2.png", "/images/projects/SAE_JAVA/3.png"],
    category: "DESKTOP",
    status: "ARCHIVED",
    startDate: "2023-01"
  },
];

const FORMATIONS = [
  {
    id: "bac-pro-cuisine",
    title: "Bac Professionnel Cuisine",
    titleEn: "Professional Baccalaureate in Cooking",
    institution: "Lycée Hôtelier | Challes-les-Eaux",
    institutionEn: "Hotel School | Challes-les-Eaux",
    period: "2018 - 2021",
    period_en: "2018 - 2021",
    periodEn: "2018 - 2021",
    description: "Baccalauréat Profesionnel Cuisine, mention Très Bien.",
    descriptionEn: "Professional Baccalaureate in Cooking, with honors.",
    longDescription: "Titulaire d’un Bac Professionnel Cuisine avec mention Très Bien, j’ai appris à travailler en équipe, à faire preuve de rigueur et à m’adapter à des situations imprévues. Cette expérience intense m’a permis de développer une excellente gestion du stress, une organisation solide et un esprit de collaboration. Ces compétences sont pleinement transférables dans le domaine de l’informatique.",
    longDescriptionEn: "Holding a Professional Baccalaureate in Cooking with honors, I learned to work in a team, to be rigorous, and to adapt to unexpected situations. This intense experience allowed me to develop excellent stress management, solid organization, and a collaborative spirit. These skills are fully transferable to the field of IT.",
    hardSkills: ["Gestion de brigade", "HACCP", "Organisation", "Rigueur"],
    hardSkillsEn: ["Brigade Management", "HACCP", "Organization", "Rigor"],
    softSkills: ["Discipline", "Travail en équipe", "Gestion du stress"],
    softSkillsEn: ["Discipline", "Teamwork", "Stress Management"],
    imageUrl: "/images/experiences/Cuisine.png",
    type: "EDUCATION",
    competencesIds: ["comp6"],
    startDate: "2018-09"
  },
  {
    id: "bac-sti2d",
    title: "Bac STI2D option EE",
    titleEn: "STI2D Baccalaureate option EE",
    institution: "Lycée Saint Ambroise | Chambéry",
    institutionEn: "Saint Ambroise High School | Chambéry",
    period: "2021 - 2022",
    period_en: "2021 - 2022",
    periodEn: "2021 - 2022",
    description: "Baccalauréat Technologique Sciences et Technologies de l'Industrie et du Développement Durable, mention Très Bien.",
    descriptionEn: "Technological Baccalaureate in Sciences and Technologies of Industry and Sustainable Development, with honors.",
    longDescription: "Réorientation vers les technologies et l'informatique. Découverte de l'ingénierie, de la mécanique et de la programmation. J'ai choisi de travailler sur la programmation autonome lors des projets, ce qui a confirmé mon intérêt pour le développement logiciel.",
    longDescriptionEn: "Reorientation towards technologies and IT. Discovery of engineering, mechanics, and programming. I chose to work on autonomous programming during projects, which confirmed my interest in software development.",
    hardSkills: ["Programmation", "Ingénierie", "Physique appliquée"],
    hardSkillsEn: ["Programming", "Engineering", "Applied Physics"],
    softSkills: ["Curiosité", "Capacité d'adaptation"],
    softSkillsEn: ["Curiosity", "Adaptability"],
    imageUrl: "/images/skills/net9.png",
    type: "education",
    competencesIds: [],
    startDate: "2021-09"
  },
  {
    id: "but-info",
    title: "BUT Informatique",
    titleEn: "BUT Computer Science",
    institution: "IUT Lyon 1 | Villeurbanne",
    institutionEn: "IUT Lyon 1 | Villeurbanne",
    period: "2022 - 2025",
    period_en: "2022 - 2025",
    periodEn: "2022 - 2025",
    description: "Bachelor Universitaire de Technologie en Informatique, spécialité Développement d’applications.",
    descriptionEn: "University Bachelor of Technology in Computer Science, specializing in Application Development.",
    longDescription: "Aujourd’hui en troisième année de BUT Informatique à Lyon 1. Approfondissement de la conception logicielle, des bases de données et du travail collaboratif. Spécialité développement d'applications.\n\nJ'y ai appris la résolution de problèmes, le prototypage et les tests rigoureux.",
    longDescriptionEn: "Currently in the third year of BUT Computer Science at Lyon 1. Deepening of software design, databases, and collaborative work. Specializing in application development.\n\nI learned problem solving, prototyping, and rigorous testing there.",
    hardSkills: ["Développement logiciel", "Bases de données", "Algorithmique", "Architecture logicielle"],
    hardSkillsEn: ["Software Development", "Databases", "Algorithms", "Software Architecture"],
    softSkills: ["Résolution de problèmes", "Autonomie", "Esprit critique"],
    softSkillsEn: ["Problem Solving", "Autonomy", "Critical Thinking"],
    imageUrl: "/images/ID_mono.png",
    type: "education",
    competencesIds: ["comp1", "comp2", "comp3", "comp4", "comp5", "comp6"],
    startDate: "2022-09"
  }
];

const PROFESSIONAL_EXPERIENCES = [
  {
    id: "alternance-desautel",
    title: "Apprenti Développeur",
    titleEn: "Apprentice Developer",
    company: "Desautel",
    companyEn: "Desautel",
    period: "Septembre 2025 - Présent",
    period_en: "September 2025 - Present",
    periodEn: "September 2025 - Present",
    period_en: "September 2025 - Present",
    description: "Alternance en 3ème année de BUT : évolution et maintenance des applications + développement d'un superviseur incendie",
    descriptionEn: "Work-study program in 3rd year of BUT: evolution and maintenance of applications + development of a fire supervisor",
    longDescription: "Poursuite du travail initié en stage en tant qu'alternant. Responsable des évolutions logicielles sur les outils de paramétrage et de supervision des centrales incendie.",
    longDescriptionEn: "Continuation of the work initiated during the internship as a work-study student. Responsible for software evolutions on parameterization and supervision tools for fire alarm systems.",
    missions: [
      "Développement de nouvelles fonctionnalités métier en C#/.NET",
      "Optimisation de la robustesse des échanges de données XML",
      "Maintenance corrective et évolutive des interfaces WPF",
      "Recherche et développement d'un superviseur incendie"
    ],
    missionsEn: [
      "Development of new business functionalities in C#/.NET",
      "Optimization of XML data exchange robustness",
      "Corrective and evolutionary maintenance of WPF interfaces",
      "Research and development of a fire supervisor"
    ],
    hardSkills: ["C#", ".NET", "WPF", "Git", "SQL"],
    hardSkillsEn: ["C#", ".NET", "WPF", "Git", "SQL"],
    softSkills: ["Professionnalisme", "Autonomie", "Rigueur"],
    softSkillsEn: ["Professionalism", "Autonomy", "Rigor"],
    imageUrl: "/images/experiences/Desautel.jpg",
    type: "APPRENTICESHIP",
    competencesIds: ["comp1", "comp2", "comp6"],
    startDate: "2025-09"
  },
  {
    id: "stage-desautel",
    title: "Stage Développement",
    titleEn: "Development Internship",
    company: "Desautel",
    companyEn: "Desautel",
    period: "Avril 2025 - Juillet 2025",
    period_en: "April 2025 - July 2025",
    periodEn: "April 2025 - July 2025",
    period_en: "April 2025 - July 2025",
    description: "Refonte de l'interface de paramétrage 'AppliParam' et sécurisation des données.",
    descriptionEn: "Redesign of the 'AppliParam' parameterization interface and data security.",
    longDescription: "Stage de 2ème année de BUT. Refonte complète de l'interface Niveau 4 du logiciel AppliParam, gestion du cryptage dynamique et génération de rapports PDF.",
    longDescriptionEn: "2nd year BUT internship. Complete redesign of the Level 4 interface of the AppliParam software, dynamic encryption management, and PDF report generation.",
    missions: [
      "Refonte de l'IHM WPF avec synchronisation Observer",
      "Développement d'un système de cryptage à clé multiple",
      "Génération de rapports PDF dynamiques",
      "Gestion de configurations réseau complexes"
    ],
    missionsEn: [
      "Redesign of WPF GUI with Observer synchronization",
      "Development of a multi-key encryption system",
      "Generation of dynamic PDF reports",
      "Management of complex network configurations"
    ],
    hardSkills: ["C#", ".NET 9", "WPF", "Cryptographie", "XML"],
    hardSkillsEn: ["C#", ".NET 9", "WPF", "Cryptography", "XML"],
    softSkills: ["Adaptabilité", "Analyse", "Persévérance"],
    softSkillsEn: ["Adaptability", "Analysis", "Perseverance"],
    imageUrl: "/images/experiences/Desautel.jpg",
    type: "INTERNSHIP",
    competencesIds: ["comp1", "comp2", "comp4"],
    startDate: "2025-04"
  },
  {
    id: "stages-cuisine",
    title: "Stages Cuisine",
    titleEn: "Cooking Internships",
    company: "Divers Établissements",
    companyEn: "Various Establishments",
    period: "2018 - 2021",
    period_en: "2018 - 2021",
    periodEn: "2018 - 2021",
    description: "Expériences en brigade dans des établissements de prestige (Nice, Perpignan, Chambéry).",
    descriptionEn: "Experiences in brigade in prestigious establishments (Nice, Perpignan, Chambéry).",
    longDescription: "Stages dans le cadre du Bac Pro Cuisine. Apprentissage de la rigueur, de l'organisation et du travail d'équipe sous pression.",
    longDescriptionEn: "Internships as part of the Professional Baccalaureate in Cooking. Learning rigor, organization, and teamwork under pressure.",
    missions: [
      "Préparation des denrées et service en brigade",
      "Respect strict des normes d'hygiène",
      "Gestion du stress en pic d'activité",
      "Organisation des postes de travail"
    ],
    missionsEn: [
      "Preparation of goods and brigade service",
      "Strict compliance with hygiene standards",
      "Stress management during peak activity",
      "Organization of workstations"
    ],
    hardSkills: ["Techniques culinaires", "Organisation"],
    hardSkillsEn: ["Culinary Techniques", "Organization"],
    softSkills: ["Résistance au stress", "Discipline", "Travail en équipe"],
    softSkillsEn: ["Stress Resistance", "Discipline", "Teamwork"],
    imageUrl: "/images/experiences/Cuisine.png",
    type: "INTERNSHIP",
    competencesIds: ["comp6"],
    startDate: "2018-09"
  }
];

const PASSIONS = [
  {
    id: "pas1",
    name: "Espace",
    name_en: "Space",
    description: "Ma passion pour l’espace est née d’une quête de connaissance et d’un émerveillement devant les sciences. L’exploration et la compréhension de l’univers, de la vie, ainsi que les technologies associées (lanceurs, sondes, etc.) me fascinent.",
    description_en: "My passion for space was born from a quest for knowledge and a wonder for science. The exploration and understanding of the universe, life, and associated technologies (launchers, probes, etc.) fascinate me.",
    imageUrl: "/images/passions/space_1.jpg"
  },
  {
    id: "pas2",
    name: "Sport automobile",
    name_en: "Motorsport",
    description: "Mon intérêt pour le sport automobile s’est construit progressivement via l’ingénierie, la compétition et le sport. La Formule 1 m’a servi de porte d’entrée vers tout l’univers du sport auto.",
    description_en: "My interest in motorsport has gradually built up through engineering, competition, and sport. Formula 1 served as my gateway into the entire world of motorsport.",
    imageUrl: "/images/passions/ms_1.jpg"
  },
  {
    id: "pas3",
    name: "SimRacing",
    name_en: "SimRacing",
    description: "En 2021, j’ai commencé à m’investir dans la simulation automobile. Je possède aujourd’hui un simulateur complet, qui me permet de développer concentration, sang-froid et réflexes.",
    description_en: "In 2021, I started getting involved in car simulation. Today I own a complete simulator, which allows me to develop concentration, composure, and reflexes.",
    imageUrl: "/images/passions/sr_1.jpg"
  },
  {
    id: "pas4",
    name: "Cuisine",
    name_en: "Cooking",
    description: "Titulaire d’un Bac Pro Cuisine avec mention Très Bien, j’ai appris la rigueur et l’organisation sous pression. Ces compétences sont pleinement transférables dans le domaine de l’informatique.",
    description_en: "Holding a Professional Baccalaureate in Cooking with honors, I learned rigor and organization under pressure. These skills are fully transferable to the field of IT.",
    imageUrl: "/images/passions/cuisine_1.jpg"
  },
  {
    id: "pas5",
    name: "Technologie Et Informatique",
    name_en: "Technology & IT",
    description: "Passionné par la résolution de problèmes et le prototypage. J'ai choisi de m'orienter vers le développement d'applications pour comprendre et créer des programmes innovants.",
    description_en: "Passionate about problem solving and prototyping. I chose to specialize in application development to understand and create innovative programs.",
    imageUrl: "/images/passions/informatique_1.jpg"
  }
];

function seedDatabase(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Drop existing tables to ensure schema update
      db.run("DROP TABLE IF EXISTS iut_competences");
      db.run("DROP TABLE IF EXISTS projects");
      db.run("DROP TABLE IF EXISTS formations");
      db.run("DROP TABLE IF EXISTS professional_experiences");
      db.run("DROP TABLE IF EXISTS passions");

      db.run(`
        CREATE TABLE IF NOT EXISTS skills (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          category TEXT NOT NULL,
          mastery INTEGER NOT NULL,
          icon TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS soft_skills (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          name_en TEXT,
          nameEn TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS iut_competences (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          name_en TEXT,
          description TEXT NOT NULL,
          description_en TEXT,
          level INTEGER NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          title_en TEXT,
          description TEXT NOT NULL,
          description_en TEXT,
          longDescription TEXT NOT NULL,
          longDescription_en TEXT,
          techStack TEXT NOT NULL,
          skillsIds TEXT NOT NULL,
          competencesIds TEXT NOT NULL,
          imageUrl TEXT NOT NULL,
          github TEXT,
          link TEXT,
          category TEXT NOT NULL,
          images TEXT,
          status TEXT,
          startDate TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS formations (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          title_en TEXT,
          institution TEXT NOT NULL,
          institution_en TEXT,
          period TEXT NOT NULL,
          period_en TEXT,
          description TEXT NOT NULL,
          description_en TEXT,
          longDescription TEXT NOT NULL,
          longDescription_en TEXT,
          hardSkills TEXT NOT NULL,
          hardSkillsEn TEXT NOT NULL,
          softSkills TEXT NOT NULL,
          softSkillsEn TEXT NOT NULL,
          imageUrl TEXT NOT NULL,
          type TEXT NOT NULL,
          competencesIds TEXT,
          startDate TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS professional_experiences (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          title_en TEXT,
          company TEXT NOT NULL,
          company_en TEXT,
          period TEXT NOT NULL,
          period_en TEXT,
          description TEXT NOT NULL,
          description_en TEXT,
          longDescription TEXT NOT NULL,
          longDescription_en TEXT,
          missions TEXT NOT NULL,
          missions_en TEXT,
          hardSkills TEXT,
          hardSkillsEn TEXT,
          softSkills TEXT,
          softSkillsEn TEXT,
          imageUrl TEXT NOT NULL,
          type TEXT NOT NULL,
          competencesIds TEXT,
          startDate TEXT
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS passions (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          name_en TEXT,
          description TEXT NOT NULL,
          description_en TEXT,
          imageUrl TEXT NOT NULL
        )
      `, (err) => {
        if (err) return reject(err);

        // Insert skills
        const skillStmt = db.prepare('INSERT OR REPLACE INTO skills (id, name, category, mastery, icon) VALUES (?, ?, ?, ?, ?)');
        SKILLS.forEach(skill => {
          skillStmt.run(skill.id, skill.name, skill.category, skill.mastery, skill.icon);
        });
        skillStmt.finalize();

        // Insert soft skills
        const softSkillStmt = db.prepare('INSERT OR REPLACE INTO soft_skills (id, name, name_en) VALUES (?, ?, ?)');
        SOFT_SKILLS.forEach(skill => {
          softSkillStmt.run(skill.id, skill.name, skill.nameEn || skill.name);
        });
        softSkillStmt.finalize();

        // Insert IUT competences
        const compStmt = db.prepare('INSERT OR REPLACE INTO iut_competences (id, name, name_en, description, description_en, level) VALUES (?, ?, ?, ?, ?, ?)');
        IUT_COMPETENCES.forEach(comp => {
          compStmt.run(comp.id, comp.name, comp.name_en || comp.name, comp.description, comp.description_en || comp.description, comp.level);
        });
        compStmt.finalize();

        // Insert projects
        const projectStmt = db.prepare('INSERT OR REPLACE INTO projects (id, title, title_en, description, description_en, longDescription, longDescription_en, techStack, skillsIds, competencesIds, imageUrl, category, images, status, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        PROJECTS.forEach(project => {
          projectStmt.run(project.id, project.title, project.titleEn || project.title, project.description, project.descriptionEn || project.description, project.longDescription, project.longDescriptionEn || project.longDescription, JSON.stringify(project.techStack), JSON.stringify(project.skillsIds), JSON.stringify(project.competencesIds), project.imageUrl, project.category, JSON.stringify(project.images || []), project.status || 'ARCHIVED', project.startDate || '');
        });
        projectStmt.finalize();

        // Insert formations
        const formationStmt = db.prepare('INSERT OR REPLACE INTO formations (id, title, title_en, institution, institution_en, period, period_en, description, description_en, longDescription, longDescription_en, hardSkills, hardSkillsEn, softSkills, softSkillsEn, imageUrl, type, competencesIds, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        FORMATIONS.forEach(formation => {
          formationStmt.run(formation.id, formation.title, formation.titleEn || formation.title_en || formation.title, formation.institution, formation.institutionEn || formation.institution_en || formation.institution, formation.period, formation.periodEn || formation.period_en || formation.period, formation.description, formation.descriptionEn || formation.description_en || formation.description, formation.longDescription, formation.longDescriptionEn || formation.longDescription_en || formation.longDescription, JSON.stringify(formation.hardSkills), JSON.stringify(formation.hardSkillsEn || formation.hardSkills_en || formation.hardSkills), JSON.stringify(formation.softSkills), JSON.stringify(formation.softSkillsEn || formation.softSkills_en || formation.softSkills), formation.imageUrl, formation.type, JSON.stringify(formation.competencesIds || []), formation.startDate || '');
        });
        formationStmt.finalize();

        // Insert professional experiences
        const profExpStmt = db.prepare('INSERT OR REPLACE INTO professional_experiences (id, title, title_en, company, company_en, period, period_en, description, description_en, longDescription, longDescription_en, missions, missions_en, hardSkills, hardSkillsEn, softSkills, softSkillsEn, imageUrl, type, competencesIds, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        PROFESSIONAL_EXPERIENCES.forEach(exp => {
          profExpStmt.run(exp.id, exp.title, exp.titleEn || exp.title_en || exp.title, exp.company, exp.companyEn || exp.company_en || exp.company, exp.period, exp.periodEn || exp.period_en || exp.period, exp.description, exp.descriptionEn || exp.description_en || exp.description, exp.longDescription, exp.longDescriptionEn || exp.longDescription_en || exp.longDescription, JSON.stringify(exp.missions || []), JSON.stringify(exp.missionsEn || exp.missions_en || exp.missions || []), JSON.stringify(exp.hardSkills || []), JSON.stringify(exp.hardSkillsEn || exp.hardSkills_en || exp.hardSkills || []), JSON.stringify(exp.softSkills || []), JSON.stringify(exp.softSkillsEn || exp.softSkills_en || exp.softSkills || []), exp.imageUrl, exp.type, JSON.stringify(exp.competencesIds || []), exp.startDate || '');
        });
        profExpStmt.finalize();

        // Insert passions
        const passionStmt = db.prepare('INSERT OR REPLACE INTO passions (id, name, name_en, description, description_en, imageUrl) VALUES (?, ?, ?, ?, ?, ?)');
        PASSIONS.forEach(passion => {
          passionStmt.run(passion.id, passion.name, passion.name_en || passion.name, passion.description, passion.description_en || passion.description, passion.imageUrl);
        });
        passionStmt.finalize();

        console.log('Database seeded successfully!');
        resolve();
      });
    });
  });
}

module.exports = { seedDatabase };

// If run directly, seed the database
if (require.main === module) {
  const dbPath = path.resolve(__dirname, 'portfolio.db');
  const db = new sqlite3.Database(dbPath);

  seedDatabase(db).then(() => {
    db.close();
  }).catch(console.error);
}