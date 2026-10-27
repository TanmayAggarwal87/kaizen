import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { AppState } from 'react-native';
import {
  getStatus,
  setBlockerEnabled,
  setBlockedApps,
  grantCredits,
  clearCredits,
  getInstalledApps,
  openAccessibilitySettings,
  requestIgnoreBatteryOptimizations,
  addStatusListener,
  AppInfo,
  BlockerStatus,
} from 'kaizen-blocker';

export interface DisciplineTask {
  id: string;
  title: string;
  category: string;
  rewardMinutes: number;
  time: string;
  completed: boolean;
}

export type RewardMode = 'earn_as_you_go' | 'unlock_after_all';

interface KaizenContextType {
  status: BlockerStatus;
  refreshStatus: () => void;
  apps: AppInfo[];
  toggleBlockedApp: (packageName: string) => void;
  tasks: DisciplineTask[];
  toggleTask: (id: string) => void;
  addTask: (title: string, category: string, rewardMinutes: number) => void;
  deleteTask: (id: string) => void;
  rewardMode: RewardMode;
  setRewardMode: (mode: RewardMode) => void;
  defaultRewardMinutes: number;
  setDefaultRewardMinutes: (minutes: number) => void;
  dailyResetTime: string;
  creditCarryover: boolean;
  setCreditCarryover: (val: boolean) => void;
  grantManualCredits: (minutes: number) => void;
  clearAllCredits: () => void;
  toggleBlocker: () => void;
  openAccessibility: () => void;
  requestBatteryExemption: () => void;
}

const defaultTasks: DisciplineTask[] = [
  {
    id: '1',
    title: 'Deep Work Session (90 min)',
    category: 'CONCENTRATION',
    rewardMinutes: 15,
    time: '08:00 AM',
    completed: true,
  },
  {
    id: '2',
    title: 'Morning Cold Exposure & Run',
    category: 'VITALITY',
    rewardMinutes: 10,
    time: '06:30 AM',
    completed: true,
  },
  {
    id: '3',
    title: 'Read Philosophy & Journal',
    category: 'INTROSPECTION',
    rewardMinutes: 5,
    time: '12:15 PM',
    completed: true,
  },
  {
    id: '4',
    title: 'Review Architecture Spec',
    category: 'ENGINEERING',
    rewardMinutes: 9,
    time: 'NEXT UP',
    completed: false,
  },
  {
    id: '5',
    title: 'Zero Inbox & Shutdown',
    category: 'CLOSURE',
    rewardMinutes: 6,
    time: 'EVENING',
    completed: false,
  },
];

const KaizenContext = createContext<KaizenContextType | undefined>(undefined);

export function KaizenProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BlockerStatus>({
    blockerEnabled: true,
    accessibilityEnabled: false,
    batteryUnrestricted: false,
    remainingMs: 27 * 60 * 1000,
    activeApp: null,
    isBlocking: false,
    blockedApps: ['com.instagram.android', 'com.twitter.android', 'com.google.android.youtube', 'com.reddit.frontpage'],
  });

  const [apps, setApps] = useState<AppInfo[]>([]);
  const [tasks, setTasks] = useState<DisciplineTask[]>(defaultTasks);
  const [rewardMode, setRewardMode] = useState<RewardMode>('earn_as_you_go');
  const [defaultRewardMinutes, setDefaultRewardMinutes] = useState(9);
  const [dailyResetTime] = useState('04:00 AM');
  const [creditCarryover, setCreditCarryover] = useState(false);

  const refreshStatus = useCallback(() => {
    try {
      const current = getStatus();
      if (current) {
        setStatus(current);
      }
    } catch {
      // Running outside dev client
    }
  }, []);

  useEffect(() => {
    refreshStatus();
    try {
      const installed = getInstalledApps();
      if (installed && installed.length > 0) {
        setApps(installed);
      } else {
        setApps([
          { packageName: 'com.instagram.android', label: 'Instagram' },
          { packageName: 'com.twitter.android', label: 'X' },
          { packageName: 'com.google.android.youtube', label: 'YouTube' },
          { packageName: 'com.reddit.frontpage', label: 'Reddit' },
          { packageName: 'com.android.chrome', label: 'Google Chrome' },
          { packageName: 'com.zhiliaoapp.musically', label: 'TikTok' },
          { packageName: 'com.netflix.mediaclient', label: 'Netflix' },
        ]);
      }
    } catch {
      setApps([]);
    }

    const sub = addStatusListener(() => {
      refreshStatus();
    });

    const appStateSub = AppState.addEventListener('change', (next) => {
      if (next === 'active') {
        refreshStatus();
      }
    });

    return () => {
      sub.remove();
      appStateSub.remove();
    };
  }, [refreshStatus]);

  const toggleBlockedApp = (packageName: string) => {
    const isBlocked = status.blockedApps.includes(packageName);
    const updated = isBlocked
      ? status.blockedApps.filter((p) => p !== packageName)
      : [...status.blockedApps, packageName];
    try {
      setBlockedApps(updated);
    } catch {}
    setStatus((prev) => ({ ...prev, blockedApps: updated }));
  };

  const toggleTask = (id: string) => {
    setTasks((prev) =>
      prev.map((t) => {
        if (t.id === id) {
          const nextCompleted = !t.completed;
          const deltaMs = t.rewardMinutes * 60 * 1000;
          try {
            if (nextCompleted) {
              grantCredits(deltaMs);
            } else {
              grantCredits(-deltaMs);
            }
          } catch {}
          return { ...t, completed: nextCompleted };
        }
        return t;
      })
    );
    setTimeout(refreshStatus, 100);
  };

  const addTask = (title: string, category: string, rewardMinutes: number) => {
    const newTask: DisciplineTask = {
      id: Date.now().toString(),
      title,
      category: category.toUpperCase(),
      rewardMinutes,
      time: 'SCHEDULED',
      completed: false,
    };
    setTasks((prev) => [...prev, newTask]);
  };

  const deleteTask = (id: string) => {
    setTasks((prev) => prev.filter((t) => t.id !== id));
  };

  const grantManualCredits = (minutes: number) => {
    try {
      grantCredits(minutes * 60 * 1000);
    } catch {}
    refreshStatus();
  };

  const clearAllCredits = () => {
    try {
      clearCredits();
    } catch {}
    refreshStatus();
  };

  const toggleBlocker = () => {
    const next = !status.blockerEnabled;
    try {
      setBlockerEnabled(next);
    } catch {}
    setStatus((prev) => ({ ...prev, blockerEnabled: next }));
  };

  return (
    <KaizenContext.Provider
      value={{
        status,
        refreshStatus,
        apps,
        toggleBlockedApp,
        tasks,
        toggleTask,
        addTask,
        deleteTask,
        rewardMode,
        setRewardMode,
        defaultRewardMinutes,
        setDefaultRewardMinutes,
        dailyResetTime,
        creditCarryover,
        setCreditCarryover,
        grantManualCredits,
        clearAllCredits,
        toggleBlocker,
        openAccessibility: openAccessibilitySettings,
        requestBatteryExemption: requestIgnoreBatteryOptimizations,
      }}
    >
      {children}
    </KaizenContext.Provider>
  );
}

export function useKaizen() {
  const ctx = useContext(KaizenContext);
  if (!ctx) {
    throw new Error('useKaizen must be used within a KaizenProvider');
  }
  return ctx;
}
