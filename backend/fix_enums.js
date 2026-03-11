const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./portfolio.db');

db.serialize(() => {
  db.run("UPDATE formations SET type='EDUCATION' WHERE type='education'");
  db.run("UPDATE professional_experiences SET type='INTERNSHIP' WHERE type='stage'");
  db.run("UPDATE professional_experiences SET type='APPRENTICESHIP' WHERE type='alternance'");
  db.run("UPDATE projects SET status='ARCHIVED' WHERE status='Archivé'");
  db.run("UPDATE projects SET status='DEPLOYED' WHERE status='Déployé'");
  db.run("UPDATE projects SET category=UPPER(category) WHERE category NOT IN ('WEB','MOBILE','SOFTWARE','DESKTOP','SYSTEM','DATA','NETWORK')");

  db.get('SELECT id, type FROM formations LIMIT 1', (err, row) => {
    console.log('Formation type check:', JSON.stringify(row));
  });
  db.get('SELECT id, status, category FROM projects LIMIT 1', (err, row) => {
    console.log('Project check:', JSON.stringify(row));
    db.close();
  });
});
