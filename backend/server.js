const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const { seedDatabase } = require('./seed');

const app = express();
const PORT = 3001;
const SECRET_KEY = 'ton_secret_hyper_securise_a_changer';

app.use(cors());
app.use(express.json());

// 1. Connexion à SQLite
const dbPath = path.resolve(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) console.error('Erreur SQLite:', err.message);
  else console.log('Système connecté à SQLite.');
});

// Check if database needs seeding
db.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='skills'", (err, row) => {
  if (err || !row || row.count === 0) {
    seedDatabase(db).catch(console.error);
  } else {
    db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
      if (row.count === 0) {
        seedDatabase(db).catch(console.error);
      }
    });
  }
});

// (On ne refait pas les CREATE TABLE ici, on part du principe que ton seed.js a tout fait proprement)
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
  db.get("SELECT * FROM admin", (err, row) => {
    if (!row) {
      const hash = bcrypt.hashSync("admin123", 10);
      db.run("INSERT INTO admin (username, password) VALUES ('tom', ?)", [hash]);
    }
  });
});

// ==========================================
// MIDDLEWARE DE SÉCURITÉ
// ==========================================
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  if (!token) return res.status(401).json({ error: 'Accès refusé.' });

  jwt.verify(token, SECRET_KEY, (err, user) => {
    if (err) return res.status(403).json({ error: 'Token invalide.' });
    req.user = user;
    next();
  });
};

// ==========================================
// ROUTES AUTHENTIFICATION
// ==========================================
app.post('/api/auth/login', (req, res) => {
  const { username, password } = req.body;
  db.get("SELECT * FROM admin WHERE username = ?", [username], (err, user) => {
    if (err || !user) return res.status(400).json({ error: 'Identifiants incorrects' });
    if (bcrypt.compareSync(password, user.password)) {
      const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '2h' });
      res.json({ token });
    } else {
      res.status(400).json({ error: 'Identifiants incorrects' });
    }
  });
});

// ==========================================
// ROUTES LECTURE (PUBLIQUES)
// ==========================================

app.get('/api/projects', (req, res) => {
  db.all('SELECT * FROM projects', [], (err, rows) => {
    if (err) return res.status(500).json([]);
    const formatted = rows.map(r => ({
      ...r,
      // Ton seed enregistre techStack, skillsIds et competencesIds en JSON stringifié
      techStack: r.techStack ? JSON.parse(r.techStack) : [],
      skillsIds: r.skillsIds ? JSON.parse(r.skillsIds) : [],
      competencesIds: r.competencesIds ? JSON.parse(r.competencesIds) : []
    }));
    res.json(formatted);
  });
});

app.get('/api/formations', (req, res) => {
  db.all('SELECT * FROM formations', [], (err, rows) => {
    if (err) return res.status(500).json([]);
    const formatted = rows.map(r => ({
      ...r,
      hardSkills: r.hardSkills ? JSON.parse(r.hardSkills) : [],
      softSkills: r.softSkills ? JSON.parse(r.softSkills) : []
    }));
    res.json(formatted);
  });
});

app.get('/api/professional-experiences', (req, res) => {
  db.all('SELECT * FROM professional_experiences', [], (err, rows) => {
    if (err) return res.status(500).json([]);
    const formatted = rows.map(r => ({
      ...r,
      missions: r.missions ? JSON.parse(r.missions) : []
    }));
    res.json(formatted);
  });
});

app.get('/api/experiences', (req, res) => {
  // On récupère simplement toutes les expériences professionnelles pour cette route globale
  db.all('SELECT * FROM professional_experiences', [], (err, rows) => {
    if (err) return res.status(500).json([]);
    const formatted = rows.map(r => ({
      ...r,
      missions: r.missions ? JSON.parse(r.missions) : []
    }));
    res.json(formatted);
  });
});

app.get('/api/passions', (req, res) => {
  db.all('SELECT * FROM passions', [], (err, rows) => {
    res.json(rows || []);
  });
});

// Attention : Dans ton seed.js, la table s'appelle `iut_competences` !
app.get('/api/iut-competences', (req, res) => {
  db.all('SELECT * FROM iut_competences', [], (err, rows) => {
    res.json(rows || []);
  });
});

app.get('/api/skills', (req, res) => {
  db.all('SELECT * FROM skills', [], (err, rows) => {
    res.json(rows || []);
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Moteur API démarré sur http://localhost:${PORT}`);
});