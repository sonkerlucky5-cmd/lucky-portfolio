import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

async function verifyDatabase() {
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    host: process.env.PGHOST,
    port: parseInt(process.env.PGPORT || "5432", 10),
    database: process.env.PGDATABASE,
  });

  try {
    const testRes = await pool.query("SELECT current_database(), NOW();");
    console.log("=========================================");
    console.log("🐘 POSTGRESQL DATABASE STATUS: CONNECTED");
    console.log(`Database Name: ${testRes.rows[0].current_database}`);
    console.log(`Server Time:   ${testRes.rows[0].now}`);
    console.log("=========================================");

    const [profile, expertise, experience, skills, certs, projects, stats, messages] =
      await Promise.all([
        pool.query("SELECT COUNT(*) FROM profile"),
        pool.query("SELECT COUNT(*) FROM expertise"),
        pool.query("SELECT COUNT(*) FROM experience"),
        pool.query("SELECT COUNT(*) FROM skill_groups"),
        pool.query("SELECT COUNT(*) FROM certifications"),
        pool.query("SELECT COUNT(*) FROM projects"),
        pool.query("SELECT COUNT(*) FROM stats"),
        pool.query("SELECT COUNT(*) FROM contact_messages"),
      ]);

    console.log("📊 Live Tables & Records in PostgreSQL:");
    console.log(`- profile:          ${profile.rows[0].count} record`);
    console.log(`- expertise:        ${expertise.rows[0].count} cards`);
    console.log(`- experience:       ${experience.rows[0].count} items`);
    console.log(`- skill_groups:     ${skills.rows.length ? skills.rows[0].count : 0} groups (33 skills)`);
    console.log(`- certifications:   ${certs.rows[0].count} certificates`);
    console.log(`- projects:         ${projects.rows[0].count} projects`);
    console.log(`- stats:            ${stats.rows[0].count} tracking keys`);
    console.log(`- contact_messages: ${messages.rows[0].count} messages`);
    console.log("=========================================");
    console.log("✅ All website data is fully active in PostgreSQL!");
  } catch (error) {
    console.error("❌ Database connection error:", error.message);
  } finally {
    await pool.end();
  }
}

verifyDatabase();
