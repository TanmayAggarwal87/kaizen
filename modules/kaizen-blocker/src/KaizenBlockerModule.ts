import { NativeModule, requireNativeModule } from 'expo';
import { AppInfo, BlockerStatus, KaizenBlockerModuleEvents } from './KaizenBlocker.types';

declare class KaizenBlockerModule extends NativeModule<KaizenBlockerModuleEvents> {
  ping(): string;
  getStatus(): BlockerStatus;
  setBlockerEnabled(enabled: boolean): void;
  setBlockedApps(packages: string[]): void;
  grantCredits(ms: number): void;
  clearCredits(): void;
  getInstalledApps(): AppInfo[];
  openAccessibilitySettings(): void;
  requestIgnoreBatteryOptimizations(): void;
}

export default requireNativeModule<KaizenBlockerModule>('KaizenBlocker');
