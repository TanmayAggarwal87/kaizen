export interface AppInfo {
  packageName: string;
  label: string;
}

export interface BlockerStatus {
  blockerEnabled: boolean;
  accessibilityEnabled: boolean;
  batteryUnrestricted: boolean;
  remainingMs: number;
  activeApp: string | null;
  isBlocking: boolean;
  blockedApps: string[];
}

export type KaizenBlockerModuleEvents = {
  onStatusChanged: (params: { remainingMs: number }) => void;
};
