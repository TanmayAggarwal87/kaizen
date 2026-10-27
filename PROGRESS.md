# KAIZEN Progress Log

## Project Baseline
- [x] Verified project on Expo SDK 58 (`expo: ~58.0.19`).
- [x] Ran `npx expo-doctor`: 20/20 checks passed.
- [x] Confirmed TypeScript strict mode (`strict: true`) and resolved web tab button typing.
- [x] Set `name: "kaizen"` and `android.package: "com.kaizen.app"` in `app.json`.
- [x] Installed `expo-dev-client` (`~58.0.15`).
- [x] Generated native Android scaffold via `npx expo prebuild --platform android`.
- [x] Configured `.gitignore` for `android/`, `.env*`, `*.keystore`, `*.jks`, `local.properties`.
- [x] Configured `android:allowBackup="false"` in `app.json` and verified manifest emission.
- [ ] Physical device build execution (pending host Android SDK setup and ADB connection).

## Local Native Module (`kaizen-blocker`)
- [x] Scaffolded local module under `modules/kaizen-blocker` autolinked via Expo module system.
- [x] Declared `KaizenAccessibilityService`, `BlockActivity`, and `BootReceiver` in module `AndroidManifest.xml`.
- [x] Configured `res/xml/accessibility_service_config.xml` with `canRetrieveWindowContent="false"` and `typeWindowStateChanged`.
- [x] Implemented `ping()` verification.

## Kotlin Core & Blocker Engine
- [x] `KaizenAccessibilityService`: Listens exclusively to `TYPE_WINDOW_STATE_CHANGED`, extracts only foreground package name, ignores self, System UI, default launcher, settings, and emergency dialers.
- [x] Debounced window events (150ms threshold) to prevent event spam.
- [x] `BlockerStore`: Atomic local state management (`remainingMs`, `blockedPackages`, `blockerEnabled`). Monotonic elapsed clock (`SystemClock.elapsedRealtime()`) avoids system clock tampering.
- [x] Shared credit timer: Credits drain only when a tracked package is in foreground. Switching between tracked apps maintains the shared balance. Expiry automatically triggers immediate block.
- [x] `BlockActivity`: Native blocking screen styled with KAIZEN black + red theme showing time remaining, "Go Home", "Open kaizen", and a 5-second long-press emergency override.
- [x] `BootReceiver`: Restores state and stops invalid draining upon system boot.
- [x] Emergency recovery adb command: `adb shell settings put secure enabled_accessibility_services ""` or Settings → Accessibility → KAIZEN → Off.

## Bridge API & TypeScript Integration
- [x] `getInstalledApps`: Returns launchable apps using `queryIntentActivities` with `<queries>` element (avoids `QUERY_ALL_PACKAGES`).
- [x] `setBlockedApps`: Input sanitized against regex `^[a-zA-Z0-9_.]+$` and length constraints.
- [x] `grantCredits`: Clamped to 24-hour maximum.
- [x] `getStatus`: Returns complete state snapshot including accessibility and battery optimization status.
- [x] `openAccessibilitySettings` and `requestIgnoreBatteryOptimizations`.
- [x] Event emission `onStatusChanged` for reactive UI updates.

## React Native User Interface
- [x] Japanese-inspired minimal theme tokens defined in `src/constants/theme.ts`.
- [x] Wordmark `KAIZEN` with `改善` and tagline.
- [x] Live status banner ("Blocker ON" / "Blocker OFF — tap to fix").
- [x] Setup checklist with real-time indicators for Accessibility and Battery Optimization, including Android 13+ restricted settings notice.
- [x] Credit balance display (`HH:MM:SS`) with "+2 Min", "+10 Min", and "Clear" controls.
- [x] App picker with instant search filtering and multi-select toggles.
- [x] Emergency blocker toggle button.
- [x] Dynamic refresh on `AppState` resume and native status changes.

## Security & Privacy Checklist
- [x] Least privilege: accessibility does not inspect window content.
- [x] Zero network requests or analytics in release builds.
- [x] Non-exported activities and receivers (`android:exported="false"`).
- [x] `allowBackup="false"` enabled.
- [x] No broad query permissions (`QUERY_ALL_PACKAGES` avoided via explicit launcher intent query).
- [x] Documented limitations in `DECISIONS.md`.
