require('dotenv').config();

const sqlite3 = require('sqlite3').verbose();
const path = require('path');

const dbPath = process.env.DB_PATH || path.resolve(__dirname, 'portfolio.db');
const db = new sqlite3.Database(dbPath);

const tables = [
  'skills',
  'soft_skills',
  'iut_competences',
  'projects',
  'formations',
  'professional_experiences',
  'passions'
];

db.serialize(() => {
  tables.forEach(table => {
    db.run(`DROP TABLE IF EXISTS ${table}`, (err) => {
      if (err) console.error(`Error dropping table ${table}:`, err.message);
      else console.log(`Dropped table ${table}`);
    });
  });
});

db.close();
