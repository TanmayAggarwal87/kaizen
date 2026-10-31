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
import AntDesign from '@expo/vector-icons/AntDesign';
import { KaizenTheme, HitSlop } from '@/constants/theme';
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
        <Text style={styles.brandTitle}>SYSTEM PROTOCOLS</Text>
        <Text style={styles.headerTitle}>Preferences & Core</Text>
        <Text style={styles.headerSub}>
          Allowance mechanics, daily renewal cycle, and background enforcement health.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Section 01: Reward Mode */}
        <View style={styles.sectionHeaderRow}>
          <Text style={styles.sectionTitle}>SECTION 01 // ALLOWANCE MECHANISM</Text>
        </View>

        <View style={styles.cardGroup}>
          <Pressable
            style={({ pressed }) => [
              styles.modeCard,
              rewardMode === 'earn_as_you_go' && styles.modeCardSelected,
              pressed && styles.rowPressed,
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
                >
                  {rewardMode === 'earn_as_you_go' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.modeTitle}>Earn as you go</Text>
              </View>
              <View style={styles.defaultBadge}>
                <Text style={styles.defaultBadgeText}>DEFAULT</Text>
              </View>
            </View>
            <Text style={styles.modeDesc}>
              Allowance is credited immediately following task completion. Incremental autonomy.
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.modeCard,
              rewardMode === 'unlock_after_all' && styles.modeCardSelected,
              pressed && styles.rowPressed,
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
                >
                  {rewardMode === 'unlock_after_all' && <View style={styles.radioInner} />}
                </View>
                <Text style={styles.modeTitle}>Unlock after all tasks</Text>
              </View>
              <View style={[styles.defaultBadge, styles.asceticBadge]}>
                <Text style={styles.asceticBadgeText}>ASCETIC</Text>
              </View>
            </View>
            <Text style={styles.modeDesc}>
              Applications remain sealed until every scheduled discipline block is finished.
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
              <Text style={styles.settingLabel}>Default reward per Tasks</Text>
              <Text style={styles.settingSub}>Added to allowance balance per checked item</Text>
            </View>
            <View style={styles.stepper}>
              <Pressable
                style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
                onPress={() => setDefaultRewardMinutes(Math.max(1, defaultRewardMinutes - 1))}
                hitSlop={HitSlop.small}
              >
                <AntDesign name="minus" size={13} color={KaizenTheme.text} />
              </Pressable>
              <Text style={styles.stepVal}>{defaultRewardMinutes} min</Text>
              <Pressable
                style={({ pressed }) => [styles.stepBtn, pressed && styles.stepBtnPressed]}
                onPress={() => setDefaultRewardMinutes(defaultRewardMinutes + 1)}
                hitSlop={HitSlop.small}
              >
                <AntDesign name="plus" size={13} color={KaizenTheme.text} />
              </Pressable>
            </View>
          </View>

          <View style={styles.settingRow}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Daily renewal cycle</Text>
              <Text style={styles.settingSub}>Protocols clear and cycle renews</Text>
            </View>
            <View style={styles.staticBadge}>
              <Text style={styles.staticValue}>{dailyResetTime}</Text>
            </View>
          </View>

          <View style={[styles.settingRow, styles.noBorder]}>
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Allowance carryover</Text>
              <Text style={styles.settingSub}>
                Unspent minutes expire strictly at daily reset when disabled.
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
            SECTION 03 // PERMISSIONS & SYSTEM HEALTH
          </Text>
        </View>

        <View style={styles.cardGroup}>
          <Pressable
            style={({ pressed }) => [styles.settingRow, pressed && styles.rowPressed]}
            onPress={openAccessibility}
          >
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Accessibility Service</Text>
              <Text style={styles.settingSub}>App window detection and guard enforcement</Text>
            </View>
            <View style={styles.permissionActionRow}>
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
                  {status.accessibilityEnabled ? 'ACTIVE' : 'ACTION NEEDED'}
                </Text>
              </View>
              <AntDesign name="right" size={12} color={KaizenTheme.textMuted} style={{ marginLeft: 6 }} />
            </View>
          </Pressable>

          <Pressable
            style={({ pressed }) => [styles.settingRow, styles.noBorder, pressed && styles.rowPressed]}
            onPress={requestBatteryExemption}
          >
            <View style={styles.settingTextGroup}>
              <Text style={styles.settingLabel}>Battery Optimization</Text>
              <Text style={styles.settingSub}>Prevent OS from terminating background guard</Text>
            </View>
            <View style={styles.permissionActionRow}>
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
                  {status.batteryUnrestricted ? 'EXEMPT' : 'ACTION NEEDED'}
                </Text>
              </View>
              <AntDesign name="right" size={12} color={KaizenTheme.textMuted} style={{ marginLeft: 6 }} />
            </View>
          </Pressable>
        </View>

        {/* Diagnostic Utilities */}
        <View style={[styles.sectionHeaderRow, styles.topSpacer]}>
          <Text style={styles.sectionTitle}>SECTION 04 // DIAGNOSTIC ALLOWANCE (TESTING)</Text>
        </View>

        <View style={styles.debugButtonsRow}>
          <Pressable
            style={({ pressed }) => [styles.debugBtn, pressed && styles.debugBtnPressed]}
            onPress={() => grantManualCredits(5)}
          >
            <Text style={styles.debugBtnText}>+5 Min</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.debugBtn, pressed && styles.debugBtnPressed]}
            onPress={() => grantManualCredits(15)}
          >
            <Text style={styles.debugBtnText}>+15 Min</Text>
          </Pressable>
          <Pressable
            style={({ pressed }) => [styles.debugBtn, styles.clearBtn, pressed && styles.debugBtnPressed]}
            onPress={clearAllCredits}
          >
            <Text style={[styles.debugBtnText, styles.clearBtnText]}>Reset Pool</Text>
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
    lineHeight: 17,
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
  rowPressed: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
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
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: KaizenTheme.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioActive: {
    borderColor: KaizenTheme.redPrimary,
  },
  radioInner: {
    width: 8,
    height: 8,
    borderRadius: 4,
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
    marginLeft: 26,
  },
  settingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
    minHeight: 52,
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
    lineHeight: 16,
  },
  stepper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    minHeight: 36,
  },
  stepBtn: {
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepBtnPressed: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
  },
  stepVal: {
    fontSize: 12,
    fontWeight: '600',
    color: KaizenTheme.text,
    paddingHorizontal: 6,
  },
  staticBadge: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  staticValue: {
    fontSize: 12,
    fontWeight: '700',
    color: KaizenTheme.redBright,
  },
  permissionActionRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  healthBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },
  healthBadgeOn: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
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
    color: KaizenTheme.text,
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
    justifyContent: 'center',
    borderRadius: 8,
    minHeight: 44,
  },
  debugBtnPressed: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
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
