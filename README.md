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

| Role      | Value | Description                            |
| --------- | ----- | -------------------------------------- |
| Guest     | 1     | Can register, limited read access      |
| Member    | 2     | Can log in, message, attend events     |
| Chaplain  | 3     | Approves calls, manages member content |
| Admin     | 4     | Full system control                    |
| Developer | 5     | Full CRUD access to all endpoints      |

Endpoints and permissions are strictly enforced per `UserAccessRules.md`. Chaplains serve as intermediaries—approving requests for contact with Admins, verifying reports, and managing events.

---

## 🔐 Authentication & Security

- **Primary Authentication:** Google & Apple Sign-In using OAuth 2.0
- **Secondary/Fallback:** Email & password login with secure password storage
- **Token Management:** JWT + SecureStore (mobile), expiring sessions
- **User Verification:** Email confirmation + approval pipeline
- **Sensitive Flow:** Admin communication and video calls require Chaplain approval first

---

## 🗂️ Data Model (SQL Server)

### Tables Include:

- `Users`: Core identity table (FKs: RoleId, TokenId)
- `Messages`: Messaging between users (SenderId, RecipientId)
- `Reports`: Incident logs (includes narrative, hours, mileage)
- `PrayerRequests`: Community spiritual support threads
- `Calendar`: Event scheduling with RSVP support (by role visibility)
- `Agencies`: Tracks external partners (fire/police departments, etc.)
- `AdminTools`: Moderation, warnings, bans, and role promotion requests
- `Notifications`: System alerts by event/message/report type

Each table is documented in `UserAccessRules.md` with relationships and constraints.

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

Detailed steps and dependencies per phase are available in `ROADMAP.md`.

---

## 🧩 Tech Stack

| Layer     | Stack/Tool                         |
| --------- | ---------------------------------- |
| Frontend  | Expo (React Native)                |
| Backend   | ASP.NET Core Web API (C#)          |
| Database  | Microsoft SQL Server               |
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

## ⚠️ Dev Warnings

- **Do not expose JWTs or sensitive keys.**
- **Admin routes must NOT be accessible to users below RoleId = 4.**
- **Chaplains act as filters between Member requests and Admin interaction.**
- **Reports and media should link back via FK to their origin users.**
- **Group chat, video, and calendar features are under staged rollout.**

---

## 🛠 Developer Setup (WIP)

1. Clone the repository
2. Install dependencies (`yarn` for front-end, `dotnet restore` for back-end)
3. Set up local environment variables:
   - Google/Apple OAuth credentials
   - API base URL
   - SQL Server connection string
4. Run front-end with `npx expo start`
5. Launch backend: `dotnet run`
6. Apply DB schema & seed dev data (manual scripts currently)

---

## 📎 Related Files

- [`ROADMAP.md`](./ROADMAP.md): Feature rollout and milestone tracking
- [`UserAccessRules.md`](./UserAccessRules.md): Role-level permissions and endpoint logic

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
Repo: _Private_  
License: Proprietary

---
