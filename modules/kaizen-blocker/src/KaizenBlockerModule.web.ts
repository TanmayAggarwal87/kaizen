import { AppInfo, BlockerStatus } from './KaizenBlocker.types';

const mockStatus: BlockerStatus = {
  blockerEnabled: true,
  accessibilityEnabled: false,
  batteryUnrestricted: false,
  remainingMs: 0,
  activeApp: null,
  isBlocking: false,
  blockedApps: [],
};

export default {
  ping(): string {
    return 'pong (web)';
  },
  getStatus(): BlockerStatus {
    return { ...mockStatus };
  },
  setBlockerEnabled(enabled: boolean): void {
    mockStatus.blockerEnabled = enabled;
  },
  setBlockedApps(packages: string[]): void {
    mockStatus.blockedApps = [...packages];
  },
  grantCredits(ms: number): void {
    mockStatus.remainingMs = Math.max(0, mockStatus.remainingMs + ms);
  },
  clearCredits(): void {
    mockStatus.remainingMs = 0;
  },
  getInstalledApps(): AppInfo[] {
    return [
      { packageName: 'com.instagram.android', label: 'Instagram' },
      { packageName: 'com.twitter.android', label: 'X (Twitter)' },
      { packageName: 'com.google.android.youtube', label: 'YouTube' },
    ];
  },
  openAccessibilitySettings(): void {},
  requestIgnoreBatteryOptimizations(): void {},
  addListener(): { remove: () => void } {
    return { remove: () => {} };
  },
  removeListeners(): void {},
};
