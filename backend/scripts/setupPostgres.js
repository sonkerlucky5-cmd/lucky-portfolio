import pg from "pg";
import dotenv from "dotenv";
import defaultProjects from "../data/defaultProjects.json" with { type: "json" };

dotenv.config();

const { Pool } = pg;

async function setupDatabase() {
  const connectionString = process.env.DATABASE_URL;
  const user = process.env.PGUSER || "postgres";
  const host = process.env.PGHOST || "localhost";
  const database = process.env.PGDATABASE || "portfolio_db";
  const password = process.env.PGPASSWORD || "";
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;

  const hasConfig = Boolean(
    (connectionString && connectionString.trim() !== "") ||
    (host && user && database && password && password.trim() !== "")
  );

  if (!hasConfig) {
    console.log("=================================================");
    console.log("ℹ️  PostgreSQL Configuration Required:");
    console.log("Please set your PostgreSQL connection in backend/.env:");
    console.log("Example Local:");
    console.log("DATABASE_URL=postgresql://postgres:your_password@localhost:5432/portfolio_db");
    console.log("Example Cloud (Neon / Supabase):");
    console.log("DATABASE_URL=postgresql://user:pass@ep-host.us-east-2.aws.neon.tech/neondb?sslmode=require");
    console.log("=================================================");
    return;
  }

  const config = connectionString
    ? {
        connectionString,
        ssl:
          connectionString.includes("neon.tech") ||
          connectionString.includes("supabase") ||
          connectionString.includes("sslmode=require")
            ? { rejectUnauthorized: false }
            : false,
      }
    : {
        user,
        host,
        database,
        password,
        port,
      };

  console.log("Connecting to PostgreSQL...");
  const pool = new Pool(config);

  try {
    const res = await pool.query("SELECT current_database(), NOW();");
    console.log(`Connected to database "${res.rows[0].current_database}" at ${res.rows[0].now}`);

    console.log("Creating tables...");
    await pool.query(`
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
    `);
    console.log("✓ Tables created successfully.");

    // Check projects count
    const count = await pool.query("SELECT COUNT(*) FROM projects;");
    if (parseInt(count.rows[0].count, 10) === 0) {
      console.log("Seeding default projects...");
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
      console.log(`✓ Seeded ${defaultProjects.length} projects.`);
    } else {
      console.log(`✓ Projects table already has ${count.rows[0].count} records.`);
    }

    // Initialize stats
    await pool.query(`
      INSERT INTO stats (key, value) VALUES ('visits', 0) ON CONFLICT (key) DO NOTHING;
      INSERT INTO stats (key, value) VALUES ('resumeDownloads', 0) ON CONFLICT (key) DO NOTHING;
    `);
    console.log("✓ Stats initialized.");

    console.log("\nPostgreSQL Setup Complete!");
  } catch (error) {
    console.error("PostgreSQL setup error:", error.message);
  } finally {
    await pool.end();
  }
}

setupDatabase();

