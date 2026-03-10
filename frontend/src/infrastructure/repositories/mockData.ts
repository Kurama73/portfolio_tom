import { Project, Skill, Experience, Passion, IutCompetence, SoftSkill } from "../models";

export const SKILLS: Skill[] = [
  { id: "html", name: "HTML", category: "Web", mastery: 90 },
  { id: "sql", name: "SQL", category: "Database", mastery: 90 },
  { id: "mongodb", name: "MongoDB", category: "Database", mastery: 90 },
  { id: "xml", name: "XML", category: "Data", mastery: 90 },
  { id: "css", name: "CSS", category: "Web", mastery: 85 },
  { id: "js", name: "JavaScript", category: "Web", mastery: 80 },
  { id: "git", name: "Git", category: "Tools", mastery: 80 },
  { id: "tailwind", name: "Tailwind CSS", category: "Web", mastery: 80 },
  { id: "java", name: "Java", category: "Backend", mastery: 75 },
  { id: "c", name: "C", category: "System", mastery: 75 },
  { id: "csharp", name: "C#", category: "Backend", mastery: 75 },
  { id: "kotlin", name: "Kotlin", category: "Mobile", mastery: 75 },
  { id: "svelte", name: "Svelte", category: "Web", mastery: 70 },
  { id: "dotnet", name: ".NET 9", category: "Backend", mastery: 60 },
  { id: "php", name: "PHP", category: "Backend", mastery: 60 },
  { id: "symfony", name: "Symfony", category: "Backend", mastery: 60 },
];

export const SOFT_SKILLS: SoftSkill[] = [
  { id: "ss1", name: "Communication" },
  { id: "ss2", name: "Travail en équipe" },
  { id: "ss3", name: "Rigueur" },
  { id: "ss4", name: "Adaptabilité" },
  { id: "ss5", name: "Résolution de problèmes" },
  { id: "ss6", name: "Autonomie" },
];

export const PROJECTS: Project[] = [
  {
    id: "appliparam",
    title: "AppliParam",
    description: "Logiciel de paramétrage de centrale incendie (WPF/.NET 9).",
    longDescription: "Refonte complète de l'interface de gestion des paramètres avancés (Niveau 4) en WPF (.NET 9) pour les centrales incendie INISE16. Ce projet incluait l'ajout de cryptage dynamique, la gestion de nouvelles cartes réseau et la génération de rapports PDF complexes. Travail réalisé lors d'un stage de 12 semaines chez Desautel.",
    techStack: ["C#", ".NET 9", "WPF", "XML", "Design Patterns"],
    skillsIds: ["csharp", "dotnet", "xml", "git"],
    competencesIds: ["comp1", "comp2", "comp4"],
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=AppliParam+WPF",
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
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=SmartDesk+Svelte",
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
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=PanierVIP+Symfony",
    category: "Web",
  },
  {
    id: "lootboxhunter",
    title: "LootBoxHunter",
    description: "Application mobile simulant l'ouverture de caisses.",
    longDescription: "Application Android permettant de simuler l'ouverture de caisses de cosmétiques. Utilise une API externe pour les données et Firebase pour toute la partie authentification et stockage des données utilisateur.",
    techStack: ["Kotlin", "Android Studio", "Firebase", "REST API"],
    skillsIds: ["kotlin"],
    competencesIds: ["comp1", "comp4"],
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=LootBoxHunter+Kotlin",
    category: "Mobile",
  },
  {
    id: "dimensionalmatrix",
    title: "DimensionalMatrix",
    description: "Jeu labyrinthe sur Raspberry Pi avec SenseHat.",
    longDescription: "Un jeu de labyrinthe innovant contrôlé par gyroscope sur une matrice LED 8x8. Le projet combine programmation matérielle en Python et logique de jeu pour une expérience interactive tangible.",
    techStack: ["Python", "Raspberry Pi", "SenseHat", "Gyroscope"],
    skillsIds: ["python"],
    competencesIds: ["comp1", "comp3"],
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=DimensionalMatrix+Python",
    category: "System",
  },
  {
    id: "sae-java",
    title: "SAE JAVA - Ciel Français",
    description: "Visualisation de graphes et évitement de collision.",
    longDescription: "Application Swing modélisant l'espace aérien français. Elle implémente des algorithmes de graphes complexes pour la détection et l'évitement des conflits de trajectoires d'avions.",
    techStack: ["Java Swing", "Algorithmes de Graphes", "JUnit"],
    skillsIds: ["java"],
    competencesIds: ["comp1", "comp2", "comp5"],
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=SAE+Java+Graph",
    category: "Desktop",
  },
];

export const EXPERIENCES: Experience[] = [
  {
    id: "exp1",
    title: "Stage Développement Logiciel",
    company: "Desautel",
    period: "Avril 2025 - Juillet 2025",
    description: "Participation au développement d'AppliParam (WPF/C#).",
    longDescription: "Durant ce stage de fin de BUT, j'ai eu l'opportunité d'intégrer l'équipe de développement de Desautel. Ma mission principale consistait à faire évoluer un logiciel métier critique pour le paramétrage des centrales incendie. J'ai mis en place un système de cryptage dynamique pour sécuriser les données de configuration et optimisé l'interface utilisateur WPF pour plus d'ergonomie.",
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=Desautel+Internship",
    competencesIds: ["comp1", "comp2", "comp4", "comp5", "comp6"]
  },
  {
    id: "exp2",
    title: "Stages en Cuisine Professionnelle",
    company: "Divers Etablissements",
    period: "2018 - 2021",
    description: "Parcours en cuisine ayant forgé ma rigueur et ma gestion du stress.",
    longDescription: "Avant de me réorienter vers l'informatique, j'ai suivi un parcours complet en cuisine. Cette expérience en brigade m'a appris la rigueur absolue, la gestion du stress en plein rush et l'importance d'une communication fluide au sein d'une équipe. Des compétences transversales que je réinvestis aujourd'hui chaque jour dans mes projets de développement.",
    imageUrl: "https://placehold.co/800x450/000000/ff4d00?text=Professional+Cuisine",
    competencesIds: ["comp6"]
  }
];

export const PASSIONS: Passion[] = [
  {
    id: "pas1",
    name: "Gaming",
    description: "Plus qu'un loisir, une source d'inspiration pour le design de mécaniques et l'optimisation des performances.",
    imageUrl: "https://placehold.co/600x400/000000/ff4d00?text=Gaming+Passion"
  },
  {
    id: "pas2",
    name: "Aérospatial",
    description: "L'exigence technique et l'innovation constante du secteur spatial me fascinent et guident ma curiosité.",
    imageUrl: "https://placehold.co/600x400/000000/ff4d00?text=Space+Passion"
  },
  {
    id: "pas3",
    name: "Sport Automobile",
    description: "L'adrénaline de la performance et l'ingénierie de pointe au service de la vitesse.",
    imageUrl: "https://placehold.co/600x400/000000/ff4d00?text=Motorsport+Passion"
  },
  {
    id: "pas4",
    name: "SimRacing",
    description: "La quête de la trajectoire parfaite, demandant une concentration et une précision chirurgicale.",
    imageUrl: "https://placehold.co/600x400/000000/ff4d00?text=SimRacing+Passion"
  },
  {
    id: "pas5",
    name: "Cuisine",
    description: "L'art de l'organisation et de la précision, où chaque ingrédient compte pour le résultat final.",
    imageUrl: "https://placehold.co/600x400/000000/ff4d00?text=Cuisine+Passion"
  },
  {
    id: "pas6",
    name: "Technologie",
    description: "En veille permanente sur les dernières avancées logicielle et matérielle pour rester à la pointe.",
    imageUrl: "https://placehold.co/600x400/000000/ff4d00?text=Technology+Passion"
  }
];

export const IUT_COMPETENCES: IutCompetence[] = [
  { id: "comp1", name: "Réaliser un développement d'application", description: "Concevoir, coder, tester et intégrer des solutions logicielles.", level: 85 },
  { id: "comp2", name: "Optimiser des applications", description: "Proposer des applications informatiques performantes et optimisées.", level: 75 },
  { id: "comp3", name: "Administrer des systèmes communicants", description: "Installer, configurer et maintenir des infrastructures informatiques.", level: 70 },
  { id: "comp4", name: "Gérer des données de l'information", description: "Concevoir et administrer des bases de données complexes.", level: 80 },
  { id: "comp5", name: "Conduire un projet", description: "Organiser et piloter un projet informatique avec des méthodes agiles.", level: 90 },
  { id: "comp6", name: "Collaborer au sein d'une équipe", description: "Travailler efficacement dans une équipe informatique.", level: 85 }
];
