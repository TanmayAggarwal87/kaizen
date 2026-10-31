import { HitSlop, KaizenTheme } from "@/constants/theme";
import { useKaizen } from "@/context/KaizenContext";
import AntDesign from "@expo/vector-icons/AntDesign";
import { useState } from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const PRESET_CATEGORIES = [
  "FOCUS",
  "VITALITY",
  "MINDFULNESS",
  "LEARNING",
  "RECOVERY",
] as const;
const PRESET_REWARDS = [5, 10, 15, 25] as const;

export default function TasksScreen() {
  const {
    tasks,
    toggleTask,
    addTask,
    deleteTask,
    completedCount,
    totalTaskCount,
    masteryPercent,
    earnedMinutes,
    totalPotentialMinutes,
  } = useKaizen();

  const [modalVisible, setModalVisible] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("FOCUS");
  const [selectedReward, setSelectedReward] = useState<number>(10);

  const handleCreate = () => {
    if (!newTitle.trim()) return;
    addTask(newTitle.trim(), selectedCategory, selectedReward);
    setNewTitle("");
    setSelectedCategory("FOCUS");
    setSelectedReward(10);
    setModalVisible(false);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View>
          <Text style={styles.brandTitle}>DAILY PROTOCOLS</Text>
          <Text style={styles.headerTitle}>Disciplines & Tasks</Text>
        </View>
        <Pressable
          style={({ pressed }) => [
            styles.addButton,
            pressed && styles.pressedState,
          ]}
          onPress={() => setModalVisible(true)}
          hitSlop={HitSlop.small}
        >
          <AntDesign
            name="plus"
            size={12}
            color={KaizenTheme.text}
            style={{ marginRight: 4 }}
          />
          <Text style={styles.addButtonText}>Add Task</Text>
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
              <Text style={styles.percentageText}>{masteryPercent}%</Text>
              <Text style={styles.masteryText}>
                {completedCount} of {totalTaskCount} Mastered
              </Text>
              <Text style={styles.gainedText}>
                +{earnedMinutes}m focused screen-time earned
              </Text>
            </View>
            <View style={styles.streakBadge}>
              <AntDesign name="fire" size={14} color={KaizenTheme.redBright} />
              <Text style={styles.streakCount}>12D</Text>
            </View>
          </View>

          {/* Progress Bar */}
          <View style={styles.progressTrack}>
            <View
              style={[
                styles.progressBar,
                { width: `${Math.min(100, masteryPercent)}%` },
              ]}
            />
          </View>
        </View>

        <View style={styles.sectionMetaRow}>
          <Text style={styles.sectionSubtitle}>
            {totalTaskCount} SCHEDULED • {totalPotentialMinutes} MIN TOTAL
            POTENTIAL
          </Text>
        </View>

        {/* Task Cards */}
        <View style={styles.taskList}>
          {tasks.length === 0 ? (
            <View style={styles.emptyCard}>
              <AntDesign
                name="check-circle"
                size={24}
                color={KaizenTheme.textMuted}
                style={{ marginBottom: 8 }}
              />
              <Text style={styles.emptyTitle}>No Protocols Scheduled</Text>
              <Text style={styles.emptySubtitle}>
                Tap "Add Task" above to schedule your daily discipline.
              </Text>
            </View>
          ) : (
            tasks.map((task) => (
              <View
                key={task.id}
                style={[
                  styles.taskCard,
                  task.completed && styles.taskCardCompleted,
                ]}
              >
                <Pressable
                  style={({ pressed }) => [
                    styles.taskCardMain,
                    pressed && styles.taskPressed,
                  ]}
                  onPress={() => toggleTask(task.id)}
                >
                  <View
                    style={[
                      styles.checkbox,
                      task.completed && styles.checkboxCompleted,
                    ]}
                  >
                    {task.completed && (
                      <AntDesign
                        name="check"
                        size={11}
                        color={KaizenTheme.text}
                      />
                    )}
                  </View>
                  <View style={styles.taskMeta}>
                    <Text
                      style={[
                        styles.taskTitle,
                        task.completed && styles.taskTitleCompleted,
                      ]}
                      numberOfLines={2}
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
                      +{task.rewardMinutes}m
                    </Text>
                  </View>
                  <Pressable
                    style={({ pressed }) => [
                      styles.deleteButton,
                      pressed && styles.deletePressed,
                    ]}
                    onPress={() => deleteTask(task.id)}
                    hitSlop={HitSlop.standard}
                  >
                    <AntDesign
                      name="delete"
                      size={14}
                      color={KaizenTheme.textMuted}
                    />
                  </Pressable>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>

      {/* Add Task Modal */}
      <Modal
        visible={modalVisible}
        transparent
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={styles.modalOverlay}>
          <Pressable
            style={styles.modalBackdrop}
            onPress={() => setModalVisible(false)}
          />
          <View style={styles.modalCard}>
            <View style={styles.modalHeaderRow}>
              <Text style={styles.modalTitle}>New Discipline Task</Text>
              <Pressable
                onPress={() => setModalVisible(false)}
                hitSlop={HitSlop.standard}
              >
                <AntDesign
                  name="close"
                  size={16}
                  color={KaizenTheme.textMuted}
                />
              </Pressable>
            </View>

            <Text style={styles.inputLabel}>TASK DESCRIPTION</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g. Read 20 pages of Philosophy"
              placeholderTextColor={KaizenTheme.textMuted}
              value={newTitle}
              onChangeText={setNewTitle}
              autoFocus
            />

            <Text style={styles.inputLabel}>CATEGORY</Text>
            <View style={styles.chipRow}>
              {PRESET_CATEGORIES.map((cat) => {
                const isSelected = selectedCategory === cat;
                return (
                  <Pressable
                    key={cat}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setSelectedCategory(cat)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      {cat}
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <Text style={styles.inputLabel}>REWARD CREDIT (MINUTES)</Text>
            <View style={styles.chipRow}>
              {PRESET_REWARDS.map((rew) => {
                const isSelected = selectedReward === rew;
                return (
                  <Pressable
                    key={rew}
                    style={[styles.chip, isSelected && styles.chipSelected]}
                    onPress={() => setSelectedReward(rew)}
                  >
                    <Text
                      style={[
                        styles.chipText,
                        isSelected && styles.chipTextSelected,
                      ]}
                    >
                      +{rew}m
                    </Text>
                  </Pressable>
                );
              })}
            </View>

            <View style={styles.modalButtons}>
              <Pressable
                style={({ pressed }) => [
                  styles.cancelButton,
                  pressed && styles.pressedState,
                ]}
                onPress={() => setModalVisible(false)}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={({ pressed }) => [
                  styles.createButton,
                  !newTitle.trim() && styles.createButtonDisabled,
                  pressed && styles.pressedState,
                ]}
                onPress={handleCreate}
                disabled={!newTitle.trim()}
              >
                <Text style={styles.createButtonText}>Commit Task</Text>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: KaizenTheme.border,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
  },
  brandTitle: {
    fontSize: 10,
    fontWeight: "700",
    letterSpacing: 2,
    color: KaizenTheme.outline,
    textTransform: "uppercase",
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    color: KaizenTheme.text,
    letterSpacing: -0.3,
    marginTop: 2,
  },
  addButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: KaizenTheme.redPrimary,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    minHeight: 36,
  },
  addButtonText: {
    color: KaizenTheme.text,
    fontSize: 12,
    fontWeight: "700",
    letterSpacing: 0.5,
  },
  pressedState: {
    opacity: 0.8,
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginBottom: 14,
  },
  percentageText: {
    fontSize: 32,
    fontWeight: "300",
    color: KaizenTheme.text,
  },
  masteryText: {
    fontSize: 13,
    fontWeight: "600",
    color: KaizenTheme.text,
    marginTop: 2,
  },
  gainedText: {
    fontSize: 11,
    color: KaizenTheme.textMuted,
    marginTop: 2,
  },
  streakBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  streakCount: {
    color: KaizenTheme.redBright,
    fontWeight: "700",
    fontSize: 12,
  },
  progressTrack: {
    height: 4,
    backgroundColor: KaizenTheme.surfaceContainerHighest,
    borderRadius: 2,
    overflow: "hidden",
  },
  progressBar: {
    height: "100%",
    backgroundColor: KaizenTheme.redPrimary,
  },
  sectionMetaRow: {
    marginBottom: 10,
  },
  sectionSubtitle: {
    fontSize: 10,
    fontWeight: "700",
    color: KaizenTheme.textMuted,
    letterSpacing: 1.5,
  },
  taskList: {
    gap: 8,
  },
  emptyCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 28,
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    color: KaizenTheme.text,
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
  },
  emptySubtitle: {
    color: KaizenTheme.textMuted,
    fontSize: 12,
    textAlign: "center",
    lineHeight: 18,
  },
  taskCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 14,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  taskCardCompleted: {
    opacity: 0.65,
  },
  taskCardMain: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    flex: 1,
    marginRight: 10,
  },
  taskPressed: {
    opacity: 0.7,
  },
  checkbox: {
    width: 22,
    height: 22,
    borderRadius: 5,
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderWidth: 1.5,
    borderColor: KaizenTheme.border,
    alignItems: "center",
    justifyContent: "center",
  },
  checkboxCompleted: {
    backgroundColor: KaizenTheme.redPrimary,
    borderColor: KaizenTheme.redPrimary,
  },
  taskMeta: {
    flex: 1,
  },
  taskTitle: {
    fontSize: 14,
    fontWeight: "500",
    color: KaizenTheme.text,
    lineHeight: 19,
  },
  taskTitleCompleted: {
    textDecorationLine: "line-through",
    color: KaizenTheme.textMuted,
  },
  categoryText: {
    fontSize: 10,
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    marginTop: 2,
    textTransform: "uppercase",
  },
  taskActions: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
  },
  rewardBadge: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
  },
  rewardBadgeCompleted: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    borderColor: KaizenTheme.border,
  },
  rewardText: {
    fontSize: 11,
    fontWeight: "700",
    color: KaizenTheme.text,
    letterSpacing: 0.5,
  },
  rewardTextCompleted: {
    color: KaizenTheme.textMuted,
  },
  deleteButton: {
    width: 32,
    height: 32,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 4,
  },
  deletePressed: {
    backgroundColor: KaizenTheme.surfaceContainerHigh,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.75)",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  modalBackdrop: {
    ...StyleSheet.absoluteFill,
  },
  modalCard: {
    backgroundColor: KaizenTheme.surfaceContainerLow,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    padding: 20,
    zIndex: 1,
  },
  modalHeaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "700",
    color: KaizenTheme.text,
  },
  inputLabel: {
    fontSize: 10,
    fontWeight: "700",
    color: KaizenTheme.textMuted,
    letterSpacing: 1,
    marginBottom: 8,
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
    marginBottom: 16,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  chip: {
    backgroundColor: KaizenTheme.surfaceContainerLowest,
    borderWidth: 1,
    borderColor: KaizenTheme.border,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  chipSelected: {
    backgroundColor: KaizenTheme.redTint,
    borderColor: KaizenTheme.redPrimary,
  },
  chipText: {
    color: KaizenTheme.textMuted,
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  chipTextSelected: {
    color: KaizenTheme.redBright,
    fontWeight: "700",
  },
  modalButtons: {
    flexDirection: "row",
    gap: 10,
    marginTop: 6,
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: KaizenTheme.surfaceContainerHigh,
    minHeight: 44,
    justifyContent: "center",
  },
  cancelButtonText: {
    color: KaizenTheme.textMuted,
    fontSize: 13,
    fontWeight: "600",
  },
  createButton: {
    flex: 1,
    paddingVertical: 12,
    alignItems: "center",
    borderRadius: 8,
    backgroundColor: KaizenTheme.redPrimary,
    minHeight: 44,
    justifyContent: "center",
  },
  createButtonDisabled: {
    opacity: 0.5,
  },
  createButtonText: {
    color: KaizenTheme.text,
    fontSize: 13,
    fontWeight: "700",
  },
});
