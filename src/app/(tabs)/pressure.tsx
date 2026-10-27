import React, { useState, useRef, useEffect } from 'react';
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

export default function PressureScreen() {
  const { status, tasks, toggleBlocker } = useKaizen();
  const [holding, setHolding] = useState(false);
  const [countdown, setCountdown] = useState(5.0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const completedCount = tasks.filter((t) => t.completed).length;
  const minutesRemaining = Math.max(0, Math.floor(status.remainingMs / (1000 * 60)));

  const startHold = () => {
    setHolding(true);
    setCountdown(5.0);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const left = Math.max(0, 5.0 - elapsed);
      setCountdown(parseFloat(left.toFixed(1)));
      if (left <= 0) {
        if (timerRef.current) clearInterval(timerRef.current);
        setHolding(false);
        toggleBlocker();
      }
    }, 100);
  };

  const cancelHold = () => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    setHolding(false);
    setCountdown(5.0);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>EMERGENCY OVERRIDE</Text>
        <Text style={styles.headerTitle}>Can you handle the pressure?</Text>
        <Text style={styles.headerSub}>
          The blocker only works if you let it. Tapping out turns it off until you deliberately resume.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stake Metrics Card */}
        <View style={styles.stakeCard}>
          <Text style={styles.cardHeader}>TODAY'S PROGRESS AT STAKE</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>
                {completedCount}<Text style={styles.metricSub}>/{tasks.length}</Text>
              </Text>
              <Text style={styles.metricLabel}>Tasks Done</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>
                {minutesRemaining}<Text style={styles.metricSub}>m</Text>
              </Text>
              <Text style={styles.metricLabel}>Unspent Time</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>
                14<Text style={styles.metricSub}>d</Text>
              </Text>
              <Text style={styles.metricLabel}>Discipline</Text>
            </View>
          </View>
        </View>

        {/* Philosophy Note */}
        <View style={styles.quoteCard}>
          <Text style={styles.quoteIcon}>👁</Text>
          <Text style={styles.quoteText}>
            No penalties. No shaming. Just your agreement with yourself.
          </Text>
        </View>

        {/* Hold to Tap Out / Resume Mechanism */}
        <View style={styles.holdSection}>
          <Pressable
            style={[
              styles.holdButton,
              holding && styles.holdButtonActive,
              !status.blockerEnabled && styles.holdButtonResumed,
            ]}
            onPressIn={startHold}
            onPressOut={cancelHold}
          >
            <Text style={styles.holdIcon}>
              {status.blockerEnabled ? '⚡' : '🔒'}
            </Text>
            <Text style={styles.holdLabel}>
              {holding
                ? `${countdown}s`
                : status.blockerEnabled
                ? 'Hold to tap out'
                : 'Hold to resume'}
            </Text>
            <Text style={styles.holdInstructions}>
              {status.blockerEnabled
                ? 'PRESS & HOLD FOR 5 SECONDS TO DISARM'
                : 'PRESS & HOLD FOR 5 SECONDS TO RE-ARM'}
            </Text>
          </Pressable>
          <Text style={styles.holdWarning}>
            Releasing early cancels the protocol.
          </Text>
        </View>

        {/* Status Log Box */}
        <View style={styles.statusBox}>
          <View style={styles.statusBoxHeader}>
            <Text style={styles.statusDot}>●</Text>
            <Text style={styles.statusTitle}>
              {status.blockerEnabled ? 'SHIELD ARMED' : 'BLOCKER DISENGAGED'}
            </Text>
          </View>
          <Text style={styles.statusDesc}>
            {status.blockerEnabled
              ? 'Distraction applications are locked behind your daily cognitive discipline credits.'
              : 'You have paused your focus. Regain control when you are ready to resume.'}
          </Text>
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
  stakeCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 18,
    marginBottom: 14,
  },
  cardHeader: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.textMuted,
    letterSpacing: 1.5,
    marginBottom: 14,
  },
  metricsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
  metricCol: {
    alignItems: 'center',
  },
  metricVal: {
    fontSize: 24,
    fontWeight: '300',
    color: KaizenTheme.text,
  },
  metricSub: {
    fontSize: 13,
    color: KaizenTheme.textMuted,
  },
  metricLabel: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 0.5,
    marginTop: 4,
  },
  divider: {
    width: 1,
    height: 30,
    backgroundColor: KaizenTheme.border,
  },
  quoteCard: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 24,
  },
  quoteIcon: {
    fontSize: 16,
    color: KaizenTheme.redPrimary,
  },
  quoteText: {
    flex: 1,
    fontSize: 12,
    color: KaizenTheme.textMuted,
    fontStyle: 'italic',
    lineHeight: 18,
  },
  holdSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  holdButton: {
    width: 200,
    height: 200,
    borderRadius: 100,
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 3,
    borderColor: KaizenTheme.redPrimary,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    shadowColor: '#000',
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  holdButtonActive: {
    backgroundColor: KaizenTheme.redTint,
    borderColor: KaizenTheme.redBright,
    transform: [{ scale: 0.96 }],
  },
  holdButtonResumed: {
    borderColor: KaizenTheme.success,
  },
  holdIcon: {
    fontSize: 28,
    marginBottom: 6,
  },
  holdLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 0.5,
  },
  holdInstructions: {
    fontSize: 8,
    fontWeight: '700',
    color: KaizenTheme.textMuted,
    letterSpacing: 0.8,
    textAlign: 'center',
    marginTop: 6,
  },
  holdWarning: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    marginTop: 12,
  },
  statusBox: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 16,
  },
  statusBoxHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 6,
  },
  statusDot: {
    color: KaizenTheme.redPrimary,
    fontSize: 12,
  },
  statusTitle: {
    fontSize: 12,
    fontWeight: '700',
    color: KaizenTheme.text,
    letterSpacing: 1,
  },
  statusDesc: {
    fontSize: 12,
    color: KaizenTheme.textMuted,
    lineHeight: 18,
  },
});
