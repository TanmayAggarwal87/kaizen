import React, { useEffect, useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  AppState,
  Platform,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';
import { KaizenTheme } from '@/constants/theme';
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

export default function KaizenHomeScreen() {
  const [status, setStatus] = useState<BlockerStatus>({
    blockerEnabled: true,
    accessibilityEnabled: false,
    batteryUnrestricted: false,
    remainingMs: 0,
    activeApp: null,
    isBlocking: false,
    blockedApps: [],
  });
  const [apps, setApps] = useState<AppInfo[]>([]);
  const [searchQuery, setSearchQuery] = useState('');

  const refreshState = useCallback(() => {
    try {
      const current = getStatus();
      if (current) {
        setStatus(current);
      }
    } catch {
      // Running on unsupported platform or fallback
    }
  }, []);

  useEffect(() => {
    refreshState();
    try {
      const installed = getInstalledApps();
      setApps(installed || []);
    } catch {
      setApps([]);
    }

    const sub = addStatusListener(() => {
      refreshState();
    });

    const appStateSub = AppState.addEventListener('change', (nextState) => {
      if (nextState === 'active') {
        refreshState();
      }
    });

    return () => {
      sub.remove();
      appStateSub.remove();
    };
  }, [refreshState]);

  const toggleAppBlocked = (packageName: string) => {
    const isBlocked = status.blockedApps.includes(packageName);
    const updated = isBlocked
      ? status.blockedApps.filter((p) => p !== packageName)
      : [...status.blockedApps, packageName];
    setBlockedApps(updated);
    setStatus((prev) => ({ ...prev, blockedApps: updated }));
  };

  const handleToggleBlocker = () => {
    const next = !status.blockerEnabled;
    setBlockerEnabled(next);
    setStatus((prev) => ({ ...prev, blockerEnabled: next }));
  };

  const filteredApps = useMemo(() => {
    if (!searchQuery.trim()) return apps;
    const query = searchQuery.toLowerCase();
    return apps.filter(
      (a) =>
        a.label.toLowerCase().includes(query) ||
        a.packageName.toLowerCase().includes(query)
    );
  }, [apps, searchQuery]);

  const formatRemainingTime = (ms: number) => {
    const totalSecs = Math.max(0, Math.floor(ms / 1000));
    const hours = Math.floor(totalSecs / 3600);
    const minutes = Math.floor((totalSecs % 3600) / 60);
    const seconds = totalSecs % 60;
    if (hours > 0) {
      return `${hours}h ${minutes.toString().padStart(2, '0')}m ${seconds.toString().padStart(2, '0')}s`;
    }
    return `${minutes}m ${seconds.toString().padStart(2, '0')}s`;
  };

  const isFullyConfigured = status.blockerEnabled && status.accessibilityEnabled;

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar style="light" />
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Brand Header */}
        <View style={styles.header}>
          <Text style={styles.wordmark}>KAIZEN</Text>
          <Text style={styles.japaneseSub}>改善</Text>
          <Text style={styles.tagline}>Earn your escape.</Text>
        </View>

        {/* Status Banner */}
        <Pressable
          style={[
            styles.banner,
            isFullyConfigured ? styles.bannerOn : styles.bannerOff,
          ]}
          onPress={isFullyConfigured ? undefined : openAccessibilitySettings}
        >
          <View
            style={[
              styles.indicatorDot,
              {
                backgroundColor: isFullyConfigured
                  ? KaizenTheme.success
                  : KaizenTheme.redPrimary,
              },
            ]}
          />
          <View style={styles.bannerTextContainer}>
            <Text style={styles.bannerTitle}>
              {isFullyConfigured ? 'Blocker ON' : 'Blocker OFF — tap to fix'}
            </Text>
            <Text style={styles.bannerSubtitle}>
              {isFullyConfigured
                ? 'Monitored apps are guarded by your credit balance'
                : 'Accessibility permission is required for detection'}
            </Text>
          </View>
        </Pressable>

        {/* Setup Checklist */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>SYSTEM SETUP</Text>

          <Pressable
            style={styles.checklistRow}
            onPress={openAccessibilitySettings}
          >
            <View style={styles.checklistInfo}>
              <Text style={styles.checkItemTitle}>Accessibility Service</Text>
              <Text style={styles.checkItemDesc}>Required for window-state detection</Text>
            </View>
            <View
              style={[
                styles.badge,
                status.accessibilityEnabled ? styles.badgeSuccess : styles.badgeDanger,
              ]}
            >
              <Text style={styles.badgeText}>
                {status.accessibilityEnabled ? 'ACTIVE' : 'ENABLE'}
              </Text>
            </View>
          </Pressable>

          <View style={styles.divider} />

          <Pressable
            style={styles.checklistRow}
            onPress={requestIgnoreBatteryOptimizations}
          >
            <View style={styles.checklistInfo}>
              <Text style={styles.checkItemTitle}>Battery Optimization</Text>
              <Text style={styles.checkItemDesc}>Prevents OS from killing the service</Text>
            </View>
            <View
              style={[
                styles.badge,
                status.batteryUnrestricted ? styles.badgeSuccess : styles.badgeDanger,
              ]}
            >
              <Text style={styles.badgeText}>
                {status.batteryUnrestricted ? 'UNRESTRICTED' : 'EXEMPT'}
              </Text>
            </View>
          </Pressable>

          {Platform.OS === 'android' && !status.accessibilityEnabled && (
            <View style={styles.restrictedNotice}>
              <Text style={styles.restrictedText}>
                Android 13+ note: If Accessibility is grayed out, go to App Info → ⋮ → "Allow restricted settings".
              </Text>
            </View>
          )}
        </View>

        {/* Credit Balance & Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>CREDIT BALANCE</Text>
          <View style={styles.creditDisplay}>
            <Text style={styles.creditTime}>
              {formatRemainingTime(status.remainingMs)}
            </Text>
            <Text style={styles.creditLabel}>Available time for selected apps</Text>
          </View>

          <View style={styles.buttonRow}>
            <Pressable
              style={styles.actionButton}
              onPress={() => grantCredits(2 * 60 * 1000)}
            >
              <Text style={styles.actionButtonText}>+2 Min</Text>
            </Pressable>

            <Pressable
              style={styles.actionButton}
              onPress={() => grantCredits(10 * 60 * 1000)}
            >
              <Text style={styles.actionButtonText}>+10 Min</Text>
            </Pressable>

            <Pressable
              style={[styles.actionButton, styles.clearButton]}
              onPress={() => clearCredits()}
            >
              <Text style={[styles.actionButtonText, styles.clearButtonText]}>Clear</Text>
            </Pressable>
          </View>
        </View>

        {/* App Picker */}
        <View style={styles.card}>
          <View style={styles.pickerHeader}>
            <Text style={styles.cardTitle}>BLOCKED APPS</Text>
            <Text style={styles.pickerCount}>
              {status.blockedApps.length} selected
            </Text>
          </View>

          <TextInput
            style={styles.searchInput}
            placeholder="Search installed apps..."
            placeholderTextColor={KaizenTheme.textMuted}
            value={searchQuery}
            onChangeText={setSearchQuery}
            autoCapitalize="none"
          />

          <View style={styles.appList}>
            {filteredApps.length === 0 ? (
              <Text style={styles.emptyText}>No apps found</Text>
            ) : (
              filteredApps.slice(0, 50).map((item) => {
                const isSelected = status.blockedApps.includes(item.packageName);
                return (
                  <Pressable
                    key={item.packageName}
                    style={[
                      styles.appRow,
                      isSelected && styles.appRowSelected,
                    ]}
                    onPress={() => toggleAppBlocked(item.packageName)}
                  >
                    <View style={styles.appMeta}>
                      <Text style={styles.appName} numberOfLines={1}>
                        {item.label}
                      </Text>
                      <Text style={styles.appPackage} numberOfLines={1}>
                        {item.packageName}
                      </Text>
                    </View>
                    <View
                      style={[
                        styles.toggleBox,
                        isSelected && styles.toggleBoxActive,
                      ]}
                    >
                      {isSelected && <Text style={styles.checkmark}>✓</Text>}
                    </View>
                  </Pressable>
                );
              })
            )}
          </View>
        </View>

        {/* Emergency Controls */}
        <View style={styles.card}>
          <Text style={styles.cardTitle}>EMERGENCY OVERRIDE</Text>
          <Text style={styles.emergencyDesc}>
            Instantly suspend all blocking enforcement without changing credit balance.
          </Text>
          <Pressable
            style={[
              styles.emergencyButton,
              status.blockerEnabled ? styles.emergencyButtonActive : styles.emergencyButtonDisabled,
            ]}
            onPress={handleToggleBlocker}
          >
            <Text style={styles.emergencyButtonText}>
              {status.blockerEnabled ? 'Disable Blocker' : 'Enable Blocker'}
            </Text>
          </Pressable>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: KaizenTheme.bg,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 40,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  wordmark: {
    fontSize: 26,
    fontWeight: '700',
    letterSpacing: 4,
    color: KaizenTheme.text,
  },
  japaneseSub: {
    fontSize: 14,
    color: KaizenTheme.textMuted,
    marginTop: 2,
    letterSpacing: 2,
  },
  tagline: {
    fontSize: 13,
    color: KaizenTheme.textMuted,
    marginTop: 6,
    fontStyle: 'italic',
  },
  banner: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 16,
  },
  bannerOn: {
    backgroundColor: KaizenTheme.surface,
    borderColor: KaizenTheme.border,
  },
  bannerOff: {
    backgroundColor: KaizenTheme.redTint,
    borderColor: KaizenTheme.redDeep,
  },
  indicatorDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 14,
  },
  bannerTextContainer: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  bannerSubtitle: {
    fontSize: 12,
    color: KaizenTheme.textMuted,
    marginTop: 2,
  },
  card: {
    backgroundColor: KaizenTheme.surface,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    marginBottom: 16,
  },
  cardTitle: {
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: KaizenTheme.textMuted,
    marginBottom: 12,
  },
  checklistRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  checklistInfo: {
    flex: 1,
    marginRight: 12,
  },
  checkItemTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  checkItemDesc: {
    fontSize: 12,
    color: KaizenTheme.textMuted,
    marginTop: 2,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 6,
  },
  badgeSuccess: {
    backgroundColor: '#1E3326',
  },
  badgeDanger: {
    backgroundColor: KaizenTheme.redDeep,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: KaizenTheme.text,
  },
  divider: {
    height: 1,
    backgroundColor: KaizenTheme.border,
    marginVertical: 4,
  },
  restrictedNotice: {
    marginTop: 10,
    padding: 10,
    borderRadius: 8,
    backgroundColor: KaizenTheme.surfaceRaised,
  },
  restrictedText: {
    fontSize: 11,
    color: KaizenTheme.redSoft,
    lineHeight: 16,
  },
  creditDisplay: {
    alignItems: 'center',
    paddingVertical: 14,
  },
  creditTime: {
    fontSize: 34,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 1,
  },
  creditLabel: {
    fontSize: 13,
    color: KaizenTheme.textMuted,
    marginTop: 4,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    backgroundColor: KaizenTheme.redPrimary,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  actionButtonText: {
    color: KaizenTheme.text,
    fontWeight: '600',
    fontSize: 14,
  },
  clearButton: {
    backgroundColor: KaizenTheme.surfaceRaised,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  clearButtonText: {
    color: KaizenTheme.textMuted,
  },
  pickerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  pickerCount: {
    fontSize: 12,
    color: KaizenTheme.redBright,
    fontWeight: '600',
  },
  searchInput: {
    backgroundColor: KaizenTheme.surfaceRaised,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    color: KaizenTheme.text,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 13,
    marginTop: 8,
    marginBottom: 12,
  },
  appList: {
    maxHeight: 280,
  },
  emptyText: {
    color: KaizenTheme.textMuted,
    fontSize: 13,
    textAlign: 'center',
    paddingVertical: 20,
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderRadius: 8,
  },
  appRowSelected: {
    backgroundColor: KaizenTheme.surfaceRaised,
  },
  appMeta: {
    flex: 1,
    marginRight: 12,
  },
  appName: {
    fontSize: 14,
    fontWeight: '500',
    color: KaizenTheme.text,
  },
  appPackage: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
    marginTop: 2,
  },
  toggleBox: {
    width: 22,
    height: 22,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggleBoxActive: {
    backgroundColor: KaizenTheme.redPrimary,
    borderColor: KaizenTheme.redPrimary,
  },
  checkmark: {
    color: KaizenTheme.text,
    fontSize: 13,
    fontWeight: '700',
  },
  emergencyDesc: {
    fontSize: 13,
    color: KaizenTheme.textMuted,
    lineHeight: 18,
    marginBottom: 14,
  },
  emergencyButton: {
    paddingVertical: 13,
    borderRadius: 8,
    alignItems: 'center',
  },
  emergencyButtonActive: {
    backgroundColor: KaizenTheme.redDeep,
  },
  emergencyButtonDisabled: {
    backgroundColor: KaizenTheme.surfaceRaised,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  emergencyButtonText: {
    color: KaizenTheme.text,
    fontWeight: '700',
    fontSize: 14,
  },
});
