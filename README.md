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
│   │   └── db.js               # PostgreSQL Pool connection & queries
│   ├── controllers/
│   │   ├── contactController.js # Direct PostgreSQL queries for contact form
│   │   ├── projectController.js # Direct PostgreSQL queries for projects
│   │   ├── statsController.js   # Direct PostgreSQL queries for visitor analytics
│   │   └── infoController.js    # Direct PostgreSQL queries for profile & skills
│   ├── routes/
│   │   ├── contactRoutes.js    # POST /api/contact, GET /api/contact, etc.
│   │   ├── projectRoutes.js    # GET /api/projects, POST /api/projects
│   │   ├── statsRoutes.js      # GET /api/stats, POST /api/stats/visit
│   │   └── infoRoutes.js       # GET /api/info
│   ├── middleware/
│   │   ├── errorHandler.js
│   │   └── rateLimiter.js
│   ├── utils/
│   │   └── emailService.js     # Nodemailer email notification service
│   ├── scripts/
│   │   └── verifyDb.js         # Live PostgreSQL database verification script
│   ├── server.js               # Express server entry point
│   └── .env                    # Environment variables
├── frontend/                   # React + Vite application
│   ├── src/
│   │   ├── components/         # Hero, About, Experience, Projects, Contact, etc.
│   │   ├── services/api.js     # Backend API integration service
│   │   └── ...
├── .gitignore                  # Git ignore rules
└── README.md                   # Project documentation
```

---

## 🐘 PostgreSQL Tables Schema

When PostgreSQL connects (or when running `npm run db:migrate`), all 7 tables are created and all JSON data is migrated to PostgreSQL:

1. **`profile`**:
   - `id`, `name`, `title`, `company`, `location`, `email`, `phone`, `whatsapp`, `github`, `linkedin`, `twitter`, `summary`, `education` (JSONB)
2. **`experience`**:
   - `id`, `role`, `company`, `period`, `status`, `summary`, `points` (TEXT[]), `order_index`
3. **`skills`**:
   - `id`, `category_key`, `category_name`, `items` (TEXT[])
4. **`certifications`**:
   - `id`, `title`, `issuer`, `year`, `score`
5. **`projects`**:
   - `id`, `title`, `type`, `preview`, `accent`, `description`, `points` (TEXT[]), `stack` (TEXT[]), `code`, `live`, `featured`
6. **`stats`**:
   - `key`, `value`, `last_updated`
7. **`contact_messages`**:
   - `id`, `name`, `email`, `subject`, `message`, `status`, `ip_address`, `created_at`, `updated_at`

---

## 💾 Migrate All JSON Data to PostgreSQL

To migrate/seed all JSON data into PostgreSQL at any time:
```bash
cd backend
npm run db:migrate
# or
npm run db:seed
```

---

## 🚀 How to Run

### **Terminal 1: Start Backend**
```bash
cd backend
npm run dev
# Backend server runs at http://localhost:5000
```

### **Terminal 2: Start Frontend**
```bash
cd frontend
npm run dev
# Website runs at http://localhost:5173
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
