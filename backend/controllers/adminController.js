import { query } from "../config/db.js";
import { generateAdminToken } from "../middleware/authMiddleware.js";

// Admin Login
export const adminLogin = async (req, res, next) => {
  try {
    const { password } = req.body;
    const adminPassword = process.env.ADMIN_PASSWORD || "lucky@2026";

    if (!password) {
      return res.status(400).json({
        success: false,
        message: "Please provide the admin password.",
      });
    }

    if (password !== adminPassword) {
      return res.status(401).json({
        success: false,
        message: "Invalid admin password. Access denied.",
      });
    }

    const token = generateAdminToken({ username: "lucky" });

    return res.status(200).json({
      success: true,
      message: "Admin authentication successful",
      token,
      admin: {
        name: "Lucky Sonker",
        role: "admin",
        username: "lucky",
      },
    });
  } catch (error) {
    next(error);
  }
};

// Admin Overview & System Stats
export const getAdminOverview = async (req, res, next) => {
  try {
    const [projectCount, messagesCount, unreadCount, statsRows, profileRow] =
      await Promise.all([
        query("SELECT COUNT(*) FROM projects;"),
        query("SELECT COUNT(*) FROM contact_messages;"),
        query("SELECT COUNT(*) FROM contact_messages WHERE status = 'unread';"),
        query("SELECT key, value FROM stats;"),
        query("SELECT name, title, email, phone, location FROM profile LIMIT 1;"),
      ]);

    const statsMap = {};
    statsRows.rows.forEach((row) => {
      statsMap[row.key] = row.value;
    });

    const recentMessages = await query(
      "SELECT id, name, email, subject, message, status, created_at AS \"createdAt\" FROM contact_messages ORDER BY created_at DESC LIMIT 5;"
    );

    return res.status(200).json({
      success: true,
      data: {
        database: {
          status: "connected",
          type: "PostgreSQL",
          name: "portfolio_db",
          host: "localhost:5432",
        },
        counts: {
          totalProjects: parseInt(projectCount.rows[0].count, 10),
          totalMessages: parseInt(messagesCount.rows[0].count, 10),
          unreadMessages: parseInt(unreadCount.rows[0].count, 10),
          totalVisits: statsMap.visits || 0,
          resumeDownloads: statsMap.resumeDownloads || 0,
        },
        profile: profileRow.rows[0] || null,
        recentMessages: recentMessages.rows,
      },
    });
  } catch (error) {
    next(error);
  }
};

// Projects CRUD for Admin
export const adminGetProjects = async (req, res, next) => {
  try {
    const result = await query(
      `SELECT id, title, type, preview, accent, description, points, stack, code, live, featured,
              order_index AS "orderIndex", created_at AS "createdAt", updated_at AS "updatedAt"
       FROM projects
       ORDER BY order_index ASC, id ASC;`
    );
    return res.status(200).json({ success: true, data: result.rows });
  } catch (error) {
    next(error);
  }
};

export const adminCreateProject = async (req, res, next) => {
  try {
    const {
      title,
      type,
      preview,
      accent,
      description,
      points,
      stack,
      code,
      live,
      featured,
    } = req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required.",
      });
    }

    const sql = `
      INSERT INTO projects (title, type, preview, accent, description, points, stack, code, live, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, title, type, preview, accent, description, points, stack, code, live, featured,
                created_at AS "createdAt";
    `;

    const result = await query(sql, [
      title.trim(),
      type || "Full-stack build",
      preview || "custom-project",
      accent || "#da5f36",
      description.trim(),
      Array.isArray(points) ? points : [],
      Array.isArray(stack) ? stack : [],
      code || "",
      live || "",
      featured !== undefined ? Boolean(featured) : true,
    ]);

    return res.status(201).json({
      success: true,
      message: "Project successfully added to PostgreSQL database",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const adminUpdateProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const {
      title,
      type,
      preview,
      accent,
      description,
      points,
      stack,
      code,
      live,
      featured,
    } = req.body;

    const sql = `
      UPDATE projects
      SET title = COALESCE($1, title),
          type = COALESCE($2, type),
          preview = COALESCE($3, preview),
          accent = COALESCE($4, accent),
          description = COALESCE($5, description),
          points = COALESCE($6, points),
          stack = COALESCE($7, stack),
          code = COALESCE($8, code),
          live = COALESCE($9, live),
          featured = COALESCE($10, featured),
          updated_at = CURRENT_TIMESTAMP
      WHERE id = $11
      RETURNING id, title, type, preview, accent, description, points, stack, code, live, featured,
                updated_at AS "updatedAt";
    `;

    const result = await query(sql, [
      title,
      type,
      preview,
      accent,
      description,
      points ? (Array.isArray(points) ? points : [points]) : null,
      stack ? (Array.isArray(stack) ? stack : [stack]) : null,
      code,
      live,
      featured !== undefined ? Boolean(featured) : null,
      id,
    ]);

    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }

    return res.status(200).json({
      success: true,
      message: "Project updated successfully in PostgreSQL",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};

export const adminDeleteProject = async (req, res, next) => {
  try {
    const { id } = req.params;
    const result = await query("DELETE FROM projects WHERE id = $1 RETURNING id;", [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({
      success: true,
      message: "Project deleted from PostgreSQL database",
      data: { id },
    });
  } catch (error) {
    next(error);
  }
};

// Profile Update for Admin
export const adminUpdateProfile = async (req, res, next) => {
  try {
    const {
      name,
      title,
      company,
      location,
      email,
      phone,
      whatsappUrl,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      aboutHeading,
      aboutLead,
      aboutStory,
    } = req.body;

    const sql = `
      UPDATE profile
      SET name = COALESCE($1, name),
          title = COALESCE($2, title),
          company = COALESCE($3, company),
          location = COALESCE($4, location),
          email = COALESCE($5, email),
          phone = COALESCE($6, phone),
          whatsapp_url = COALESCE($7, whatsapp_url),
          github_url = COALESCE($8, github_url),
          linkedin_url = COALESCE($9, linkedin_url),
          twitter_url = COALESCE($10, twitter_url),
          about_heading = COALESCE($11, about_heading),
          about_lead = COALESCE($12, about_lead),
          about_story = COALESCE($13, about_story),
          updated_at = CURRENT_TIMESTAMP
      RETURNING *;
    `;

    const result = await query(sql, [
      name,
      title,
      company,
      location,
      email,
      phone,
      whatsappUrl,
      githubUrl,
      linkedinUrl,
      twitterUrl,
      aboutHeading,
      aboutLead,
      aboutStory,
    ]);

    return res.status(200).json({
      success: true,
      message: "Profile updated successfully in PostgreSQL",
      data: result.rows[0],
    });
  } catch (error) {
    next(error);
  }
};
