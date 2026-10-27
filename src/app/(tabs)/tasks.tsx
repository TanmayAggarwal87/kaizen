import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  TextInput,
  Modal,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { KaizenTheme } from '@/constants/theme';
import { useKaizen } from '@/context/KaizenContext';

export default function TasksScreen() {
  const { tasks, toggleTask, addTask, deleteTask } = useKaizen();
  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('FOCUS');
  const [newReward, setNewReward] = useState('10');

  const completedCount = tasks.filter((t) => t.completed).length;
  const totalCount = tasks.length;
  const percent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const totalPotential = tasks.reduce((acc, t) => acc + t.rewardMinutes, 0);
  const gainedMinutes = tasks
    .filter((t) => t.completed)
    .reduce((acc, t) => acc + t.rewardMinutes, 0);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    const rewardVal = parseInt(newReward, 10) || 10;
    addTask(newTitle.trim(), newCategory.trim() || 'FOCUS', rewardVal);
    setNewTitle('');
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>DISCIPLINE ROSTER</Text>
          <Text style={styles.headerTitle}>Today's Tasks</Text>
        </View>
        <Pressable
          style={styles.addButton}
          onPress={() => setModalVisible(true)}
        >
          <Text style={styles.addButtonText}>+ New Task</Text>
        </Pressable>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryTopRow}>
            <View>
              <Text style={styles.percentageText}>{percent}%</Text>
              <Text style={styles.masteryText}>
                {completedCount} of {totalCount} Mastered
              </Text>
              <Text style={styles.gainedText}>
                +{gainedMinutes}m focused screen-time gained
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <Text style={styles.streakIcon}>🔥</Text>
              <Text style={styles.streakCount}>12D</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, percent)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.sectionMetaRow}>
          <Text style={styles.sectionSubtitle}>
            {totalCount} SCHEDULED • {totalPotential} MIN REWARD POTENTIAL
          </Text>
        </View>

        {/* Task Cards */}
        <View style={styles.taskList}>
          {tasks.map((task) => (
            <View
              key={task.id}
              style={[styles.taskCard, task.completed && styles.taskCardCompleted]}
            >
              <Pressable
                style={styles.taskCardMain}
                onPress={() => toggleTask(task.id)}
              >
                <View
                  style={[
                    styles.checkbox,
                    task.completed && styles.checkboxCompleted,
                  ]}
                >
                  {task.completed && <Text style={styles.checkIcon}>✓</Text>}
                </View>
                <View style={styles.taskMeta}>
                  <Text
                    style={[
                      styles.taskTitle,
                      task.completed && styles.taskTitleCompleted,
                    ]}
                  >
                    {task.title}
                  </Text>
                  <Text style={styles.categoryText}>
                    {task.time} • {task.category}
                  </Text>
                </View>
              </Pressable>

              <View style={styles.taskActions}>
                <View
                  style={[
                    styles.rewardBadge,
                    task.completed && styles.rewardBadgeCompleted,
                  ]}
                >
                  <Text
                    style={[
                      styles.rewardText,
                      task.completed && styles.rewardTextCompleted,
                    ]}
                  >
                    +{task.rewardMinutes} MIN
                  </Text>
                </View>
                <Pressable
                  style={styles.deleteButton}
                  onPress={() => deleteTask(task.id)}
                >
                  <Text style={styles.deleteIcon}>✕</Text>
                </Pressable>
              </View>
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal visible={modalVisible} transparent animationType="fade">
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>New Discipline Ritual</Text>

            <Text style={styles.inputLabel}>TASK DESCRIPTION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 20 pages of Philosophy"
              placeholderTextColor={KaizenTheme.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
            />

            <Text style={styles.inputLabel}>CATEGORY</Text>
            <TextInput
              style={styles.input}
              placeholder="CONCENTRATION / VITALITY / ENGINEERING"
              placeholderTextColor={KaizenTheme.textMuted}
              value={newCategory}
              onChangeText={setNewCategory}
            />

            <Text style={styles.inputLabel}>REWARD CREDIT (MINUTES)</Text>
            <TextInput
              style={styles.input}
              placeholder="10"
              keyboardType="numeric"
              placeholderTextColor={KaizenTheme.textMuted}
              value={newReward}
              onChangeText={setNewReward}
            />

            <View style={styles.modalButtons}>
              <Pressable
                style={styles.cancelButton}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable style={styles.createButton} onPress={handleCreate}>
                <Text style={styles.createButtonText}>Add Task</Text>
              </Pressable>
            </View>
          </View>
        </View>
      </Modal>
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
    paddingVertical: 14,
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
  addButton: {
    backgroundColor: KaizenTheme.redPrimary,
    paddingHorizontal: 12,
    paddingVertical: 7,
    borderRadius: 6,
  },
  addButtonText: {
    color: KaizenTheme.text,
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  scrollContent: {
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 36,
  },
  summaryCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 18,
    marginBottom: 16,
  },
  summaryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 14,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: '300',
    color: KaizenTheme.text,
  },
  masteryText: {
    fontSize: 13,
    fontWeight: '600',
    color: KaizenTheme.text,
    marginTop: 2,
  },
  gainedText: {
    fontSize: 11,
    color: KaizenTheme.tertiary,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  streakIcon: {
    fontSize: 14,
  },
  streakCount: {
    color: KaizenTheme.redBright,
    fontWeight: '700',
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: KaizenTheme.surfaceContainerHighest,
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    backgroundColor: KaizenTheme.redPrimary,
  },
  sectionMetaRow: {
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.textMuted,
    letterSpacing: 1.5,
  },
  taskList: {
    gap: 8,
  },
  taskCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 14,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskCardCompleted: {
    opacity: 0.7,
  },
  taskCardMain: {
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
  checkboxCompleted: {
    backgroundColor: KaizenTheme.redPrimary,
    borderColor: KaizenTheme.redPrimary,
  },
  checkIcon: {
    color: KaizenTheme.text,
    fontSize: 12,
    fontWeight: '800',
  },
  taskMeta: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: KaizenTheme.text,
  },
  taskTitleCompleted: {
    textDecorationLine: 'line-through',
    color: KaizenTheme.textMuted,
  },
  categoryText: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: 'uppercase',
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  rewardBadge: {
    backgroundColor: '#0E1F14',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: '#1E3326',
  },
  rewardBadgeCompleted: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    borderColor: KaizenTheme.border,
  },
  rewardText: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.tertiary,
    letterSpacing: 0.5,
  },
  rewardTextCompleted: {
    color: KaizenTheme.textMuted,
  },
  deleteButton: {
    padding: 4,
  },
  deleteIcon: {
    color: KaizenTheme.textMuted,
    fontSize: 14,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.75)',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  modalCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 20,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: KaizenTheme.text,
    marginBottom: 16,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: '700',
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    marginBottom: 6,
  },
  input: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    paddingHorizontal: 12,
    paddingVertical: 10,
    color: KaizenTheme.text,
    fontSize: 13,
    marginBottom: 14,
  },
  modalButtons: {
    flexDirection: 'row',
    gap: 10,
    marginTop: 8,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: KaizenTheme.surfaceContainerHigh,
  },
  cancelButtonText: {
    color: KaizenTheme.textMuted,
    fontSize: 13,
    fontWeight: '600',
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: 'center',
    borderRadius: 8,
    backgroundColor: KaizenTheme.redPrimary,
  },
  createButtonText: {
    color: KaizenTheme.text,
    fontSize: 13,
    fontWeight: '700',
  },
});
