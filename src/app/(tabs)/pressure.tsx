import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from '@expo/vector-icons/AntDesign';
import { KaizenTheme } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

const HOLD_DURATION_SECONDS = 5.0;

export default function PressureScreen() {
  const {
    status,
    toggleBlocker,
    completedCount,
    totalTaskCount,
    remainingMinutes,
  } = useKaizen();

  const [holding, setHolding] = useState(false);
  const [countdown, setCountdown] = useState(HOLD_DURATION_SECONDS);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startHold = () => {
    setHolding(true);
    setCountdown(HOLD_DURATION_SECONDS);
    const start = Date.now();
    timerRef.current = setInterval(() => {
      const elapsed = (Date.now() - start) / 1000;
      const left = Math.max(0, HOLD_DURATION_SECONDS - elapsed);
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
    setCountdown(HOLD_DURATION_SECONDS);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const progressPercent = Math.min(
    100,
    Math.max(0, ((HOLD_DURATION_SECONDS - countdown) / HOLD_DURATION_SECONDS) * 100)
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.brandTitle}>DISARM PROTOCOL</Text>
        <Text style={styles.headerTitle}>The Pressure Valve</Text>
        <Text style={styles.headerSub}>
          The limit holds only while you uphold it. Disarming suspends enforcement until you deliberately resume.
        </Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Stake Metrics Card */}
        <View style={styles.stakeCard}>
          <Text style={styles.cardHeader}>TODAY'S DISCIPLINE AT STAKE</Text>
          <View style={styles.metricsRow}>
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>
                {completedCount}<Text style={styles.metricSub}>/{totalTaskCount}</Text>
              </Text>
              <Text style={styles.metricLabel}>Tasks Done</Text>
            </View>
            <View style={styles.divider} />
            <View style={styles.metricCol}>
              <Text style={styles.metricVal}>
                {remainingMinutes}<Text style={styles.metricSub}>m</Text>
              </Text>
              <Text style={styles.metricLabel}>Balance Left</Text>
            </View>
          </View>
        </View>

        {/* Philosophy Note */}
        <View style={styles.quoteCard}>
          <AntDesign name="info-circle" size={15} color={KaizenTheme.outline} />
          <Text style={styles.quoteText}>
            Discipline is choosing between what you want now and what you want most. There are no penalties, only your agreement with yourself.
          </Text>
        </View>

        {/* Hold to Disarm / Resume Mechanism */}
        <View style={styles.holdSection}>
          <Pressable
            style={[
              styles.holdButton,
              status.blockerEnabled ? styles.holdButtonArmed : styles.holdButtonDisarmed,
              holding && styles.holdButtonActive,
            ]}
            onPressIn={startHold}
            onPressOut={cancelHold}
          >
            {/* Progress Track Arc Indicator */}
            {holding && (
              <View
                style={[
                  styles.progressIndicator,
                  {
                    borderColor: status.blockerEnabled ? KaizenTheme.redBright : KaizenTheme.outline,
                    opacity: 0.3 + (progressPercent / 100) * 0.7,
                  },
                ]}
              />
            )}

            <AntDesign
              name={status.blockerEnabled ? 'thunderbolt' : 'unlock'}
              size={34}
              color={status.blockerEnabled ? KaizenTheme.redPrimary : KaizenTheme.textMuted}
              style={{ marginBottom: 6 }}
            />
            <Text style={styles.holdLabel}>
              {holding
                ? `${countdown.toFixed(1)}s`
                : status.blockerEnabled
                ? 'Hold to Disarm'
                : 'Hold to Re-Arm'}
            </Text>
            <Text style={styles.holdInstructions}>
              {status.blockerEnabled
                ? 'PRESS & HOLD FOR 5 SECONDS'
                : 'PRESS & HOLD TO RESUME'}
            </Text>
          </Pressable>
          <Text style={styles.holdWarning}>
            Releasing early cancels the override protocol.
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
    lineHeight: 17,
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
    width: 204,
    height: 204,
    borderRadius: 102,
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
    position: 'relative',
  },
  holdButtonArmed: {
    borderColor: KaizenTheme.redPrimary,
  },
  holdButtonDisarmed: {
    borderColor: KaizenTheme.border,
  },
  holdButtonActive: {
    backgroundColor: KaizenTheme.surfaceContainer,
    transform: [{ scale: 0.97 }],
  },
  progressIndicator: {
    position: 'absolute',
    top: -4,
    left: -4,
    right: -4,
    bottom: -4,
    borderRadius: 106,
    borderWidth: 4,
  },
  holdLabel: {
    fontSize: 17,
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
});
