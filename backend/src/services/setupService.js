import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { query } from '../db/index.js';
import { seedDatabase } from '../db/seed.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export async function initializeDatabase() {
  const schemaPath = path.join(__dirname, '../db/schema.sql');
  const schema = await fs.readFile(schemaPath, 'utf-8');
  await query(schema);
  await seedDatabase();
}
