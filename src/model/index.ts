import "dotenv/config";
import path from "node:path";
import { drizzle } from "drizzle-orm/node-sqlite";
import { migrate } from "drizzle-orm/node-sqlite/migrator";
import { DatabaseSync } from "node:sqlite";
import { config } from "../config.js";

const sqlite = new DatabaseSync(config.DB_FILE_NAME);
// enable foreign key support, WAL mode, and busy timeout in sqlite
sqlite.exec("PRAGMA foreign_keys = ON;");
sqlite.exec("PRAGMA journal_mode = WAL;");
sqlite.exec("PRAGMA busy_timeout = 5000;");

export const db = drizzle({ client: sqlite });

// auto-apply migrations on startup so the database tables exist immediately
try {
  const migrationsFolder = path.resolve(process.cwd(), "src/model/migrations");
  migrate(db, { migrationsFolder });
} catch {
  // migrations are already applied or handled externally
}
