import pg from "pg";
import dotenv from "dotenv";

dotenv.config();

const { Pool } = pg;

let pool = null;
let isConnected = false;

export const getPool = () => pool;
export const isDbConnected = () => isConnected;

// Execute SQL query helper
export const query = async (text, params) => {
  if (!pool || !isConnected) {
    throw new Error("PostgreSQL database is not connected");
  }
  return pool.query(text, params);
};

export const connectDB = async () => {
  const connectionString = process.env.DATABASE_URL;
  const user = process.env.PGUSER || "postgres";
  const host = process.env.PGHOST || "localhost";
  const database = process.env.PGDATABASE || "portfolio_db";
  const password = process.env.PGPASSWORD;
  const port = process.env.PGPORT ? parseInt(process.env.PGPORT, 10) : 5432;

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

  try {
    pool = new Pool(config);

    // Test connection
    const res = await pool.query("SELECT NOW() as current_time;");
    isConnected = true;
    console.log(`[PostgreSQL] Connected successfully to database at ${res.rows[0].current_time}`);
    return true;
  } catch (error) {
    console.error(`[PostgreSQL] Connection failed: ${error.message}`);
    isConnected = false;
    return false;
  }
};
