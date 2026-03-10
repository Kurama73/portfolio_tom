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
    title: "AppliParam",
    description: "Logiciel de paramétrage de centrale incendie (WPF/.NET 9).",
    longDescription: "Refonte complète de l'interface de gestion des paramètres avancés (Niveau 4) en WPF (.NET 9) pour les centrales incendie INISE16. Ce projet incluait l'ajout de cryptage dynamique, la gestion de nouvelles cartes réseau et la génération de rapports PDF complexes. Travail réalisé lors d'un stage de 12 semaines chez Desautel.",
    techStack: ["C#", ".NET 9", "WPF", "XML", "Design Patterns"],
    skillsIds: ["csharp", "dotnet", "xml", "git"],
    competencesIds: ["comp1", "comp2", "comp4"],
    imageUrl: "/images/projects/AppliParam/1.jpg",
    images: ["/images/projects/AppliParam/1.jpg", "/images/projects/AppliParam/2.jpg", "/images/projects/AppliParam/3.jpg"],
    category: "Software",
  },
  {
    id: "smartdesk",
    title: "SmartDesk",
    description: "Application web moderne de gestion d'agenda et productivité.",
    longDescription: "Une solution complète pour booster sa productivité : calendrier interactif, gestionnaire de tâches, module de prise de notes et widgets musicaux. Développé avec l'approche Svelte pour une réactivité maximale et un design épuré.",
    techStack: ["Svelte", "Node.js", "TailwindCSS", "MySQL", "VPS"],
    skillsIds: ["svelte", "tailwind", "sql", "js"],
    competencesIds: ["comp1", "comp2"],
    imageUrl: "/images/projects/SmartDesk/1.png",
    images: ["/images/projects/SmartDesk/1.png", "/images/projects/SmartDesk/2.png"],
    category: "Web",
  },
  {
    id: "paniervip",
    title: "PanierVIP",
    description: "Gestion collaborative de listes de courses en temps réel.",
    longDescription: "Application web collaborative permettant de créer des comptes, gérer des listes de courses partagées et suivre les achats en temps réel. Utilisation du framework PHP Symfony pour garantir une architecture MVC robuste et sécurisée.",
    techStack: ["PHP", "Symfony", "Twig", "MySQL", "CSS"],
    skillsIds: ["php", "symfony", "sql", "css"],
    competencesIds: ["comp1", "comp4", "comp6"],
    imageUrl: "/images/projects/PanierVIP/1.png",
    images: ["/images/projects/PanierVIP/1.png", "/images/projects/PanierVIP/2.png", "/images/projects/PanierVIP/3.png"],
    category: "Web",
    status: "Déployé"
  },
  {
    id: "lootboxhunter",
    title: "LootBoxHunter",
    description: "Application mobile simulant l'ouverture de caisses.",
    longDescription: "Application Android permettant de simuler l'ouverture de caisses de cosmétiques. Utilise une API externe pour les données et Firebase pour toute la partie authentification et stockage des données utilisateur.",
    techStack: ["Kotlin", "Android Studio", "Firebase", "REST API"],
    skillsIds: ["kotlin"],
    competencesIds: ["comp1", "comp4"],
    imageUrl: "/images/projects/LootBoxHunter/1.png",
    images: ["/images/projects/LootBoxHunter/1.png", "/images/projects/LootBoxHunter/2.png", "/images/projects/LootBoxHunter/3.png", "/images/projects/LootBoxHunter/4.png"],
    category: "Mobile",
    status: "Déployé"
  },
  {
    id: "dimensionalmatrix",
    title: "DimensionalMatrix",
    description: "Jeu labyrinthe sur Raspberry Pi avec SenseHat.",
    longDescription: "Un jeu de labyrinthe innovant contrôlé par gyroscope sur une matrice LED 8x8. Le projet combine programmation matérielle en Python et logique de jeu pour une expérience interactive tangible.",
    techStack: ["Python", "Raspberry Pi", "SenseHat", "Gyroscope"],
    skillsIds: ["python"],
    competencesIds: ["comp1", "comp3"],
    imageUrl: "/images/projects/DimensionalMatrix/1.png",
    images: ["/images/projects/DimensionalMatrix/1.png"],
    category: "System",
    status: "Archivé"
  },
  {
    id: "sae-java",
    title: "SAE JAVA - Ciel Français",
    description: "Visualisation de graphes et évitement de collision.",
    longDescription: "Application Swing modélisant l'espace aérien français. Elle implémente des algorithmes de graphes complexes pour la détection et l'évitement des conflits de trajectoires d'avions.",
    techStack: ["Java Swing", "Algorithmes de Graphes", "JUnit"],
    skillsIds: ["java"],
    competencesIds: ["comp1", "comp2", "comp5"],
    imageUrl: "/images/projects/SAE_JAVA/4.png",
    images: ["/images/projects/SAE_JAVA/4.png", "/images/projects/SAE_JAVA/1.png", "/images/projects/SAE_JAVA/2.png", "/images/projects/SAE_JAVA/3.png"],
    category: "Desktop",
    status: "Archivé"
  },
];

const FORMATIONS = [
  {
    id: "bac-pro-cuisine",
    title: "Baccalauréat Professionnel Cuisine",
    institution: "Lycée Hôtelier",
    period: "2018 - 2021",
    description: "Formation en cuisine professionnelle avec stages en brigade.",
    longDescription: "Formation complète en arts culinaires avec apprentissage des techniques de base et avancées de la cuisine française. Accent mis sur la précision, l'organisation et le travail en équipe dans un environnement exigeant.",
    hardSkills: ["Techniques culinaires", "Hygiène alimentaire", "Gestion des stocks", "Préparation des plats", "Service en salle"],
    softSkills: ["Travail d'équipe", "Rigueur", "Gestion du stress", "Adaptabilité", "Précision"],
    imageUrl: "/images/experiences/Cuisine.png",
    type: "education"
  },
  {
    id: "sti2d",
    title: "Baccalauréat STI2D",
    institution: "Lycée Technologique",
    period: "2021 - 2022",
    description: "Baccalauréat Sciences et Technologies de l'Industrie et du Développement Durable.",
    longDescription: "Formation technologique orientée vers l'innovation et le développement durable. Introduction aux sciences industrielles et aux technologies numériques.",
    hardSkills: ["Électronique", "Informatique", "Mécanique", "Énergies renouvelables", "Programmation basique"],
    softSkills: ["Résolution de problèmes", "Créativité", "Travail en équipe", "Autonomie", "Pensée critique"],
    imageUrl: "/images/ID_mono.png",
    type: "education"
  },
  {
    id: "but-info",
    title: "BUT Informatique",
    institution: "IUT de Chambéry",
    period: "2022 - 2025",
    description: "Bachelor Universitaire de Technologie en Informatique.",
    longDescription: "Formation supérieure en informatique avec spécialisation en développement logiciel, bases de données et systèmes d'information. Projet de fin d'études en cours.",
    hardSkills: ["Développement web", "Bases de données", "Programmation orientée objet", "Algorithmique", "Architecture logicielle", "Cybersécurité"],
    softSkills: ["Communication", "Travail en équipe", "Adaptabilité", "Résolution de problèmes", "Gestion de projet", "Autonomie"],
    imageUrl: "/images/ID_mono.png",
    type: "education"
  }
];

const PROFESSIONAL_EXPERIENCES = [
  {
    id: "stage-desautel",
    title: "Stage Développement Logiciel",
    company: "Desautel",
    period: "Avril 2025 - Juillet 2025",
    description: "Développement et amélioration d'un logiciel de paramétrage de centrales incendie.",
    longDescription: "Stage de fin de BUT consistant à refondre l'interface de gestion des paramètres avancés d'un logiciel métier critique pour les centrales incendie INISE16.",
    missions: [
      "Refonte complète de l'interface WPF (.NET 9) pour les paramètres de niveau 4",
      "Implémentation d'un système de cryptage dynamique multi-clés",
      "Gestion de nouvelles cartes réseau et optimisation des performances",
      "Génération de rapports PDF complexes avec données chiffrées",
      "Travail en méthodologie agile avec Git pour le versioning"
    ],
    imageUrl: "/images/experiences/Desautel.jpg",
    type: "stage"
  },
  {
    id: "stages-cuisine",
    title: "Stages Cuisine Professionnelle",
    company: "Divers Établissements",
    period: "2018 - 2021",
    description: "Stages en cuisine dans différents établissements (Perpignan, Nice, Chambéry, etc.).",
    longDescription: "Parcours complet en cuisine professionnelle dans le cadre du Bac Pro Cuisine. Expérience en brigade dans divers établissements permettant d'acquérir rigueur et gestion du stress.",
    missions: [
      "Préparation et cuisson des plats selon les standards professionnels",
      "Gestion des stocks et inventaires alimentaires",
      "Travail en équipe sous pression en service continu",
      "Respect des normes d'hygiène et de sécurité alimentaire",
      "Service en salle et relation client"
    ],
    imageUrl: "/images/experiences/Cuisine.png",
    type: "stage"
  }
];

const PASSIONS = [
  {
    id: "pas1",
    name: "Gaming",
    description: "Plus qu'un loisir, une source d'inspiration pour le design de mécaniques et l'optimisation des performances.",
    imageUrl: "/images/passions/gaming_1.png"
  },
  {
    id: "pas2",
    name: "Aérospatial",
    description: "L'exigence technique et l'innovation constante du secteur spatial me fascinent et guident ma curiosité.",
    imageUrl: "/images/passions/space_1.jpg"
  },
  {
    id: "pas3",
    name: "Sport Automobile",
    description: "L'adrénaline de la performance et l'ingénierie de pointe au service de la vitesse.",
    imageUrl: "/images/passions/ms_1.jpg"
  },
  {
    id: "pas4",
    name: "SimRacing",
    description: "La quête de la trajectoire parfaite, demandant une concentration et une précision chirurgicale.",
    imageUrl: "/images/passions/sr_1.jpg"
  },
  {
    id: "pas5",
    name: "Cuisine",
    description: "L'art de l'organisation et de la précision, où chaque ingrédient compte pour le résultat final.",
    imageUrl: "/images/passions/cuisine_1.jpg"
  },
  {
    id: "pas6",
    name: "Technologie",
    description: "En veille permanente sur les dernières avancées logicielle et matérielle pour rester à la pointe.",
    imageUrl: "/images/passions/informatique_1.jpg"
  }
];

// Function to seed the database
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
          images TEXT
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
          type TEXT NOT NULL
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
          imageUrl TEXT NOT NULL,
          type TEXT NOT NULL
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
        const projectStmt = db.prepare('INSERT OR REPLACE INTO projects (id, title, description, longDescription, techStack, skillsIds, competencesIds, imageUrl, category, images) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        PROJECTS.forEach(project => {
          projectStmt.run(project.id, project.title, project.description, project.longDescription, JSON.stringify(project.techStack), JSON.stringify(project.skillsIds), JSON.stringify(project.competencesIds), project.imageUrl, project.category, JSON.stringify(project.images || []));
        });
        projectStmt.finalize();

        // Insert formations
        const formationStmt = db.prepare('INSERT OR REPLACE INTO formations (id, title, institution, period, description, longDescription, hardSkills, softSkills, imageUrl, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)');
        FORMATIONS.forEach(formation => {
          formationStmt.run(formation.id, formation.title, formation.institution, formation.period, formation.description, formation.longDescription, JSON.stringify(formation.hardSkills), JSON.stringify(formation.softSkills), formation.imageUrl, formation.type);
        });
        formationStmt.finalize();

        // Insert professional experiences
        const profExpStmt = db.prepare('INSERT OR REPLACE INTO professional_experiences (id, title, company, period, description, longDescription, missions, imageUrl, type) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)');
        PROFESSIONAL_EXPERIENCES.forEach(exp => {
          profExpStmt.run(exp.id, exp.title, exp.company, exp.period, exp.description, exp.longDescription, JSON.stringify(exp.missions), exp.imageUrl, exp.type);
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