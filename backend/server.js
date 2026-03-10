const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');
const path = require('path');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const multer = require('multer');
require('dotenv').config();
const { seedDatabase } = require('./seed');
const rateLimit = require('express-rate-limit');

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000,
  max: 5,
  message: { error: "Trop de tentatives. Veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});

const app = express();
const PORT = process.env.PORT || 3001;
const SECRET_KEY = process.env.JWT_SECRET || 'fallback_secret_for_dev_only';

// ==========================================
// CONFIGURATION ET MIDDLEWARES GLOBAUX
// ==========================================

app.use(cors());
app.use(express.json());
app.use('/images', express.static(path.join(__dirname, 'public/images')));

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
  db.all("SELECT * FROM formations", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsedRows = rows.map(r => ({
      ...r,
      hardSkills: JSON.parse(r.hardSkills || '[]'),
      softSkills: JSON.parse(r.softSkills || '[]'),
      competencesIds: JSON.parse(r.competencesIds || '[]')
    }));
    res.json(parsedRows);
  });
});

app.get('/api/professional_experiences', (req, res) => {
  db.all("SELECT * FROM professional_experiences", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    const parsedRows = rows.map(r => ({
      ...r,
      missions: JSON.parse(r.missions || '[]'),
      hardSkills: JSON.parse(r.hardSkills || '[]'),
      softSkills: JSON.parse(r.softSkills || '[]'),
      competencesIds: JSON.parse(r.competencesIds || '[]')
    }));
    res.json(parsedRows);
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

app.post('/api/upload', authenticateToken, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).json({ error: 'Aucun fichier uploadé' });
  const imageUrl = `/images/uploads/${req.file.filename}`;
  res.json({ url: imageUrl });
});

app.post('/api/projects', authenticateToken, (req, res) => {
  const p = req.body;
  const sql = `INSERT INTO projects (title, description, longDescription, techStack, imageUrl, github, link, category, status, skillsIds, competencesIds, images, startDate)
               VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  const params = [
    p.title, p.description, p.longDescription,
    JSON.stringify(p.techStack || []), p.imageUrl, p.github, p.link,
    p.category, p.status,
    JSON.stringify(p.skillsIds || []), JSON.stringify(p.competencesIds || []),
    JSON.stringify(p.images || []),
    p.startDate
  ];
  db.run(sql, params, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: this.lastID, ...p });
  });
});

app.put('/api/projects/:id', authenticateToken, (req, res) => {
  const p = req.body;
  const sql = `UPDATE projects SET title=?, description=?, longDescription=?, techStack=?, imageUrl=?, github=?, link=?, category=?, status=?, skillsIds=?, competencesIds=?, images=?, startDate=? WHERE id=?`;
  const params = [
    p.title, p.description, p.longDescription,
    JSON.stringify(p.techStack || []), p.imageUrl, p.github, p.link,
    p.category, p.status,
    JSON.stringify(p.skillsIds || []), JSON.stringify(p.competencesIds || []),
    JSON.stringify(p.images || []),
    p.startDate,
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

app.post('/api/formations', authenticateToken, (req, res) => {
  const f = req.body;
  const sql = `INSERT INTO formations (id, title, institution, period, description, longDescription, imageUrl, type, hardSkills, softSkills, competencesIds, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [f.id, f.title, f.institution, f.period, f.description, f.longDescription, f.imageUrl, f.type, JSON.stringify(f.hardSkills || []), JSON.stringify(f.softSkills || []), JSON.stringify(f.competencesIds || []), f.startDate], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: f.id });
  });
});

app.put('/api/formations/:id', authenticateToken, (req, res) => {
  const f = req.body;
  const sql = `UPDATE formations SET title=?, institution=?, period=?, description=?, longDescription=?, imageUrl=?, type=?, hardSkills=?, softSkills=?, competencesIds=?, startDate=? WHERE id=?`;
  db.run(sql, [f.title, f.institution, f.period, f.description, f.longDescription, f.imageUrl, f.type, JSON.stringify(f.hardSkills || []), JSON.stringify(f.softSkills || []), JSON.stringify(f.competencesIds || []), f.startDate, req.params.id], function(err) {
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

app.post('/api/professional_experiences', authenticateToken, (req, res) => {
  const e = req.body;
  const sql = `INSERT INTO professional_experiences (id, title, company, period, description, longDescription, missions, hardSkills, softSkills, imageUrl, type, competencesIds, startDate) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
  db.run(sql, [e.id, e.title, e.company, e.period, e.description, e.longDescription, JSON.stringify(e.missions || []), JSON.stringify(e.hardSkills || []), JSON.stringify(e.softSkills || []), e.imageUrl, e.type, JSON.stringify(e.competencesIds || []), e.startDate], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ id: e.id });
  });
});

app.put('/api/professional_experiences/:id', authenticateToken, (req, res) => {
  const e = req.body;
  const sql = `UPDATE professional_experiences SET title=?, company=?, period=?, description=?, longDescription=?, missions=?, hardSkills=?, softSkills=?, imageUrl=?, type=?, competencesIds=?, startDate=? WHERE id=?`;
  db.run(sql, [e.title, e.company, e.period, e.description, e.longDescription, JSON.stringify(e.missions || []), JSON.stringify(e.hardSkills || []), JSON.stringify(e.softSkills || []), e.imageUrl, e.type, JSON.stringify(e.competencesIds || []), e.startDate, req.params.id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

app.delete('/api/professional_experiences/:id', authenticateToken, (req, res) => {
  db.run('DELETE FROM professional_experiences WHERE id = ?', [req.params.id], (err) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

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

app.post('/api/contact', contactLimiter, async (req, res) => {
  const { name, email, subject, message, _honeypot } = req.body;

  if (_honeypot) {
    console.warn("Tentative de bot détectée (Honeypot rempli)");
    return res.status(403).json({ error: "Bot detected." });
  }

  if (!name || !email || !subject || !message) {
    return res.status(400).json({ error: "Tous les champs sont obligatoires." });
  }

  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({ error: "Format d'email invalide." });
  }

  if (message.length < 10) {
    return res.status(400).json({ error: "Le message est trop court." });
  }

  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) {
    console.error("DISCORD_WEBHOOK_URL non configuré");
    return res.status(500).json({ error: "Service indisponible." });
  }

  const discordPayload = {
    embeds: [{
      title: `🚨 Message Portfolio de ${name}`,
      description: `**Sujet :** ${subject}`,
      color: 0x00ffcc,
      fields: [
        { name: "📧 Email", value: `\`${email}\``, inline: true },
        { name: "✉️ Message", value: message }
      ],
      timestamp: new Date().toISOString()
    }]
  };

  try {
    const response = await fetch(webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(discordPayload)
    });

    if (response.ok) res.json({ success: true });
    else throw new Error("Discord API Response Error");
  } catch (error) {
    res.status(500).json({ error: "Échec de l'envoi." });
  }
});

// ==========================================
// DÉMARRAGE DU SERVEUR
// ==========================================

app.listen(PORT, () => {
  console.log(`🚀 Moteur API démarré sur http://localhost:${PORT}`);
});