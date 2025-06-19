- Roadmap Overview

  1. 📌Phase 1: Google & Apple Sign-In (OAuth 2.0)

     - 🎯 Goal: Enable Google & Apple Sign-In as the primary authentication methods and integrate with .NET API.
     - ✅ Tasks
       1. Implement Google Sign-In using expo-auth-session/providers/google.
          1. Set up Google OAuth credentials in the Google Developer Console.
             - ~~Create new project~~
             - ~~Navigate to APIs & Services -> Credentials and create a new~~ [OAuth client ID](203699688611-tq6t38klc334rurgkg0hscc30ae252ve.apps.googleusercontent.com)
             - Configure redirect URIs for Expo AuthSession
          2. Install & configure expo-auth-session in the project
             - Install package: "expo install expo-auth-session"
             - Set up the Google authentication provider in authConfig.ts or inside the login screen.
          3. Create the Google Sign-In button and authentication flow.
             - Design a Google Sign-In button in the UI.
             - Implement the function to trigger Google login and obtain an access token.
          4. Send the authentication token to the backend (.NET API) for validation.
             - Extract the ID token from Google OAuth response.
             - Send it to .NET API for verification.
             - Receive JWT + DeviceId from `/api/users/google` endpoint.
             - Store these values for authenticated requests.
          5. Handle login success & store authentication tokens.
             - Store JWT tokens securely using "Expo SecureStore".
             - Redirect users to the appropriate screen after login.
       2. Implement Apple Sign-In using expo-apple-authentication.
          1. Enable Apple Sign-In in Apple Developer Console.
             - Go to Certificates, Identifiers & Profiles -> Select app.
             - Enable "Sign in with Apple under Capabilities."
          2. Install & configure expo-apple-authentication in the project.
             - Install the package "expo install expo-apple-authentication"
             - Add Apple authentication support in the app.json under expo.plugins.
          3. Create the Apple Sign-In button and authentication flow.
             - Design an Apple Sign-In button in the UI.
             - Implement Apple authentication using AppleAuthentication.signInAsync().
          4. Send the authentication token to the backend (.NET API) for validation.
             - Extract the ID token from Apple OAuth response.
             - Send it to .NET API for verification.
          5. Handle login success & store authentication tokens.
             - Store JWT tokens securely using Expo SecureStore.
             - Redirect users to the appropriate screen after login.
       3. Set up OAuth credentials for both Google & Apple in Google Developer Console & Apple Developer Console.
          1. Google OAuth Setup
             - Generate OAuth credentials in Google Developer Console.
             - Configure redirect URIs for Expo AuthSession.
          2. Apple OAuth Setup
             - Enable Sign in with Apple in Apple Developer Console.
             - Generate an App ID, Services ID, and Key for authentication.
       4. Verify authentication token exchange with .NET + SQL Server API.
          1. Receive Google & Apple ID tokens in the backend
          2. Validate tokens with Google & Apple authentication servers
             - Use Google's token validation endpoint.
             - Use Apple's token validation process.
          3. Issue a JWT token for authenticated users
             - If validation is successful, generate a JWT token for the user.
          4. Store user session data in SQL Server.
             - Save user profile & session details in the database.
       5. Store JWT tokens securely using Expo SecureStore.
          1. Install & configure expo-secure-store in the project.
             - "expo install expo-secure-store"
          2. Encrypt & store the JWT token after successful login.
             - Store the token & expiration time securely.
          3. Create a function to retrieve the token for API requests.
          4. Set up automatic token expiration & refresh logic.
       6. Implement basic login/logout functionality.
          1. Store authentication status in global state (e.g., Context API or Redux).
          2. Detect existing login session on app start.
          3. Create a logout function to clear stored JWT tokens & reset user state.
          4. Redirect users based on authentication state (logged in vs. logged out).
       7. Test authentication flow on both Android & iOS.
          1. Test Google Sign-In on Android & iOS.
          2. Test Apple Sign-In on iOS devices.
          3. Verify token exchange with .NET API.
          4. Ensure JWT tokens persist correctly across app restarts.
          5. Check error handling for failed logins, token expiration, and API failures.
     - 🔗 Dependencies
       1. Expo (React Native)
       2. Google OAuth credentials
       3. Apple OAuth (Sign in with Apple)
       4. Expo SecureStore for token storage
       5. .NET API for backend authentication
     - 🎯 Expected Outcome
       1. Users can log in with Google & Apple.
       2. Authentication works with JWT tokens from .NET API.
       3. User sessions persist using SecureStore.

  2. 📌 Phase 2: Full Authentication & User Management

     - 🎯 Goal: Add email/password login, user roles, and account verification.
     - ✅ Tasks
       1. Add Email/Password Authentication as a fallback method.
       2. Implement role-based access control (RBAC) (Guest, Member, Chaplain, Admin).
       3. Create a user registration flow with email verification.
       4. Implement password reset via email (send verification links).
       5. Set up session expiration logic based on user activity.
       6. Configure guest access permissions (view-only content).
       7. 🔗 Dependencies
       8. Expo-auth-session (Google & Apple)
       9. Custom .NET API + SQL Server for email login & role management
       10. SendGrid or SMTP for email verification
     - 🎯 Expected Outcome
       1. Users can sign up & log in with email/password.
       2. Role-based access is enforced.
       3. Users can reset passwords via email.

  3. 📌 Phase 3: User Communication (Messaging & Calls)

     - 🎯 Goal: Implement messaging, calls, and group chat with role-based permissions.
     - ✅ Tasks
       1. Create real-time messaging (Members ↔ Chaplains).
       2. Implement message read/write/delete permissions.
       3. Set up chat requests (Chaplains approve Admin chats).
       4. Add scheduled call requests (Members request calls, Chaplains approve).
       5. Implement group chats for community discussions.
       6. Secure all communication with end-to-end encryption.
     - 🔗 Dependencies
       1. Expo WebSockets / Firebase for real-time chat
       2. .NET API for chat history & call scheduling
     - 🎯 Expected Outcome

       1. Members can message Chaplains & other Members.
       2. Admins can be contacted only after Chaplain approval.
       3. Calls & group chats follow role-based access rules.

  4. 📌 Phase 4: Calendar & Event Scheduling

     - 🎯 Goal: Implement an event calendar for scheduling calls, meetings, and community events.
     - ✅ Tasks
       1. Develop calendar UI for Members, Chaplains, and Admins.
       2. Enable event creation (Chaplains & Admins).
       3. Allow users to RSVP (attending/not attending).
       4. Display role-based event visibility (Chaplains see private events).
     - 🔗 Dependencies
       1. Expo Calendar API
       2. .NET API for event management
       3. SQL Server to store event data
     - 🎯 Expected Outcome
       1. Users can view & RSVP to events.
       2. Admins & Chaplains can schedule events.
       3. Calendar access is role-based.

  5. 📌 Phase 5: Reports & Incident Tracking

     - 🎯 Goal: Allow Chaplains & Members to submit reports after callouts.
     - ✅ Tasks
       1. Implement report submission (Chaplains can submit on behalf of others).
       2. Create report approval system (Chaplains approve Member reports).
       3. Add metrics tracking (hours served, miles driven).
       4. Implement role-based access (Users can only see their own reports).
     - 🔗 Dependencies
       1. Expo Forms / File Uploads
       2. .NET API & SQL Server for report storage
     - 🎯 Expected Outcome
       1. Users can submit reports after calls.
       2. Chaplains approve reports before they are finalized.
       3. Metrics are tracked for organizational insights.

  6. 📌 Phase 6: Finalizing & Admin Tools

     - 🎯 Goal: Add Admin tools for user management & agency tracking.
     - ✅ Tasks
       1. Implement admin dashboard for managing users, reports, and agencies.
       2. Allow Admins to approve user join requests.
       3. Set up role promotion requests (Chaplains recommend users for role upgrades).
       4. Track agencies & partnerships within the system.
     - 🔗 Dependencies
       1. Expo Router for dashboard navigation
       2. .NET API for admin role & agency management
     - 🎯 Expected Outcome
       1. Admins can approve users & manage agencies.
       2. Role promotions & permissions are automated.
       3. The app is fully functional with all major features complete.

- 🚀 Summary of Roadmap Priorities
  - Phase Feature Priority
    - 1️⃣ Google & Apple Sign-In + JWT Authentication 🔥 HIGH
    - 2️⃣ Email/Password Login, Role-Based Access 🔥 HIGH
    - 3️⃣ Messaging, Calls & Group Chats ⚡ Medium
    - 4️⃣ Calendar & Event Scheduling ⚡ Medium
    - 5️⃣ Reports & Incident Tracking ⚡ Medium
    - 6️⃣ Admin Dashboard & User Management ✅ Final Step
