"use client"

import { useState, useEffect, useRef } from "react"
import { View, Text, ScrollView, TouchableOpacity, TextInput, Alert, Image } from "react-native"
import { useUser } from "@clerk/clerk-expo"
import { AntDesign, MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { calculateProgress, formatTime, isTimerComplete } from "@/lib/timer-utils"

interface Goal {
  id: string
  title: string
  duration: number
  category: string
  color: string
  icon: string
  rating: number
  isRunning?: boolean
  startTime?: number
  elapsedSeconds?: number
  isCompleted?: boolean
}

export default function HomeScreen() {
  const { user } = useUser()
  const [showForm, setShowForm] = useState(false)
  const [goalInput, setGoalInput] = useState("")
  const [timerInput, setTimerInput] = useState("5")
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Morning Workout Routine",
      duration: 30,
      category: "Health & Fitness",
      color: "#D4F4E7",
      icon: "dumbbell",
      rating: 4.5,
    },
    {
      id: "2",
      title: "Deep Focus Coding Session",
      duration: 45,
      category: "Tech & Software",
      color: "#E8D4F4",
      icon: "laptop",
      rating: 4.2,
    },
  ])

  const timerIntervalRef = useRef<number | null>(null)

  useEffect(() => {
    const hasRunningGoals = goals.some((goal) => goal.isRunning && !goal.isCompleted)

    if (hasRunningGoals) {
      timerIntervalRef.current = setInterval(() => {
        setGoals((prevGoals) =>
          prevGoals.map((goal) => {
            if (!goal.isRunning || goal.isCompleted) return goal

            const now = Date.now()
            const elapsedSeconds = Math.floor((now - (goal.startTime || now)) / 1000)
            const completed = isTimerComplete(elapsedSeconds, goal.duration)

            return {
              ...goal,
              elapsedSeconds,
              isCompleted: completed,
              isRunning: !completed,
            }
          }),
        )
      }, 1000) as unknown as number
    } else {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
        timerIntervalRef.current = null
      }
    }

    return () => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current)
      }
    }
  }, [goals])

  const addGoal = () => {
    if (!goalInput.trim()) {
      Alert.alert("Error", "Please enter a goal")
      return
    }

    const colors = ["#D4F4E7", "#E8D4F4", "#F4E8D4", "#D4E4F4"]
    const icons = ["target", "dumbbell", "laptop", "book-open-variant", "brain"]

    const newGoal: Goal = {
      id: Date.now().toString(),
      title: goalInput,
      duration: Number.parseInt(timerInput) || 5,
      category: "Personal Goal",
      color: colors[Math.floor(Math.random() * colors.length)],
      icon: icons[Math.floor(Math.random() * icons.length)],
      rating: 0,
    }

    setGoals([newGoal, ...goals])
    setGoalInput("")
    setTimerInput("5")
    setShowForm(false)
  }

  const deleteGoal = (id: string) => {
    Alert.alert("Delete Goal", "Are you sure you want to delete this goal?", [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", onPress: () => setGoals(goals.filter((g) => g.id !== id)), style: "destructive" },
    ])
  }

  const toggleTimer = (goalId: string) => {
    setGoals((prevGoals) =>
      prevGoals.map((goal) => {
        if (goal.id !== goalId) return goal

        if (goal.isCompleted) {
          return goal
        }

        if (goal.isRunning) {
          return {
            ...goal,
            isRunning: false,
          }
        } else {
          return {
            ...goal,
            isRunning: true,
            startTime: Date.now() - (goal.elapsedSeconds || 0) * 1000,
            elapsedSeconds: goal.elapsedSeconds || 0,
          }
        }
      }),
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 py-4 bg-white">
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center flex-1">
            <Image
              source={{ uri: user?.imageUrl || "https://avatar.iran.liara.run/public/42" }}
              className="w-12 h-12 rounded-full mr-3"
            />
            <View>
              <Text className="text-gray-900 text-lg font-bold">Hello {user?.firstName || "Alex"}</Text>
              <View className="flex-row items-center mt-0.5">
                <View className="w-2 h-2 rounded-full bg-green-500 mr-1.5" />
                <View className="h-1.5 bg-blue-400 rounded-full" style={{ width: 60 }} />
              </View>
            </View>
          </View>
          <TouchableOpacity className="w-10 h-10 rounded-full bg-gray-100 items-center justify-center">
            <Ionicons name="notifications-outline" size={22} color="#374151" />
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView className="flex-1" contentContainerStyle={{ paddingBottom: 40 }} showsVerticalScrollIndicator={false}>
        {/* Title Section */}
        <View className="px-5 pt-6 pb-4 flex-row items-center justify-between">
          <View>
            <Text className="text-gray-900 text-3xl font-bold">Your Progress</Text>
            <Text className="text-gray-900 text-3xl font-bold">Today</Text>
          </View>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-white items-center justify-center shadow-sm">
            <Ionicons name="search" size={22} color="#374151" />
          </TouchableOpacity>
        </View>

        {/* Add Goal Button - Floating */}
        {!showForm && (
          <View className="px-5 mb-4">
            <TouchableOpacity
              onPress={() => setShowForm(true)}
              className="bg-gray-900 rounded-2xl py-4 px-5 flex-row items-center justify-center shadow-lg"
            >
              <AntDesign name="plus" size={20} color="white" />
              <Text className="text-white font-bold text-base ml-2">Add New Goal</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* Goal Creation Form */}
        {showForm && (
          <View className="mx-5 mb-5 bg-white rounded-3xl p-5 shadow-sm border border-gray-100">
            <Text className="text-gray-900 font-bold text-xl mb-4">Create a New Goal</Text>

            <Text className="text-gray-700 font-semibold mb-2 text-sm">Goal Description</Text>
            <TextInput
              value={goalInput}
              onChangeText={setGoalInput}
              placeholder="e.g., Morning meditation practice"
              placeholderTextColor="#9CA3AF"
              className="border border-gray-200 rounded-2xl p-4 mb-1 bg-gray-50 text-gray-900"
            />
            <Text className="text-gray-400 text-right text-xs mb-3">{goalInput.length}/100</Text>

            <Text className="text-gray-700 font-semibold mb-2 text-sm">Duration (minutes)</Text>
            <TextInput
              value={timerInput}
              onChangeText={setTimerInput}
              placeholder="5"
              placeholderTextColor="#9CA3AF"
              keyboardType="number-pad"
              className="border border-gray-200 rounded-2xl p-4 bg-gray-50 text-gray-900"
            />

            <View className="flex-row justify-end mt-5 space-x-3">
              <TouchableOpacity onPress={() => setShowForm(false)} className="bg-gray-100 px-6 py-3 rounded-xl">
                <Text className="text-gray-700 font-bold">Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={addGoal} className="bg-gray-900 px-6 py-3 rounded-xl ml-3">
                <Text className="text-white font-bold">Create</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* Goals List */}
        <View className="px-5">
          {goals.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-gray-100">
              <MaterialCommunityIcons name="target" size={48} color="#D1D5DB" />
              <Text className="text-gray-400 text-center mt-4 text-base">
                No goals yet. Create your first goal to get started!
              </Text>
            </View>
          ) : (
            goals.map((goal, index) => {
              const progress =
                goal.isRunning || goal.isCompleted ? calculateProgress(goal.elapsedSeconds || 0, goal.duration) : 0

              return (
                <View key={goal.id} className="rounded-3xl p-5 mb-4 shadow-sm" style={{ backgroundColor: goal.color }}>
                  {/* Top Row */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center">
                      <MaterialCommunityIcons name={goal.icon as any} size={24} color="#374151" />
                    </View>
                    {goal.isCompleted ? (
                      <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                        <Ionicons name="checkmark-circle" size={16} color="white" />
                        <Text className="text-white font-bold ml-1 text-sm">Completed!</Text>
                      </View>
                    ) : goal.rating > 0 ? (
                      <View className="flex-row items-center bg-white rounded-full px-3 py-1.5">
                        <Ionicons name="star" size={16} color="#FCD34D" />
                        <Text className="text-gray-900 font-bold ml-1 text-sm">{goal.rating}</Text>
                      </View>
                    ) : null}
                  </View>

                  {/* Category */}
                  <Text className="text-gray-600 text-sm font-medium mb-1">{goal.category}</Text>

                  {/* Title */}
                  <Text className="text-gray-900 text-lg font-bold mb-4">{goal.title}</Text>

                  {(goal.isRunning || goal.isCompleted) && (
                    <View className="mb-4">
                      <View className="h-2 bg-white/40 rounded-full overflow-hidden">
                        <View className="h-full bg-gray-900 rounded-full" style={{ width: `${progress}%` }} />
                      </View>
                      <Text className="text-gray-700 text-xs font-semibold mt-1.5">
                        {goal.isCompleted
                          ? "Goal Complete!"
                          : `${formatTime(goal.elapsedSeconds || 0)} / ${goal.duration} min`}
                      </Text>
                    </View>
                  )}

                  {/* Bottom Row */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center">
                      <View className="bg-white rounded-full px-3 py-1.5 flex-row items-center">
                        <Ionicons name="time-outline" size={16} color="#6B7280" />
                        <Text className="text-gray-700 font-semibold ml-1.5 text-sm">{goal.duration} min</Text>
                      </View>
                    </View>

                    <View className="flex-row space-x-2">
                      <TouchableOpacity
                        onPress={() => deleteGoal(goal.id)}
                        className="w-11 h-11 rounded-full bg-white items-center justify-center"
                      >
                        <Ionicons name="trash-outline" size={18} color="#EF4444" />
                      </TouchableOpacity>
                      <TouchableOpacity
                        onPress={() => toggleTimer(goal.id)}
                        className="w-11 h-11 rounded-full bg-white items-center justify-center"
                        disabled={goal.isCompleted}
                      >
                        {goal.isCompleted ? (
                          <Ionicons name="checkmark" size={18} color="#10B981" />
                        ) : goal.isRunning ? (
                          <Ionicons name="pause" size={18} color="#374151" />
                        ) : (
                          <Ionicons name="play" size={18} color="#374151" />
                        )}
                      </TouchableOpacity>
                    </View>
                  </View>
                </View>
              )
            })
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
