# KAIZEN Architecture & Technical Decisions

## Architectural Principles
1. **Local-First & Auditable**: No backend, no third-party blocker libraries (`expo-blocker`, etc.). All blocking logic is owned in native Kotlin.
2. **Native Enforcement**: JS runtime handles UI and status display. Kotlin service independently manages detection, timer draining, and blocking even if JS runtime is stopped.
3. **Least Privilege**: Only `TYPE_WINDOW_STATE_CHANGED` accessibility events. No window content inspection, no network requests in release builds.
4. **Non-Tamper-Proof Scope (v1)**: As documented in TODO, v1 is not tamper-proof against uninstallation, manual service disable, or force-stopping via system settings. This is accepted for v1 MVP.

## Dependencies Added
- `expo-dev-client`: Required for running custom native code and local Expo modules without relying on Expo Go.

## Audit & Security Findings
- `npm audit` reported high-severity vulnerabilities (`node-forge`, `zod`) in dev-time CLI tooling dependencies transitive to `@expo/cli`. `npm audit fix --force` would downgrade to Expo 44 (breaking). Because these are local build-time dev dependencies and do not bundle into the release mobile app runtime, no downgrading is performed.

## Fixed Architectural Choices
- Target package ID: `com.kaizen.app`.
- Enforcement mechanism: `AccessibilityService` window state change detection + `performGlobalAction(GLOBAL_ACTION_HOME)` and native `BlockActivity`.
