# PAIMANA

**Public. Traceable. Accountable.**

A project tracking and accountability platform for government infrastructure — built as a full-stack practice project.

🔗 **Live App:** [https://paymana.vercel.app](https://paymana.vercel.app) *(update with your final working URL)*
🔗 **Backend API:** [https://paymana.onrender.com](https://paymana.onrender.com)

> ⚠️ Free-tier hosting note: the backend (Render) spins down after periods of inactivity. The first request after idle time may take 30–50 seconds to respond while it wakes up — this is expected, not a bug.

---

## The Story Behind PAIMANA

Since my first day of college, I was very curious about the accommodation facilities provided by the college. But that curiosity changed into reality when I stepped into my hostel room.

Then, a new hope began with the ongoing construction of the **MEGA HOSTEL BUILDING**.

First year finished.
Second year finished.

But the floors of the building were also increasing — almost **one floor per year**.

Later, I came to know from my seniors that only **5 workers** were working on the project, trying hard to complete the construction with dedication.

And I was shocked when I came to know that the construction had actually started **7 years ago**.

## ONLY ONE QUESTION

# **ACCOUNTABILITY?** **ACCOUNTABILITY?**  **ACCOUNTABILITY?** ???

Then, as a CSE student, I came up with an idea.

**What if there was a platform accessible to everyone where they could track projects like this and take action if needed?**

What if people could see:
- When a project started?
- What was promised?
- What is the current progress?
- What milestones have been completed?
- Why is the project delayed?
- Who is responsible?
- And most importantly — **who is accountable?**

And that's how the idea of **PAIMANA** began.

---

## What is PAIMANA?

**PAIMANA** (पैमाना — "measure" or "standard" in Hindi/Urdu) is a project tracking and accountability platform designed to make government projects more transparent and accessible.

The platform allows users to track the progress of projects, monitor timelines and milestones, identify delays, and see who is responsible — turning invisible delays into visible, traceable, questionable facts.

```text
Project Starts
      ↓
PAIMANA tracks the progress
      ↓
Progress becomes visible
      ↓
Delays become visible
      ↓
Questions can be raised
      ↓
ACCOUNTABILITY
```

> **Note:** All project data in this repository is sample/demo data created for learning purposes. It is not live official government data.

---

## Screenshots
<img width="500" height="300" alt="image" src="https://github.com/user-attachments/assets/682e10a0-bfb9-43e3-b289-e840e3c8c9f1" />
<img width="500" height="300" alt="Screenshot 2026-08-24 144043" src="https://github.com/user-attachments/assets/7ca33090-1e88-4509-b8b9-638cf89a37a8" />
<img width="500" height="300" alt="Screenshot 2026-08-24 144043" src="https://github.com/user-attachments/assets/4fd9704b-d4e7-4bf8-8111-9c6af30059db" />


![Homepage](./screenshots/homepage.png)
![Project List](./screenshots/project-list.png)
![Project Detail](./screenshots/project-detail.png)
![Dashboard](./screenshots/dashboard.png)
![Map View](./screenshots/map.png)
-->

*(Screenshots to be added — see project structure section for where to place a `screenshots/` folder)*

---

## The Three Roles

| Role | What they do |
|---|---|
| **Government Employee** | Registers new projects, releases budget tranches, reviews and approves/rejects contractor progress updates |
| **Contractor** | Submits progress updates (% complete, amount utilized, notes) for projects they're assigned to — submissions sit **pending** until reviewed |
| **Public / Citizen** | Browses all projects, filters by state/category/status, views budget breakdowns, timelines, sources, and a full edit history — no login required |

The core design principle: **the public never sees a contractor's raw claim** — only data a government employee has verified. That approval gate is what makes this an accountability tool rather than just a database.

---

## Tech Stack

**Backend**
- Node.js + Express
- PostgreSQL (hosted on Neon)
- Prisma ORM
- JWT authentication + bcrypt password hashing
- Role-based access control middleware
- Deployed on **Render**

**Frontend**
- React (Vite)
- React Router
- Leaflet + OpenStreetMap (interactive project map)
- Deployed on **Vercel**

---

## Features

### Backend
- Full relational schema: `User`, `Project`, `Budget`, `Milestone`, `Source`, `ProgressUpdate`, `EditLog`
- Auth: register / login with hashed passwords and signed JWTs
- Role-based middleware (`ADMIN`, `GOVT_EMPLOYEE`, `CONTRACTOR`, `VIEWER`)
- Project CRUD with filtering (`state`, `category`, `status`, `search`) and pagination
- **Progress update approval workflow** — contractor submits → sits `PENDING` → employee approves/rejects → on approval, a database transaction updates the real project's `percentComplete` and `Budget.utilizedAmount`, and writes an `EditLog` entry, all atomically
- Every meaningful change (project creation, edits, approved progress updates) writes to `EditLog` with a diff, so every number on the public page is traceable
- Stats endpoint returning total sanctioned/utilized budget, delayed project count, and status breakdown
- Seed script with realistic sample projects and three test accounts

### Frontend
- **Project List** — all projects as cards (status badge, progress bar, budget), with search and filters (category, status, state)
- **Project Detail** — full budget breakdown, milestone timeline, sources, edit history; shows a progress-update submission form to the assigned contractor
- **Login** — JWT stored in `localStorage`, persists across page refresh
- **Add Project** form — visible only to `GOVT_EMPLOYEE` / `ADMIN`
- **Approval Queue** — visible only to `GOVT_EMPLOYEE` / `ADMIN`, approve/reject pending contractor submissions
- **Dashboard** — summary stats (total budget, delayed count, status breakdown)
- **Map View** — interactive map (Leaflet + OpenStreetMap) showing every project's real location, color-coded by status

---

## Project Structure

```
Paimana-FS/
├── README.md
├── screenshots/                 (add screenshots here)
├── backend/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── src/
│       ├── app.js
│       ├── server.js
│       ├── controllers/
│       │   ├── authController.js
│       │   ├── projectController.js
│       │   └── progressController.js
│       ├── middleware/
│       │   ├── auth.js
│       │   └── errorHandler.js
│       ├── routes/
│       │   ├── auth.js
│       │   ├── projects.js
│       │   └── progressUpdates.js
│       └── utils/
│           └── prisma.js
└── frontend/
    ├── vercel.json
    └── src/
        ├── App.jsx
        ├── main.jsx
        ├── api/
        │   ├── projects.js
        │   ├── auth.js
        │   └── progressUpdates.js
        ├── components/
        │   ├── ProjectCard.jsx
        │   ├── ProgressUpdateForm.jsx
        │   └── FilterBar.jsx
        └── pages/
            ├── ProjectList.jsx
            ├── ProjectDetail.jsx
            ├── Login.jsx
            ├── AddProject.jsx
            ├── ApprovalQueue.jsx
            ├── Dashboard.jsx
            └── MapView.jsx
```

---

## API Reference

```
GET    /api/health
POST   /api/auth/register
POST   /api/auth/login

GET    /api/projects                       (public — filters: state, category, status, search, page, limit)
GET    /api/projects/stats/summary         (public)
GET    /api/projects/:id                   (public)
POST   /api/projects                       [GOVT_EMPLOYEE, ADMIN]
PATCH  /api/projects/:id                   [GOVT_EMPLOYEE, ADMIN]
DELETE /api/projects/:id                   [ADMIN]

POST   /api/progress-updates               [CONTRACTOR]
GET    /api/progress-updates/pending       [GOVT_EMPLOYEE, ADMIN]
PATCH  /api/progress-updates/:id/review    [GOVT_EMPLOYEE, ADMIN]
```

---

## Local Setup

### Backend
```bash
cd backend
npm install
cp .env.example .env      # fill in DATABASE_URL (Neon/Supabase) and JWT_SECRET
npx prisma migrate dev --name init
npm run seed
npm run dev                # runs on http://localhost:5000
```

### Frontend
```bash
cd frontend
npm install
npm run dev                # runs on http://localhost:5173
```

To point the frontend at a different backend (e.g. your own deployed instance), set an environment variable:
```
VITE_API_URL=https://your-backend-url.onrender.com/api
```

### Test Accounts (after seeding)

| Role | Email | Password |
|---|---|---|
| Admin | admin@paimana.dev | password123 |
| Government Employee | employee@paimana.dev | password123 |
| Contractor | contractor@paimana.dev | password123 |

---

## Deployment

| Piece | Platform | Notes |
|---|---|---|
| Database | [Neon](https://neon.tech) | Free Postgres, serverless |
| Backend | [Render](https://render.com) | Free tier — spins down after inactivity |
| Frontend | [Vercel](https://vercel.com) | Free tier, auto-deploys on push to `main` |

**Important:** the frontend reads the backend URL from the `VITE_API_URL` environment variable (set in Vercel project settings), not a hardcoded value — this lets the same code run locally against `localhost:5000` and in production against the live Render URL.

---

## Why This Project Exists

Beyond the personal story above, this was built as a hands-on way to practice full-stack development — relational data modeling, authentication, role-based access control, database transactions, and React state management — around a real-world problem worth solving: making public infrastructure spending genuinely visible and accountable.
