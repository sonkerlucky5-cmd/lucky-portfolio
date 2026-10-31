import { query } from "../config/db.js";

export const getAllProjects = async (req, res, next) => {
  try {
    const sql = `
      SELECT id, title, type, preview, accent, description, points, stack, code, live, featured,
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM projects
      ORDER BY order_index ASC, id ASC;
    `;
    const result = await query(sql);
    return res.status(200).json({
      success: true,
      count: result.rows.length,
      data: result.rows,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT id, title, type, preview, accent, description, points, stack, code, live, featured,
             created_at AS "createdAt", updated_at AS "updatedAt"
      FROM projects
      WHERE id = $1;
    `;
    const result = await query(sql, [id]);
    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};

export const createProject = async (req, res, next) => {
  try {
    const { title, type, preview, accent, description, points, stack, code, live, featured } =
      req.body;

    if (!title || !description) {
      return res.status(400).json({
        success: false,
        message: "Title and description are required",
      });
    }

    const payload = {
      title,
      type: type || "Full-stack build",
      preview: preview || "project-preview",
      accent: accent || "#da5f36",
      description,
      points: Array.isArray(points) ? points : [],
      stack: Array.isArray(stack) ? stack : [],
      code: code || "",
      live: live || "",
      featured: featured !== undefined ? Boolean(featured) : true,
    };

    const sql = `
      INSERT INTO projects (title, type, preview, accent, description, points, stack, code, live, featured)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      RETURNING id, title, type, preview, accent, description, points, stack, code, live, featured,
                created_at AS "createdAt";
    `;
    const result = await query(sql, [
      payload.title,
      payload.type,
      payload.preview,
      payload.accent,
      payload.description,
      payload.points,
      payload.stack,
      payload.code,
      payload.live,
      payload.featured,
    ]);
    return res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    next(error);
  }
};
