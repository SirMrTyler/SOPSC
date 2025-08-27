# Pull Request Checklist

## Summary
- Type: feat | fix | docs | refactor | chore
- Platforms: api | mobile-android | mobile-ios | sql | docs
- Related Issue(s): #
- Scope: Short description of what this changes and why.

## How to Test
1. API: `cd Backend/SOPSC.Api && dotnet build && dotnet run`
2. Android: `cd Frontend/sopsc-mobile-app && yarn install && npx expo prebuild && npx expo run:android`
3. iOS (macOS only): Ensure Xcode 15+ and CocoaPods; `cd Frontend/sopsc-mobile-app && npx expo prebuild && npx expo run:ios`
4. Verify key flows touched by this PR (login, navigation, API calls).
5. See detailed steps in [TestingGuide.md](../../TestingGuide.md).

## Database Changes / Migrations (if applicable)
- Location: place scripts under `SQL/<Area>/` following existing patterns, e.g., `Users/Users_TABLE.txt`, `Messages/Messages_Insert.txt`.
- Describe changes: new/altered tables, procs, indexes, seed data.
- Apply steps: exact order/commands to apply scripts; any required data backfill.
- Rollback plan: how to revert changes safely.

## Screenshots / Recordings (if UI)
<!-- Add images or links to videos showing the change. -->

## Breaking Changes
- [ ] None
- Details:

## Checklist
- [ ] Commit messages are clear, imperative, and scoped.
- [ ] Linked related issues and added a concise PR description.
- [ ] API builds locally (`dotnet build`) and basic endpoints smoke-tested.
- [ ] Android build runs (`npx expo run:android`) without regressions.
- [ ] iOS build runs on macOS (`npx expo run:ios`) and basic flows verified.
- [ ] Lint passes for mobile (`npx eslint .`) or warnings explained.
- [ ] `npx expo-doctor --verbose` shows no blocking issues.
- [ ] No secrets committed; `.env*` and `appsettings.*` are excluded.
- [ ] Updated docs where relevant (e.g., `TestingGuide.md`, `AGENTS.md`).
- [ ] If API contracts changed, updated controller docs and mobile API usage.
- [ ] If SQL changed, scripts added/updated under `SQL/` with apply/rollback notes tested on a local DB.
- [ ] CI passes on GitHub Actions (API workflow). If mobile workflow exists (e.g., `.github/workflows/mobile.yml`), it also passes.

## Notes for Reviewers
- Risks/areas to focus on:
- Follow-up tasks (if any):
