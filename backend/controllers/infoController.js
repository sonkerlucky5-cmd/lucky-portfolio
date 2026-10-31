import { query, isDbConnected } from "../config/db.js";
import defaultProfile from "../data/defaultProfile.json" with { type: "json" };

export const getProfileInfo = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const profileRes = await query("SELECT * FROM profile LIMIT 1;");
      const expRes = await query("SELECT * FROM experience ORDER BY order_index ASC, id ASC;");
      const skillsRes = await query("SELECT * FROM skills ORDER BY id ASC;");
      const certRes = await query("SELECT * FROM certifications ORDER BY id ASC;");

      if (profileRes.rows.length > 0) {
        const p = profileRes.rows[0];

        const skillsObj = {};
        skillsRes.rows.forEach((s) => {
          skillsObj[s.category_key] = s.items;
        });

        const fullProfile = {
          name: p.name,
          title: p.title,
          company: p.company,
          location: p.location,
          email: p.email,
          phone: p.phone,
          whatsapp: p.whatsapp,
          github: p.github,
          linkedin: p.linkedin,
          twitter: p.twitter,
          summary: p.summary,
          education: p.education,
          skills: skillsObj,
          experience: expRes.rows.map((e) => ({
            role: e.role,
            company: e.company,
            period: e.period,
            status: e.status,
            summary: e.summary,
            points: e.points,
          })),
          certifications: certRes.rows.map((c) => ({
            title: c.title,
            issuer: c.issuer,
            year: c.year,
            score: c.score,
          })),
        };

        return res.status(200).json({
          success: true,
          source: "postgresql",
          data: fullProfile,
        });
      }
    }

    // Fallback to local defaultProfile
    return res.status(200).json({
      success: true,
      source: "local-store",
      data: defaultProfile,
    });
  } catch (error) {
    next(error);
  }
};
