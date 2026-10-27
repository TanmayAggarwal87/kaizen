import KaizenBlockerModule from './src/KaizenBlockerModule';
import { AppInfo, BlockerStatus } from './src/KaizenBlocker.types';

export function ping(): string {
  return KaizenBlockerModule.ping();
}

export function getStatus(): BlockerStatus {
  return KaizenBlockerModule.getStatus();
}

export function setBlockerEnabled(enabled: boolean): void {
  KaizenBlockerModule.setBlockerEnabled(enabled);
}

export function setBlockedApps(packages: string[]): void {
  KaizenBlockerModule.setBlockedApps(packages);
}

export function grantCredits(ms: number): void {
  KaizenBlockerModule.grantCredits(ms);
}

export function clearCredits(): void {
  KaizenBlockerModule.clearCredits();
}

export function getInstalledApps(): AppInfo[] {
  return KaizenBlockerModule.getInstalledApps();
}

export function openAccessibilitySettings(): void {
  KaizenBlockerModule.openAccessibilitySettings();
}

export function requestIgnoreBatteryOptimizations(): void {
  KaizenBlockerModule.requestIgnoreBatteryOptimizations();
}

export function addStatusListener(listener: (params: { remainingMs: number }) => void) {
  return KaizenBlockerModule.addListener('onStatusChanged', listener);
}

export * from './src/KaizenBlocker.types';
export { default as KaizenBlockerModule } from './src/KaizenBlockerModule';
