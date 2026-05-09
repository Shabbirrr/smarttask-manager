<p align="center">
  <img src="Client/public/favicon.ico" alt="WorkFlow Logo" width="80" />
</p>

<h1 align="center">WorkFlow</h1>

<p align="center">
  <strong>A modern, full-stack project management app for teams</strong>
</p>

<p align="center">
  Manage workspaces, projects, tasks, and teams — with real-time collaboration, analytics, and email notifications.
</p>

<p align="center">
  <a href="https://workfloww.vercel.app">🌐 Live Demo</a> •
  <a href="#screenshots">Screenshots</a> •
  <a href="#features">Features</a> •
  <a href="#tech-stack">Tech Stack</a> •
  <a href="#getting-started">Getting Started</a> •
  <a href="#project-structure">Project Structure</a> •
  <a href="#api-reference">API Reference</a> •
  <a href="#deployment">Deployment</a> •
  <a href="#contributing">Contributing</a> •
  <a href="#license">License</a>
</p>

---

## About

**WorkFlow** is a production-ready, enterprise-grade project management platform designed to streamline how teams plan, track, and deliver work. Built from the ground up with a modern tech stack — **React 19**, **Express 5**, **Prisma ORM**, and **serverless PostgreSQL** — it delivers a fast, responsive experience across devices.

Unlike basic to-do apps, WorkFlow provides a complete project lifecycle solution: from creating workspaces and organizing projects with timelines and priorities, to assigning tasks with real-time discussion threads, visual analytics dashboards with interactive charts, and a calendar view for deadline tracking. The platform features secure, production-grade authentication via **Clerk** (with Organizations support for multi-tenant workspaces), event-driven background processing via **Inngest** for seamless user sync and automated email notifications, and a polished dark mode UI built with **Tailwind CSS v4**.

Whether you're a solo developer managing side projects or a team coordinating across multiple workspaces, WorkFlow gives you the tools to stay organized, meet deadlines, and ship faster.

---

## Screenshots

### Dashboard
Get a bird's-eye view of your workspace — stats, project overviews, recent activity, and your assigned tasks all in one place.

![Dashboard](screenshots/dashboard.png)

![Dashboard Activity](screenshots/dashboard-activity.png)

### Project Details & Task Management
Dive into any project to see task lists with filtering by status, type, priority, and assignee. Track progress and manage your team.

![Project Details](screenshots/project-details.png)

### Create Projects & Tasks
Quickly create new projects with status, priority, timeline, team lead, and member assignments — or spin up tasks with type, priority, assignee, and due dates.

<p>
  <img src="screenshots/create-project.png" alt="Create Project" width="49%" />
  <img src="screenshots/create-task.png" alt="Create Task" width="49%" />
</p>

### Task Discussion
Collaborate with real-time comments on tasks. View full task details, project context, and due dates at a glance.

![Task Discussion](screenshots/task-discussion.png)

---

## Features

- 🏢 **Workspaces** — Create and switch between workspaces powered by Clerk Organizations. Invite members with role-based access (Admin / Member).
- 📁 **Projects** — Create projects with status tracking (Planning → Active → Completed), priority levels, timelines, progress tracking, and team assignment.
- ✅ **Tasks** — Full task lifecycle management with types (Bug, Feature, Task, Improvement), priorities, status updates, assignees, and due dates.
- 💬 **Task Discussion** — Real-time comment threads on tasks with auto-refresh every 10 seconds.
- 👥 **Team Management** — View team members, invite new members via email, see per-member task assignments and contributions.
- 📊 **Analytics Dashboard** — Project-level analytics with interactive charts — task status breakdown (bar chart), task type distribution (pie chart), priority breakdown, and key metrics (completion rate, overdue tasks).
- 📅 **Calendar View** — Visual calendar showing task due dates, overdue indicators, and upcoming/overdue task lists.
- 🔍 **Global Search** — Search across all projects and tasks from the navbar.
- 📧 **Email Notifications** — Automatic email sent to assignees when a new task is created (via Inngest background jobs + Nodemailer).
- 🌗 **Dark Mode** — Full dark mode support with theme persistence across sessions.
- 📱 **Responsive Design** — Mobile-friendly UI with collapsible sidebar and adaptive layouts.

---

## Tech Stack

### Frontend
| Technology | Purpose |
|---|---|
| [React 19](https://react.dev) | UI framework |
| [Vite 7](https://vite.dev) | Build tool & dev server |
| [Tailwind CSS v4](https://tailwindcss.com) | Utility-first styling |
| [Redux Toolkit](https://redux-toolkit.js.org) | State management |
| [React Router v7](https://reactrouter.com) | Client-side routing |
| [Clerk](https://clerk.com) | Authentication & Organizations |
| [Recharts](https://recharts.org) | Charts & analytics |
| [Axios](https://axios-http.com) | HTTP client |
| [date-fns](https://date-fns.org) | Date formatting |
| [react-hot-toast](https://react-hot-toast.com) | Toast notifications |
| [Lucide React](https://lucide.dev) | Icons |

### Backend
| Technology | Purpose |
|---|---|
| [Express 5](https://expressjs.com) | Web framework |
| [Prisma ORM](https://prisma.io) | Database ORM |
| [Neon](https://neon.tech) | Serverless PostgreSQL |
| [Clerk](https://clerk.com) | Auth middleware |
| [Inngest](https://inngest.com) | Background jobs & event-driven functions |
| [Nodemailer](https://nodemailer.com) | Email delivery (via Brevo SMTP) |

---

## Getting Started

### Prerequisites

- **Node.js** 18+
- A [Clerk](https://clerk.com) account — for authentication & organizations
- A [Neon](https://neon.tech) database — serverless PostgreSQL
- An [Inngest](https://inngest.com) account — for background job processing
- SMTP credentials — for email notifications (e.g., [Brevo](https://brevo.com))

### 1. Clone the Repository

```bash
git clone https://github.com/Shabbirrr/workflow.git
cd workflow
```

### 2. Set Up Environment Variables

**Client** — create `Client/.env`:
```env
VITE_CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key
VITE_BASEURL=http://localhost:5000
```

**Server** — create `server/.env`:
```env
# Database
DATABASE_URL=postgresql://user:password@host/db?sslmode=require
DIRECT_URL=postgresql://user:password@host/db?sslmode=require

# Clerk
CLERK_SECRET_KEY=sk_test_your_clerk_secret_key
CLERK_PUBLISHABLE_KEY=pk_test_your_clerk_publishable_key

# Email (Brevo SMTP)
SMTP_USER=your_smtp_user
SMTP_PASS=your_smtp_password
SENDER_EMAIL=noreply@yourdomain.com

# Inngest
INNGEST_EVENT_KEY=your_inngest_event_key
INNGEST_SIGNING_KEY=your_inngest_signing_key
```

### 3. Install Dependencies

```bash
# Server
cd server
npm install

# Client
cd ../Client
npm install
```

### 4. Set Up the Database

```bash
cd server
npx prisma generate
npx prisma db push
```

### 5. Run Locally

```bash
# Terminal 1 — Start the server
cd server
npm run server

# Terminal 2 — Start the client
cd Client
npm run dev
```

- **Client:** http://localhost:5173
- **Server:** http://localhost:5000

### 6. Set Up Inngest (Background Jobs)

Inngest handles user sync (Clerk webhooks) and email notifications. In development:

```bash
npx inngest-cli@latest dev
```

Then configure your Clerk webhook to point to your Inngest endpoint.

---

## Project Structure

```
workflow/
├── Client/                          # React frontend
│   ├── public/                      # Static assets
│   ├── src/
│   │   ├── assets/                  # Images, icons, dummy data
│   │   ├── app/
│   │   │   └── store.js             # Redux store configuration
│   │   ├── features/
│   │   │   ├── workspaceSlice.js    # Workspace/project/task state
│   │   │   └── themeSlice.js        # Theme (dark/light) state
│   │   ├── configs/
│   │   │   └── api.js               # Axios instance
│   │   ├── components/
│   │   │   ├── Sidebar.jsx          # App sidebar with navigation
│   │   │   ├── Navbar.jsx           # Top navbar with search
│   │   │   ├── WorkspaceDropdown.jsx
│   │   │   ├── ProjectsSidebar.jsx  # Projects list in sidebar
│   │   │   ├── MyTasksSidebar.jsx   # User's tasks in sidebar
│   │   │   ├── StatsGrid.jsx       # Dashboard stat cards
│   │   │   ├── ProjectOverview.jsx  # Dashboard project list
│   │   │   ├── ProjectCard.jsx      # Project card for grid view
│   │   │   ├── ProjectTasks.jsx     # Task list with filters
│   │   │   ├── ProjectAnalytics.jsx # Charts & metrics
│   │   │   ├── ProjectCalendar.jsx  # Calendar view
│   │   │   ├── ProjectSettings.jsx  # Project edit form
│   │   │   ├── RecentActivity.jsx   # Recent tasks feed
│   │   │   ├── TasksSummary.jsx     # Task summary cards
│   │   │   ├── CreateProjectDialog.jsx
│   │   │   ├── CreateTaskDialog.jsx
│   │   │   ├── InviteMemberDialog.jsx
│   │   │   └── AddProjectMember.jsx
│   │   ├── pages/
│   │   │   ├── Layout.jsx           # Main layout (sidebar + navbar)
│   │   │   ├── Dashboard.jsx        # Home dashboard
│   │   │   ├── Projects.jsx         # Projects list with filters
│   │   │   ├── ProjectDetails.jsx   # Project detail (tabs)
│   │   │   ├── TaskDetails.jsx      # Task detail + comments
│   │   │   └── Team.jsx             # Team management
│   │   ├── App.jsx                  # Route definitions
│   │   ├── main.jsx                 # App entry point
│   │   └── index.css                # Global styles
│   ├── index.html
│   ├── vite.config.js
│   ├── eslint.config.js
│   ├── vercel.json
│   └── package.json
│
├── server/                          # Express backend
│   ├── controllers/
│   │   ├── workspaceController.js   # Workspace CRUD + member mgmt
│   │   ├── projectController.js     # Project CRUD + member mgmt
│   │   ├── taskController.js        # Task CRUD
│   │   └── commentController.js     # Comment CRUD
│   ├── routes/
│   │   ├── workspaceRoutes.js
│   │   ├── projectRoutes.js
│   │   ├── taskRoutes.js
│   │   └── commentRoutes.js
│   ├── middlewares/
│   │   └── authMiddleware.js        # Clerk auth guard
│   ├── configs/
│   │   ├── prisma.js                # Prisma client (Neon adapter)
│   │   └── nodemailer.js            # Email transporter
│   ├── inngest/
│   │   └── index.js                 # Background functions
│   ├── prisma/
│   │   └── schema.prisma            # Database schema
│   ├── server.js                    # Express app entry point
│   ├── vercel.json
│   └── package.json
│
└── .gitignore
```

---

## API Reference

All API routes require authentication via Clerk (`Authorization: Bearer <token>` header).

### Workspaces

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/workspaces` | Get all workspaces for the authenticated user (includes members, projects, tasks) |
| `POST` | `/api/workspaces/add-member` | Add a member to a workspace |

### Projects

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/projects` | Create a new project |
| `PUT` | `/api/projects` | Update a project |
| `POST` | `/api/projects/:projectId/addMember` | Add a member to a project |

### Tasks

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/tasks` | Create a new task (triggers email notification) |
| `PUT` | `/api/tasks/:id` | Update a task (status, priority, assignee, etc.) |
| `POST` | `/api/tasks/delete` | Delete tasks (batch — accepts `taskIds` array) |

### Comments

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/comments` | Add a comment to a task |
| `GET` | `/api/comments/:taskId` | Get all comments for a task |

### Inngest Events (Background Jobs)

| Event | Function | Description |
|-------|----------|-------------|
| `clerk/user.created` | Sync User Creation | Creates user in DB when signed up via Clerk |
| `clerk/user.updated` | Sync User Update | Updates user profile in DB |
| `clerk/user.deleted` | Sync User Deletion | Removes user from DB |
| `clerk/organization.created` | Sync Workspace Creation | Creates workspace + admin membership |
| `clerk/organization.updated` | Sync Workspace Update | Updates workspace name/slug/image |
| `clerk/organization.deleted` | Sync Workspace Deletion | Removes workspace from DB |
| `clerk/organizationInvitation.accepted` | Sync Member Join | Creates workspace membership |
| `app/task.created` | Send Task Assignment Email | Emails the assignee with task details |

---

## Database Schema

The app uses **PostgreSQL** (via Neon) with **Prisma ORM**. Key models:

- **User** — Synced from Clerk (id, name, email, image)
- **Workspace** — Organizations with members and projects
- **WorkspaceMember** — Junction table with role (ADMIN / MEMBER)
- **Project** — Belongs to a workspace, has status, priority, timeline, and team lead
- **ProjectMember** — Junction table for project team members
- **Task** — Belongs to a project, has status (TODO / IN_PROGRESS / DONE), type, priority, assignee, and due date
- **Comment** — Belongs to a task and user

---

## Deployment

Both the client and server are configured for **Vercel** deployment.

### Deploy Server
```bash
cd server
vercel --prod
```

### Deploy Client
```bash
cd Client
vercel --prod
```

Make sure to set all environment variables in your Vercel project settings.

---

## Contributing

Contributions are welcome! See [CONTRIBUTING.md](Client/CONTRIBUTING.md) for guidelines.

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'feat: add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## License

This project is licensed under the MIT License — see [LICENSE.md](Client/LICENSE.md) for details.

Copyright (c) 2025 GreatStackDev  
Modifications Copyright (c) 2026 Shabbir Shah
