"use client"

import { useState, useEffect } from "react"
import { View, Text, ScrollView, TouchableOpacity, Alert, RefreshControl } from "react-native"
import { useUser } from "@clerk/clerk-expo"
import { MaterialCommunityIcons, Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { db, CompletedGoal } from "@/lib/db"
import { formatTime } from "@/lib/timer-utils"

export default function TaskScreen() {
  const { user } = useUser()
  const [completedGoals, setCompletedGoals] = useState<CompletedGoal[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [stats, setStats] = useState({
    totalCompleted: 0,
    totalTimeSpent: 0,
  })

  const loadCompletedGoals = async () => {
    if (!user?.id) return

    try {
      const goals = await db.getCompletedGoals(user.id)
      const count = await db.getCompletedGoalsCount(user.id)
      const totalTime = await db.getTotalTimeSpent(user.id)

      setCompletedGoals(goals)
      setStats({
        totalCompleted: count,
        totalTimeSpent: totalTime,
      })
    } catch (error) {
      console.error('[v0] Error loading completed goals:', error)
      Alert.alert('Error', 'Failed to load completed goals')
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  useEffect(() => {
    loadCompletedGoals()
  }, [user?.id])

  const onRefresh = () => {
    setRefreshing(true)
    loadCompletedGoals()
  }

  const deleteCompletedGoal = (id: number) => {
    Alert.alert(
      "Delete Completed Goal",
      "Are you sure you want to delete this completed goal from history?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          onPress: async () => {
            if (!user?.id) return
            
            try {
              await db.deleteCompletedGoal(id, user.id)
              await loadCompletedGoals()
            } catch (error) {
              console.error('[v0] Error deleting completed goal:', error)
              Alert.alert('Error', 'Failed to delete completed goal')
            }
          },
          style: "destructive",
        },
      ]
    )
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
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })
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

  if (loading) {
    return (
      <SafeAreaView className="flex-1 bg-gray-50">
        <View className="flex-1 items-center justify-center">
          <MaterialCommunityIcons name="loading" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 mt-4">Loading completed goals...</Text>
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="px-5 py-6 bg-white border-b border-gray-100">
        <Text className="text-gray-900 text-3xl font-bold">Completed Goals</Text>
        <Text className="text-gray-500 mt-1">Track your achievements</Text>
      </View>

      <ScrollView
        className="flex-1"
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Stats Cards */}
        <View className="px-5 py-6">
          <View className="flex-row space-x-4">
            <View className="flex-1 bg-gradient-to-br from-blue-500 to-blue-600 rounded-3xl p-5">
              <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mb-3">
                <Ionicons name="checkmark-circle" size={24} color="white" />
              </View>
              <Text className="text-white/80 text-sm font-medium">Total Completed</Text>
              <Text className="text-white text-3xl font-bold mt-1">{stats.totalCompleted}</Text>
            </View>

            <View className="flex-1 bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-5">
              <View className="w-12 h-12 rounded-2xl bg-white/20 items-center justify-center mb-3">
                <Ionicons name="time" size={24} color="white" />
              </View>
              <Text className="text-white/80 text-sm font-medium">Time Spent</Text>
              <Text className="text-white text-3xl font-bold mt-1">
                {formatTotalTime(stats.totalTimeSpent)}
              </Text>
            </View>
          </View>
        </View>

        {/* Completed Goals List */}
        <View className="px-5">
          {completedGoals.length === 0 ? (
            <View className="bg-white rounded-3xl p-8 items-center justify-center border border-gray-100">
              <MaterialCommunityIcons name="trophy-outline" size={64} color="#D1D5DB" />
              <Text className="text-gray-900 font-bold text-xl mt-4">No Completed Goals Yet</Text>
              <Text className="text-gray-400 text-center mt-2 text-base">
                Complete goals in the Home tab to see them here!
              </Text>
            </View>
          ) : (
            completedGoals.map((goal) => (
              <View
                key={goal.id}
                className="rounded-3xl p-5 mb-4 shadow-sm"
                style={{ backgroundColor: goal.color }}
              >
                {/* Top Row */}
                <View className="flex-row items-center justify-between mb-4">
                  <View className="w-12 h-12 rounded-2xl bg-white items-center justify-center">
                    <MaterialCommunityIcons name={goal.icon as any} size={24} color="#374151" />
                  </View>
                  <View className="flex-row items-center bg-green-500 rounded-full px-3 py-1.5">
                    <Ionicons name="checkmark-circle" size={16} color="white" />
                    <Text className="text-white font-bold ml-1 text-sm">Completed</Text>
                  </View>
                </View>

                {/* Category & Date */}
                <View className="flex-row items-center justify-between mb-1">
                  <Text className="text-gray-600 text-sm font-medium">{goal.category}</Text>
                  <Text className="text-gray-600 text-xs">{formatDate(goal.completed_at)}</Text>
                </View>

                {/* Title */}
                <Text className="text-gray-900 text-lg font-bold mb-4">{goal.title}</Text>

                {/* Progress Bar - Always 100% */}
                <View className="mb-4">
                  <View className="h-2 bg-white/40 rounded-full overflow-hidden">
                    <View className="h-full bg-gray-900 rounded-full" style={{ width: '100%' }} />
                  </View>
                  <Text className="text-gray-700 text-xs font-semibold mt-1.5">
                    Completed in {formatTime(goal.elapsed_seconds)}
                  </Text>
                </View>

                {/* Bottom Row */}
                <View className="flex-row items-center justify-between">
                  <View className="flex-row items-center space-x-2">
                    <View className="bg-white rounded-full px-3 py-1.5 flex-row items-center">
                      <Ionicons name="time-outline" size={16} color="#6B7280" />
                      <Text className="text-gray-700 font-semibold ml-1.5 text-sm">{goal.duration} min</Text>
                    </View>
                    {goal.rating > 0 && (
                      <View className="bg-white rounded-full px-3 py-1.5 flex-row items-center">
                        <Ionicons name="star" size={16} color="#FCD34D" />
                        <Text className="text-gray-900 font-bold ml-1 text-sm">{goal.rating}</Text>
                      </View>
                    )}
                  </View>

                  <TouchableOpacity
                    onPress={() => deleteCompletedGoal(goal.id)}
                    className="w-11 h-11 rounded-full bg-white items-center justify-center"
                  >
                    <Ionicons name="trash-outline" size={18} color="#EF4444" />
                  </TouchableOpacity>
                </View>
              </View>
            ))
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  )
}
