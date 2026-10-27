import { NativeModule, requireOptionalNativeModule } from 'expo';
import { AppInfo, BlockerStatus, KaizenBlockerModuleEvents } from './KaizenBlocker.types';
import webFallback from './KaizenBlockerModule.web';

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

const nativeModule = requireOptionalNativeModule<KaizenBlockerModule>('KaizenBlocker');

export default (nativeModule ?? webFallback) as unknown as KaizenBlockerModule;
