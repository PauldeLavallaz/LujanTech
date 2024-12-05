import { drizzle } from "drizzle-orm/libsql";
import { createClient } from "@libsql/client";
import * as schema from "./schema";

const client = createClient({
  url: process.env.DATABASE_URL!,
  authToken: process.env.DATABASE_AUTH_TOKEN!,
});

const db = drizzle(client, { schema });

async function main() {
  console.log(" Starting database migration...");

  try {
    // Recrear la tabla
    await client.execute(`
      DROP TABLE IF EXISTS runs;
      CREATE TABLE runs (
        run_id TEXT PRIMARY KEY NOT NULL,
        user_id TEXT NOT NULL,
        created_at INTEGER DEFAULT (strftime('%s', 'now')),
        image_url TEXT,
        inputs TEXT,
        live_status TEXT,
        progress REAL,
        deployment_id TEXT
      );
    `);

    console.log("✅ Migration completed successfully!");
  } catch (error) {
    console.error("❌ Migration failed:", error);
    process.exit(1);
  }

  process.exit(0);
}

main();
