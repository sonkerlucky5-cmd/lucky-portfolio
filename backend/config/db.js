import pg from "pg";
import defaultProjects from "../data/defaultProjects.json" with { type: "json" };

const { Pool } = pg;

let pool = null;
let isConnected = false;

export const getPool = () => pool;
export const isDbConnected = () => isConnected;

// Execute SQL query helper
export const query = async (text, params) => {
  if (!pool || !isConnected) {
    throw new Error("PostgreSQL is not connected");
  }
  return pool.query(text, params);
};

// Initialize PostgreSQL tables
const initTables = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS contact_messages (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      email VARCHAR(255) NOT NULL,
      subject VARCHAR(200) DEFAULT 'Portfolio Inquiry',
      message TEXT NOT NULL,
      status VARCHAR(20) DEFAULT 'unread',
      ip_address VARCHAR(100) DEFAULT '',
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS projects (
      id SERIAL PRIMARY KEY,
      title VARCHAR(200) NOT NULL,
      type VARCHAR(100) NOT NULL,
      preview VARCHAR(100) DEFAULT 'project-preview',
      accent VARCHAR(50) DEFAULT '#da5f36',
      description TEXT NOT NULL,
      points TEXT[] DEFAULT '{}',
      stack TEXT[] DEFAULT '{}',
      code TEXT DEFAULT '',
      live TEXT DEFAULT '',
      featured BOOLEAN DEFAULT true,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stats (
      key VARCHAR(50) PRIMARY KEY,
      value INTEGER DEFAULT 0,
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );
  `;

  await pool.query(createTablesQuery);

  // Seed default projects if table is empty
  const countResult = await pool.query("SELECT COUNT(*) FROM projects;");
  if (parseInt(countResult.rows[0].count, 10) === 0) {
    console.log("[PostgreSQL] Seeding initial projects into database...");
    for (const proj of defaultProjects) {
      await pool.query(
        `INSERT INTO projects (title, type, preview, accent, description, points, stack, code, live, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          proj.title,
          proj.type,
          proj.preview,
          proj.accent,
          proj.description,
          proj.points,
          proj.stack,
          proj.code,
          proj.live,
          proj.featured ?? true,
        ]
      );
    }
  }

  // Seed initial stats if not existing
  await pool.query(`
    INSERT INTO stats (key, value) VALUES ('visits', 0) ON CONFLICT (key) DO NOTHING;
    INSERT INTO stats (key, value) VALUES ('resumeDownloads', 0) ON CONFLICT (key) DO NOTHING;
  `);

  console.log("[PostgreSQL] Tables verified and ready (contact_messages, projects, stats).");
};

export const connectDB = async () => {
  const connectionString = process.env.DATABASE_URL;
  const user = process.env.PGUSER;
  const host = process.env.PGHOST;
  const database = process.env.PGDATABASE;
  const password = process.env.PGPASSWORD;
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;

  // Determine if database configuration exists
  const hasConfig = connectionString || (host && user && database);

  if (!hasConfig) {
    console.log("[PostgreSQL] No DATABASE_URL or PG* credentials specified in .env.");
    console.log("[PostgreSQL] Running with local JSON store fallback (data/messages.json).");
    return false;
  }

  try {
    const isCloudDb =
      (connectionString && (connectionString.includes("neon.tech") || connectionString.includes("supabase") || connectionString.includes("render") || connectionString.includes("sslmode=require"))) ||
      process.env.PGSSL === "true";

    const config = connectionString
      ? {
          connectionString,
          ssl: isCloudDb ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 5000,
        }
      : {
          user,
          host,
          database,
          password,
          port,
          ssl: isCloudDb ? { rejectUnauthorized: false } : false,
          connectionTimeoutMillis: 5000,
        };

    pool = new Pool(config);

    // Test connection
    const res = await pool.query("SELECT NOW() as current_time;");
    isConnected = true;
    console.log(`[PostgreSQL] Connected successfully to database at ${res.rows[0].current_time}`);

    // Auto-create tables
    await initTables();
    return true;
  } catch (error) {
    console.warn(`[PostgreSQL] Connection failed: ${error.message}`);
    console.log("[PostgreSQL] Using local JSON storage fallback so the server runs without interruption.");
    isConnected = false;
    return false;
  }
};
