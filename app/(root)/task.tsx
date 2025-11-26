"use client"

import { useState } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl, Dimensions } from "react-native"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import LottieView from "lottie-react-native"

const { width } = Dimensions.get("window")

// Using dummy data instead of loading from database

interface CompletedGoal {
  id: number
  title: string
  duration: number
  elapsed_seconds: number
  completed_at: string
  icon: string
  color: string
}

const DUMMY_COMPLETED_GOALS: CompletedGoal[] = [
  {
    id: 1,
    title: "Morning Meditation",
    duration: 10,
    elapsed_seconds: 615,
    completed_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    icon: "meditation",
    color: "#8B5CF6",
  },
  {
    id: 2,
    title: "Gym Workout",
    duration: 60,
    elapsed_seconds: 3625,
    completed_at: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    icon: "dumbbell",
    color: "#EC4899",
  },
  {
    id: 3,
    title: "Read 30 Pages",
    duration: 45,
    elapsed_seconds: 2745,
    completed_at: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
    icon: "book-open",
    color: "#06B6D4",
  },
  {
    id: 4,
    title: "Drink 8 Glasses Water",
    duration: 15,
    elapsed_seconds: 890,
    completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "water",
    color: "#0EA5E9",
  },
  {
    id: 5,
    title: "Journaling",
    duration: 20,
    elapsed_seconds: 1245,
    completed_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    icon: "notebook",
    color: "#F59E0B",
  },
]

export default function TaskScreen() {
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>(DUMMY_COMPLETED_GOALS)
  const [refreshing, setRefreshing] = useState(false)

  const stats = {
    totalCompleted: completedGoals.length,
    totalTimeSpent: completedGoals.reduce((sum, goal) => sum + goal.elapsed_seconds, 0),
    weeklyStreak: 5,
    completionRate: 65,
  }

  const onRefresh = () => {
    setRefreshing(true)
    setTimeout(() => {
      setRefreshing(false)
    }, 800)
  }

  const deleteCompletedGoal = (id: number) => {
    Alert.alert("Delete Goal", "Remove this completed goal from your history?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        onPress: () => {
          setCompletedGoals(completedGoals.filter((goal) => goal.id !== id))
        },
        style: "destructive",
      },
    ])
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffInMs = now.getTime() - date.getTime()
    const diffInHours = diffInMs / (1000 * 60 * 60)

    if (diffInHours < 24) {
      return "Today"
    } else if (diffInHours < 48) {
      return "Yesterday"
    } else {
      return date.toLocaleDateString("en-US", { month: "short", day: "numeric" })
    }
  }

  const formatTotalTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    if (hours > 0) {
      return `${hours}h ${minutes}m`
    }
    return `${minutes}m`
  }

  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600)
    const minutes = Math.floor((seconds % 3600) / 60)
    const secs = seconds % 60
    if (hours > 0) {
      return `${hours}:${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
    }
    return `${String(minutes).padStart(2, "0")}:${String(secs).padStart(2, "0")}`
  }

  // Weekly activity data (Mon-Sun)
  const weeklyData = [
    { day: "MON", percentage: 65 },
    { day: "TUE", percentage: 45 },
    { day: "WED", percentage: 80 },
    { day: "THU", percentage: 55 },
    { day: "FRI", percentage: 70 },
    { day: "SAT", percentage: 35 },
    { day: "SUN", percentage: 90 },
  ]

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor="#1F2937" />}
      >
        {/* Header */}
        <View className="px-6 py-8">
          <Text className="text-4xl font-bold text-gray-900 mb-1">Goal Tracker</Text>
          <Text className="text-gray-500 text-base">Track your progress and achievements</Text>
        </View>

        {/* Premium Stats Overview */}
        <View className="px-6 mb-8">
          <View className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-3xl p-8 mb-4 overflow-hidden">
            <LottieView
              source={require("@/assets/animations/success.json")}
              autoPlay
              loop
              style={{
                position: "absolute",
                width: 200,
                height: 200,
                top: -50,
                right: -50,
                opacity: 0.2,
              }}
            />
            <View className="relative z-10">
              <Text className="text-blue-100 text-sm font-semibold mb-2">Total Progress</Text>
              <View className="flex-row items-end justify-between">
                <View>
                  <Text className="text-white text-5xl font-bold">{stats.totalCompleted}</Text>
                  <Text className="text-blue-200 text-sm mt-1">Goals Completed</Text>
                </View>
                <View className="items-end">
                  <Text className="text-blue-100 text-sm mb-1">{Math.round(stats.completionRate)}%</Text>
                  <View className="w-16 h-1.5 bg-blue-400/30 rounded-full overflow-hidden">
                    <View
                      className="h-full bg-blue-300 rounded-full"
                      style={{ width: `${Math.max(stats.completionRate, 10)}%` }}
                    />
                  </View>
                </View>
              </View>
            </View>
          </View>

          {/* Secondary Stats */}
          <View className="flex-row gap-3">
            <View className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <Text className="text-gray-600 text-xs font-semibold mb-2">Time Invested</Text>
              <Text className="text-gray-900 text-2xl font-bold">{formatTotalTime(stats.totalTimeSpent)}</Text>
            </View>
            <View className="flex-1 bg-gray-50 rounded-2xl p-5 border border-gray-100">
              <Text className="text-gray-600 text-xs font-semibold mb-2">Weekly Streak</Text>
              <Text className="text-gray-900 text-2xl font-bold">{stats.weeklyStreak} days</Text>
            </View>
          </View>
        </View>

        {/* Weekly Activity Ring */}
        <View className="px-6 mb-8">
          <Text className="text-lg font-bold text-gray-900 mb-5">Weekly Activity</Text>
          <View className="bg-gray-50 rounded-2xl p-6 border border-gray-100">
            <View className="flex-row items-end justify-between gap-2">
              {weeklyData.map((item, index) => (
                <View key={index} className="flex-1 items-center">
                  <View className="w-8 h-24 bg-gray-200 rounded-lg overflow-hidden mb-2">
                    <View
                      className="w-full bg-gradient-to-t from-purple-600 to-purple-400 rounded-lg"
                      style={{ height: `${item.percentage}%` }}
                    />
                  </View>
                  <Text className="text-gray-700 text-xs font-semibold">{item.day}</Text>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Completed Goals Section */}
        <View className="px-6">
          <View className="flex-row items-center justify-between mb-5">
            <Text className="text-lg font-bold text-gray-900">Recent Achievements</Text>
            {completedGoals.length > 0 && (
              <Text className="text-purple-600 text-sm font-semibold">{completedGoals.length}</Text>
            )}
          </View>

          {completedGoals.length === 0 ? (
            <View className="bg-gray-50 rounded-3xl p-8 items-center justify-center border border-gray-100">
              <LottieView
                source={require("@/assets/animations/empty.json")}
                autoPlay
                loop
                style={{ width: 120, height: 120 }}
              />
              <Text className="text-gray-900 font-bold text-lg mt-4">No Completed Goals Yet</Text>
              <Text className="text-gray-500 text-center mt-2">
                Complete goals in the Home tab to track your progress here
              </Text>
            </View>
          ) : (
            completedGoals.slice(0, 5).map((goal, index) => (
              <View key={goal.id} className="mb-4 rounded-2xl border border-gray-200 overflow-hidden bg-white">
                {/* Color accent bar */}
                <View className="h-1" style={{ backgroundColor: goal.color }} />

                <View className="p-5">
                  {/* Top Row */}
                  <View className="flex-row items-center justify-between mb-4">
                    <View className="flex-row items-center flex-1">
                      <View
                        className="w-12 h-12 rounded-xl items-center justify-center mr-3"
                        style={{ backgroundColor: goal.color + "20" }}
                      >
                        <MaterialCommunityIcons name={goal.icon as any} size={24} color={goal.color} />
                      </View>
                      <View className="flex-1">
                        <Text className="text-gray-900 font-bold text-base">{goal.title}</Text>
                        <Text className="text-gray-500 text-xs mt-1">{formatDate(goal.completed_at)}</Text>
                      </View>
                    </View>
                    <View className="bg-green-50 rounded-full px-3 py-1.5 flex-row items-center gap-1">
                      <Ionicons name="checkmark-circle" size={14} color="#10B981" />
                      <Text className="text-green-700 text-xs font-bold">Completed</Text>
                    </View>
                  </View>

                  {/* Time info */}
                  <View className="flex-row items-center justify-between">
                    <View className="flex-row items-center gap-3">
                      <View className="flex-row items-center gap-1.5">
                        <Ionicons name="time-outline" size={14} color="#6B7280" />
                        <Text className="text-gray-600 text-sm">{goal.duration} min</Text>
                      </View>
                      <View className="w-1 h-1 bg-gray-300 rounded-full" />
                      <Text className="text-gray-600 text-sm font-medium">{formatTime(goal.elapsed_seconds)}</Text>
                    </View>

                    <TouchableOpacity onPress={() => deleteCompletedGoal(goal.id)} className="p-2">
                      <Ionicons name="trash-outline" size={18} color="#EF4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))
          )}

          {completedGoals.length > 5 && (
            <TouchableOpacity className="bg-gray-900 rounded-2xl py-4 mt-4 items-center">
              <Text className="text-white font-bold">View All {completedGoals.length} Goals</Text>
            </TouchableOpacity>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
