# Lucky Sonker Portfolio 🚀 (Full-Stack)

Personal full-stack developer portfolio of **Lucky Sonker** — built with **React, Node.js, Express, and PostgreSQL**, featuring interactive contact messaging, project dynamic API, and visitor analytics.

---

## 🛠 Tech Stack

### **Frontend**
- **React.js 19** + **Vite**
- **Framer Motion** (smooth layout animations & reveals)
- **Lucide Icons**
- **CSS3 Variables & Design Tokens** (dark / light theme)

### **Backend**
- **Node.js** + **Express.js**
- **PostgreSQL (`pg` Pool)** with auto-table migration & default project seeding
- **Local JSON Store Fallback** (allows the backend to run even if PostgreSQL is temporarily offline)
- **Nodemailer** (automated email alerts on new contact messages)
- **Express Rate Limit** (anti-spam protection on contact endpoints)
- **CORS & Dotenv**

---

## 📂 Project Structure

```
Portfolio/
├── backend/
│   ├── config/
│   │   └── db.js               # PostgreSQL Pool connection & auto-table migration
│   ├── controllers/
│   │   ├── contactController.js # Handles contact form submissions & queries
│   │   ├── projectController.js # Dynamic projects management
│   │   ├── statsController.js   # Visitor & resume download analytics
│   │   └── infoController.js    # Profile & experience info
│   ├── routes/
│   │   ├── contactRoutes.js    # POST /api/contact, GET /api/contact, etc.
│   │   ├── projectRoutes.js    # GET /api/projects, POST /api/projects
│   │   ├── statsRoutes.js      # GET /api/stats, POST /api/stats/visit
│   │   └── infoRoutes.js       # GET /api/info
│   ├── data/
│   │   ├── localStore.js       # Persistent local JSON store fallback
│   │   ├── defaultProjects.json
│   │   ├── defaultProfile.json
│   │   ├── messages.json
│   │   └── stats.json
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── utils/
│   │   └── emailService.js     # Nodemailer email notification service
│   ├── scripts/
│   │   ├── setupPostgres.js    # Standalone PostgreSQL table setup & seed script
│   │   └── testLocal.js        # Backend unit test runner
│   ├── server.js               # Express server entry point
│   └── .env                    # Environment variables
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # Hero, About, Experience, Projects, Contact, etc.
│   │   ├── services/api.js     # Backend API integration service
│   │   └── ...
└── package.json                # Root package manager scripts
```

---

## 🐘 PostgreSQL Tables Schema

When PostgreSQL connects, these tables are automatically created:

1. **`contact_messages`**:
   - `id` (SERIAL PRIMARY KEY)
   - `name` (VARCHAR(100))
   - `email` (VARCHAR(255))
   - `subject` (VARCHAR(200))
   - `message` (TEXT)
   - `status` (VARCHAR(20) DEFAULT 'unread')
   - `ip_address` (VARCHAR(100))
   - `created_at` (TIMESTAMP WITH TIME ZONE)
   - `updated_at` (TIMESTAMP WITH TIME ZONE)

2. **`projects`**:
   - `id` (SERIAL PRIMARY KEY)
   - `title`, `type`, `preview`, `accent`, `description`
   - `points` (TEXT[])
   - `stack` (TEXT[])
   - `code`, `live`, `featured`
   - `created_at`, `updated_at`

3. **`stats`**:
   - `key` (VARCHAR(50) PRIMARY KEY)
   - `value` (INTEGER)
   - `last_updated` (TIMESTAMP WITH TIME ZONE)

---

## 🚀 How to Run

### **Option A: Run Both Together (Single Terminal - Recommended)**
From the project root:
```bash
npm run dev
```
*(Starts both Backend on `http://localhost:5000` and Frontend on `http://localhost:5173` with color-coded logs!)*

---

### **Option B: Run in Separate Terminals**

#### **Terminal 1 (Backend)**
```bash
cd backend
npm run dev
# Server running at http://localhost:5000
```

#### **Terminal 2 (Frontend)**
```bash
cd frontend
npm run dev
# Website running at http://localhost:5173
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server uptime & DB connection status (`connected (PostgreSQL)`) |
| `POST` | `/api/contact` | Submit contact form inquiry (saved to Postgres + email alert) |
| `GET` | `/api/contact` | Retrieve list of all contact messages |
| `PATCH` | `/api/contact/:id/read` | Mark message as read |
| `DELETE` | `/api/contact/:id` | Delete a message |
| `GET` | `/api/projects` | Fetch all portfolio projects |
| `POST` | `/api/projects` | Add a new project |
| `GET` | `/api/stats` | Get page views, resume downloads & total messages |
| `POST` | `/api/stats/visit` | Increment visitor counter |
| `POST` | `/api/stats/resume-download` | Increment resume download counter |
| `GET` | `/api/info` | Get Lucky's profile and experience details |

---

## 📬 Contact

- **Email:** sonkerlucky5@gmail.com  
- **GitHub:** [sonkerlucky5-cmd](https://github.com/sonkerlucky5-cmd)  
- **LinkedIn:** [Lucky Sonker](https://www.linkedin.com/in/lucky-sonker-24539a2b4)  
- **WhatsApp:** [+91 93350 48020](https://wa.me/919335048020)

---
*Built with ❤️ by [Lucky Sonker](https://github.com/sonkerlucky5-cmd).*
