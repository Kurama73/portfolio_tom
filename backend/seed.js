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
  { id: "ss1", name: "Communication" },
  { id: "ss2", name: "Travail en équipe" },
  { id: "ss3", name: "Rigueur" },
  { id: "ss4", name: "Adaptabilité" },
  { id: "ss5", name: "Résolution de problèmes" },
  { id: "ss6", name: "Autonomie" },
];

const IUT_COMPETENCES = [
  { id: "comp1", name: "Réaliser un développement d'application", description: "Concevoir, coder, tester et intégrer des solutions logicielles.", level: 85 },
  { id: "comp2", name: "Optimiser des applications", description: "Proposer des applications informatiques performantes et optimisées.", level: 75 },
  { id: "comp3", name: "Administrer des systèmes communicants", description: "Installer, configurer et maintenir des infrastructures informatiques.", level: 70 },
  { id: "comp4", name: "Gérer des données de l'information", description: "Concevoir et administrer des bases de données complexes.", level: 80 },
  { id: "comp5", name: "Conduire un projet", description: "Organiser et piloter un projet informatique avec des méthodes agiles.", level: 90 },
  { id: "comp6", name: "Collaborer au sein d'une équipe", description: "Travailler efficacement dans une équipe informatique.", level: 85 }
];

const PROJECTS = [
  {
    id: "appliparam",
    title: "AppliParam (Desautel)",
    description: "Refonte d'un logiciel WPF/.NET de paramétrage de centrales incendie avec cryptographie.",
    longDescription: "Lors de mon stage de 12 semaines au sein de l’équipe R&D de Desautel, j’ai été chargé de la refonte complète de l’interface Niveau 4 du logiciel AppliParam, utilisé pour la configuration avancée des centrales incendie INISE16.\n\nL’ancienne interface souffrait d’un manque d’ergonomie et d’une absence de validation. J’ai conçu une nouvelle IHM en WPF/XAML synchronisée en temps réel (pattern Observer). J’ai également développé un système de cryptage dynamique à clé multiple pour sécuriser les fichiers XML et enrichi la génération de rapports PDF techniques.",
    techStack: ["C#", ".NET 9", "WPF", "Design Patterns", "Git", "Cryptographie", "XML"],
    skillsIds: ["csharp", "dotnet", "xml", "git"],
    competencesIds: ["comp1", "comp2", "comp4"],
    imageUrl: "/images/projects/AppliParam/1.jpg",
    images: ["/images/projects/AppliParam/1.jpg", "/images/projects/AppliParam/2.jpg", "/images/projects/AppliParam/3.jpg"],
    category: "Software",
    startDate: "2025-04"
  },
  {
    id: "smartdesk",
    title: "SmartDesk",
    description: "Application web de productivité (Svelte/Node.js) avec widgets personnalisables.",
    longDescription: "SmartDesk est une application web collaborative de gestion d’agenda et de productivité développée en équipe. Elle regroupe calendrier, tâches, notes et widgets (musique, etc.) dans une interface responsive.\n\nMa contribution a porté sur le design global et le développement complet du système de widgets interactifs. Nous avons utilisé Svelte, Node.js et MySQL, avec un déploiement sur VPS et une gestion de projet agile sur GitHub.",
    techStack: ["Svelte", "Node.js", "TailwindCSS", "MySQL", "VPS"],
    skillsIds: ["svelte", "tailwind", "sql", "js"],
    competencesIds: ["comp1", "comp2", "comp5"],
    imageUrl: "/images/projects/SmartDesk/1.png",
    images: ["/images/projects/SmartDesk/1.png", "/images/projects/SmartDesk/2.png"],
    category: "Web",
    startDate: "2024-05"
  },
  {
    id: "paniervip",
    title: "PanierVIP",
    description: "Gestion collaborative de listes de courses en temps réel avec PHP/Symfony.",
    longDescription: "PanierVIP permet à plusieurs utilisateurs de partager des listes de courses avec suivi des achats et statistiques. Développé sous Symfony avec Twig et MySQL.\n\nJ'ai réalisé l'authentification et la gestion des rôles (SecurityBundle), ainsi que les fonctionnalités CRUD pour les produits et utilisateurs. Le projet a permis de maîtriser les migrations et la validation des formulaires dans un environnement collaboratif.",
    techStack: ["PHP", "Symfony", "Twig", "MySQL", "CSS", "Git"],
    skillsIds: ["php", "symfony", "sql", "css"],
    competencesIds: ["comp1", "comp4", "comp6"],
    imageUrl: "/images/projects/PanierVIP/1.png",
    images: ["/images/projects/PanierVIP/1.png", "/images/projects/PanierVIP/2.png", "/images/projects/PanierVIP/3.png"],
    category: "Web",
    status: "Déployé",
    startDate: "2024-01"
  },
  {
    id: "lootboxhunter",
    title: "LootBoxHunter",
    description: "Simulateur mobile d'ouverture de caisses (Kotlin/Firebase) avec API REST.",
    longDescription: "Application Android native permettant de simuler l'ouverture de caisses de cosmétiques. Utilisation d'une API REST pour les données et de Firebase pour l'authentification et le stockage cloud.\n\nDesign complet de l'IHM sous Android Studio et gestion asynchrone des flux de données. Le système gère l'inventaire des utilisateurs et la synchronisation en temps réel.",
    techStack: ["Kotlin", "Android Studio", "Firebase", "API REST"],
    skillsIds: ["kotlin"],
    competencesIds: ["comp1", "comp4", "comp3"],
    imageUrl: "/images/projects/LootBoxHunter/1.png",
    images: ["/images/projects/LootBoxHunter/1.png", "/images/projects/LootBoxHunter/2.png", "/images/projects/LootBoxHunter/3.png", "/images/projects/LootBoxHunter/4.png"],
    category: "Mobile",
    status: "Déployé",
    startDate: "2023-11"
  },
  {
    id: "dimensionalmatrix",
    title: "DimensionalMatrix",
    description: "Jeu labyrinthe Python sur Raspberry Pi avec capteurs SenseHat.",
    longDescription: "Développement d'un jeu interactif utilisant la matrice LED et le gyroscope du SenseHat. Le joueur doit s'échapper d'un labyrinthe en inclinant le boîtier.\n\nProjet réalisé en équipe dans un contexte international (ateliers en anglais), mettant l'accent sur l'optimisation pour hardware embarqué et la gestion des entrées/sorties temps réel.",
    techStack: ["Python", "Raspberry Pi", "SenseHat", "Gyroscope"],
    skillsIds: ["python"],
    competencesIds: ["comp1", "comp2", "comp3"],
    imageUrl: "/images/projects/DimensionalMatrix/1.png",
    images: ["/images/projects/DimensionalMatrix/1.png"],
    category: "System",
    status: "Archivé",
    startDate: "2023-03"
  },
  {
    id: "sae-java",
    title: "SAE JAVA - Coloration",
    description: "Visualisation de graphes et évitement de collision d'avions (Java Swing).",
    longDescription: "Modélisation de l'espace aérien et simulation d'évitement de collisions à l'aide d'algorithmes de coloration de graphes. Développement d'une interface graphique interactive permettant de manipuler les trajectoires.\n\nJ’ai conçu toute la partie IHM interactive (Java Swing) et l’intégration des fonctionnalités d'import/export de données complexes (CSV/JSON).",
    techStack: ["Java Swing", "Algorithmes de Graphes", "JUnit"],
    skillsIds: ["java"],
    competencesIds: ["comp1", "comp2", "comp5"],
    imageUrl: "/images/projects/SAE_JAVA/4.png",
    images: ["/images/projects/SAE_JAVA/4.png", "/images/projects/SAE_JAVA/1.png", "/images/projects/SAE_JAVA/2.png", "/images/projects/SAE_JAVA/3.png"],
    category: "Desktop",
    status: "Archivé",
    startDate: "2023-01"
  },
];

const FORMATIONS = [
  {
    id: "bac-pro-cuisine",
    title: "Bac Professionnel Cuisine",
    institution: "Lycée Hôtelier | Challes-les-Eaux",
    period: "2018 - 2021",
    description: "Baccalauréat Profesionnel Cuisine, mention Très Bien.",
    longDescription: "Titulaire d’un Bac Professionnel Cuisine avec mention Très Bien, j’ai appris à travailler en équipe, à faire preuve de rigueur et à m’adapter à des situations imprévues. Cette expérience intense m’a permis de développer une excellente gestion du stress, une organisation solide et un esprit de collaboration. Ces compétences sont pleinement transférables dans le domaine de l’informatique.",
    hardSkills: ["Gestion de brigade", "HACCP", "Organisation", "Rigueur"],
    softSkills: ["Discipline", "Travail en équipe", "Gestion du stress"],
    imageUrl: "/images/experiences/Cuisine.png",
    type: "education",
    competencesIds: ["comp6"],
    startDate: "2018-09"
  },
  {
    id: "bac-sti2d",
    title: "Bac STI2D option EE",
    institution: "Lycée Saint Ambroise | Chambéry",
    period: "2021 - 2022",
    description: "Baccalauréat Technologique Sciences et Technologies de l'Industrie et du Développement Durable, mention Très Bien.",
    longDescription: "Réorientation vers les technologies et l'informatique. Découverte de l'ingénierie, de la mécanique et de la programmation. J'ai choisi de travailler sur la programmation autonome lors des projets, ce qui a confirmé mon intérêt pour le développement logiciel.",
    hardSkills: ["Programmation", "Ingénierie", "Physique appliquée"],
    softSkills: ["Curiosité", "Capacité d'adaptation"],
    imageUrl: "/images/skills/net9.png",
    type: "education",
    competencesIds: [],
    startDate: "2021-09"
  },
  {
    id: "but-info",
    title: "BUT Informatique",
    institution: "IUT Lyon 1 | Villeurbanne",
    period: "2022 - 2025",
    description: "Bachelor Universitaire de Technologie en Informatique, spécialité Développement d’applications.",
    longDescription: "Aujourd’hui en troisième année de BUT Informatique à Lyon 1. Approfondissement de la conception logicielle, des bases de données et du travail collaboratif. Spécialité développement d'applications.\n\nJ'y ai appris la résolution de problèmes, le prototypage et les tests rigoureux.",
    hardSkills: ["Développement logiciel", "Bases de données", "Algorithmique", "Architecture logicielle"],
    softSkills: ["Résolution de problèmes", "Autonomie", "Esprit critique"],
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
    company: "Desautel",
    period: "Septembre 2025 - Présent",
    description: "Alternance en 3ème année de BUT : évolution et maintenance des applications + développement d'un superviseur incendie",
    longDescription: "Poursuite du travail initié en stage en tant qu'alternant. Responsable des évolutions logicielles sur les outils de paramétrage et de supervision des centrales incendie.",
    missions: [
      "Développement de nouvelles fonctionnalités métier en C#/.NET",
      "Optimisation de la robustesse des échanges de données XML",
      "Maintenance corrective et évolutive des interfaces WPF",
      "Recherche et développement d'un superviseur incendie"
    ],
    hardSkills: ["C#", ".NET", "WPF", "Git", "SQL"],
    softSkills: ["Professionnalisme", "Autonomie", "Rigueur"],
    imageUrl: "/images/experiences/Desautel.jpg",
    type: "alternance",
    competencesIds: ["comp1", "comp2", "comp6"],
    startDate: "2025-09"
  },
  {
    id: "stage-desautel",
    title: "Stage Développement",
    company: "Desautel",
    period: "Avril 2025 - Juillet 2025",
    description: "Refonte de l'interface de paramétrage 'AppliParam' et sécurisation des données.",
    longDescription: "Stage de 2ème année de BUT. Refonte complète de l'interface Niveau 4 du logiciel AppliParam, gestion du cryptage dynamique et génération de rapports PDF.",
    missions: [
      "Refonte de l'IHM WPF avec synchronisation Observer",
      "Développement d'un système de cryptage à clé multiple",
      "Génération de rapports PDF dynamiques",
      "Gestion de configurations réseau complexes"
    ],
    hardSkills: ["C#", ".NET 9", "WPF", "Cryptographie", "XML"],
    softSkills: ["Adaptabilité", "Analyse", "Persévérance"],
    imageUrl: "/images/experiences/Desautel.jpg",
    type: "stage",
    competencesIds: ["comp1", "comp2", "comp4"],
    startDate: "2025-04"
  },
  {
    id: "stages-cuisine",
    title: "Stages Cuisine",
    company: "Divers Établissements",
    period: "2018 - 2021",
    description: "Expériences en brigade dans des établissements de prestige (Nice, Perpignan, Chambéry).",
    longDescription: "Stages dans le cadre du Bac Pro Cuisine. Apprentissage de la rigueur, de l'organisation et du travail d'équipe sous pression.",
    missions: [
      "Préparation des denrées et service en brigade",
      "Respect strict des normes d'hygiène",
      "Gestion du stress en pic d'activité",
      "Organisation des postes de travail"
    ],
    hardSkills: ["Techniques culinaires", "Organisation"],
    softSkills: ["Résistance au stress", "Discipline", "Travail en équipe"],
    imageUrl: "/images/experiences/Cuisine.png",
    type: "stage",
    competencesIds: ["comp6"],
    startDate: "2018-09"
  }
];

const PASSIONS = [
  {
    id: "pas1",
    name: "Espace",
    description: "Ma passion pour l’espace est née d’une quête de connaissance et d’un émerveillement devant les sciences. L’exploration et la compréhension de l’univers, de la vie, ainsi que les technologies associées (lanceurs, sondes, etc.) me fascinent.",
    imageUrl: "/images/passions/space_1.jpg"
  },
  {
    id: "pas2",
    name: "Sport automobile",
    description: "Mon intérêt pour le sport automobile s’est construit progressivement via l’ingénierie, la compétition et le sport. La Formule 1 m’a servi de porte d’entrée vers tout l’univers du sport auto.",
    imageUrl: "/images/passions/ms_1.jpg"
  },
  {
    id: "pas3",
    name: "SimRacing",
    description: "En 2021, j’ai commencé à m’investir dans la simulation automobile. Je possède aujourd’hui un simulateur complet, qui me permet de développer concentration, sang-froid et réflexes.",
    imageUrl: "/images/passions/sr_1.jpg"
  },
  {
    id: "pas4",
    name: "Cuisine",
    description: "Titulaire d’un Bac Pro Cuisine avec mention Très Bien, j’ai appris la rigueur et l’organisation sous pression. Ces compétences sont pleinement transférables dans le domaine de l’informatique.",
    imageUrl: "/images/passions/cuisine_1.jpg"
  },
  {
    id: "pas5",
    name: "Technologie Et Informatique",
    description: "Passionné par la résolution de problèmes et le prototypage. J'ai choisi de m'orienter vers le développement d'applications pour comprendre et créer des programmes innovants.",
    imageUrl: "/images/passions/informatique_1.jpg"
  }
];

function seedDatabase(db) {
  return new Promise((resolve, reject) => {
    db.serialize(() => {
      // Create tables
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
          name TEXT NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS iut_competences (
          id TEXT PRIMARY KEY,
          name TEXT NOT NULL,
          description TEXT NOT NULL,
          level INTEGER NOT NULL
        )
      `);

      db.run(`
        CREATE TABLE IF NOT EXISTS projects (
          id TEXT PRIMARY KEY,
          title TEXT NOT NULL,
          description TEXT NOT NULL,
          longDescription TEXT NOT NULL,
          techStack TEXT NOT NULL,
          skillsIds TEXT NOT NULL,
          competencesIds TEXT NOT NULL,
          imageUrl TEXT NOT NULL,
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
          institution TEXT NOT NULL,
          period TEXT NOT NULL,
          description TEXT NOT NULL,
          longDescription TEXT NOT NULL,
          hardSkills TEXT NOT NULL,
          softSkills TEXT NOT NULL,
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
          company TEXT NOT NULL,
          period TEXT NOT NULL,
          description TEXT NOT NULL,
          longDescription TEXT NOT NULL,
          missions TEXT NOT NULL,
          hardSkills TEXT,
          softSkills TEXT,
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
          description TEXT NOT NULL,
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
        const softSkillStmt = db.prepare('INSERT OR REPLACE INTO soft_skills (id, name) VALUES (?, ?)');
        SOFT_SKILLS.forEach(skill => {
          softSkillStmt.run(skill.id, skill.name);
        });
        softSkillStmt.finalize();

        // Insert IUT competences
        const compStmt = db.prepare('INSERT OR REPLACE INTO iut_competences (id, name, description, level) VALUES (?, ?, ?, ?)');
        IUT_COMPETENCES.forEach(comp => {
          compStmt.run(comp.id, comp.name, comp.description, comp.level);
        });
        compStmt.finalize();

        // Insert projects
        const projectStmt = db.prepare('INSERT OR REPLACE INTO projects (id, title, description, longDescription, techStack, skillsIds, competencesIds, imageUrl, category, images, status, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        PROJECTS.forEach(project => {
          projectStmt.run(project.id, project.title, project.description, project.longDescription, JSON.stringify(project.techStack), JSON.stringify(project.skillsIds), JSON.stringify(project.competencesIds), project.imageUrl, project.category, JSON.stringify(project.images || []), project.status || 'Archivé', project.startDate || '');
        });
        projectStmt.finalize();

        // Insert formations
        const formationStmt = db.prepare('INSERT OR REPLACE INTO formations (id, title, institution, period, description, longDescription, hardSkills, softSkills, imageUrl, type, competencesIds, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        FORMATIONS.forEach(formation => {
          formationStmt.run(formation.id, formation.title, formation.institution, formation.period, formation.description, formation.longDescription, JSON.stringify(formation.hardSkills), JSON.stringify(formation.softSkills), formation.imageUrl, formation.type, JSON.stringify(formation.competencesIds || []), formation.startDate || '');
        });
        formationStmt.finalize();

        // Insert professional experiences
        const profExpStmt = db.prepare('INSERT OR REPLACE INTO professional_experiences (id, title, company, period, description, longDescription, missions, hardSkills, softSkills, imageUrl, type, competencesIds, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        PROFESSIONAL_EXPERIENCES.forEach(exp => {
          profExpStmt.run(exp.id, exp.title, exp.company, exp.period, exp.description, exp.longDescription, JSON.stringify(exp.missions || []), JSON.stringify(exp.hardSkills || []), JSON.stringify(exp.softSkills || []), exp.imageUrl, exp.type, JSON.stringify(exp.competencesIds || []), exp.startDate || '');
        });
        profExpStmt.finalize();

        // Insert passions
        const passionStmt = db.prepare('INSERT OR REPLACE INTO passions (id, name, description, imageUrl) VALUES (?, ?, ?, ?)');
        PASSIONS.forEach(passion => {
          passionStmt.run(passion.id, passion.name, passion.description, passion.imageUrl);
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