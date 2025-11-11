"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, SafeAreaView } from "react-native"

interface Task {
  id: string
  title: string
  category: string
  duration: string
  progress: number
  streak: number
  completedDays: number[]
  totalDays: number
  journal: JournalEntry[]
}

interface JournalEntry {
  id: string
  date: string
  note: string
  mood: string
}

export default function TaskScreen() {
  const [tasks] = useState<Task[]>([
    {
      id: "1",
      title: "Morning Meditation",
      category: "Wellness",
      duration: "15 min",
      progress: 75,
      streak: 12,
      completedDays: [1, 2, 3, 5, 6, 8, 9, 10, 12, 13, 15, 16],
      totalDays: 16,
      journal: [
        {
          id: "1",
          date: "Nov 11",
          note: "Felt very centered today. The breathing exercises helped clear my mind.",
          mood: "😊",
        },
        { id: "2", date: "Nov 10", note: "Good session, though a bit distracted in the beginning.", mood: "🙂" },
      ],
    },
    {
      id: "2",
      title: "Coding Practice",
      category: "Tech & Software",
      duration: "45 min",
      progress: 60,
      streak: 8,
      completedDays: [1, 2, 4, 5, 7, 8, 9, 11],
      totalDays: 16,
      journal: [
        {
          id: "1",
          date: "Nov 11",
          note: "Completed the React Native tutorial. Built a timer component from scratch!",
          mood: "🎉",
        },
        { id: "2", date: "Nov 9", note: "Struggled with state management but finally figured it out.", mood: "🤔" },
      ],
    },
    {
      id: "3",
      title: "Reading",
      category: "Personal Growth",
      duration: "30 min",
      progress: 85,
      streak: 15,
      completedDays: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
      totalDays: 16,
      journal: [
        {
          id: "1",
          date: "Nov 11",
          note: "Finished chapter 5 of Atomic Habits. Eye-opening insights on habit stacking.",
          mood: "📚",
        },
      ],
    },
  ])

  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const [journalText, setJournalText] = useState("")
  const [showJournalInput, setShowJournalInput] = useState(false)

  const renderProgressRing = (progress: number, size = 80) => {
    const circleSize = size
    const innerSize = size - 12
    const progressDegrees = (progress / 100) * 360

    return (
      <View className="items-center justify-center" style={{ width: circleSize, height: circleSize }}>
        <View
          className="rounded-full bg-gray-200"
          style={{ width: circleSize, height: circleSize, position: "absolute" }}
        />
        <View
          className="rounded-full bg-purple-500"
          style={{
            width: circleSize,
            height: circleSize,
            position: "absolute",
            transform: [{ rotate: `${progressDegrees}deg` }],
          }}
        />
        <View className="rounded-full bg-white" style={{ width: innerSize, height: innerSize, position: "absolute" }} />
        <Text className="text-base font-bold text-gray-900 absolute">{progress}%</Text>
      </View>
    )
  }

  const renderWeekCalendar = (completedDays: number[], totalDays: number) => {
    const weeks = Math.ceil(totalDays / 7)
    const days = Array.from({ length: totalDays }, (_, i) => i + 1)

    return (
      <View className="mb-5">
        {Array.from({ length: weeks }).map((_, weekIndex) => (
          <View key={weekIndex} className="flex-row justify-between mb-2">
            {days.slice(weekIndex * 7, (weekIndex + 1) * 7).map((day) => (
              <View
                key={day}
                className={`w-9 h-9 rounded-xl items-center justify-center ${
                  completedDays.includes(day) ? "bg-purple-500" : "bg-gray-100"
                }`}
              >
                <Text
                  className={`text-sm font-semibold ${completedDays.includes(day) ? "text-white" : "text-gray-400"}`}
                >
                  {day}
                </Text>
              </View>
            ))}
          </View>
        ))}
      </View>
    )
  }

  if (selectedTask) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-row justify-between items-center px-6 pt-5 pb-4 bg-white">
          <TouchableOpacity
            onPress={() => setSelectedTask(null)}
            className="w-10 h-10 rounded-xl bg-gray-100 items-center justify-center"
          >
            <Text className="text-xl text-gray-900">←</Text>
          </TouchableOpacity>
          <Text className="text-lg font-semibold text-gray-900">Task Details</Text>
          <View className="w-10" />
        </View>

        <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
          {/* Task Header */}
          <View className="bg-white p-6 mb-4">
            <View className="flex-row justify-between items-center mb-5">
              <View className="flex-1">
                <Text className="text-3xl font-bold text-gray-900 mb-2">{selectedTask.title}</Text>
                <Text className="text-base text-gray-500">{selectedTask.category}</Text>
              </View>
              {renderProgressRing(selectedTask.progress, 90)}
            </View>

            {/* Streak Badge */}
            <View className="flex-row items-center bg-amber-100 py-3 px-5 rounded-2xl self-start">
              <Text className="text-2xl mr-2">🔥</Text>
              <Text className="text-base font-semibold text-amber-900">{selectedTask.streak} Day Streak</Text>
            </View>
          </View>

          {/* Progress Calendar */}
          <View className="bg-white mx-5 mb-4 p-5 rounded-2xl shadow-sm">
            <Text className="text-lg font-bold text-gray-900 mb-4">Activity Calendar</Text>
            {renderWeekCalendar(selectedTask.completedDays, selectedTask.totalDays)}
            <View className="flex-row justify-around pt-5 border-t border-gray-100">
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900 mb-1">{selectedTask.completedDays.length}</Text>
                <Text className="text-sm text-gray-500">Completed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {selectedTask.totalDays - selectedTask.completedDays.length}
                </Text>
                <Text className="text-sm text-gray-500">Missed</Text>
              </View>
              <View className="items-center">
                <Text className="text-2xl font-bold text-gray-900 mb-1">
                  {Math.round((selectedTask.completedDays.length / selectedTask.totalDays) * 100)}%
                </Text>
                <Text className="text-sm text-gray-500">Success Rate</Text>
              </View>
            </View>
          </View>

          {/* Journal Section */}
          <View className="bg-white mx-5 mb-4 p-5 rounded-2xl shadow-sm">
            <View className="flex-row justify-between items-center mb-4">
              <Text className="text-lg font-bold text-gray-900">Journal Entries</Text>
              <TouchableOpacity
                className="bg-purple-500 py-2 px-4 rounded-xl"
                onPress={() => setShowJournalInput(!showJournalInput)}
              >
                <Text className="text-white text-sm font-semibold">+ Add</Text>
              </TouchableOpacity>
            </View>

            {showJournalInput && (
              <View className="bg-gray-50 p-4 rounded-2xl mb-4">
                <TextInput
                  className="text-base text-gray-900 min-h-[100px]"
                  placeholder="How did it go today? Write your thoughts..."
                  placeholderTextColor="#9CA3AF"
                  multiline
                  value={journalText}
                  onChangeText={setJournalText}
                  style={{ textAlignVertical: "top" }}
                />
                <View className="flex-row justify-end mt-3">
                  <TouchableOpacity className="bg-purple-500 py-2.5 px-5 rounded-xl">
                    <Text className="text-white text-sm font-semibold">Save Entry</Text>
                  </TouchableOpacity>
                </View>
              </View>
            )}

            {selectedTask.journal.map((entry) => (
              <View key={entry.id} className="bg-gray-50 p-4 rounded-2xl mb-3">
                <View className="flex-row justify-between items-center mb-2.5">
                  <Text className="text-2xl">{entry.mood}</Text>
                  <Text className="text-sm text-gray-500 font-medium">{entry.date}</Text>
                </View>
                <Text className="text-base text-gray-700 leading-6">{entry.note}</Text>
              </View>
            ))}
          </View>

          <View className="h-10" />
        </ScrollView>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="flex-row justify-between items-center px-6 pt-5 pb-4 bg-white">
        <View>
          <Text className="text-3xl font-bold text-gray-900 mb-1">Task Progress</Text>
          <Text className="text-base text-gray-500">Track your goals and growth</Text>
        </View>
      </View>

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Summary Cards */}
        <View className="flex-row px-5 pt-6 gap-3">
          <View className="flex-1 p-4 rounded-2xl items-center bg-blue-50">
            <Text className="text-2xl font-bold text-gray-900 mb-1">{tasks.reduce((sum, t) => sum + t.streak, 0)}</Text>
            <Text className="text-xs text-gray-500 font-medium">Total Days</Text>
          </View>
          <View className="flex-1 p-4 rounded-2xl items-center bg-orange-50">
            <Text className="text-2xl font-bold text-gray-900 mb-1">{tasks.length}</Text>
            <Text className="text-xs text-gray-500 font-medium">Active Goals</Text>
          </View>
          <View className="flex-1 p-4 rounded-2xl items-center bg-green-50">
            <Text className="text-2xl font-bold text-gray-900 mb-1">
              {Math.round(tasks.reduce((sum, t) => sum + t.progress, 0) / tasks.length)}%
            </Text>
            <Text className="text-xs text-gray-500 font-medium">Avg Progress</Text>
          </View>
        </View>

        {/* Task Cards */}
        <Text className="text-xl font-bold text-gray-900 px-6 mt-8 mb-4">Your Goals</Text>
        {tasks.map((task) => (
          <TouchableOpacity
            key={task.id}
            className="flex-row justify-between items-center bg-white mx-5 mb-3 p-5 rounded-2xl shadow-sm"
            onPress={() => setSelectedTask(task)}
            activeOpacity={0.7}
          >
            <View className="flex-row items-center flex-1">
              <View className="w-14 h-14 rounded-2xl bg-gray-100 items-center justify-center mr-4">
                <Text className="text-3xl">
                  {task.category === "Wellness" ? "🧘" : task.category === "Tech & Software" ? "💻" : "📚"}
                </Text>
              </View>
              <View className="flex-1">
                <Text className="text-lg font-semibold text-gray-900 mb-1">{task.title}</Text>
                <Text className="text-sm text-gray-500 mb-2">{task.category}</Text>
                <View className="flex-row items-center">
                  <View className="flex-row items-center">
                    <Text className="text-sm mr-1">🔥</Text>
                    <Text className="text-sm font-semibold text-amber-500">{task.streak} days</Text>
                  </View>
                  <Text className="text-sm text-gray-400 ml-2">• {task.duration}</Text>
                </View>
              </View>
            </View>
            <View className="ml-4">{renderProgressRing(task.progress, 60)}</View>
          </TouchableOpacity>
        ))}

        <View className="h-10" />
      </ScrollView>
    </SafeAreaView>
  )
}
