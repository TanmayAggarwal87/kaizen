import React, { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { AppState } from 'react-native';
import { safeStorage } from '@/utils/storage';
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
  // Computed helpers for consistent metrics
  earnedMinutes: number;
  spentMinutes: number;
  remainingMinutes: number;
  completedCount: number;
  totalTaskCount: number;
  masteryPercent: number;
  totalPotentialMinutes: number;
}

const defaultTasks: DisciplineTask[] = [];

const KaizenContext = createContext<KaizenContextType | undefined>(undefined);

export function KaizenProvider({ children }: { children: React.ReactNode }) {
  const [status, setStatus] = useState<BlockerStatus>({
    blockerEnabled: true,
    accessibilityEnabled: false,
    batteryUnrestricted: false,
    remainingMs: 0,
    activeApp: null,
    isBlocking: false,
    blockedApps: [
      'com.instagram.android',
      'com.twitter.android',
      'com.google.android.youtube',
      'com.reddit.frontpage',
    ],
  });

  const [apps, setApps] = useState<AppInfo[]>([]);
  const [tasks, setTasks] = useState<DisciplineTask[]>([]);
  const [rewardMode, setRewardModeState] = useState<RewardMode>('earn_as_you_go');
  const [defaultRewardMinutes, setDefaultRewardMinutesState] = useState(9);
  const [dailyResetTime] = useState('04:00 AM');
  const [creditCarryover, setCreditCarryoverState] = useState(false);

  // Restore saved state from safe persistent storage
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const savedTasks = await safeStorage.getItem('@kaizen_tasks');
        if (mounted && savedTasks) {
          const parsed = JSON.parse(savedTasks);
          if (Array.isArray(parsed)) {
            // Filter out old hardcoded mock tasks with IDs '1'..'5'
            const realTasks = parsed.filter(
              (t: DisciplineTask) => !['1', '2', '3', '4', '5'].includes(t.id)
            );
            setTasks(realTasks);
            if (realTasks.length !== parsed.length) {
              safeStorage.setItem('@kaizen_tasks', JSON.stringify(realTasks)).catch(() => {});
            }
          }
        }
        const savedMode = await safeStorage.getItem('@kaizen_reward_mode');
        if (mounted && savedMode) setRewardModeState(savedMode as RewardMode);
        const savedReward = await safeStorage.getItem('@kaizen_default_reward');
        if (mounted && savedReward) setDefaultRewardMinutesState(parseInt(savedReward, 10));
        const savedCarryover = await safeStorage.getItem('@kaizen_carryover');
        if (mounted && savedCarryover !== null) setCreditCarryoverState(savedCarryover === 'true');
      } catch {}
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshStatus = useCallback(() => {
    try {
      const current = getStatus();
      if (current) {
        if (!current.blockedApps || current.blockedApps.length === 0) {
          const defaults = [
            'com.instagram.android',
            'com.twitter.android',
            'com.google.android.youtube',
            'com.reddit.frontpage',
          ];
          setBlockedApps(defaults);
          current.blockedApps = defaults;
        }
        setStatus(current);
      }
    } catch {}
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

    const interval = setInterval(() => {
      if (AppState.currentState === 'active') {
        refreshStatus();
      }
    }, 1000);

    return () => {
      clearInterval(interval);
      sub.remove();
      appStateSub.remove();
    };
  }, [refreshStatus]);

  const updateTasks = (newTasks: DisciplineTask[]) => {
    setTasks(newTasks);
    safeStorage.setItem('@kaizen_tasks', JSON.stringify(newTasks)).catch(() => {});
  };

  const setRewardMode = (mode: RewardMode) => {
    setRewardModeState(mode);
    safeStorage.setItem('@kaizen_reward_mode', mode).catch(() => {});
    try {
      if (mode === 'unlock_after_all') {
        const allDone = tasks.length > 0 && tasks.every((t) => t.completed);
        clearCredits();
        if (allDone) {
          const totalMs = tasks.reduce((acc, t) => acc + t.rewardMinutes, 0) * 60 * 1000;
          grantCredits(totalMs);
        }
      } else {
        // Switching to earn_as_you_go: credit whatever tasks are currently completed
        const earnedMs = tasks
          .filter((t) => t.completed)
          .reduce((acc, t) => acc + t.rewardMinutes, 0) * 60 * 1000;
        clearCredits();
        if (earnedMs > 0) {
          grantCredits(earnedMs);
        }
      }
    } catch {}
    setTimeout(refreshStatus, 80);
  };

  const setDefaultRewardMinutes = (mins: number) => {
    setDefaultRewardMinutesState(mins);
    safeStorage.setItem('@kaizen_default_reward', mins.toString()).catch(() => {});
  };

  const setCreditCarryover = (val: boolean) => {
    setCreditCarryoverState(val);
    safeStorage.setItem('@kaizen_carryover', val ? 'true' : 'false').catch(() => {});
  };

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
    const target = tasks.find((t) => t.id === id);
    if (!target) return;
    const nextCompleted = !target.completed;
    const nextTasks = tasks.map((t) =>
      t.id === id ? { ...t, completed: nextCompleted } : t
    );

    try {
      if (rewardMode === 'earn_as_you_go') {
        const deltaMs = target.rewardMinutes * 60 * 1000;
        if (nextCompleted) {
          grantCredits(deltaMs);
        } else {
          grantCredits(-deltaMs);
        }
      } else {
        // unlock_after_all: only grant when ALL tasks are completed
        const allDone = nextTasks.length > 0 && nextTasks.every((t) => t.completed);
        clearCredits();
        if (allDone) {
          const totalMs = nextTasks.reduce((acc, t) => acc + t.rewardMinutes, 0) * 60 * 1000;
          grantCredits(totalMs);
        }
      }
    } catch {}

    updateTasks(nextTasks);
    setTimeout(refreshStatus, 80);
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
    const updated = [...tasks, newTask];

    // If in unlock_after_all mode, adding an uncompleted task locks apps again
    if (rewardMode === 'unlock_after_all') {
      try {
        clearCredits();
      } catch {}
      setTimeout(refreshStatus, 80);
    }

    updateTasks(updated);
  };

  const deleteTask = (id: string) => {
    const target = tasks.find((t) => t.id === id);
    const updated = tasks.filter((t) => t.id !== id);

    try {
      if (rewardMode === 'earn_as_you_go' && target?.completed) {
        grantCredits(-target.rewardMinutes * 60 * 1000);
      } else if (rewardMode === 'unlock_after_all') {
        const allDone = updated.length > 0 && updated.every((t) => t.completed);
        clearCredits();
        if (allDone) {
          const totalMs = updated.reduce((acc, t) => acc + t.rewardMinutes, 0) * 60 * 1000;
          grantCredits(totalMs);
        }
      }
    } catch {}

    updateTasks(updated);
    setTimeout(refreshStatus, 80);
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

  // Computed metrics
  const earnedMinutes = useMemo(() => {
    if (rewardMode === 'unlock_after_all') {
      const allDone = tasks.length > 0 && tasks.every((t) => t.completed);
      return allDone ? tasks.reduce((acc, t) => acc + t.rewardMinutes, 0) : 0;
    }
    return tasks
      .filter((t) => t.completed)
      .reduce((acc, t) => acc + t.rewardMinutes, 0);
  }, [tasks, rewardMode]);

  const remainingMinutes = Math.max(0, Math.ceil(status.remainingMs / 60000));

  const spentMinutes = useMemo(() => {
    return Math.max(0, earnedMinutes - remainingMinutes);
  }, [earnedMinutes, remainingMinutes]);

  const completedCount = useMemo(() => {
    return tasks.filter((t) => t.completed).length;
  }, [tasks]);

  const totalTaskCount = tasks.length;

  const masteryPercent = useMemo(() => {
    return totalTaskCount > 0 ? Math.round((completedCount / totalTaskCount) * 100) : 0;
  }, [completedCount, totalTaskCount]);

  const totalPotentialMinutes = useMemo(() => {
    return tasks.reduce((acc, t) => acc + t.rewardMinutes, 0);
  }, [tasks]);

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
        earnedMinutes,
        spentMinutes,
        remainingMinutes,
        completedCount,
        totalTaskCount,
        masteryPercent,
        totalPotentialMinutes,
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
