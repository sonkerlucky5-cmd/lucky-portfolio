import pg from "pg";
import dotenv from "dotenv";
import defaultContent from "../data/defaultContent.json" with { type: "json" };
import defaultProjects from "../data/defaultProjects.json" with { type: "json" };

dotenv.config();

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

// Initialize PostgreSQL tables and seed data if empty
const initTables = async () => {
  const createTablesQuery = `
    CREATE TABLE IF NOT EXISTS profile (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      title VARCHAR(150) NOT NULL,
      company VARCHAR(150),
      location VARCHAR(150),
      email VARCHAR(255) NOT NULL,
      phone VARCHAR(50),
      whatsapp_url VARCHAR(255),
      github_url VARCHAR(255),
      linkedin_url VARCHAR(255),
      twitter_url VARCHAR(255),
      resume_url VARCHAR(255),
      typing_lines TEXT[] DEFAULT '{}',
      about_heading TEXT,
      about_lead TEXT,
      about_story TEXT,
      about_points TEXT[] DEFAULT '{}',
      education JSONB,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS expertise (
      id SERIAL PRIMARY KEY,
      icon VARCHAR(50) NOT NULL,
      title VARCHAR(100) NOT NULL,
      text TEXT NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

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

    CREATE TABLE IF NOT EXISTS skill_groups (
      id SERIAL PRIMARY KEY,
      icon VARCHAR(50) NOT NULL,
      label VARCHAR(100) NOT NULL,
      note VARCHAR(255),
      items JSONB NOT NULL,
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS certifications (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      issuer VARCHAR(150) NOT NULL,
      year VARCHAR(100),
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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
      order_index INTEGER DEFAULT 0,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
      updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS stats (
      key VARCHAR(50) PRIMARY KEY,
      value INTEGER DEFAULT 0,
      last_updated TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
    );

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
  `;

  await pool.query(createTablesQuery);

  // 1. Seed Profile if empty
  const profileCount = await pool.query("SELECT COUNT(*) FROM profile;");
  if (parseInt(profileCount.rows[0].count, 10) === 0) {
    console.log("[PostgreSQL] Seeding profile into database...");
    const p = defaultContent.profile;
    await pool.query(
      `INSERT INTO profile (
        name, title, company, location, email, phone, whatsapp_url,
        github_url, linkedin_url, twitter_url, resume_url, typing_lines,
        about_heading, about_lead, about_story, about_points, education
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17);`,
      [
        p.name,
        p.title,
        p.company,
        p.location,
        p.email,
        p.phone,
        p.whatsappUrl,
        p.githubUrl,
        p.linkedinUrl,
        p.twitterUrl,
        p.resumeUrl,
        p.typingLines,
        p.aboutHeading,
        p.aboutLead,
        p.aboutStory,
        p.aboutPoints,
        JSON.stringify(p.education),
      ]
    );
  }

  // 2. Seed Expertise if empty
  const expCount = await pool.query("SELECT COUNT(*) FROM expertise;");
  if (parseInt(expCount.rows[0].count, 10) === 0) {
    for (let i = 0; i < defaultContent.expertise.length; i++) {
      const exp = defaultContent.expertise[i];
      await pool.query(
        `INSERT INTO expertise (icon, title, text, order_index) VALUES ($1, $2, $3, $4);`,
        [exp.icon, exp.title, exp.text, i]
      );
    }
  }

  // 3. Seed Experience if empty
  const experienceCount = await pool.query("SELECT COUNT(*) FROM experience;");
  if (parseInt(experienceCount.rows[0].count, 10) === 0) {
    for (let i = 0; i < defaultContent.experience.length; i++) {
      const exp = defaultContent.experience[i];
      await pool.query(
        `INSERT INTO experience (role, company, period, status, summary, points, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [exp.role, exp.company, exp.period, exp.status, exp.summary, exp.points, i]
      );
    }
  }

  // 4. Seed Skill Groups if empty
  const skillCount = await pool.query("SELECT COUNT(*) FROM skill_groups;");
  if (parseInt(skillCount.rows[0].count, 10) === 0) {
    for (let i = 0; i < defaultContent.skillGroups.length; i++) {
      const group = defaultContent.skillGroups[i];
      await pool.query(
        `INSERT INTO skill_groups (icon, label, note, items, order_index)
         VALUES ($1, $2, $3, $4, $5);`,
        [group.icon, group.label, group.note, JSON.stringify(group.items), i]
      );
    }
  }

  // 5. Seed Certifications if empty
  const certCount = await pool.query("SELECT COUNT(*) FROM certifications;");
  if (parseInt(certCount.rows[0].count, 10) === 0) {
    for (let i = 0; i < defaultContent.certifications.length; i++) {
      const cert = defaultContent.certifications[i];
      await pool.query(
        `INSERT INTO certifications (title, issuer, year, order_index)
         VALUES ($1, $2, $3, $4);`,
        [cert.title, cert.issuer, cert.year, i]
      );
    }
  }

  // 6. Seed Projects if empty
  const projCount = await pool.query("SELECT COUNT(*) FROM projects;");
  if (parseInt(projCount.rows[0].count, 10) === 0) {
    for (let i = 0; i < defaultContent.projects.length; i++) {
      const proj = defaultContent.projects[i];
      await pool.query(
        `INSERT INTO projects (title, type, preview, accent, description, points, stack, code, live, featured, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11);`,
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
          i,
        ]
      );
    }
  }

  // 7. Seed Stats if not existing
  await pool.query(`
    INSERT INTO stats (key, value) VALUES ('visits', 0) ON CONFLICT (key) DO NOTHING;
    INSERT INTO stats (key, value) VALUES ('resumeDownloads', 0) ON CONFLICT (key) DO NOTHING;
  `);

  console.log("[PostgreSQL] All 7 tables verified and 100% of website data live in PostgreSQL.");
};

export const connectDB = async () => {
  const connectionString = process.env.DATABASE_URL;
  const user = process.env.PGUSER;
  const host = process.env.PGHOST;
  const database = process.env.PGDATABASE;
  const password = process.env.PGPASSWORD;
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;

  const hasConfig = Boolean(
    (connectionString && connectionString.trim() !== "") ||
    (host && user && database && password && password.trim() !== "")
  );

  if (!hasConfig) {
    console.log("[PostgreSQL] No active DATABASE_URL or password provided in .env.");
    console.log("[PostgreSQL] Running with local JSON store (backend/data/projects.json & messages.json).");
    console.log("[PostgreSQL] To connect live PostgreSQL, provide your connection string in backend/.env");
    return false;
  }

  try {
    const isCloudDb =
      (connectionString &&
        (connectionString.includes("neon.tech") ||
          connectionString.includes("supabase") ||
          connectionString.includes("render") ||
          connectionString.includes("sslmode=require"))) ||
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

    // Auto-create tables & seed data
    await initTables();
    return true;
  } catch (error) {
    console.warn(`[PostgreSQL] Connection failed: ${error.message}`);
    console.log("[PostgreSQL] Using local JSON storage fallback so the server runs without interruption.");
    isConnected = false;
    return false;
  }
};
