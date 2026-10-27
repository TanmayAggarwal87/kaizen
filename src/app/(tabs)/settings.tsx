import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  Switch,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KaizenTheme } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

export default function SettingsScreen() {
  const {
    status,
    rewardMode,
    setRewardMode,
    defaultRewardMinutes,
    setDefaultRewardMinutes,
    dailyResetTime,
    creditCarryover,
    setCreditCarryover,
    grantManualCredits,
    clearAllCredits,
    openAccessibility,
    requestBatteryExemption,
  } = useKaizen();

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>SYSTEM CORE</Text>
        <Text style={styles.headerTitle}>Settings</Text>
        <Text style={styles.headerSub}>
          System configuration, gating protocol, and blocking daemon state.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 01: Reward Mode */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>SECTION 01 // REWARD MODE</Text>
        </View>

        <View style={styles.cardGroup}>
          <Pressable
            style={[
              styles.modeCard,
              rewardMode === 'earn_as_you_go' && styles.modeCardSelected,
            ]}
            onPress={() => setRewardMode('earn_as_you_go')}
          >
            <View style={styles.modeHeader}>
              <View style={styles.modeTitleRow}>
                <View
                  style={[
                    styles.radio,
                    rewardMode === 'earn_as_you_go' && styles.radioActive,
                  ]}
                />
                <Text style={styles.modeTitle}>Earn as you go</Text>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            </View>
            <Text style={styles.modeDesc}>
              Earn screen allowance immediately following task completion. Incremental autonomy.
            </Text>
          </Pressable>

          <Pressable
            style={[
              styles.modeCard,
              rewardMode === 'unlock_after_all' && styles.modeCardSelected,
            ]}
            onPress={() => setRewardMode('unlock_after_all')}
          >
            <View style={styles.modeHeader}>
              <View style={styles.modeTitleRow}>
                <View
                  style={[
                    styles.radio,
                    rewardMode === 'unlock_after_all' && styles.radioActive,
                  ]}
                />
                <Text style={styles.modeTitle}>Unlock after all tasks</Text>
              </View>
              <View style={[styles.defaultBadge, styles.asceticBadge]}>
                <Text style={styles.asceticBadgeText}>ASCETIC</Text>
              </View>
            </View>
            <Text style={styles.modeDesc}>
              Distraction apps remain sealed until every planned discipline block is accounted for.
            </Text>
          </Pressable>
        </View>

        {/* Section 02: Task Defaults & Schedule */}
        <View style={[styles.sectionHeaderRow, styles.topSpacer]}>
          <Text style={styles.sectionTitle}>
            SECTION 02 // TASK DEFAULTS & SCHEDULE
          </Text>
        </View>

        <View style={styles.cardGroup}>
          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Default reward per task</Text>
              <Text style={styles.settingSub}>Added to pool per checked item</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setDefaultRewardMinutes(Math.max(1, defaultRewardMinutes - 1))}
              >
                <Text style={styles.stepBtnText}>−</Text>
              </Pressable>
              <Text style={styles.stepVal}>{defaultRewardMinutes} min</Text>
              <Pressable
                style={styles.stepBtn}
                onPress={() => setDefaultRewardMinutes(defaultRewardMinutes + 1)}
              >
                <Text style={styles.stepBtnText}>+</Text>
              </Pressable>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Daily reset time</Text>
              <Text style={styles.settingSub}>Disciplines clear; cycle renews</Text>
            </View>
            <Text style={styles.staticValue}>{dailyResetTime}</Text>
          </View>

          <View style={[styles.settingRow, styles.noBorder]}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Credit carryover</Text>
              <Text style={styles.settingSub}>
                Unspent allowance strictly perishes at reset.
              </Text>
            </View>
            <Switch
              value={creditCarryover}
              onValueChange={setCreditCarryover}
              trackColor={{ false: KaizenTheme.surfaceContainerHigh, true: KaizenTheme.redPrimary }}
              thumbColor={KaizenTheme.text}
            />
          </View>
        </View>

        {/* Section 03: Permissions & Health Checklist */}
        <View style={[styles.sectionHeaderRow, styles.topSpacer]}>
          <Text style={styles.sectionTitle}>
            SECTION 03 // PERMISSIONS & HEALTH CHECKLIST
          </Text>
        </View>

        <View style={styles.cardGroup}>
          <Pressable style={styles.settingRow} onPress={openAccessibility}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Accessibility Service</Text>
              <Text style={styles.settingSub}>Window & app launch detection</Text>
            </View>
            <View
              style={[
                styles.healthBadge,
                status.accessibilityEnabled ? styles.healthBadgeOn : styles.healthBadgeOff,
              ]}
            >
              <Text
                style={[
                  styles.healthBadgeText,
                  status.accessibilityEnabled ? styles.healthBadgeTextOn : styles.healthBadgeTextOff,
                ]}
              >
                {status.accessibilityEnabled ? 'ACTIVE' : 'ENABLE'}
              </Text>
            </View>
          </Pressable>

          <Pressable style={[styles.settingRow, styles.noBorder]} onPress={requestBatteryExemption}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Battery Optimization</Text>
              <Text style={styles.settingSub}>Prevent OS background suspension</Text>
            </View>
            <View
              style={[
                styles.healthBadge,
                status.batteryUnrestricted ? styles.healthBadgeOn : styles.healthBadgeOff,
              ]}
            >
              <Text
                style={[
                  styles.healthBadgeText,
                  status.batteryUnrestricted ? styles.healthBadgeTextOn : styles.healthBadgeTextOff,
                ]}
              >
                {status.batteryUnrestricted ? 'EXEMPT' : 'FIX'}
              </Text>
            </View>
          </Pressable>
        </View>

        {/* Debug Utilities */}
        <View style={[styles.sectionHeaderRow, styles.topSpacer]}>
          <Text style={styles.sectionTitle}>DEBUG CREDITS (TESTING)</Text>
        </View>

        <View style={styles.debugButtonsRow}>
          <Pressable
            style={styles.debugBtn}
            onPress={() => grantManualCredits(2)}
          >
            <Text style={styles.debugBtnText}>+2 Min</Text>
          </Pressable>
          <Pressable
            style={styles.debugBtn}
            onPress={() => grantManualCredits(10)}
          >
            <Text style={styles.debugBtnText}>+10 Min</Text>
          </Pressable>
          <Pressable
            style={[styles.debugBtn, styles.clearBtn]}
            onPress={clearAllCredits}
          >
            <Text style={[styles.debugBtnText, styles.clearBtnText]}>Clear</Text>
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
  sectionHeaderRow: {
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
  cardGroup: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    overflow: 'hidden',
  },
  modeCard: {
    padding: 14,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
  },
  modeCardSelected: {
    backgroundColor: KaizenTheme.surfaceContainer,
  },
  modeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 6,
  },
  modeTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 10,
  },
  radio: {
    width: 14,
    height: 14,
    borderRadius: 7,
    borderWidth: 1.5,
    borderColor: KaizenTheme.border,
  },
  radioActive: {
    borderColor: KaizenTheme.redPrimary,
    backgroundColor: KaizenTheme.redPrimary,
  },
  modeTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  defaultBadge: {
    backgroundColor: KaizenTheme.redTint,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  defaultBadgeText: {
    fontSize: 9,
    fontWeight: '700',
    color: KaizenTheme.redBright,
    letterSpacing: 0.5,
  },
  asceticBadge: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
  },
  asceticBadgeText: {
    color: KaizenTheme.textMuted,
  },
  modeDesc: {
    fontSize: 12,
    color: KaizenTheme.textMuted,
    lineHeight: 18,
    marginLeft: 24,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  settingTextGroup: {
    flex: 1,
    marginRight: 10,
  },
  settingLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: KaizenTheme.text,
  },
  settingSub: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
    marginTop: 2,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  stepBtn: {
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  stepBtnText: {
    color: KaizenTheme.text,
    fontSize: 14,
    fontWeight: '700',
  },
  stepVal: {
    fontSize: 12,
    fontWeight: '600',
    color: KaizenTheme.text,
    paddingHorizontal: 4,
  },
  staticValue: {
    fontSize: 13,
    fontWeight: '600',
    color: KaizenTheme.redBright,
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  healthBadgeOn: {
    backgroundColor: '#0E1F14',
    borderWidth: 1,
    borderColor: '#1E3326',
  },
  healthBadgeOff: {
    backgroundColor: KaizenTheme.redTint,
    borderWidth: 1,
    borderColor: KaizenTheme.redDeep,
  },
  healthBadgeText: {
    fontSize: 10,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  healthBadgeTextOn: {
    color: KaizenTheme.success,
  },
  healthBadgeTextOff: {
    color: KaizenTheme.redBright,
  },
  debugButtonsRow: {
    flexDirection: 'row',
    gap: 8,
  },
  debugBtn: {
    flex: 1,
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
  },
  debugBtnText: {
    color: KaizenTheme.text,
    fontSize: 12,
    fontWeight: '600',
  },
  clearBtn: {
    backgroundColor: KaizenTheme.redTint,
    borderColor: KaizenTheme.redDeep,
  },
  clearBtnText: {
    color: KaizenTheme.redBright,
  },
});
