import pg from "pg";
import dotenv from "dotenv";
import defaultContent from "../data/defaultContent.json" with { type: "json" };

dotenv.config();

const { Pool } = pg;

async function runFullMigration() {
  const connectionString = process.env.DATABASE_URL;
  const user = process.env.PGUSER || "postgres";
  const host = process.env.PGHOST || "localhost";
  const database = process.env.PGDATABASE || "portfolio_db";
  const password = process.env.PGPASSWORD || "784_6@92";
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;

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
  console.log("🚀 MIGRATING 100% OF WEBSITE DATA TO POSTGRESQL");
  console.log("=================================================");

  const pool = new Pool(config);

  try {
    const testRes = await pool.query("SELECT current_database(), NOW();");
    console.log(`✓ Connected to Database: "${testRes.rows[0].current_database}"`);

    // 1. Create Tables
    console.log("\n1. Verifying / Creating database tables...");
    await pool.query(`
      DROP TABLE IF EXISTS profile CASCADE;
      DROP TABLE IF EXISTS expertise CASCADE;
      DROP TABLE IF EXISTS skill_groups CASCADE;
      DROP TABLE IF EXISTS certifications CASCADE;
      DROP TABLE IF EXISTS projects CASCADE;
      DROP TABLE IF EXISTS experience CASCADE;

      -- Profile & Bio Table
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

      -- Expertise Cards Table
      CREATE TABLE IF NOT EXISTS expertise (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50) NOT NULL,
        title VARCHAR(100) NOT NULL,
        text TEXT NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
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

      -- Skill Groups Table
      CREATE TABLE IF NOT EXISTS skill_groups (
        id SERIAL PRIMARY KEY,
        icon VARCHAR(50) NOT NULL,
        label VARCHAR(100) NOT NULL,
        note VARCHAR(255),
        items JSONB NOT NULL,
        order_index INTEGER DEFAULT 0,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );

      -- Certifications Table
      CREATE TABLE IF NOT EXISTS certifications (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        issuer VARCHAR(150) NOT NULL,
        year VARCHAR(100),
        order_index INTEGER DEFAULT 0,
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
        order_index INTEGER DEFAULT 0,
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
    console.log("✓ All 7 database tables ready.");

    // 2. Insert Profile
    console.log("\n2. Saving Full Profile to PostgreSQL...");
    await pool.query("TRUNCATE TABLE profile RESTART IDENTITY CASCADE;");
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
    console.log("✓ Profile & About details saved in PostgreSQL.");

    // 3. Insert Expertise
    console.log("\n3. Saving Expertise cards to PostgreSQL...");
    await pool.query("TRUNCATE TABLE expertise RESTART IDENTITY CASCADE;");
    for (let i = 0; i < defaultContent.expertise.length; i++) {
      const exp = defaultContent.expertise[i];
      await pool.query(
        `INSERT INTO expertise (icon, title, text, order_index) VALUES ($1, $2, $3, $4);`,
        [exp.icon, exp.title, exp.text, i]
      );
    }
    console.log(`✓ ${defaultContent.expertise.length} Expertise cards saved in PostgreSQL.`);

    // 4. Insert Experience
    console.log("\n4. Saving Experience to PostgreSQL...");
    await pool.query("TRUNCATE TABLE experience RESTART IDENTITY CASCADE;");
    for (let i = 0; i < defaultContent.experience.length; i++) {
      const exp = defaultContent.experience[i];
      await pool.query(
        `INSERT INTO experience (role, company, period, status, summary, points, order_index)
         VALUES ($1, $2, $3, $4, $5, $6, $7);`,
        [exp.role, exp.company, exp.period, exp.status, exp.summary, exp.points, i]
      );
    }
    console.log(`✓ ${defaultContent.experience.length} Experience items saved in PostgreSQL.`);

    // 5. Insert Projects
    console.log("\n5. Saving Projects to PostgreSQL...");
    await pool.query("TRUNCATE TABLE projects RESTART IDENTITY CASCADE;");
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
    console.log(`✓ ${defaultContent.projects.length} Projects saved in PostgreSQL.`);

    // 6. Insert Skill Groups
    console.log("\n6. Saving Skill Groups to PostgreSQL...");
    await pool.query("TRUNCATE TABLE skill_groups RESTART IDENTITY CASCADE;");
    for (let i = 0; i < defaultContent.skillGroups.length; i++) {
      const group = defaultContent.skillGroups[i];
      await pool.query(
        `INSERT INTO skill_groups (icon, label, note, items, order_index)
         VALUES ($1, $2, $3, $4, $5);`,
        [group.icon, group.label, group.note, JSON.stringify(group.items), i]
      );
    }
    console.log(`✓ ${defaultContent.skillGroups.length} Skill Groups (33 skills) saved in PostgreSQL.`);

    // 7. Insert Certifications
    console.log("\n7. Saving Certifications to PostgreSQL...");
    await pool.query("TRUNCATE TABLE certifications RESTART IDENTITY CASCADE;");
    for (let i = 0; i < defaultContent.certifications.length; i++) {
      const cert = defaultContent.certifications[i];
      await pool.query(
        `INSERT INTO certifications (title, issuer, year, order_index)
         VALUES ($1, $2, $3, $4);`,
        [cert.title, cert.issuer, cert.year, i]
      );
    }
    console.log(`✓ ${defaultContent.certifications.length} Certifications saved in PostgreSQL.`);

    // 8. Seed Stats
    await pool.query(`
      INSERT INTO stats (key, value) VALUES ('visits', 0) ON CONFLICT (key) DO NOTHING;
      INSERT INTO stats (key, value) VALUES ('resumeDownloads', 0) ON CONFLICT (key) DO NOTHING;
    `);
    console.log("✓ Stats counters initialized in PostgreSQL.");

    console.log("\n=================================================");
    console.log("🎉 100% OF WEBSITE DATA SUCCESSFULLY SAVED TO POSTGRESQL!");
    console.log("=================================================\n");
  } catch (error) {
    console.error("❌ Migration error:", error.message);
  } finally {
    await pool.end();
  }
}

runFullMigration();
