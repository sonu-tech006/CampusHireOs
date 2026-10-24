# 🎓 CampusHire OS — Smart College Placement Management Platform

[![Live Demo](https://img.shields.io/badge/Live%20Demo-campushire--os.ai.studio-6366f1?style=for-the-badge&logo=google-chrome&logoColor=white)](https://campushire-os.ai.studio)
[![License: MIT](https://img.shields.io/badge/License-MIT-emerald.svg?style=for-the-badge)](LICENSE)
[![MongoDB Atlas](https://img.shields.io/badge/MongoDB%20Atlas-Live%20Cluster-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/cloud/atlas)
[![React 19](https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind%20CSS-v4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)

> **One platform. Every opportunity.**  
> A high-performance, full-stack placement operations platform built for modern colleges and universities. Automates eligibility verification, recruitment drive pipelines, live interview scheduling, student profiles, and placement intelligence reports with real-time MongoDB Atlas persistence.

🌐 **Live Production Link:** [https://campushire-os.ai.studio](https://campushire-os.ai.studio)

---

## 🌟 Key Highlights & Screen Preview

| 🏛️ Placement Officer Console | 👨‍🎓 Student Career Portal |
| :---: | :---: |
| Full administrative control over drives, companies, eligibility criteria, multi-stage pipelines, and instant PDF applicant roster generation. | Personalized student dashboard, live opening discovery with automatic eligibility checks, application tracking, and profile management. |

```
┌─────────────────────────────────────────────────────────────────────────────┐
│ 🎓 CampusHire OS                       [🟢 MongoDB Atlas]  [🎨 Theme] [👤]  │
├───────────────┬─────────────────────────────────────────────────────────────┤
│ 📊 Dashboard  │  ⚡ Active Placement Season 2026                            │
│ 🏢 Companies  │  ┌───────────────┐ ┌───────────────┐ ┌────────────────────┐ │
│ 💼 Drives     │  │ 240+ Students │ │ 24 Companies  │ │ 18 Active Openings │ │
│ 📑 Applicants │  └───────────────┘ └───────────────┘ └────────────────────┘ │
│ 👥 Directory  │                                                             │
│ 📈 Analytics  │  📋 Recruitment Pipeline (Applied ➔ OA ➔ Tech ➔ HR ➔ Placed) │
│ 📢 Broadcasts │  📄 One-Click Formal PDF Applicant Reports with Letterhead  │
└───────────────┴─────────────────────────────────────────────────────────────┘
```

---

## 🚀 Key Features

- **🔐 Dual-Role Authentication (Admin & Student):**
  - Secure registration & login powered by **MongoDB Atlas**, **Bcrypt** (10 salt rounds), and signed **JWT (JSON Web Tokens)**.
  - Live status indicator displaying database cluster health, replica set host, and active connection state.
- **🎯 Automated Eligibility Gatekeeper:**
  - Evaluates student CGPA, active backlogs, historical backlogs, course, and department against corporate drive criteria in real time.
  - Displays instant eligibility badges: `Eligible` vs `Ineligible (Reason: Active backlogs > 0)`.
- **💼 End-to-End Application Tracking Pipeline:**
  - Interactive stage manager: `Applied` ➔ `Shortlisted` ➔ `Online Assessment` ➔ `Technical Interview` ➔ `HR Round` ➔ `Offered / Placed`.
  - Batch status updater with notes, test scores, and interview time slots.
- **📄 Professional PDF Roster Generation:**
  - Built-in `jsPDF` and `AutoTable` engine to generate formal, branded applicant dossiers with academic breakdown, contact info, and signature blocks.
  - CSV / Excel export for external campus records and corporate recruiters.
- **🎨 Dynamic Theme & Background Engine:**
  - **Tailwind CSS v4** class-based dark mode engine with instant zero-flicker transitions.
  - 5 Canvas Background Presets:
    - 🏢 **Tech Slate** (`#f8fafc` / `#0b0f19`)
    - 📜 **Warm Sand / Campus Ivory** (`#faf7f2` / `#151310`)
    - 🌌 **Midnight Blue** (`#f0f4f9` / `#080d1a`)
    - 🍃 **Emerald Sage** (`#f2f8f4` / `#061510`)
    - 🖤 **OLED Pure Black** (`#000000`)
  - 6 Vibrant Accent Colors: Indigo, Sky Blue, Violet, Emerald, Rose, Amber.
- **📊 Placement Intelligence & Analytics:**
  - Department-wise placement percentage, average/highest CTC salary brackets, top recruiter breakdown, and real-time audit trail.

---

## 🛠️ Tech Stack & Architecture

### Frontend
<p align="left">
  <img src="https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB" alt="React" />
  <img src="https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white" alt="TypeScript" />
  <img src="https://img.shields.io/badge/Tailwind_CSS_v4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" />
  <img src="https://img.shields.io/badge/Vite-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" />
  <img src="https://img.shields.io/badge/Lucide_Icons-F05032?style=for-the-badge&logo=git&logoColor=white" alt="Lucide Icons" />
</p>

### Backend & Middleware
<p align="left">
  <img src="https://img.shields.io/badge/Node.js-43853D?style=for-the-badge&logo=node.js&logoColor=white" alt="Node.js" />
  <img src="https://img.shields.io/badge/Express.js-404D59?style=for-the-badge&logo=express&logoColor=white" alt="Express" />
  <img src="https://img.shields.io/badge/JWT-000000?style=for-the-badge&logo=json-web-tokens&logoColor=white" alt="JWT" />
  <img src="https://img.shields.io/badge/Bcrypt-4A90E2?style=for-the-badge&logo=letsencrypt&logoColor=white" alt="Bcrypt" />
</p>

### Database & Cloud
<p align="left">
  <img src="https://img.shields.io/badge/MongoDB_Atlas-4EA94B?style=for-the-badge&logo=mongodb&logoColor=white" alt="MongoDB Atlas" />
  <img src="https://img.shields.io/badge/Mongoose_ODM-880000?style=for-the-badge&logo=mongoose&logoColor=white" alt="Mongoose" />
</p>

---

## 📐 Project Flow Diagrams

### 1. System Architecture Diagram

```mermaid
graph TD
    subgraph Client ["Frontend (React 19 + TypeScript + Tailwind v4)"]
        UI[CampusHire OS Web App]
        AuthCtx[Auth Context & JWT Store]
        ThemeCtx[Theme & Canvas Engine]
    end

    subgraph Server ["Backend (Node.js + Express + Vite Middleware)"]
        Router["/api/auth Router"]
        StatusRoute["/api/db-status Health Monitor"]
        BcryptModule[Bcrypt Salt 10 Hasher]
        TokenModule[JWT Sign & Verify Engine]
    end

    subgraph Database ["Cloud Database (MongoDB Atlas)"]
        AtlasCluster[(MongoDB Atlas Replica Set)]
        UserCol[Users Collection]
        ProfileCol[StudentProfiles Collection]
    end

    UI -->|HTTP / JSON| Router
    UI -->|Diagnostics| StatusRoute
    Router -->|Hash & Verify| BcryptModule
    Router -->|Issue Token| TokenModule
    Router -->|Mongoose ODM| AtlasCluster
    AtlasCluster --> UserCol
    AtlasCluster --> ProfileCol
    ThemeCtx -->|CSS Variables & Custom Variant| UI
```

### 2. Recruitment & Placement Workflow

```mermaid
sequenceDiagram
    autonumber
    actor Admin as 🏛️ Placement Cell
    actor Student as 👨‍🎓 Student
    participant System as ⚙️ CampusHire OS
    participant DB as 🍃 MongoDB Atlas

    Admin->>System: Post Company & Job Opening (CGPA, Backlogs, CTC)
    System->>DB: Save Opening Details
    Student->>System: Browse Opportunities
    System->>System: Evaluate Live Eligibility (CGPA ≥ Min, Backlogs ≤ Max)
    alt Student is Eligible
        Student->>System: Submit 1-Click Application
        System->>DB: Store Application Record (Stage: Applied)
        System-->>Student: Success Notification
    else Ineligible
        System-->>Student: Display Ineligible Flag & Reason
    end
    Admin->>System: Review Applicants & Update Pipeline Stage (OA ➔ Tech ➔ HR)
    Admin->>System: Mark Student as "Placed"
    Admin->>System: Generate Branded PDF Applicant Report
    System-->>Admin: Download Official Placement Dossier
```

---

## 📂 Project Directory Structure

```
├── .env.example               # Environment template
├── LICENSE                    # MIT License
├── README.md                  # Project documentation
├── index.html                 # HTML Entry Point
├── package.json               # Dependencies and scripts
├── server.ts                  # Express backend & Vite middleware
├── server/
│   ├── db/
│   │   └── connection.ts      # MongoDB Atlas connection manager & fallback
│   ├── models/
│   │   ├── StudentProfile.ts  # Mongoose model for Student Profiles
│   │   └── User.ts            # Mongoose model for User Accounts & Bcrypt
│   └── routes/
│       └── auth.ts            # /api/auth registration, login & status routes
└── src/
    ├── components/
    │   ├── admin/             # Admin console (Pipeline, Drives, PDF Exports)
    │   ├── layout/            # Navbar, Sidebar, Theme customizer
    │   ├── public/            # Landing page, Auth modal
    │   └── student/           # Student portal (Applications, Profile, Jobs)
    ├── context/
    │   ├── AuthContext.tsx    # Auth state & MongoDB Atlas session sync
    │   └── ThemeContext.tsx   # Canvas background & color switcher
    ├── services/
    │   ├── pdfExport.ts       # jsPDF campus report generator
    │   └── storage.ts         # Persistent data layer
    └── index.css              # Tailwind v4 directives & CSS variables
```

---

## ⚡ Getting Started (Local Setup)

### Prerequisites
- [Node.js](https://nodejs.org/) (v18.0.0 or higher)
- [npm](https://www.npmjs.com/) or [bun](https://bun.sh/)
- A free [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) account (or local MongoDB)

### 1. Clone the repository
```bash
git clone https://github.com/sonukr7435/campushire-os.git
cd campushire-os
```

### 2. Install dependencies
```bash
npm install
```

### 3. Configure environment variables
Create a `.env` file in the root directory:
```env
# MongoDB Atlas Connection URI
MONGODB_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/campushire?retryWrites=true&w=majority"

# JWT Secret for Session Tokens
JWT_SECRET="your-super-secret-jwt-key"

# Port (defaults to 3000)
PORT=3000
```

### 4. Start the Development Server
```bash
npm run dev
```
Open your browser at `http://localhost:3000` to access CampusHire OS.

### 5. Build for Production
```bash
npm run build
npm start
```

---

## 📡 REST API Reference

| Method | Endpoint | Description | Auth Required |
| :--- | :--- | :--- | :---: |
| `POST` | `/api/auth/register` | Register new student or admin account into MongoDB Atlas | No |
| `POST` | `/api/auth/login` | Authenticate with email/student ID & password | No |
| `GET` | `/api/auth/me` | Fetch currently logged-in user and student profile | Yes (`Bearer <token>`) |
| `GET` | `/api/db-status` | Check real-time MongoDB Atlas cluster connectivity & host | No |
| `POST` | `/api/auth/connect-mongodb` | Dynamically update MongoDB connection string or password | Admin |
| `GET` | `/api/health` | Health check probe returning service uptime and timestamp | No |

---

## 📄 License

This project is open-source and licensed under the **[MIT License](LICENSE)**.

---

## 👨‍💻 Author & Connect

**Sonu Kumar**  
Full Stack Developer & Software Engineer

- 📧 **Email:** [sonukr7435@gmail.com](mailto:sonukr7435@gmail.com)
- 🌐 **Portfolio:** [https://animated-portfolio-pro.vercel.app/](https://animated-portfolio-pro.vercel.app/)
- 💼 **LinkedIn:** [https://www.linkedin.com/in/sonu-kumar-3234bb344/](https://www.linkedin.com/in/sonu-kumar-3234bb344/)
- 🚀 **Live Project:** [https://campushire-os.ai.studio](https://campushire-os.ai.studio)

---

<p align="center">
  Made with ❤️ by Sonu Kumar for college placement cells & students across universities.
</p>
