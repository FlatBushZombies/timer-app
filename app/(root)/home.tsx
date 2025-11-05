import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import { EnrichedTextInput } from 'react-native-enriched'

const { width } = Dimensions.get('window');

interface Goal {
  id: string;
  title: string;
  duration: number; // in seconds
  timeLeft: number; // in seconds
  isRunning: boolean;
  createdAt: number;
}

export default function HomeScreen() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [goalInput, setGoalInput] = useState('');
  const [timerInput, setTimerInput] = useState('5');
  const [showForm, setShowForm] = useState(false);

  // Timer effect
  useEffect(() => {
    const interval = setInterval(() => {
      setGoals(prevGoals =>
        prevGoals.map(goal => {
          if (goal.isRunning && goal.timeLeft > 0) {
            return { ...goal, timeLeft: goal.timeLeft - 1 };
          } else if (goal.isRunning && goal.timeLeft === 0) {
            Alert.alert('Goal Complete!', `You finished: ${goal.title}`);
            return { ...goal, isRunning: false };
          }
          return goal;
        })
      );
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const addGoal = () => {
    if (!goalInput.trim()) {
      Alert.alert('Error', 'Please enter a goal');
      return;
    }
    if (!timerInput || parseInt(timerInput) <= 0) {
      Alert.alert('Error', 'Please enter a valid duration in minutes');
      return;
    }

    const seconds = parseInt(timerInput) * 60;
    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goalInput,
      duration: seconds,
      timeLeft: seconds,
      isRunning: false,
      createdAt: Date.now(),
    };

    setGoals([newGoal, ...goals]);
    setGoalInput('');
    setTimerInput('5');
    setShowForm(false);
  };

  const toggleTimer = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id ? { ...goal, isRunning: !goal.isRunning } : goal
      )
    );
  };

  const deleteGoal = (id: string) => {
    setGoals(goals.filter(goal => goal.id !== id));
  };

  const resetGoal = (id: string) => {
    setGoals(prevGoals =>
      prevGoals.map(goal =>
        goal.id === id
          ? { ...goal, timeLeft: goal.duration, isRunning: false }
          : goal
      )
    );
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getProgressPercentage = (goal: Goal) => {
    return ((goal.duration - goal.timeLeft) / goal.duration) * 100;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Goal Timer</Text>
        <Text style={styles.headerSubtitle}>Track your goals with timers</Text>
      </View>

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Add Goal Button */}
        {!showForm && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => setShowForm(true)}
          >
            <Text style={styles.addButtonText}>+ Add New Goal</Text>
          </TouchableOpacity>
        )}

        {/* Goal Form */}
        {showForm && (
          <View style={styles.formContainer}>
            <Text style={styles.formTitle}>Create a New Goal</Text>

            <View style={styles.formSection}>
              <Text style={styles.label}>Goal Description</Text>
              <TextInput
                style={styles.textInput}
                placeholder="e.g., Do abs at the gym"
                placeholderTextColor="#999"
                value={goalInput}
                onChangeText={setGoalInput}
                multiline
                maxLength={100}
              />
              
              <Text style={styles.charCount}>{goalInput.length}/100</Text>
            </View>

            <View style={styles.formSection}>
              <Text style={styles.label}>Duration (minutes)</Text>
              <TextInput
                style={styles.numberInput}
                placeholder="5"
                placeholderTextColor="#999"
                value={timerInput}
                onChangeText={setTimerInput}
                keyboardType="number-pad"
                maxLength={3}
              />
            </View>

            <View style={styles.formButtons}>
              <TouchableOpacity
                style={[styles.formButton, styles.cancelButton]}
                onPress={() => {
                  setShowForm(false);
                  setGoalInput('');
                  setTimerInput('5');
                }}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.formButton, styles.submitButton]}
                onPress={addGoal}
              >
                <Text style={styles.submitButtonText}>Create Goal</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Goals List */}
        {goals.length > 0 ? (
          <View style={styles.goalsSection}>
            <Text style={styles.sectionTitle}>Active Goals</Text>
            {goals.map(goal => (
              <View key={goal.id} style={styles.goalCard}>
                {/* Goal Header */}
                <View style={styles.goalHeader}>
                  <Text style={styles.goalTitle}>{goal.title}</Text>
                  <TouchableOpacity
                    onPress={() => deleteGoal(goal.id)}
                    style={styles.deleteButton}
                  >
                    <Text style={styles.deleteButtonText}>✕</Text>
                  </TouchableOpacity>
                </View>

                {/* Timer Display */}
                <View style={styles.timerContainer}>
                  <Text style={styles.timerText}>
                    {formatTime(goal.timeLeft)}
                  </Text>
                  <Text style={styles.timerLabel}>
                    of {formatTime(goal.duration)}
                  </Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBarContainer}>
                  <View
                    style={[
                      styles.progressBar,
                      {
                        width: `${getProgressPercentage(goal)}%`,
                      },
                    ]}
                  />
                </View>

                {/* Control Buttons */}
                <View style={styles.controlButtons}>
                  <TouchableOpacity
                    style={[
                      styles.controlButton,
                      goal.isRunning
                        ? styles.pauseButton
                        : styles.playButton,
                    ]}
                    onPress={() => toggleTimer(goal.id)}
                  >
                    <Text style={styles.controlButtonText}>
                      {goal.isRunning ? 'Pause' : 'Start'}
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.controlButton, styles.resetButton]}
                    onPress={() => resetGoal(goal.id)}
                  >
                    <Text style={styles.controlButtonText}>Reset</Text>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateIcon}>🎯</Text>
            <Text style={styles.emptyStateTitle}>No Goals Yet</Text>
            <Text style={styles.emptyStateText}>
              Create your first goal to get started
            </Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    backgroundColor: '#6366f1',
    paddingTop: 60,
    paddingBottom: 30,
    paddingHorizontal: 20,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#e0e7ff',
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 40,
  },
  addButton: {
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  addButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  formContainer: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  formTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 16,
  },
  formSection: {
    marginBottom: 16,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  charCount: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 6,
    textAlign: 'right',
  },
  numberInput: {
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 14,
    color: '#1f2937',
    backgroundColor: '#f9fafb',
  },
  formButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 20,
  },
  formButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#f3f4f6',
    borderWidth: 1.5,
    borderColor: '#e5e7eb',
  },
  cancelButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
  },
  submitButton: {
    backgroundColor: '#6366f1',
  },
  submitButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#fff',
  },
  goalsSection: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 12,
  },
  goalCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 5,
    borderLeftColor: '#6366f1',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  goalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  goalTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1f2937',
    flex: 1,
    marginRight: 8,
  },
  deleteButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#fee2e2',
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    fontSize: 18,
    color: '#dc2626',
    fontWeight: '700',
  },
  timerContainer: {
    alignItems: 'center',
    marginBottom: 16,
    paddingVertical: 12,
    backgroundColor: '#f9fafb',
    borderRadius: 12,
  },
  timerText: {
    fontSize: 32,
    fontWeight: '700',
    color: '#6366f1',
    letterSpacing: 1,
  },
  timerLabel: {
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 4,
  },
  progressBarContainer: {
    height: 6,
    backgroundColor: '#e5e7eb',
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressBar: {
    height: '100%',
    backgroundColor: '#6366f1',
    borderRadius: 3,
  },
  controlButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  controlButton: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  playButton: {
    backgroundColor: '#d1fae5',
  },
  pauseButton: {
    backgroundColor: '#fef3c7',
  },
  resetButton: {
    backgroundColor: '#f3f4f6',
  },
  controlButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1f2937',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyStateTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    marginBottom: 4,
  },
  emptyStateText: {
    fontSize: 14,
    color: '#9ca3af',
  },
});