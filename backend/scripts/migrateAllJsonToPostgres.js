import pg from "pg";
import dotenv from "dotenv";
import defaultProfile from "../data/defaultProfile.json" with { type: "json" };
import defaultProjects from "../data/defaultProjects.json" with { type: "json" };
import { fileURLToPath } from "url";
import path from "path";
import fs from "fs/promises";

dotenv.config();

const { Pool } = pg;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, "../data");

async function runFullMigration() {
  const connectionString = process.env.DATABASE_URL;
  const user = process.env.PGUSER || "postgres";
  const host = process.env.PGHOST || "localhost";
  const database = process.env.PGDATABASE || "portfolio_db";
  const password = process.env.PGPASSWORD || "postgres";
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;

  const hasConfig = Boolean(
    (connectionString && connectionString.trim() !== "") ||
    (host && user && database && password)
  );

  if (!hasConfig) {
    console.error("❌ No PostgreSQL configuration found in .env.");
    console.log("Please check DATABASE_URL in backend/.env");
    process.exit(1);
  }

  const isCloud =
    (connectionString &&
      (connectionString.includes("neon.tech") ||
        connectionString.includes("supabase") ||
        connectionString.includes("render") ||
        connectionString.includes("sslmode=require"))) ||
    process.env.PGSSL === "true";

  const config = connectionString
    ? {
        connectionString,
        ssl: isCloud ? { rejectUnauthorized: false } : false,
      }
    : {
        user,
        host,
        database,
        password,
        port,
        ssl: isCloud ? { rejectUnauthorized: false } : false,
      };

  console.log("=================================================");
  console.log("🔄 Starting Full JSON-to-PostgreSQL Data Migration");
  console.log("=================================================");
  
  const pool = new Pool(config);

  try {
    const testRes = await pool.query("SELECT current_database(), NOW();");
    console.log(`✓ Connected to Database: "${testRes.rows[0].current_database}"`);

    // 1. Create all Tables
    console.log("\n1. Creating database tables...");
    await pool.query(`
      -- Profile Table
      CREATE TABLE IF NOT EXISTS profile (
        id SERIAL PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        title VARCHAR(150) NOT NULL,
        company VARCHAR(150),
        location VARCHAR(150),
        email VARCHAR(255) NOT NULL,
        phone VARCHAR(50),
        whatsapp VARCHAR(255),
        github VARCHAR(255),
        linkedin VARCHAR(255),
        twitter VARCHAR(255),
        summary TEXT,
        education JSONB,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Experience Table
      CREATE TABLE IF NOT EXISTS experience (
        id SERIAL PRIMARY KEY,
        role VARCHAR(150) NOT NULL,
        company VARCHAR(200) NOT NULL,
        period VARCHAR(100) NOT NULL,
        status VARCHAR(50) DEFAULT 'past',
        summary TEXT,
        points TEXT[] DEFAULT '{}',
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Skills Table
      CREATE TABLE IF NOT EXISTS skills (
        id SERIAL PRIMARY KEY,
        category_key VARCHAR(100) NOT NULL UNIQUE,
        category_name VARCHAR(100) NOT NULL,
        items TEXT[] NOT NULL,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Certifications Table
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(150) NOT NULL,
        year VARCHAR(50),
        score VARCHAR(50),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Projects Table
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

      -- Stats Table
      CREATE TABLE IF NOT EXISTS stats (
        key VARCHAR(50) PRIMARY KEY,
        value INTEGER DEFAULT 0,
        last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Contact Inquiries Table
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
    `);
    console.log("✓ All 7 database tables verified.");

    // 2. Migrate Profile
    console.log("\n2. Migrating Profile data...");
    await pool.query("TRUNCATE TABLE profile RESTART IDENTITY CASCADE;");
    await pool.query(
      `INSERT INTO profile (name, title, company, location, email, phone, whatsapp, github, linkedin, twitter, summary, education)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12);`,
      [
        defaultProfile.name,
        defaultProfile.title,
        defaultProfile.company,
        defaultProfile.location,
        defaultProfile.email,
        defaultProfile.phone,
        defaultProfile.whatsapp,
        defaultProfile.github,
        defaultProfile.linkedin,
        defaultProfile.twitter,
        defaultProfile.summary,
        JSON.stringify(defaultProfile.education),
      ]
    );
    console.log("✓ Profile data successfully saved in PostgreSQL.");

    // 3. Migrate Experience
    console.log("\n3. Migrating Experience data...");
    await pool.query("TRUNCATE TABLE experience RESTART IDENTITY CASCADE;");
    for (let i = 0; i < defaultProfile.experience.length; i++) {
      const exp = defaultProfile.experience[i];
      await pool.query(
        `INSERT INTO experience (role, company, period, status, summary, points, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [
          exp.role,
          exp.company,
          exp.period,
          exp.status,
          exp.summary,
          exp.points,
          i,
        ]
      );
    }
    console.log(`✓ ${defaultProfile.experience.length} Experience records saved in PostgreSQL.`);

    // 4. Migrate Skills
    console.log("\n4. Migrating Skills data...");
    await pool.query("TRUNCATE TABLE skills RESTART IDENTITY CASCADE;");
    const skillCategoryNames = {
      programmingLanguages: "Programming Languages",
      frameworksAndLibraries: "Frameworks & Libraries",
      databasesAndORMs: "Databases & ORMs",
      ecommerce: "E-Commerce",
      aiAndML: "AI / Machine Learning",
      toolsAndPlatforms: "Tools & Platforms",
    };

    for (const [key, items] of Object.entries(defaultProfile.skills)) {
      await pool.query(
        `INSERT INTO skills (category_key, category_name, items)
         VALUES ($1, $2, $3);`,
        [key, skillCategoryNames[key] || key, items]
      );
    }
    console.log(`✓ ${Object.keys(defaultProfile.skills).length} Skill categories saved in PostgreSQL.`);

    // 5. Migrate Certifications
    console.log("\n5. Migrating Certifications data...");
    await pool.query("TRUNCATE TABLE certifications RESTART IDENTITY CASCADE;");
    for (const cert of defaultProfile.certifications) {
      await pool.query(
        `INSERT INTO certifications (title, issuer, year, score)
         VALUES ($1, $2, $3, $4);`,
        [cert.title, cert.issuer, cert.year, cert.score || null]
      );
    }
    console.log(`✓ ${defaultProfile.certifications.length} Certifications saved in PostgreSQL.`);

    // 6. Migrate Projects
    console.log("\n6. Migrating Projects data...");
    await pool.query("TRUNCATE TABLE projects RESTART IDENTITY CASCADE;");
    for (const proj of defaultProjects) {
      await pool.query(
        `INSERT INTO projects (title, type, preview, accent, description, points, stack, code, live, featured)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10);`,
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
    console.log(`✓ ${defaultProjects.length} Projects saved in PostgreSQL.`);

    // 7. Migrate Stats & Messages
    console.log("\n7. Migrating Stats & Messages...");
    try {
      const statsRaw = await fs.readFile(path.join(DATA_DIR, "stats.json"), "utf-8");
      const stats = JSON.parse(statsRaw);
      await pool.query(`
        INSERT INTO stats (key, value) VALUES ('visits', $1)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
      `, [stats.visits || 0]);
      await pool.query(`
        INSERT INTO stats (key, value) VALUES ('resumeDownloads', $1)
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;
      `, [stats.resumeDownloads || 0]);
      console.log("✓ Stats counter migrated to PostgreSQL.");
    } catch {
      await pool.query(`
        INSERT INTO stats (key, value) VALUES ('visits', 0) ON CONFLICT (key) DO NOTHING;
        INSERT INTO stats (key, value) VALUES ('resumeDownloads', 0) ON CONFLICT (key) DO NOTHING;
      `);
    }

    console.log("\n=================================================");
    console.log("🎉 ALL JSON DATA SUCCESSFULLY SAVED TO POSTGRESQL!");
    console.log("=================================================\n");
  } catch (error) {
    console.error("\n❌ Migration failed:", error.message);
    if (error.code === "ECONNREFUSED") {
      console.log("\n💡 Tip: Your PostgreSQL server is not running on localhost:5432.");
      console.log("   Start PostgreSQL service or provide a free cloud PostgreSQL URL (Neon/Supabase) in backend/.env");
    }
  } finally {
    await pool.end();
  }
}

runFullMigration();

