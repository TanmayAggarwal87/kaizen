import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { KaizenTheme, HitSlop } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

export default function TodayScreen() {
  const {
    status,
    tasks,
    toggleTask,
    openAccessibility,
    earnedMinutes,
    spentMinutes,
    remainingMinutes,
    completedCount,
    totalTaskCount,
  } = useKaizen();

  const isBlockerActive = status.blockerEnabled && status.accessibilityEnabled;
  const todayDateString = new Date().toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
  const todayWeekday = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
  }).toUpperCase();

  return (
    <SafeAreaView style={styles.container}>
      {/* Brand Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <Text style={styles.brandTitle}>KAIZEN</Text>
          <Text style={styles.headerScreen}>Today</Text>
        </View>
        <View style={styles.avatar}>
          <AntDesign name="user" size={14} color={KaizenTheme.text} />
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Blocker Alert Banner */}
        {!isBlockerActive && (
          <Pressable
            style={({ pressed }) => [styles.alertBanner, pressed && styles.pressedState]}
            onPress={openAccessibility}
            hitSlop={HitSlop.small}
          >
            <View style={styles.alertLeft}>
              <AntDesign name="warning" size={14} color={KaizenTheme.redBright} />
              <Text style={styles.alertText}>Gating Inactive · Tap to Enable</Text>
            </View>
            <AntDesign name="arrow-right" size={14} color={KaizenTheme.redBright} />
          </Pressable>
        )}

        {/* Date and Daily Focus */}
        <View style={styles.chronologyRow}>
          <View>
            <Text style={styles.focusHeadline}>Daily Discipline</Text>
            <Text style={styles.focusSub}>Intentional Focus</Text>
          </View>
          <View style={styles.dateCol}>
            <Text style={styles.dayText}>{todayWeekday}</Text>
            <Text style={styles.dateText}>{todayDateString}</Text>
          </View>
        </View>

        {/* Zen Minimalist Progress Ring Card */}
        <View style={styles.progressCard}>
          <View style={styles.ringContainer}>
            <View style={styles.outerRing}>
              <View style={styles.innerRingContent}>
                <Text style={styles.ringLabel}>AVAILABLE TIME</Text>
                <Text style={styles.ringCounter}>{remainingMinutes}</Text>
                <Text style={styles.ringSub}>Minutes Remaining</Text>
              </View>
            </View>
          </View>
          <View style={styles.completionBadge}>
            <View style={styles.badgeDot} />
            <Text style={styles.badgeText}>
              {completedCount} of {totalTaskCount} Disciplines Mastered
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
              {spentMinutes}<Text style={styles.ledgerUnit}>m</Text>
            </Text>
          </View>
          <View style={styles.ledgerCol}>
            <Text style={styles.ledgerLabel}>Balance</Text>
            <Text style={[styles.ledgerValue, styles.remValue]}>
              {remainingMinutes}<Text style={styles.remUnit}>m</Text>
            </Text>
          </View>
        </View>

        {/* Daily Discipline Tasks */}
        <View style={styles.taskSection}>
          <View style={styles.taskSectionHeader}>
            <View style={styles.taskSectionTitleRow}>
              <AntDesign name="check-circle" size={13} color={KaizenTheme.redPrimary} />
              <Text style={styles.taskSectionTitle}>TODAY'S Tasks</Text>
            </View>
            <View style={styles.taskCountBadge}>
              <Text style={styles.taskCountText}>
                {completedCount} / {totalTaskCount} COMPLETED
              </Text>
            </View>
          </View>

          <View style={styles.taskList}>
            {tasks.length === 0 ? (
              <View style={styles.emptyTaskBox}>
                <Text style={styles.emptyTaskTitle}>No Tasks Added Yet</Text>
                <Text style={styles.emptyTaskSub}>
                  Head over to the Tasks tab to add your daily tasks and earn screen time.
                </Text>
              </View>
            ) : (
              tasks.map((task) => (
                <Pressable
                  key={task.id}
                  style={({ pressed }) => [
                    styles.taskRow,
                    task.completed && styles.taskRowDone,
                    pressed && styles.pressedState,
                  ]}
                  onPress={() => toggleTask(task.id)}
                >
                  <View style={styles.taskLeft}>
                    <View
                      style={[
                        styles.checkbox,
                        task.completed && styles.checkboxChecked,
                      ]}
                    >
                      {task.completed && (
                        <AntDesign name="check" size={11} color={KaizenTheme.text} />
                      )}
                    </View>
                    <View style={styles.taskTextCol}>
                      <Text
                        style={[
                          styles.taskTitle,
                          task.completed && styles.taskTitleDone,
                        ]}
                        numberOfLines={1}
                      >
                        {task.title}
                      </Text>
                      <Text style={styles.taskCategory}>{task.category}</Text>
                    </View>
                  </View>
                  <View style={[styles.rewardPill, task.completed && styles.rewardPillDone]}>
                    <Text style={[styles.rewardText, task.completed && styles.rewardTextDone]}>
                      +{task.rewardMinutes}m
                    </Text>
                  </View>
                </Pressable>
              ))
            )}
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
    borderBottomColor: KaizenTheme.borderSubtle,
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
    fontSize: 13,
    fontWeight: '700',
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 32,
  },
  alertBanner: {
    backgroundColor: KaizenTheme.redTint,
    borderWidth: 1,
    borderColor: KaizenTheme.redDeep,
    paddingHorizontal: 14,
    paddingVertical: 10,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
    borderRadius: 8,
  },
  alertLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  alertText: {
    color: KaizenTheme.redBright,
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  chronologyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 16,
    paddingHorizontal: 4,
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
    letterSpacing: 1,
    marginTop: 2,
  },
  dateCol: {
    alignItems: 'flex-end',
  },
  dayText: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    fontWeight: '600',
  },
  dateText: {
    fontSize: 13,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 0.5,
  },
  progressCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.borderSubtle,
    borderRadius: 14,
    paddingVertical: 24,
    paddingHorizontal: 16,
    alignItems: 'center',
    marginBottom: 12,
  },
  ringContainer: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  outerRing: {
    width: 160,
    height: 160,
    borderRadius: 80,
    borderWidth: 3,
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
    letterSpacing: 1.5,
    color: KaizenTheme.textMuted,
    fontWeight: '600',
    textTransform: 'uppercase',
  },
  ringCounter: {
    fontSize: 44,
    fontWeight: '300',
    color: KaizenTheme.text,
    letterSpacing: -1,
    marginVertical: 1,
  },
  ringSub: {
    fontSize: 10,
    color: KaizenTheme.redPrimary,
    fontWeight: '600',
    letterSpacing: 0.5,
    textTransform: 'uppercase',
  },
  completionBadge: {
    marginTop: 16,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 12,
    paddingVertical: 5,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: KaizenTheme.borderSubtle,
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
    letterSpacing: 0.5,
    fontWeight: '500',
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
    borderColor: KaizenTheme.borderSubtle,
    paddingVertical: 12,
    paddingHorizontal: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  ledgerLabel: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: 3,
  },
  ledgerValue: {
    fontSize: 20,
    fontWeight: '500',
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
  taskSection: {
    marginTop: 4,
  },
  taskSectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 2,
  },
  taskSectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  taskSectionTitle: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: KaizenTheme.textMuted,
  },
  taskCountBadge: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: 4,
  },
  taskCountText: {
    fontSize: 9,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 0.8,
  },
  taskList: {
    gap: 7,
  },
  taskRow: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.borderSubtle,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    minHeight: 52,
  },
  taskRowDone: {
    opacity: 0.65,
  },
  pressedState: {
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
    width: 20,
    height: 20,
    borderRadius: 4,
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
  taskTextCol: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 13,
    color: KaizenTheme.text,
    fontWeight: '500',
  },
  taskTitleDone: {
    textDecorationLine: 'line-through',
    color: KaizenTheme.textMuted,
  },
  taskCategory: {
    fontSize: 9,
    color: KaizenTheme.textMuted,
    letterSpacing: 0.8,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  rewardPill: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  rewardPillDone: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    borderColor: KaizenTheme.borderSubtle,
  },
  rewardText: {
    color: KaizenTheme.text,
    fontSize: 11,
    fontWeight: '700',
  },
  rewardTextDone: {
    color: KaizenTheme.textMuted,
  },
  emptyTaskBox: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KaizenTheme.borderSubtle,
    padding: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyTaskTitle: {
    color: KaizenTheme.text,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
  },
  emptyTaskSub: {
    color: KaizenTheme.textMuted,
    fontSize: 11,
    textAlign: 'center',
    lineHeight: 16,
  },
});
