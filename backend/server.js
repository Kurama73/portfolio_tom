const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
require('dotenv').config();
const { seedDatabase } = require('./seed');

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

// ==========================================
// CONFIGURATION ET MIDDLEWARES GLOBAUX
// ==========================================

app.use(cors());
app.use(express.json());
// Servir les fichiers statiques (images)
app.use('/images', express.static(path.join(__dirname, 'public/images')));

// Configuration Multer pour les images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, 'public/images/uploads'));
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    cb(null, uniqueSuffix + path.extname(file.originalname));
  }
});
const upload = multer({ storage });

// ==========================================
// CONNEXION À SQLITE ET INITIALISATION
// ==========================================

const dbPath = path.resolve(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error('Erreur SQLite:', err.message);
  } else {
    console.log('Système connecté à SQLite.');

    // Initialisation de la base de données (Seeding si nécessaire)
    db.get("SELECT COUNT(*) as count FROM sqlite_master WHERE type='table' AND name='skills'", (err, row) => {
      if (err || !row || row.count === 0) {
        seedDatabase(db).catch(console.error);
      } else {
        db.get("SELECT COUNT(*) as count FROM skills", (err, row) => {
          if (row && row.count === 0) {
            seedDatabase(db).catch(console.error);
          }
        });
      }
    });

    // Création de la table admin et utilisateur par défaut
    db.serialize(() => {
      db.run(`CREATE TABLE IF NOT EXISTS admin (id INTEGER PRIMARY KEY, username TEXT, password TEXT)`);
      db.get("SELECT * FROM admin", (err, row) => {
        if (!row) {
          const adminPass = process.env.ADMIN_PASSWORD || "admin123";
          const hash = bcrypt.hashSync(adminPass, 10);
          db.run("INSERT INTO admin (username, password) VALUES ('tom', ?)", [hash]);
        }
      });
    });
  }
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
      const token = jwt.sign({ username: user.username }, SECRET_KEY, { expiresIn: '24h' });
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
      techStack: r.techStack ? JSON.parse(r.techStack) : [],
      skillsIds: r.skillsIds ? JSON.parse(r.skillsIds) : [],
      competencesIds: r.competencesIds ? JSON.parse(r.competencesIds) : [],
      images: r.images ? JSON.parse(r.images) : []
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
      missions: r.missions ? JSON.parse(r.missions) : [],
      hardSkills: r.hardSkills ? JSON.parse(r.hardSkills) : [],
      softSkills: r.softSkills ? JSON.parse(r.softSkills) : []
    }));
    res.json(formatted);
  });
});

app.get('/api/experiences', (req, res) => {
  db.all('SELECT * FROM professional_experiences', [], (err, rows) => {
    if (err) return res.status(500).json([]);
    const formatted = rows.map(r => ({
      ...r,
      missions: r.missions ? JSON.parse(r.missions) : [],
      hardSkills: r.hardSkills ? JSON.parse(r.hardSkills) : [],
      softSkills: r.softSkills ? JSON.parse(r.softSkills) : []
    }));
    res.json(formatted);
  });
});

app.get('/api/passions', (req, res) => {
  db.all('SELECT * FROM passions', [], (err, rows) => {
    res.json(rows || []);
  });
});

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

app.get('/api/soft-skills', (req, res) => {
  db.all('SELECT * FROM soft_skills', [], (err, rows) => {
    res.json(rows || []);
  });
});

// ==========================================
// ROUTES ÉCRITURE (SÉCURISÉES)
// ==========================================

// --- UPLOAD D'IMAGE ---
app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier uploadé' });
  const imageUrl = `/images/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

// --- PROJETS ---
app.post('/api/projects', authenticateToken, (req, res) => {
  const p = req.body;
  const sql = `INSERT INTO projects (title, description, longDescription, techStack, imageUrl, github, link, category, status, skillsIds, competencesIds, images)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    p.title, p.description, p.longDescription,
    JSON.stringify(p.techStack || []), p.imageUrl, p.github, p.link,
    p.category, p.status,
    JSON.stringify(p.skillsIds || []), JSON.stringify(p.competencesIds || []),
    JSON.stringify(p.images || [])
  ];
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...p });
  });
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const p = req.body;
  const sql = `UPDATE projects SET title=?, description=?, longDescription=?, techStack=?, imageUrl=?, github=?, link=?, category=?, status=?, skillsIds=?, competencesIds=?, images=? WHERE id=?`;
  const params = [
    p.title, p.description, p.longDescription,
    JSON.stringify(p.techStack || []), p.imageUrl, p.github, p.link,
    p.category, p.status,
    JSON.stringify(p.skillsIds || []), JSON.stringify(p.competencesIds || []),
    JSON.stringify(p.images || []),
    req.params.id
  ];
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/projects/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM projects WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- FORMATIONS ---
app.post('/api/formations', authenticateToken, (req, res) => {
  const f = req.body;
  const sql = `INSERT INTO formations (title, institution, period, description, longDescription, imageUrl, type, hardSkills, softSkills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [f.title, f.institution, f.period, f.description, f.longDescription, f.imageUrl, f.type, JSON.stringify(f.hardSkills || []), JSON.stringify(f.softSkills || [])];
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...f });
  });
});

app.put('/api/formations/:id', authenticateToken, (req, res) => {
  const f = req.body;
  const sql = `UPDATE formations SET title=?, institution=?, period=?, description=?, longDescription=?, imageUrl=?, type=?, hardSkills=?, softSkills=? WHERE id=?`;
  const params = [f.title, f.institution, f.period, f.description, f.longDescription, f.imageUrl, f.type, JSON.stringify(f.hardSkills || []), JSON.stringify(f.softSkills || []), req.params.id];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/formations/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM formations WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- EXPERIENCES PRO ---
app.post('/api/professional-experiences', authenticateToken, (req, res) => {
  const e = req.body;
  const sql = `INSERT INTO professional_experiences (title, company, period, description, longDescription, imageUrl, type, missions, hardSkills, softSkills) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    e.title, e.company, e.period, e.description, e.longDescription, e.imageUrl, e.type,
    JSON.stringify(e.missions || []), JSON.stringify(e.hardSkills || []), JSON.stringify(e.softSkills || [])
  ];
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...e });
  });
});

app.put('/api/professional-experiences/:id', authenticateToken, (req, res) => {
  const e = req.body;
  const sql = `UPDATE professional_experiences SET title=?, company=?, period=?, description=?, longDescription=?, imageUrl=?, type=?, missions=?, hardSkills=?, softSkills=? WHERE id=?`;
  const params = [
    e.title, e.company, e.period, e.description, e.longDescription, e.imageUrl, e.type,
    JSON.stringify(e.missions || []), JSON.stringify(e.hardSkills || []), JSON.stringify(e.softSkills || []),
    req.params.id
  ];
  db.run(sql, params, (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/professional-experiences/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM professional_experiences WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- COMPETENCES IUT ---
app.post('/api/iut-competences', authenticateToken, (req, res) => {
  const c = req.body;
  db.run('INSERT INTO iut_competences (id, name, description, level) VALUES (?, ?, ?, ?)', [c.id, c.name, c.description, c.level], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(c);
  });
});

app.put('/api/iut-competences/:id', authenticateToken, (req, res) => {
  const c = req.body;
  db.run('UPDATE iut_competences SET name=?, description=?, level=? WHERE id=?', [c.name, c.description, c.level, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/iut-competences/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM iut_competences WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- SKILLS ---
app.post('/api/skills', authenticateToken, (req, res) => {
  const s = req.body;
  db.run('INSERT INTO skills (id, name, mastery, category, icon) VALUES (?, ?, ?, ?, ?)', [s.id, s.name, s.mastery, s.category, s.icon], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(s);
  });
});

app.put('/api/skills/:id', authenticateToken, (req, res) => {
  const s = req.body;
  db.run('UPDATE skills SET name=?, mastery=?, category=?, icon=? WHERE id=?', [s.name, s.mastery, s.category, s.icon, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/skills/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM skills WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- SOFT SKILLS ---
app.post('/api/soft-skills', authenticateToken, (req, res) => {
  const s = req.body;
  db.run('INSERT INTO soft_skills (id, name) VALUES (?, ?)', [s.id, s.name], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(s);
  });
});

app.put('/api/soft-skills/:id', authenticateToken, (req, res) => {
  const s = req.body;
  db.run('UPDATE soft_skills SET name=? WHERE id=?', [s.name, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/soft-skills/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM soft_skills WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// --- PASSIONS ---
app.post('/api/passions', authenticateToken, (req, res) => {
  const p = req.body;
  db.run('INSERT INTO passions (id, name, description, imageUrl) VALUES (?, ?, ?, ?)', [p.id, p.name, p.description, p.imageUrl], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(p);
  });
});

app.put('/api/passions/:id', authenticateToken, (req, res) => {
  const p = req.body;
  db.run('UPDATE passions SET name=?, description=?, imageUrl=? WHERE id=?', [p.name, p.description, p.imageUrl, req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/passions/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM passions WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================

app.listen(PORT, () => {
  console.log(`🚀 Moteur API démarré sur http://localhost:${PORT}`);
});