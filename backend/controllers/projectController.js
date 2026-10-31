import { query, isDbConnected } from "../config/db.js";
import { getLocalProjects, addLocalProject } from "../data/localStore.js";
import defaultProjects from "../data/defaultProjects.json" with { type: "json" };

export const getAllProjects = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const sql = `
        SELECT id, title, type, preview, accent, description, points, stack, code, live, featured,
               created_at AS "createdAt", updated_at AS "updatedAt"
        FROM projects
        ORDER BY id ASC;
      `;
      const result = await query(sql);
      return res.status(200).json({
        success: true,
        count: result.rows.length,
        data: result.rows,
      });
    }

    const projects = await getLocalProjects();
    return res.status(200).json({
      success: true,
      count: projects.length,
      data: projects.length > 0 ? projects : defaultProjects,
    });
  } catch (error) {
    next(error);
  }
};

export const getProjectById = async (req, res, next) => {
  try {
    const { id } = req.params;

    if (isDbConnected()) {
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
    }

    const projects = await getLocalProjects();
    const project = projects.find((p) => String(p._id) === String(id) || String(p.id) === String(id));
    if (!project) {
      return res
        .status(404)
        .json({ success: false, message: "Project not found" });
    }
    return res.status(200).json({ success: true, data: project });
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

    if (isDbConnected()) {
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
    }

    const created = await addLocalProject(payload);
    return res.status(201).json({ success: true, data: created });
  } catch (error) {
    next(error);
  }
};
