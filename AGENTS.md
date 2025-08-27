# Repository Guidelines

## Project Structure & Module Organization
- Backend: `Backend/SOPSC.Api` — ASP.NET Core 8 Web API. Key folders: `Controllers`, `Services`, `Data`, `Models`, `Properties`.
- Frontend: `Frontend/sopsc-mobile-app` — Expo React Native (TypeScript). Key folders: `src/components`, `src/routes`, `src/hooks`, `src/utils`, `assets`.
- SQL: `SQL/*` — schema, stored-proc scripts, and backups.
- CI: `.github/workflows/main_sopsc-api.yml` builds/publishes the API.

## Build, Test, and Development Commands
- API build/run: `cd Backend/SOPSC.Api && dotnet build && dotnet run` — compile and start local HTTPS.
- API publish: `dotnet publish -c Release -o publish` — produce deployable output.
- Mobile setup: `cd Frontend/sopsc-mobile-app && yarn install` — install dependencies.
- Mobile run: `npx expo prebuild && npx expo run:android` (or `npx expo run:ios`) — launch app.
- Diagnose Expo: `npx expo-doctor --verbose` — check env/deps/build.
- Lint (mobile): `npx eslint .` — uses `eslint.config.js`.

## Coding Style & Naming Conventions
- C# (API): 4-space indent; PascalCase for classes/methods; camelCase for locals/fields. Controllers end with `Controller` in `Controllers/`; services end with `Service` in `Services/`.
- TypeScript (mobile): functional components; PascalCase for component files under `src/components`; hooks as `useX.ts` in `src/hooks`; keep modules small and colocated.

## Testing Guidelines
- No unit test projects are present. Follow manual flows in [TestingGuide.md](TestingGuide.md).
- Pre-PR checks: `dotnet build` succeeds; `npx expo run:android` boots to login; `npx expo-doctor` passes.
- Add tests opportunistically (e.g., xUnit for API; Jest/React Testing Library for mobile) when introducing complex logic.

## SQL Script Naming
- Folders: group by domain (e.g., `SQL/Users`, `SQL/Messages/GroupChats`).
- Tables: `<Entity>_TABLE.txt` (schema with PK/FK/indexes).
- Procs/ops: `<Entity>_<Action>.txt` (e.g., `Messages_Insert.txt`, `Messages_SelectByChatId.txt`).
- Ordering: when needed, prefix with `YYYYMMDD_`; provide rollback as `<Name>_ROLLBACK.txt`.
- Practice: test on a local DB before PR; avoid committing large backup files unless intentional.

## CI Notes
- API CI: `.github/workflows/main_sopsc-api.yml` builds and deploys the backend.
- Mobile CI (future): add `.github/workflows/mobile.yml` to run `yarn install`, `npx expo prebuild`, and Android/iOS build checks. Keep Expo/EAS secrets in GitHub Actions secrets.

## Commit & Pull Request Guidelines
- Commits: short, imperative mood (e.g., "Refactor mobile routing"); one topic per commit; avoid vague titles (e.g., "ext. X").
- PRs: include summary/scope, linked issues, screenshots for UI, and verification steps. Confirm no secrets, and that `.env*`/`appsettings.*` remain untracked.

## Security & Configuration Tips
- Do not commit credentials. Use `.env*` (mobile) and `appsettings.Development.json` (API). Provide sample values only in docs.
- Required vars: `EXPO_PUBLIC_API_URL` (mobile) and `GoogleOAuth:WebClientId` (API), as shown in `TestingGuide.md`.
