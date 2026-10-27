import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KaizenTheme } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

export default function AppsScreen() {
  const { apps, status, toggleBlockedApp } = useKaizen();
  const [search, setSearch] = useState('');

  const blockedList = useMemo(() => {
    return apps.filter((a) => status.blockedApps.includes(a.packageName));
  }, [apps, status.blockedApps]);

  const unblockedList = useMemo(() => {
    return apps.filter((a) => !status.blockedApps.includes(a.packageName));
  }, [apps, status.blockedApps]);

  const filterFn = (item: { label: string; packageName: string }) => {
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      item.label.toLowerCase().includes(q) ||
      item.packageName.toLowerCase().includes(q)
    );
  };

  const filteredBlocked = blockedList.filter(filterFn);
  const filteredUnblocked = unblockedList.filter(filterFn);

  const minutesRemaining = Math.max(0, Math.floor(status.remainingMs / (1000 * 60)));

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>GATE ACCESS</Text>
        <Text style={styles.headerTitle}>Covered Apps</Text>
        <Text style={styles.headerSub}>
          All selected apps share one single disciplined time balance.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Collective Bank Status */}
        <View style={styles.bankCard}>
          <View style={styles.bankLeft}>
            <Text style={styles.bankIcon}>⌛</Text>
            <View>
              <Text style={styles.bankTitle}>Collective Bank</Text>
              <Text style={styles.bankDesc}>{minutesRemaining}m available today</Text>
            </View>
          </View>
          <View style={styles.bankBadge}>
            <Text style={styles.bankBadgeText}>
              {status.blockedApps.length} SYNCED
            </Text>
          </View>
        </View>

        {/* Search Input */}
        <TextInput
          style={styles.searchInput}
          placeholder="Search apps or packages..."
          placeholderTextColor={KaizenTheme.textMuted}
          value={search}
          onChangeText={setSearch}
          autoCapitalize="none"
        />

        {/* Monitored Apps Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            COVERED BY TIME BALANCE ({filteredBlocked.length})
          </Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>STRICT TIER</Text>
          </View>
        </View>

        <View style={styles.cardGroup}>
          {filteredBlocked.length === 0 ? (
            <Text style={styles.emptyText}>No covered apps selected</Text>
          ) : (
            filteredBlocked.map((app) => (
              <Pressable
                key={app.packageName}
                style={styles.appRow}
                onPress={() => toggleBlockedApp(app.packageName)}
              >
                <View style={styles.appAvatar}>
                  <Text style={styles.appAvatarText}>
                    {app.label.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appLabel}>{app.label}</Text>
                  <Text style={styles.appPackage} numberOfLines={1}>
                    {app.packageName}
                  </Text>
                </View>
                <View style={styles.lockStatusButton}>
                  <Text style={styles.lockStatusText}>LOCKED</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Unmonitored Apps Section */}
        <View style={[styles.sectionHeaderRow, styles.topSpacer]}>
          <Text style={styles.sectionTitle}>
            OTHER INSTALLED APPS ({filteredUnblocked.length})
          </Text>
          <View style={[styles.tierBadge, styles.unmonitoredTier]}>
            <Text style={styles.unmonitoredText}>UNMONITORED</Text>
          </View>
        </View>

        <View style={styles.cardGroup}>
          {filteredUnblocked.length === 0 ? (
            <Text style={styles.emptyText}>No apps found</Text>
          ) : (
            filteredUnblocked.slice(0, 40).map((app) => (
              <Pressable
                key={app.packageName}
                style={styles.appRow}
                onPress={() => toggleBlockedApp(app.packageName)}
              >
                <View style={[styles.appAvatar, styles.unmonitoredAvatar]}>
                  <Text style={[styles.appAvatarText, styles.unmonitoredAvatarText]}>
                    {app.label.charAt(0).toUpperCase()}
                  </Text>
                </View>
                <View style={styles.appInfo}>
                  <Text style={styles.appLabel}>{app.label}</Text>
                  <Text style={styles.appPackage} numberOfLines={1}>
                    {app.packageName}
                  </Text>
                </View>
                <View style={styles.addButton}>
                  <Text style={styles.addButtonText}>+ ADD</Text>
                </View>
              </Pressable>
            ))
          )}
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
  header: {
    paddingHorizontal: 20,
    paddingTop: 14,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: KaizenTheme.outline,
    textTransform: 'uppercase',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: KaizenTheme.text,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  headerSub: {
    fontSize: 12,
    color: KaizenTheme.textMuted,
    marginTop: 4,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  bankCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  bankLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  bankIcon: {
    fontSize: 18,
  },
  bankTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  bankDesc: {
    fontSize: 11,
    color: KaizenTheme.redPrimary,
    marginTop: 2,
  },
  bankBadge: {
    backgroundColor: KaizenTheme.redTint,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KaizenTheme.redDeep,
  },
  bankBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.redBright,
    letterSpacing: 0.5,
  },
  searchInput: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: KaizenTheme.text,
    fontSize: 13,
    marginBottom: 16,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  topSpacer: {
    marginTop: 20,
  },
  sectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.textMuted,
    letterSpacing: 1.2,
  },
  tierBadge: {
    backgroundColor: KaizenTheme.redTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  tierText: {
    fontSize: 9,
    fontWeight: '700',
    color: KaizenTheme.redBright,
    letterSpacing: 0.5,
  },
  unmonitoredTier: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
  },
  unmonitoredText: {
    fontSize: 9,
    fontWeight: '700',
    color: KaizenTheme.textMuted,
    letterSpacing: 0.5,
  },
  cardGroup: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    overflow: 'hidden',
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
  },
  appAvatar: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: KaizenTheme.redTint,
    borderWidth: 1,
    borderColor: KaizenTheme.redDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appAvatarText: {
    color: KaizenTheme.redPrimary,
    fontWeight: '700',
    fontSize: 14,
  },
  unmonitoredAvatar: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderColor: KaizenTheme.border,
  },
  unmonitoredAvatarText: {
    color: KaizenTheme.textMuted,
  },
  appInfo: {
    flex: 1,
    marginRight: 10,
  },
  appLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  appPackage: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    marginTop: 2,
  },
  lockStatusButton: {
    backgroundColor: KaizenTheme.redDeep,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  lockStatusText: {
    color: KaizenTheme.text,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButton: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  addButtonText: {
    color: KaizenTheme.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  emptyText: {
    color: KaizenTheme.textMuted,
    fontSize: 12,
    textAlign: 'center',
    paddingVertical: 20,
  },
});
