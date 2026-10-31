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

/**
 * ============================================================
 * ADMIN API CLIENT (PostgreSQL Powered)
 * ============================================================
 */

const getAdminAuthHeaders = () => {
  const token = localStorage.getItem("portfolio_admin_token");
  return {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

export const adminLogin = async (password) => {
  const res = await fetch(`${API_BASE}/api/admin/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  });
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || "Admin login failed.");
  }
  if (data.token) {
    localStorage.setItem("portfolio_admin_token", data.token);
  }
  return data;
};

export const adminLogout = () => {
  localStorage.removeItem("portfolio_admin_token");
};

export const adminGetOverview = async () => {
  const res = await fetch(`${API_BASE}/api/admin/overview`, {
    headers: getAdminAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load admin overview");
  return data.data;
};

export const adminGetProjects = async () => {
  const res = await fetch(`${API_BASE}/api/admin/projects`, {
    headers: getAdminAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load projects");
  return data.data;
};

export const adminCreateProject = async (projectData) => {
  const res = await fetch(`${API_BASE}/api/admin/projects`, {
    method: "POST",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(projectData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to create project");
  return data.data;
};

export const adminUpdateProject = async (id, projectData) => {
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "PUT",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(projectData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update project");
  return data.data;
};

export const adminDeleteProject = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/projects/${id}`, {
    method: "DELETE",
    headers: getAdminAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete project");
  return data.data;
};

export const adminGetMessages = async () => {
  const res = await fetch(`${API_BASE}/api/admin/messages`, {
    headers: getAdminAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to load messages");
  return data.data;
};

export const adminMarkMessageRead = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/messages/${id}/read`, {
    method: "PATCH",
    headers: getAdminAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to mark message read");
  return data.data;
};

export const adminDeleteMessage = async (id) => {
  const res = await fetch(`${API_BASE}/api/admin/messages/${id}`, {
    method: "DELETE",
    headers: getAdminAuthHeaders(),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to delete message");
  return data.data;
};

export const adminUpdateProfile = async (profileData) => {
  const res = await fetch(`${API_BASE}/api/admin/profile`, {
    method: "PUT",
    headers: getAdminAuthHeaders(),
    body: JSON.stringify(profileData),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Failed to update profile");
  return data.data;
};
