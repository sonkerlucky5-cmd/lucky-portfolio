const API_BASE = import.meta.env.VITE_API_URL || "";

/**
 * Send a contact inquiry to the backend
 */
export const sendContactMessage = async ({ name, email, subject, message }) => {
  try {
    const res = await fetch(`${API_BASE}/api/contact`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, email, subject, message }),
    });

    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.message || "Failed to send message. Please try again.");
    }
    return data;
  } catch (error) {
    throw error;
  }
};

/**
 * Fetch projects from backend API
 */
export const getProjects = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/projects`);
    if (!res.ok) throw new Error("Could not fetch projects");
    const data = await res.json();
    return data.data || [];
  } catch (error) {
    console.warn("Backend projects API unreachable, using fallback data:", error.message);
    return null;
  }
};

/**
 * Record a page visit in stats
 */
export const recordVisit = async () => {
  try {
    await fetch(`${API_BASE}/api/stats/visit`, { method: "POST" });
  } catch (err) {
    // Non-blocking
  }
};

/**
 * Record a resume download in stats
 */
export const recordResumeDownload = async () => {
  try {
    await fetch(`${API_BASE}/api/stats/resume-download`, { method: "POST" });
  } catch (err) {
    // Non-blocking
  }
};

/**
 * Fetch website stats
 */
export const getStats = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/stats`);
    if (!res.ok) return null;
    const data = await res.json();
    return data.data;
  } catch (err) {
    return null;
  }
};


/**
 * Fetch 100% of website content (profile, expertise, experience, skills, certifications) from Database
 */
export const getWebsiteContent = async () => {
  try {
    const res = await fetch(`${API_BASE}/api/info`);
    if (!res.ok) throw new Error("Could not fetch website content");
    const data = await res.json();
    return data.data || null;
  } catch (error) {
    console.warn("Backend content API unreachable, using local fallback:", error.message);
    return null;
  }
};
