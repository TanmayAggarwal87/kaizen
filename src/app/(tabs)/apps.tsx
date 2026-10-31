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
import AntDesign from '@expo/vector-icons/AntDesign';
import { KaizenTheme, HitSlop } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

export default function AppsScreen() {
  const { apps, status, toggleBlockedApp, remainingMinutes } = useKaizen();
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

  const filteredBlocked = useMemo(() => blockedList.filter(filterFn), [blockedList, search]);
  const filteredUnblocked = useMemo(() => unblockedList.filter(filterFn), [unblockedList, search]);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>APPLICATION GATE</Text>
        <Text style={styles.headerTitle}>Guarded Applications</Text>
        <Text style={styles.headerSub}>
          Monitored applications share your single disciplined allowance balance.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Collective Bank Status */}
        <View style={styles.bankCard}>
          <View style={styles.bankLeft}>
            <View style={styles.bankIconContainer}>
              <AntDesign name="clock-circle" size={16} color={KaizenTheme.outline} />
            </View>
            <View>
              <Text style={styles.bankTitle}>Collective Allowance Bank</Text>
              <Text style={styles.bankDesc}>{remainingMinutes}m available today</Text>
            </View>
          </View>
          <View style={styles.bankBadge}>
            <Text style={styles.bankBadgeText}>
              {status.blockedApps.length} GUARDED
            </Text>
          </View>
        </View>

        {/* Search Input with Clear Button */}
        <View style={styles.searchContainer}>
          <AntDesign name="search" size={14} color={KaizenTheme.textMuted} style={styles.searchIcon} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name or package..."
            placeholderTextColor={KaizenTheme.textMuted}
            value={search}
            onChangeText={setSearch}
            autoCapitalize="none"
            autoCorrect={false}
          />
          {search.length > 0 && (
            <Pressable
              onPress={() => setSearch('')}
              hitSlop={HitSlop.standard}
              style={styles.searchClearBtn}
            >
              <AntDesign name="close-circle" size={14} color={KaizenTheme.textMuted} />
            </Pressable>
          )}
        </View>

        {/* Guarded Apps Section */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>
            GUARDED BY TIME ALLOWANCE ({filteredBlocked.length})
          </Text>
          <View style={styles.tierBadge}>
            <Text style={styles.tierText}>STRICT TIER</Text>
          </View>
        </View>

        <View style={styles.cardGroup}>
          {filteredBlocked.length === 0 ? (
            <View style={styles.emptyContainer}>
              <AntDesign name="info-circle" size={18} color={KaizenTheme.textMuted} style={{ marginBottom: 6 }} />
              <Text style={styles.emptyTitle}>No Guarded Apps</Text>
              <Text style={styles.emptyText}>
                Select applications from the list below to set daily time limits.
              </Text>
            </View>
          ) : (
            filteredBlocked.map((app) => (
              <Pressable
                key={app.packageName}
                style={({ pressed }) => [styles.appRow, pressed && styles.rowPressed]}
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
                  <AntDesign name="lock" size={10} color={KaizenTheme.text} style={{ marginRight: 4 }} />
                  <Text style={styles.lockStatusText}>GUARDED</Text>
                </View>
              </Pressable>
            ))
          )}
        </View>

        {/* Unguarded Apps Section */}
        <View style={[styles.sectionHeaderRow, styles.topSpacer]}>
          <Text style={styles.sectionTitle}>
            AVAILABLE APPLICATIONS ({filteredUnblocked.length})
          </Text>
          <View style={[styles.tierBadge, styles.unmonitoredTier]}>
            <Text style={styles.unmonitoredText}>OPEN ACCESS</Text>
          </View>
        </View>

        <View style={styles.cardGroup}>
          {filteredUnblocked.length === 0 ? (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>
                {search.length > 0 ? 'No matching applications found' : 'All detected apps are guarded'}
              </Text>
            </View>
          ) : (
            filteredUnblocked.slice(0, 40).map((app) => (
              <Pressable
                key={app.packageName}
                style={({ pressed }) => [styles.appRow, pressed && styles.rowPressed]}
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
                  <AntDesign name="plus" size={10} color={KaizenTheme.textMuted} style={{ marginRight: 3 }} />
                  <Text style={styles.addButtonText}>GUARD</Text>
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
    lineHeight: 17,
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
  bankIconContainer: {
    width: 32,
    height: 32,
    borderRadius: 6,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  bankTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  bankDesc: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
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
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    marginBottom: 16,
    minHeight: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: KaizenTheme.text,
    fontSize: 13,
    paddingVertical: 10,
  },
  searchClearBtn: {
    padding: 4,
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
  rowPressed: {
    backgroundColor: KaizenTheme.surfaceContainer,
  },
  appAvatar: {
    width: 34,
    height: 34,
    borderRadius: 6,
    backgroundColor: KaizenTheme.redTint,
    borderWidth: 1,
    borderColor: KaizenTheme.redDeep,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  appAvatarText: {
    color: KaizenTheme.redBright,
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KaizenTheme.redDeep,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
  },
  lockStatusText: {
    color: KaizenTheme.text,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  addButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 5,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  addButtonText: {
    color: KaizenTheme.textMuted,
    fontSize: 10,
    fontWeight: '600',
  },
  emptyContainer: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTitle: {
    color: KaizenTheme.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 2,
  },
  emptyText: {
    color: KaizenTheme.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
