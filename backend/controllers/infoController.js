import { query, isDbConnected } from "../config/db.js";
import defaultContent from "../data/defaultContent.json" with { type: "json" };

export const getProfileInfo = async (req, res, next) => {
  try {
    if (isDbConnected()) {
      const profileRes = await query("SELECT * FROM profile LIMIT 1;");
      const expRes = await query("SELECT * FROM experience ORDER BY order_index ASC, id ASC;");
      const expertiseRes = await query("SELECT * FROM expertise ORDER BY order_index ASC, id ASC;");
      const skillsRes = await query("SELECT * FROM skill_groups ORDER BY order_index ASC, id ASC;");
      const certRes = await query("SELECT * FROM certifications ORDER BY order_index ASC, id ASC;");

      if (profileRes.rows.length > 0) {
        const p = profileRes.rows[0];

        const fullContent = {
          profile: {
            name: p.name,
            title: p.title,
            company: p.company,
            location: p.location,
            email: p.email,
            phone: p.phone,
            whatsappUrl: p.whatsapp_url,
            githubUrl: p.github_url,
            linkedinUrl: p.linkedin_url,
            twitterUrl: p.twitter_url,
            resumeUrl: p.resume_url,
            typingLines: p.typing_lines,
            aboutHeading: p.about_heading,
            aboutLead: p.about_lead,
            aboutStory: p.about_story,
            aboutPoints: p.about_points,
            education: p.education,
          },
          expertise: expertiseRes.rows.map((row) => ({
            icon: row.icon,
            title: row.title,
            text: row.text,
          })),
          experience: expRes.rows.map((e) => ({
            role: e.role,
            company: e.company,
            period: e.period,
            status: e.status,
            summary: e.summary,
            points: e.points,
          })),
          skillGroups: skillsRes.rows.map((s) => ({
            icon: s.icon,
            label: s.label,
            note: s.note,
            items: typeof s.items === "string" ? JSON.parse(s.items) : s.items,
          })),
          certifications: certRes.rows.map((c) => ({
            title: c.title,
            issuer: c.issuer,
            year: c.year,
          })),
        };

        return res.status(200).json({
          success: true,
          source: "postgresql",
          data: fullContent,
        });
      }
    }

    // Fallback to local defaultContent
    return res.status(200).json({
      success: true,
      source: "local-store",
      data: defaultContent,
    });
  } catch (error) {
    next(error);
  }
};
