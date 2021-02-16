const sqlite3 = require('sqlite3').verbose();
const fs = require('fs')
const path = require('path')

const dbFilePath = path.join(__dirname, '../fp-ts.docset/Contents/Resources/docSet.dsidx')
try {
  fs.unlinkSync(dbFilePath)
} catch {}
const db = new sqlite3.Database(dbFilePath);

const moduleDir = path.join(__dirname, '../docs/modules')
const filenames = fs.readdirSync(moduleDir).map(filename => path.basename(filename, '.md'))

db.serialize(() => {
  db.run("CREATE TABLE searchIndex(id INTEGER PRIMARY KEY, name TEXT, type TEXT, path TEXT)");
  db.run("CREATE UNIQUE INDEX anchor ON searchIndex (name, type, path);");

  const stmt = db.prepare("INSERT OR IGNORE INTO searchIndex(name, type, path) VALUES (?, ?, ?)");
  filenames.forEach(filename => {
    stmt.run(filename, 'Module', `${filename}.html`);
  })
  stmt.finalize();
});

db.close();