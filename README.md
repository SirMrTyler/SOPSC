# 📖 SOPSC Public Safety Platform – Developer README

Welcome to the SOPSC App, a full-stack public safety platform for chaplains and first responders serving multiple counties. This README outlines the system architecture, roles, access permissions, and project roadmap to streamline collaboration and onboarding for future developers (including Codex).

---

## 📌 Project Purpose

The SOPSC app is designed to support spiritual first responders by enabling:

- Secure authentication (OAuth 2.0, JWT)
- Structured role-based user interaction (Guest → Admin)
- Cross-platform communication (messages, calls, video)
- Real-time emergency logging, prayer requests, and reporting
- Event coordination across divisions and agencies

---

## 🧑‍🤝‍🧑 Role-Based Access Control (RBAC)

Each user is assigned a role (integer-based) with escalating privileges:

| Role      | Value | Description                        |
| --------- | ----- | ---------------------------------- |
| Developer | 1     | Full CRUD access to all endpoints  |
| Admin     | 2     | Full system control                |
| Member    | 3     | Can log in, message, attend events |
| Guest     | 4     | Can register, limited read access  |

Endpoints and permissions are strictly enforced per [`UserAccessRules.md`](./UserAccessRules.md). Chaplains serve as intermediaries—approving requests for contact with Admins, verifying reports, and managing events.

---

## 🔐 Authentication & Security

- **Primary Authentication:** Google & Apple Sign-In using OAuth 2.0
- **Secondary/Fallback:** Email & password login with secure password storage
- **Token Management:** JWT + SecureStore (mobile), expiring sessions
- **User Verification:** Email confirmation + approval pipeline
- **Sensitive Flow:** Admin communication and video calls require Chaplain approval first
- **Transport:** SSL/TLS enforced
- **API Access:** Role-based middleware on all routes
- **Secrets:** GitHub secret scanning and push protection enabled

---

## 🗂️ Data Model (SQL Server)

**Core Tables:**

- `Users`, `Reports`, `Messages`, `Notifications`, `Roles`, `PrayerRequests`, `Agencies`, `Media`, `Divisions`, `Calendar` (planned), `AdminTools` (planned)

Each table is documented in [`UserAccessRules.md`](./UserAccessRules.md) with relationships and constraints.

---

## 📅 Feature Roadmap Summary

| Phase | Feature                           | Status         | Priority  |
| ----- | --------------------------------- | -------------- | --------- |
| 1     | Google & Apple Sign-In            | ✅ Complete    | 🔥 High   |
| 2     | Email Auth + Role Enforcement     | ✅ Complete    | 🔥 High   |
| 3     | Messaging, Calls, Group Chats     | ⚒️ In Progress | ⚡ Medium |
| 4     | Event Calendar                    | ⚒️ In Progress | ⚡ Medium |
| 5     | Reports & Metrics                 | ⚒️ In Progress | ⚡ Medium |
| 6     | Admin Dashboard + Agency Tracking | ⏳ Finalizing  | ✅ Final  |

Detailed steps and dependencies per phase are available in [`ROADMAP.md`](./ROADMAP.md).

---

## 🧩 Tech Stack

| Layer     | Stack/Tool                         |
| --------- | ---------------------------------- |
| Frontend  | Expo (React Native)                |
| Backend   | ASP.NET Core Web API (C#)          |
| Database  | Microsoft SQL Server 2022          |
| Auth      | OAuth 2.0 (Google, Apple, Email)   |
| Messaging | Expo WebSockets (Realtime comms)   |
| Storage   | Expo SecureStore (JWT tokens)      |
| Email     | SendGrid / SMTP (for verification) |

---

## 🚦 Key Implementation Rules

- 🧱 Use `.NET` API to manage roles and token-based login.
- 🔐 Secure all routes by role using middleware or endpoint checks.
- 📩 All communication must follow chain-of-command:
  - Members ↔ Chaplains ↔ Admins
- 📝 Reports must include: narrative, call time, mileage, agencies.
- 📅 Event visibility is filtered by user role.

---

## 🛠 Developer Setup

### Frontend Setup

```bash
cd Frontend/sopsc-mobile-app
yarn install
yarn start  # Start Expo Dev Client
```

### Backend Setup

```bash
cd Backend/SOPSC.Api
dotnet build
dotnet run
```

Requires: .NET 8 SDK

### Database Setup

- Run scripts in `/SQL` to generate database schema
- Run stored procedures for core CRUD
- Copy `Backend/SOPSC.Api/.env.example` to `.env` and set `ConnectionStrings__DefaultConnection` and `JWT_KEY`
- The API loads variables from this `.env` file at startup. **Do not commit it.**

---

## 🗒 Backend Dev Notes

### How to Add a Table

1. Define table schema → add to `/SQL`
2. Create matching stored procedures:
   - `[TableName]_Insert`
   - `[TableName]_SelectAll`
   - `[TableName]_SelectById`
   - `[TableName]_Update`
   - `[TableName]_Delete`
3. Add Controller in `Backend/SOPSC.Api/Controllers/`
4. Register endpoints in API

---

## Deploy Updates:

Navigate to your [GitHub Actions tab](https://github.com/SirMrTyler/SOPSC/actions) after pushing to `main`.

### ✅ To deploy updates:

1. Make your code changes in the `main` branch (or merge PRs into it).
2. Push to GitHub.
3. GitHub Actions will automatically trigger:
   - `build` → compiles the .NET backend
   - `deploy` → publishes the API to Azure Web App

### 🔍 To verify:

- Go to **GitHub → Actions → Latest Workflow**
- Ensure both `build` and `deploy` jobs succeed
- If successful, your API is now live at:

### ⚙️ Troubleshooting:

- Failed deploy? Check that:
  - `.env` values are valid
  - Your GitHub secrets (`client-id`, `tenant-id`, `subscription-id`) are correct
  - No syntax errors exist in the `.yml` workflow
- If needed, re-run the workflow manually from GitHub using **"Run workflow"**

> NOTE: Only the backend is deployed via this flow. The frontend must be built and deployed separately using Expo EAS.

---

## ⚠️ Dev Warnings

- **Do not expose JWTs or sensitive keys.**
- **Admin routes must NOT be accessible to users below RoleId = 4.**
- **Chaplains act as filters between Member requests and Admin interaction.**
- **Reports and media should link back via FK to their origin users.**
- **Group chat, video, and calendar features are under staged rollout.**
- **GitHub secret scanning is active — do not commit `.env` files, API keys, or tokens.**

---

## 📎 Related Files

- [`ROADMAP.md`](./Planning/ROADMAP.md)
- [`UserAccessRules.md`](./Planning/UserAccessRules.md)

---

## 🧠 Contribution Notes

Codex and developers should **always validate user permissions** before proceeding with:

- Messaging
- Call requests
- Report creation
- Prayer request actions
- Calendar edits
- Admin-level tools

Use the `RoleId` and corresponding access table as your source of truth.

---

## 🧭 Final Notes

This project is active and used in a live capacity by public safety teams. Maintain **data integrity, user trust, and operational stability** at all times.

For questions, contact the lead developer: Tyler Klein  
GitHub: [github.com/SirMrTyler](https://github.com/SirMrTyler)  
License: Proprietary

---
