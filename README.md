# Lucky Sonker Portfolio 🚀 (Full-Stack)

Personal full-stack developer portfolio of **Lucky Sonker** — built with **React, Node.js, Express, and MongoDB**, featuring interactive contact messaging, project dynamic API, and visitor analytics.

---

## 🛠 Tech Stack

### **Frontend**
- **React.js 19** + **Vite**
- **Framer Motion** (smooth layout animations & reveals)
- **Lucide Icons**
- **CSS3 Variables & Design Tokens** (dark / light theme)

### **Backend**
- **Node.js** + **Express.js**
- **MongoDB & Mongoose** (with built-in local JSON storage engine fallback when MongoDB is offline)
- **Nodemailer** (automated email alerts on new contact messages)
- **Express Rate Limit** (anti-spam protection on contact endpoints)
- **CORS & Dotenv**

---

## 📂 Project Structure

```
Portfolio/
├── backend/
│   ├── config/
│   │   └── db.js               # MongoDB connection with fallback detection
│   ├── controllers/
│   │   ├── contactController.js # Handles contact form submissions & queries
│   │   ├── projectController.js # Dynamic projects management
│   │   ├── statsController.js   # Visitor & resume download analytics
│   │   └── infoController.js    # Profile & experience info
│   ├── models/
│   │   ├── ContactMessage.js   # Mongoose Schema for inquiries
│   │   ├── Project.js          # Mongoose Schema for projects
│   │   └── Stat.js             # Mongoose Schema for metrics
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

## 🚀 How to Run

### **1. Run Backend**
```bash
cd backend
npm run dev
# Server starts at http://localhost:5000
```

### **2. Run Frontend**
```bash
cd frontend
npm run dev
# Vite runs at http://localhost:5173
```

### **3. Run Both from Root**
```bash
npm run dev:backend
npm run dev:frontend
```

---

## 📡 Backend API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/health` | Server uptime & DB connection status |
| `POST` | `/api/contact` | Submit contact form inquiry (with rate limiting & email alert) |
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

## ⚙️ Environment Variables (`backend/.env`)

```env
PORT=5000
NODE_ENV=development
FRONTEND_URL=http://localhost:5173

# Optional: MongoDB connection string (leave blank to use local JSON fallback)
MONGODB_URI=

# Optional: Nodemailer SMTP credentials for email alerts
SMTP_HOST=
SMTP_PORT=587
SMTP_USER=
SMTP_PASS=
NOTIFICATION_EMAIL=sonkerlucky5@gmail.com
```

---

## 📬 Contact

- **Email:** sonkerlucky5@gmail.com  
- **GitHub:** [sonkerlucky5-cmd](https://github.com/sonkerlucky5-cmd)  
- **LinkedIn:** [Lucky Sonker](https://www.linkedin.com/in/lucky-sonker-24539a2b4)  
- **WhatsApp:** [+91 93350 48020](https://wa.me/919335048020)

---
*Built with ❤️ by [Lucky Sonker](https://github.com/sonkerlucky5-cmd).*
