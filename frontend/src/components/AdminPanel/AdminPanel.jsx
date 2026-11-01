import { useState, useEffect } from "react";
import {
  AlertCircle,
  ArrowLeft,
  Briefcase,
  Check,
  CheckCircle2,
  Database,
  Download,
  Eye,
  EyeOff,
  Github,
  Globe,
  Inbox,
  Key,
  LayoutDashboard,
  Loader2,
  Lock,
  LogOut,
  Mail,
  Plus,
  RefreshCw,
  Save,
  Send,
  Sparkles,
  Trash2,
  User,
  Zap,
} from "lucide-react";
import {
  adminLogin,
  adminLogout,
  adminGetOverview,
  adminGetProjects,
  adminCreateProject,
  adminUpdateProject,
  adminDeleteProject,
  adminGetMessages,
  adminMarkMessageRead,
  adminDeleteMessage,
  adminUpdateProfile,
} from "../../services/api";
import "./admin.css";

const AdminPanel = ({ isOpen, onClose, onRefreshProjects, onRefreshProfile }) => {
  const [token, setToken] = useState(() => localStorage.getItem("portfolio_admin_token"));
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loginLoading, setLoginLoading] = useState(false);
  const [loginError, setLoginError] = useState("");

  const [activeTab, setActiveTab] = useState("overview"); // overview | projects | messages | profile
  const [loadingData, setLoadingData] = useState(false);
  const [successToast, setSuccessToast] = useState("");

  // Dashboard Data State
  const [overview, setOverview] = useState(null);
  const [projects, setProjects] = useState([]);
  const [messages, setMessages] = useState([]);
  const [profileForm, setProfileForm] = useState({
    name: "Lucky Sonker",
    title: "Software Engineer · MERN & AI/ML",
    company: "VorldX Industries Pvt. Ltd.",
    location: "Lucknow, India",
    email: "sonkerlucky5@gmail.com",
    phone: "+91 93350 48020",
    whatsappUrl: "https://wa.me/919335048020",
    githubUrl: "https://github.com/sonkerlucky5-cmd",
    linkedinUrl: "https://www.linkedin.com/in/lucky-sonker-24539a2b4",
    twitterUrl: "https://x.com/Lucky_DevAI",
  });

  // Project Modal State
  const [projectModalOpen, setProjectModalOpen] = useState(false);
  const [editingProjectId, setEditingProjectId] = useState(null);
  const [projectForm, setProjectForm] = useState({
    title: "",
    type: "Full-stack build",
    preview: "custom-app",
    accent: "#da5f36",
    description: "",
    pointsStr: "",
    stackStr: "",
    code: "https://github.com/sonkerlucky5-cmd",
    live: "",
  });

  const showToast = (msg) => {
    setSuccessToast(msg);
    setTimeout(() => setSuccessToast(""), 3500);
  };

  // Load Admin Data when authenticated
  const loadAllData = async () => {
    if (!token) return;
    setLoadingData(true);
    try {
      const [ovData, projData, msgData] = await Promise.all([
        adminGetOverview().catch(() => null),
        adminGetProjects().catch(() => []),
        adminGetMessages().catch(() => []),
      ]);
      if (ovData) {
        setOverview(ovData);
        if (ovData.profile) {
          setProfileForm((prev) => ({ ...prev, ...ovData.profile }));
        }
      }
      if (projData) setProjects(projData);
      if (msgData) setMessages(msgData);
    } catch (err) {
      console.error("Failed to load admin data:", err);
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (isOpen && token) {
      loadAllData();
    }
  }, [isOpen, token]);

  // Handle Login
  const handleLogin = async (e) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError("");
    try {
      const res = await adminLogin(password);
      setToken(res.token);
      showToast("Welcome Lucky! Connected to PostgreSQL Database.");
    } catch (err) {
      setLoginError(err.message || "Invalid admin password");
    } finally {
      setLoginLoading(false);
    }
  };

  // Handle Logout
  const handleLogout = () => {
    adminLogout();
    setToken(null);
    setPassword("");
  };

  // Open Project Modal for Create or Edit
  const handleOpenProjectModal = (proj = null) => {
    if (proj) {
      setEditingProjectId(proj.id);
      setProjectForm({
        title: proj.title || "",
        type: proj.type || "Full-stack build",
        preview: proj.preview || "app",
        accent: proj.accent || "#da5f36",
        description: proj.description || "",
        pointsStr: Array.isArray(proj.points) ? proj.points.join("\n") : "",
        stackStr: Array.isArray(proj.stack) ? proj.stack.join(", ") : "",
        code: proj.code || "",
        live: proj.live || "",
      });
    } else {
      setEditingProjectId(null);
      setProjectForm({
        title: "",
        type: "Full-stack build",
        preview: "new-app",
        accent: "#da5f36",
        description: "",
        pointsStr: "",
        stackStr: "React.js, Node.js, PostgreSQL",
        code: "https://github.com/sonkerlucky5-cmd",
        live: "",
      });
    }
    setProjectModalOpen(true);
  };

  // Save Project (Create / Update)
  const handleSaveProject = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        title: projectForm.title,
        type: projectForm.type,
        preview: projectForm.preview,
        accent: projectForm.accent,
        description: projectForm.description,
        points: projectForm.pointsStr
          .split("\n")
          .map((p) => p.trim())
          .filter(Boolean),
        stack: projectForm.stackStr
          .split(",")
          .map((s) => s.trim())
          .filter(Boolean),
        code: projectForm.code,
        live: projectForm.live,
      };

      if (editingProjectId) {
        await adminUpdateProject(editingProjectId, payload);
        showToast("Project updated in PostgreSQL database!");
      } else {
        await adminCreateProject(payload);
        showToast("New project added to PostgreSQL database!");
      }

      setProjectModalOpen(false);
      await loadAllData();
      if (onRefreshProjects) onRefreshProjects();
    } catch (err) {
      alert("Error saving project: " + err.message);
    }
  };

  // Delete Project
  const handleDeleteProject = async (id, title) => {
    if (!window.confirm(`Are you sure you want to delete "${title}" from PostgreSQL database?`)) {
      return;
    }
    try {
      await adminDeleteProject(id);
      showToast(`Deleted "${title}" from database`);
      await loadAllData();
      if (onRefreshProjects) onRefreshProjects();
    } catch (err) {
      alert("Failed to delete project: " + err.message);
    }
  };

  // Mark Message Read
  const handleMarkRead = async (id) => {
    try {
      await adminMarkMessageRead(id);
      setMessages((prev) =>
        prev.map((m) => (m.id === id ? { ...m, status: "read" } : m))
      );
      showToast("Message marked as read");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Delete Message
  const handleDeleteMessage = async (id) => {
    if (!window.confirm("Delete this inquiry from PostgreSQL?")) return;
    try {
      await adminDeleteMessage(id);
      setMessages((prev) => prev.filter((m) => m.id !== id));
      showToast("Inquiry deleted from database");
    } catch (err) {
      alert("Error: " + err.message);
    }
  };

  // Save Profile
  const handleSaveProfile = async (e) => {
    e.preventDefault();
    try {
      await adminUpdateProfile(profileForm);
      showToast("Profile details updated in PostgreSQL database!");
      if (onRefreshProfile) onRefreshProfile();
    } catch (err) {
      alert("Failed to update profile: " + err.message);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="admin-overlay" role="dialog" aria-modal="true" aria-label="Admin Control Panel">
      {/* Toast Notification */}
      {successToast && (
        <div className="admin-toast">
          <CheckCircle2 size={16} className="text-emerald" />
          <span>{successToast}</span>
        </div>
      )}

      <div className="admin-container">
        {/* If Not Logged In -> Show Login Form */}
        {!token ? (
          <div className="admin-login-card">
            <div className="admin-login-header">
              <div className="admin-lock-icon">
                <Lock size={26} />
              </div>
              <h2>Admin Authentication</h2>
              <p>Secure PostgreSQL Management Portal · Lucky Sonker Portfolio</p>
            </div>

            <form onSubmit={handleLogin} className="admin-login-form">
              {loginError && (
                <div className="admin-alert-error">
                  <AlertCircle size={16} />
                  <span>{loginError}</span>
                </div>
              )}

              <div className="admin-field-group">
                <label>Admin Password</label>
                <div className="admin-input-wrap">
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="Enter admin password (e.g. lucky@2026)"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    autoFocus
                  />
                  <button
                    type="button"
                    className="admin-pw-toggle"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </button>
                </div>
                <small className="admin-tip">Default configured key: <code>lucky@2026</code></small>
              </div>

              <div className="admin-login-actions">
                <button
                  type="submit"
                  className="btn btn-primary admin-submit-btn"
                  disabled={loginLoading}
                >
                  {loginLoading ? (
                    <>
                      <Loader2 size={16} className="animate-spin" />
                      <span>Authenticating...</span>
                    </>
                  ) : (
                    <>
                      <Key size={16} />
                      <span>Access Admin Dashboard</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  className="btn btn-outline admin-cancel-btn"
                  onClick={onClose}
                >
                  <ArrowLeft size={15} /> Back to Website
                </button>
              </div>
            </form>
          </div>
        ) : (
          /* Logged In -> Show Full Admin Dashboard */
          <div className="admin-dashboard">
            {/* Top Bar */}
            <header className="admin-header-bar">
              <div className="admin-brand-info">
                <div className="admin-brand-logo">
                  <Database size={18} />
                </div>
                <div>
                  <div className="admin-brand-title">PostgreSQL Control Panel</div>
                  <div className="admin-db-status">
                    <span className="live-dot" /> Connected to <strong>portfolio_db</strong> (Localhost:5432)
                  </div>
                </div>
              </div>

              <div className="admin-top-actions">
                <button
                  type="button"
                  className="admin-btn-action"
                  onClick={loadAllData}
                  title="Reload from PostgreSQL"
                >
                  <RefreshCw size={15} className={loadingData ? "animate-spin" : ""} />
                  <span>Sync DB</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-action"
                  onClick={onClose}
                  title="Return to portfolio site"
                >
                  <ArrowLeft size={15} />
                  <span>View Site</span>
                </button>
                <button
                  type="button"
                  className="admin-btn-logout"
                  onClick={handleLogout}
                  title="Log out of admin session"
                >
                  <LogOut size={15} />
                  <span>Logout</span>
                </button>
              </div>
            </header>

            {/* Navigation Tabs */}
            <nav className="admin-nav-tabs">
              <button
                className={`admin-tab-btn ${activeTab === "overview" ? "active" : ""}`}
                onClick={() => setActiveTab("overview")}
              >
                <LayoutDashboard size={16} />
                <span>Overview &amp; Stats</span>
              </button>
              <button
                className={`admin-tab-btn ${activeTab === "projects" ? "active" : ""}`}
                onClick={() => setActiveTab("projects")}
              >
                <Briefcase size={16} />
                <span>Projects ({projects.length})</span>
              </button>
              <button
                className={`admin-tab-btn ${activeTab === "messages" ? "active" : ""}`}
                onClick={() => setActiveTab("messages")}
              >
                <Inbox size={16} />
                <span>Inquiries ({messages.length})</span>
                {overview?.counts?.unreadMessages > 0 && (
                  <span className="unread-pill">{overview.counts.unreadMessages}</span>
                )}
              </button>
              <button
                className={`admin-tab-btn ${activeTab === "profile" ? "active" : ""}`}
                onClick={() => setActiveTab("profile")}
              >
                <User size={16} />
                <span>Profile &amp; Bio</span>
              </button>
            </nav>

            {/* Tab Contents */}
            <main className="admin-content-pane">
              {/* TAB 1: OVERVIEW */}
              {activeTab === "overview" && (
                <div className="admin-tab-view">
                  <div className="admin-kpi-grid">
                    <div className="admin-kpi-card">
                      <div className="kpi-icon-wrap kpi-blue">
                        <Briefcase size={20} />
                      </div>
                      <div className="kpi-info">
                        <span className="kpi-label">POSTGRESQL PROJECTS</span>
                        <h3 className="kpi-value">{overview?.counts?.totalProjects || projects.length}</h3>
                        <span className="kpi-sub">Active &amp; Visible</span>
                      </div>
                    </div>

                    <div className="admin-kpi-card">
                      <div className="kpi-icon-wrap kpi-emerald">
                        <Inbox size={20} />
                      </div>
                      <div className="kpi-info">
                        <span className="kpi-label">TOTAL INQUIRIES</span>
                        <h3 className="kpi-value">{overview?.counts?.totalMessages || messages.length}</h3>
                        <span className="kpi-sub">
                          {overview?.counts?.unreadMessages || 0} unread
                        </span>
                      </div>
                    </div>

                    <div className="admin-kpi-card">
                      <div className="kpi-icon-wrap kpi-purple">
                        <Zap size={20} />
                      </div>
                      <div className="kpi-info">
                        <span className="kpi-label">TOTAL VISITS</span>
                        <h3 className="kpi-value">{overview?.counts?.totalVisits || 1}</h3>
                        <span className="kpi-sub">Tracked in Database</span>
                      </div>
                    </div>

                    <div className="admin-kpi-card">
                      <div className="kpi-icon-wrap kpi-amber">
                        <Download size={20} />
                      </div>
                      <div className="kpi-info">
                        <span className="kpi-label">RESUME DOWNLOADS</span>
                        <h3 className="kpi-value">{overview?.counts?.resumeDownloads || 0}</h3>
                        <span className="kpi-sub">ATS PDF Downloads</span>
                      </div>
                    </div>
                  </div>

                  {/* Recent Inquiries Quick Table */}
                  <div className="admin-section-box">
                    <div className="section-box-header">
                      <h3>Recent Inquiries (Saved in PostgreSQL)</h3>
                      <button
                        className="btn-text-link"
                        onClick={() => setActiveTab("messages")}
                      >
                        View All Inquiries →
                      </button>
                    </div>

                    {messages.length === 0 ? (
                      <div className="empty-state-card">
                        <Inbox size={32} />
                        <p>No messages received yet. Submit one from the Contact section to test!</p>
                      </div>
                    ) : (
                      <div className="admin-messages-list">
                        {messages.slice(0, 3).map((m) => (
                          <div key={m.id} className="admin-msg-card">
                            <div className="msg-card-top">
                              <strong>{m.name}</strong>
                              <span className="msg-date">
                                {new Date(m.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                            <div className="msg-subject">{m.subject}</div>
                            <p className="msg-body-preview">{m.message}</p>
                            <div className="msg-card-actions">
                              <a
                                href={`mailto:${m.email}`}
                                className="btn-sm btn-outline"
                              >
                                Reply via Email
                              </a>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* TAB 2: PROJECTS MANAGER */}
              {activeTab === "projects" && (
                <div className="admin-tab-view">
                  <div className="admin-toolbar">
                    <div>
                      <h3>Manage Projects ({projects.length})</h3>
                      <p className="admin-desc">
                        Add, edit, or delete projects stored in PostgreSQL table <code>projects</code>.
                      </p>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary admin-add-btn"
                      onClick={() => handleOpenProjectModal()}
                    >
                      <Plus size={16} />
                      <span>Add New Project</span>
                    </button>
                  </div>

                  <div className="admin-projects-grid">
                    {projects.map((proj) => (
                      <div
                        key={proj.id}
                        className="admin-project-item"
                        style={{ "--item-accent": proj.accent || "#da5f36" }}
                      >
                        <div className="item-head">
                          <span className="item-monogram">{proj.title.charAt(0)}</span>
                          <div className="item-meta">
                            <h4>{proj.title}</h4>
                            <span className="item-type-badge">{proj.type}</span>
                          </div>
                        </div>

                        <p className="item-description">{proj.description}</p>

                        <div className="item-stack-row">
                          {proj.stack &&
                            proj.stack.map((t) => (
                              <span key={t} className="item-stack-chip">
                                {t}
                              </span>
                            ))}
                        </div>

                        <div className="item-footer-actions">
                          <button
                            type="button"
                            className="btn-sm btn-outline"
                            onClick={() => handleOpenProjectModal(proj)}
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            className="btn-sm btn-danger"
                            onClick={() => handleDeleteProject(proj.id, proj.title)}
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* TAB 3: CONTACT MESSAGES */}
              {activeTab === "messages" && (
                <div className="admin-tab-view">
                  <div className="admin-toolbar">
                    <div>
                      <h3>Contact Messages &amp; Leads ({messages.length})</h3>
                      <p className="admin-desc">
                        Direct sync from PostgreSQL table <code>contact_messages</code>.
                      </p>
                    </div>
                  </div>

                  {messages.length === 0 ? (
                    <div className="empty-state-card">
                      <Inbox size={38} />
                      <h4>No inquiries in database</h4>
                      <p>When someone uses the Contact section, inquiries will appear here instantly!</p>
                    </div>
                  ) : (
                    <div className="admin-inbox-table-wrap">
                      <table className="admin-inbox-table">
                        <thead>
                          <tr>
                            <th>Status</th>
                            <th>Sender</th>
                            <th>Subject</th>
                            <th>Date</th>
                            <th>Message</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {messages.map((m) => (
                            <tr key={m.id} className={m.status === "unread" ? "row-unread" : ""}>
                              <td>
                                <span className={`status-pill-badge ${m.status}`}>
                                  {m.status}
                                </span>
                              </td>
                              <td>
                                <strong>{m.name}</strong>
                                <br />
                                <small className="text-muted">{m.email}</small>
                              </td>
                              <td>{m.subject}</td>
                              <td>
                                <small>{new Date(m.createdAt).toLocaleString()}</small>
                              </td>
                              <td className="message-cell">{m.message}</td>
                              <td>
                                <div className="table-actions">
                                  {m.status === "unread" && (
                                    <button
                                      type="button"
                                      className="btn-icon"
                                      title="Mark as Read"
                                      onClick={() => handleMarkRead(m.id)}
                                    >
                                      <Check size={14} />
                                    </button>
                                  )}
                                  <a
                                    href={`mailto:${m.email}?subject=Re: ${encodeURIComponent(m.subject)}`}
                                    className="btn-icon"
                                    title="Reply via Email"
                                  >
                                    <Mail size={14} />
                                  </a>
                                  <button
                                    type="button"
                                    className="btn-icon btn-icon-danger"
                                    title="Delete Message"
                                    onClick={() => handleDeleteMessage(m.id)}
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              )}

              {/* TAB 4: PROFILE & BIO */}
              {activeTab === "profile" && (
                <div className="admin-tab-view">
                  <div className="admin-toolbar">
                    <div>
                      <h3>Profile &amp; Personal Info</h3>
                      <p className="admin-desc">
                        Update your headline, role, and social links in PostgreSQL table <code>profile</code>.
                      </p>
                    </div>
                  </div>

                  <form onSubmit={handleSaveProfile} className="admin-profile-form">
                    <div className="admin-form-grid">
                      <div className="admin-field-group">
                        <label>Full Name</label>
                        <input
                          type="text"
                          value={profileForm.name}
                          onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>Professional Role / Title</label>
                        <input
                          type="text"
                          value={profileForm.title}
                          onChange={(e) => setProfileForm({ ...profileForm, title: e.target.value })}
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>Company</label>
                        <input
                          type="text"
                          value={profileForm.company}
                          onChange={(e) => setProfileForm({ ...profileForm, company: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>Location</label>
                        <input
                          type="text"
                          value={profileForm.location}
                          onChange={(e) => setProfileForm({ ...profileForm, location: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>Contact Email</label>
                        <input
                          type="email"
                          value={profileForm.email}
                          onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                          required
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>WhatsApp Number</label>
                        <input
                          type="text"
                          value={profileForm.phone}
                          onChange={(e) => setProfileForm({ ...profileForm, phone: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>GitHub Profile URL</label>
                        <input
                          type="url"
                          value={profileForm.githubUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, githubUrl: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>LinkedIn Profile URL</label>
                        <input
                          type="url"
                          value={profileForm.linkedinUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, linkedinUrl: e.target.value })}
                        />
                      </div>

                      <div className="admin-field-group">
                        <label>X (Twitter) Profile URL</label>
                        <input
                          type="url"
                          value={profileForm.twitterUrl}
                          onChange={(e) => setProfileForm({ ...profileForm, twitterUrl: e.target.value })}
                        />
                      </div>
                    </div>

                    <div className="admin-form-submit-row">
                      <button type="submit" className="btn btn-primary">
                        <Save size={16} />
                        <span>Save to PostgreSQL Database</span>
                      </button>
                    </div>
                  </form>
                </div>
              )}
            </main>
          </div>
        )}
      </div>

      {/* Project Create / Edit Modal */}
      {projectModalOpen && (
        <div className="admin-sub-modal-overlay">
          <div className="admin-sub-modal-card">
            <div className="sub-modal-head">
              <h3>{editingProjectId ? "Edit Project" : "Add New Project"}</h3>
              <button
                type="button"
                className="btn-icon"
                onClick={() => setProjectModalOpen(false)}
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveProject} className="sub-modal-form">
              <div className="admin-form-grid">
                <div className="admin-field-group">
                  <label>Project Title *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Next-Gen AI Assistant"
                    value={projectForm.title}
                    onChange={(e) => setProjectForm({ ...projectForm, title: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label>Category / Type *</label>
                  <input
                    type="text"
                    required
                    placeholder="Full-stack build / E-commerce / AI & ML"
                    value={projectForm.type}
                    onChange={(e) => setProjectForm({ ...projectForm, type: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label>Preview Slug (URL)</label>
                  <input
                    type="text"
                    placeholder="e.g. ai-assistant"
                    value={projectForm.preview}
                    onChange={(e) => setProjectForm({ ...projectForm, preview: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label>Accent Color (Hex)</label>
                  <div className="color-input-wrap">
                    <input
                      type="color"
                      value={projectForm.accent}
                      onChange={(e) => setProjectForm({ ...projectForm, accent: e.target.value })}
                    />
                    <input
                      type="text"
                      value={projectForm.accent}
                      onChange={(e) => setProjectForm({ ...projectForm, accent: e.target.value })}
                    />
                  </div>
                </div>
              </div>

              <div className="admin-field-group">
                <label>Description *</label>
                <textarea
                  rows={3}
                  required
                  placeholder="Summary of the project..."
                  value={projectForm.description}
                  onChange={(e) => setProjectForm({ ...projectForm, description: e.target.value })}
                />
              </div>

              <div className="admin-field-group">
                <label>Key Highlights / Bullet Points (One per line)</label>
                <textarea
                  rows={3}
                  placeholder="Architected PostgreSQL schema&#10;Integrated JWT auth with 12+ APIs"
                  value={projectForm.pointsStr}
                  onChange={(e) => setProjectForm({ ...projectForm, pointsStr: e.target.value })}
                />
              </div>

              <div className="admin-field-group">
                <label>Tech Stack (Comma-separated)</label>
                <input
                  type="text"
                  placeholder="React.js, Node.js, Express, PostgreSQL"
                  value={projectForm.stackStr}
                  onChange={(e) => setProjectForm({ ...projectForm, stackStr: e.target.value })}
                />
              </div>

              <div className="admin-form-grid">
                <div className="admin-field-group">
                  <label>GitHub Repository URL</label>
                  <input
                    type="url"
                    value={projectForm.code}
                    onChange={(e) => setProjectForm({ ...projectForm, code: e.target.value })}
                  />
                </div>

                <div className="admin-field-group">
                  <label>Live Site URL (Optional)</label>
                  <input
                    type="url"
                    placeholder="https://..."
                    value={projectForm.live}
                    onChange={(e) => setProjectForm({ ...projectForm, live: e.target.value })}
                  />
                </div>
              </div>

              <div className="sub-modal-actions">
                <button
                  type="button"
                  className="btn btn-outline"
                  onClick={() => setProjectModalOpen(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="btn btn-primary">
                  <Save size={15} />
                  <span>{editingProjectId ? "Update Project" : "Add Project"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPanel;

