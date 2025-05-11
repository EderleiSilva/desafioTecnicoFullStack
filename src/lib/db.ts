import Database from "better-sqlite3";

const dbPath = '../database/mydatabase.db';
const db = new Database(dbPath);
db.pragma('journal_mode = WAL');

db.exec(`
  CREATE TABLE IF NOT EXISTS user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL,
    cep TEXT,
    state TEXT,
    city TEXT,
    created_in DATETIME DEFAULT CURRENT_TIMESTAMP
  )
`);

export default db;