import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KaizenTheme } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

export default function TodayScreen() {
  const { status, tasks, toggleTask, openAccessibility } = useKaizen();

  const minutesRemaining = Math.max(0, Math.floor(status.remainingMs / (1000 * 60)));
  const completedTasksCount = tasks.filter((t) => t.completed).length;
  const totalTasksCount = tasks.length;
  const isBlockerActive = status.blockerEnabled && status.accessibilityEnabled;

  const earnedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.rewardMinutes, 0);

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>KAIZEN · 改善</Text>
          <Text style={styles.headerScreen}>Today</Text>
        </View>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>道</Text>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blocker Alert Banner */}
        {!isBlockerActive ? (
          <Pressable style={styles.alertBanner} onPress={openAccessibility}>
            <View style={styles.alertLeft}>
              <Text style={styles.alertIcon}>⚠</Text>
              <Text style={styles.alertText}>Blocker is off. Tap to fix.</Text>
            </View>
            <Text style={styles.alertArrow}>→</Text>
          </Pressable>
        ) : (
          <View style={styles.activeBanner}>
            <View style={styles.activeDot} />
            <Text style={styles.activeBannerText}>SHIELD ACTIVE · ALL DISCIPLINED APPS LOCKED</Text>
          </View>
        )}

        {/* Date and Daily Focus */}
        <View style={styles.chronologyRow}>
          <View>
            <Text style={styles.focusHeadline}>Daily Focus</Text>
            <Text style={styles.focusSub}>改善 · Mindful Velocity</Text>
          </View>
          <View style={styles.dateCol}>
            <Text style={styles.dayText}>TODAY</Text>
            <Text style={styles.dateText}>OCT 27</Text>
          </View>
        </View>

        {/* Zen Minimalist Progress Ring Card */}
        <View style={styles.progressCard}>
          <View style={styles.ringContainer}>
            <View style={styles.outerRing}>
              <View style={styles.innerRingContent}>
                <Text style={styles.ringLabel}>TIME CREDIT</Text>
                <Text style={styles.ringCounter}>{minutesRemaining}</Text>
                <Text style={styles.ringSub}>Minutes Available</Text>
              </View>
            </View>
          </View>
          <View style={styles.completionBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>
              {completedTasksCount} of {totalTasksCount} Disciplines Mastered
            </Text>
          </View>
        </View>

        {/* Tri-Metric Ledger Strip */}
        <View style={styles.ledgerGrid}>
          <View style={styles.ledgerCol}>
            <Text style={styles.ledgerLabel}>Earned</Text>
            <Text style={styles.ledgerValue}>
              {earnedMinutes}<Text style={styles.ledgerUnit}>m</Text>
            </Text>
          </View>
          <View style={styles.ledgerCol}>
            <Text style={styles.ledgerLabel}>Spent</Text>
            <Text style={[styles.ledgerValue, styles.spentValue]}>
              18<Text style={styles.ledgerUnit}>m</Text>
            </Text>
          </View>
          <View style={styles.ledgerCol}>
            <Text style={styles.ledgerLabel}>Remaining</Text>
            <Text style={[styles.ledgerValue, styles.remValue]}>
              {minutesRemaining}<Text style={styles.remUnit}>m</Text>
            </Text>
          </View>
        </View>

        {/* Operational Guard Pill */}
        <View style={styles.guardPill}>
          <View style={styles.guardLeft}>
            <View style={styles.lockBadge}>
              <Text style={styles.lockIcon}>🔒</Text>
              <Text style={styles.lockText}>APPS LOCKED</Text>
            </View>
            <Text style={styles.guardSub}>Earn as you go</Text>
          </View>
          <Text style={styles.guardStatus}>
            ● {isBlockerActive ? 'SHIELD ACTIVE' : 'DISARMED'}
          </Text>
        </View>

        {/* Today's Discipline Tasks */}
        <View style={styles.taskSection}>
          <View style={styles.taskSectionHeader}>
            <View style={styles.taskSectionTitleRow}>
              <Text style={styles.taskSectionIcon}>⚔</Text>
              <Text style={styles.taskSectionTitle}>TODAY'S DISCIPLINE</Text>
            </View>
            <View style={styles.taskCountBadge}>
              <Text style={styles.taskCountText}>
                {completedTasksCount} / {totalTasksCount} DONE
              </Text>
            </View>
          </View>

          <View style={styles.taskList}>
            {tasks.map((task) => (
              <Pressable
                key={task.id}
                style={[styles.taskRow, task.completed && styles.taskRowDone]}
                onPress={() => toggleTask(task.id)}
              >
                <View style={styles.taskLeft}>
                  <View
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxChecked,
                    ]}
                  >
                    {task.completed && <Text style={styles.checkIcon}>✓</Text>}
                  </View>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleDone,
                    ]}
                    numberOfLines={1}
                  >
                    {task.title}
                  </Text>
                </View>
                <View style={styles.rewardPill}>
                  <Text style={styles.rewardText}>+{task.rewardMinutes}m</Text>
                </View>
              </Pressable>
            ))}
          </View>
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
  },
  headerLeft: {
    flex: 1,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 2,
    color: KaizenTheme.outline,
    textTransform: 'uppercase',
  },
  headerScreen: {
    fontSize: 20,
    fontWeight: '600',
    color: KaizenTheme.text,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: KaizenTheme.redPrimary,
    fontSize: 14,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  alertBanner: {
    backgroundColor: KaizenTheme.redTint,
    borderWidth: 1,
    borderColor: KaizenTheme.redDeep,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 18,
    borderRadius: 6,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertIcon: {
    color: KaizenTheme.redBright,
    fontSize: 14,
  },
  alertText: {
    color: KaizenTheme.redBright,
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  alertArrow: {
    color: KaizenTheme.redBright,
    fontSize: 16,
    fontWeight: '700',
  },
  activeBanner: {
    backgroundColor: '#0E1F14',
    borderWidth: 1,
    borderColor: '#1E3326',
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 18,
    borderRadius: 6,
  },
  activeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KaizenTheme.success,
  },
  activeBannerText: {
    color: KaizenTheme.success,
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1,
  },
  chronologyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
  },
  focusHeadline: {
    fontSize: 20,
    fontWeight: '600',
    color: KaizenTheme.text,
    letterSpacing: -0.2,
  },
  focusSub: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginTop: 2,
  },
  dateCol: {
    alignItems: 'flex-end',
  },
  dayText: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 1,
  },
  progressCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    borderRadius: 12,
    padding: 24,
    alignItems: 'center',
    marginBottom: 12,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 170,
    height: 170,
    borderRadius: 85,
    borderWidth: 5,
    borderColor: KaizenTheme.redPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: KaizenTheme.surfaceContainerLowest,
  },
  innerRingContent: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringLabel: {
    fontSize: 9,
    letterSpacing: 2,
    color: KaizenTheme.textMuted,
    textTransform: 'uppercase',
  },
  ringCounter: {
    fontSize: 48,
    fontWeight: '300',
    color: KaizenTheme.text,
    letterSpacing: -1,
    marginVertical: 2,
  },
  ringSub: {
    fontSize: 10,
    color: KaizenTheme.redPrimary,
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  completionBadge: {
    marginTop: 18,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  badgeDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: KaizenTheme.redPrimary,
  },
  badgeText: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  ledgerGrid: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 12,
  },
  ledgerCol: {
    flex: 1,
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 8,
  },
  ledgerLabel: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: 4,
  },
  ledgerValue: {
    fontSize: 22,
    fontWeight: '400',
    color: KaizenTheme.text,
  },
  spentValue: {
    color: KaizenTheme.textMuted,
  },
  remValue: {
    color: KaizenTheme.redPrimary,
  },
  ledgerUnit: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
  },
  remUnit: {
    fontSize: 11,
    color: KaizenTheme.redPrimary,
  },
  guardPill: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 18,
  },
  guardLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  lockBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: KaizenTheme.redTint,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
  },
  lockIcon: {
    fontSize: 10,
  },
  lockText: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.redBright,
    letterSpacing: 0.8,
  },
  guardSub: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
  },
  guardStatus: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.success,
    letterSpacing: 1,
  },
  taskSection: {
    marginTop: 6,
  },
  taskSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  taskSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskSectionIcon: {
    fontSize: 14,
    color: KaizenTheme.redPrimary,
  },
  taskSectionTitle: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.5,
    color: KaizenTheme.textMuted,
  },
  taskCountBadge: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskCountText: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 1,
  },
  taskList: {
    gap: 6,
  },
  taskRow: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    borderRadius: 8,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  taskRowDone: {
    opacity: 0.75,
  },
  taskLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  checkbox: {
    width: 18,
    height: 18,
    borderRadius: 3,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: KaizenTheme.redPrimary,
    borderColor: KaizenTheme.redPrimary,
  },
  checkIcon: {
    color: KaizenTheme.text,
    fontSize: 11,
    fontWeight: '800',
  },
  taskTitle: {
    fontSize: 13,
    color: KaizenTheme.text,
    flex: 1,
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: KaizenTheme.textMuted,
  },
  rewardPill: {
    backgroundColor: '#0E1F14',
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E3326',
  },
  rewardText: {
    color: KaizenTheme.tertiary,
    fontSize: 11,
    fontWeight: '700',
  },
});
