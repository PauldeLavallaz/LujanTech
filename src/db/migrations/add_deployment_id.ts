import { sql } from "drizzle-orm";
import { sqliteTable, text } from "drizzle-orm/sqlite-core";

export async function up(db: any) {
  await db.run(sql`
    ALTER TABLE runs 
    ADD COLUMN deployment_id TEXT;
  `);
}

export async function down(db: any) {
  // No podemos eliminar columnas en SQLite
  // Tendríamos que recrear la tabla sin la columna
} 