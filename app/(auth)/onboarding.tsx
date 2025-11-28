"use client"
import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, TextInput, Alert } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useRouter } from "expo-router"

interface OnboardingData {
  habitName: string
  goalMinutes: number
  selectedCategories: string[]
  notificationsEnabled: boolean
}

interface Category {
  id: string
  icon: string
  name: string
}

const HabitTrackerOnboarding: React.FC = () => {
  const router = useRouter()
  const [currentStep, setCurrentStep] = useState(0)
  const [habitName, setHabitName] = useState("")
  const [goalMinutes, setGoalMinutes] = useState("30")
  const [selectedCategories, setSelectedCategories] = useState<string[]>([])
  const [notificationsEnabled, setNotificationsEnabled] = useState(false)

  const categories: Category[] = [
    { id: "1", icon: "🏃‍♂️", name: "Running" },
    { id: "2", icon: "🧘‍♂️", name: "Meditation" },
    { id: "3", icon: "📝", name: "Writing" },
    { id: "4", icon: "💻", name: "Coding" },
    { id: "5", icon: "🎨", name: "Drawing" },
    { id: "6", icon: "🧘‍♀️", name: "Yoga" },
  ]

  const handleBack = () => {
    setCurrentStep(currentStep - 1)
  }

  const handleNext = () => {
    if (currentStep === 5) {
      // <CHANGE> Save onboarding data and navigate to home
      const onboardingData: OnboardingData = {
        habitName,
        goalMinutes: Number.parseInt(goalMinutes),
        selectedCategories,
        notificationsEnabled,
      }
      
      // Save to AsyncStorage or your preferred storage
      // For now, just navigate
      console.log("Onboarding complete:", onboardingData)
      router.replace("/(root)/home")
    } else {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleSkip = () => {
    router.replace("/(root)/home")
  }

  const updateGoalMinutes = (value: string) => {
    setGoalMinutes(value)
  }

  const toggleCategory = (categoryId: string) => {
    setSelectedCategories((prevCategories) =>
      prevCategories.includes(categoryId)
        ? prevCategories.filter((id) => id !== categoryId)
        : [...prevCategories, categoryId],
    )
  }

  const renderProgressBar = (): React.ReactElement => (
    <View className="flex-row gap-1.5 px-6 mb-8">
      {[0, 1, 2, 3, 4, 5].map((step: number) => (
        <View
          key={step}
          className={`flex-1 h-1.5 rounded-full ${
            step <= currentStep ? "bg-gradient-to-r from-purple-500 to-pink-500" : "bg-gray-300"
          }`}
        />
      ))}
    </View>
  )

  return (
    <SafeAreaView className="flex-1 bg-gradient-to-br from-slate-50 to-purple-50">
      <ScrollView className="flex-1" showsVerticalScrollIndicator={false} scrollEnabled={false}>
        {/* Header with back button */}
        <View className="flex-row items-center justify-between px-6 py-6">
          <TouchableOpacity
            onPress={handleBack}
            disabled={currentStep === 0}
            className={`w-10 h-10 rounded-full items-center justify-center ${
              currentStep === 0 ? "bg-gray-100" : "bg-gradient-to-br from-purple-100 to-pink-100"
            }`}
          >
            <Text className={`text-xl font-bold ${currentStep === 0 ? "text-gray-300" : "text-purple-600"}`}>←</Text>
          </TouchableOpacity>
          <Text className="text-purple-600 text-sm font-semibold">Step {currentStep + 1} of 6</Text>
          <TouchableOpacity onPress={handleSkip} className="px-3 py-1.5 rounded-full bg-gray-200/50">
            <Text className="text-gray-600 text-xs font-semibold">Skip</Text>
          </TouchableOpacity>
        </View>

        {renderProgressBar()}

        {/* Step 1: Welcome */}
        {currentStep === 0 && (
          <View className="flex-1 px-6 justify-center py-20">
            <View className="items-center mb-12">
              <View className="w-28 h-28 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 items-center justify-center mb-8 shadow-xl shadow-purple-400/50">
                <Text className="text-6xl">🎯</Text>
              </View>
              <Text className="text-4xl font-bold text-center text-gray-900 mb-4">Build Your Future</Text>
              <Text className="text-center text-gray-600 text-base leading-6">
                Track your daily habits and reach your goals with our intelligent timer system
              </Text>
            </View>
          </View>
        )}

        {/* Step 2: Create Habit */}
        {currentStep === 1 && (
          <View className="flex-1 px-6 py-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">What is your main habit?</Text>
            <Text className="text-gray-600 text-sm mb-8">Enter the habit you want to build</Text>
            <View className="bg-white rounded-2xl px-4 py-3 mb-8 border-2 border-purple-200 shadow-md">
              <TextInput
                placeholder="e.g., Morning Exercise, Reading"
                value={habitName}
                onChangeText={setHabitName}
                placeholderTextColor="#D1D5DB"
                className="text-base text-gray-900 font-medium"
              />
            </View>
            <Text className="text-gray-700 font-semibold mb-3">Popular habits</Text>
            <View className="flex-row flex-wrap gap-2">
              {["Running", "Meditation", "Writing", "Coding", "Drawing", "Yoga"].map((habit: string) => (
                <TouchableOpacity
                  key={habit}
                  onPress={() => setHabitName(habit)}
                  className={`px-4 py-2.5 rounded-full border-2 ${
                    habitName === habit
                      ? "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`font-semibold text-sm ${habitName === habit ? "text-white" : "text-gray-700"}`}>
                    {habit}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 3: Set Goal Duration */}
        {currentStep === 2 && (
          <View className="flex-1 px-6 py-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Set your goal timer</Text>
            <Text className="text-gray-600 text-sm mb-10">How many minutes do you want to dedicate daily?</Text>
            <View className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-3xl p-8 mb-8 items-center border border-purple-200">
              <Text className="text-7xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 text-transparent bg-clip-text mb-2">
                {goalMinutes}
              </Text>
              <Text className="text-gray-600 text-lg font-semibold">minutes per day</Text>
            </View>
            <View className="bg-white rounded-2xl px-4 py-4 mb-8 flex-row items-center justify-between border-2 border-purple-200">
              <TouchableOpacity
                onPress={() => {
                  const current = Number.parseInt(goalMinutes) || 30
                  updateGoalMinutes(Math.max(5, current - 5).toString())
                }}
                className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg items-center justify-center shadow-md"
              >
                <Text className="text-2xl text-white font-bold">−</Text>
              </TouchableOpacity>
              <TextInput
                value={goalMinutes}
                onChangeText={updateGoalMinutes}
                keyboardType="number-pad"
                className="text-2xl font-bold text-gray-900 text-center flex-1"
              />
              <TouchableOpacity
                onPress={() => {
                  const current = Number.parseInt(goalMinutes) || 30
                  updateGoalMinutes(Math.min(480, current + 5).toString())
                }}
                className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg items-center justify-center shadow-md"
              >
                <Text className="text-2xl text-white font-bold">+</Text>
              </TouchableOpacity>
            </View>
            <View className="flex-row gap-2 flex-wrap">
              {["15", "30", "45", "60"].map((mins: string) => (
                <TouchableOpacity
                  key={mins}
                  onPress={() => setGoalMinutes(mins)}
                  className={`px-5 py-3 rounded-full border-2 transition ${
                    goalMinutes === mins
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 border-transparent shadow-lg"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text className={`font-bold text-sm ${goalMinutes === mins ? "text-white" : "text-gray-700"}`}>
                    {mins}m
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 4: Choose Categories */}
        {currentStep === 3 && (
          <View className="flex-1 px-6 py-8">
            <Text className="text-3xl font-bold text-gray-900 mb-2">Choose your interests</Text>
            <Text className="text-gray-600 text-sm mb-8">Select categories to personalize your experience</Text>
            <View className="flex-row flex-wrap gap-3">
              {categories.map((category: Category) => (
                <TouchableOpacity
                  key={category.id}
                  onPress={() => toggleCategory(category.id)}
                  className={`px-4 py-3 rounded-2xl border-2 flex-row items-center gap-2 transition ${
                    selectedCategories.includes(category.id)
                      ? "bg-gradient-to-br from-purple-100 to-pink-100 border-purple-500 shadow-md"
                      : "bg-white border-gray-200"
                  }`}
                >
                  <Text className="text-2xl">{category.icon}</Text>
                  <Text
                    className={`font-semibold text-sm ${
                      selectedCategories.includes(category.id) ? "text-purple-700" : "text-gray-700"
                    }`}
                  >
                    {category.name}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>
        )}

        {/* Step 5: Notifications */}
        {currentStep === 4 && (
          <View className="flex-1 px-6 justify-center py-20">
            <View className="items-center mb-12">
              <View className="w-24 h-24 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 items-center justify-center mb-8 shadow-xl shadow-purple-400/50">
                <Text className="text-5xl">🔔</Text>
              </View>
              <Text className="text-3xl font-bold text-gray-900 mb-3 text-center">Stay on Track</Text>
              <Text className="text-center text-gray-600 text-base leading-6 mb-10">
                Enable notifications to get reminders for your daily habits
              </Text>
              <TouchableOpacity
                onPress={() => setNotificationsEnabled(!notificationsEnabled)}
                className={`w-full px-6 py-4 rounded-2xl border-2 mb-6 items-center shadow-md transition ${
                  notificationsEnabled
                    ? "bg-gradient-to-r from-purple-500 to-pink-500 border-transparent shadow-lg shadow-purple-500/50"
                    : "bg-white border-gray-200"
                }`}
              >
                <Text className={`text-lg font-bold ${notificationsEnabled ? "text-white" : "text-gray-700"}`}>
                  {notificationsEnabled ? "✓ " : ""}Notifications {notificationsEnabled ? "On" : "Off"}
                </Text>
              </TouchableOpacity>
              <Text className="text-gray-500 text-xs text-center">You can change this anytime in settings</Text>
            </View>
          </View>
        )}

        {/* Step 6: Complete */}
        {currentStep === 5 && (
          <View className="flex-1 px-6 justify-center py-20">
            <View className="items-center">
              <View className="w-28 h-28 rounded-full bg-gradient-to-br from-green-400 to-emerald-400 items-center justify-center mb-8 shadow-xl shadow-green-400/50">
                <Text className="text-6xl">🎉</Text>
              </View>
              <Text className="text-4xl font-bold text-gray-900 mb-3 text-center">You are all set!</Text>
              <Text className="text-center text-gray-600 text-base leading-6 mb-12">
                Your habit tracker is ready. Start building your future one day at a time.
              </Text>
              <View className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-2xl p-6 w-full mb-8 border-2 border-purple-300 shadow-md">
                <Text className="text-gray-700 font-semibold mb-2">Summary</Text>
                <Text className="text-gray-900 font-bold text-lg mb-2">{habitName || "Your Habit"}</Text>
                <Text className="text-gray-700 font-medium">{goalMinutes} minutes daily</Text>
                {selectedCategories.length > 0 && (
                  <Text className="text-gray-600 text-sm mt-2">Categories: {selectedCategories.length} selected</Text>
                )}
              </View>
            </View>
          </View>
        )}

        <View className="h-8" />
      </ScrollView>

      {/* Footer Button */}
      <View className="px-6 pb-8 pt-6 bg-gradient-to-t from-slate-50 to-transparent">
        <TouchableOpacity
          onPress={handleNext}
          className="w-full bg-gradient-to-r from-purple-600 to-pink-600 rounded-full py-4 items-center shadow-lg shadow-purple-500/50 active:opacity-90"
        >
          <Text className="text-white text-base font-bold">{currentStep === 5 ? "Get Started" : "Next"}</Text>
        </TouchableOpacity>
        {currentStep > 0 && currentStep < 5 && (
          <TouchableOpacity onPress={handleBack} className="w-full mt-3 py-4 items-center">
            <Text className="text-gray-600 text-base font-semibold">Back</Text>
          </TouchableOpacity>
        )}
      </View>
    </SafeAreaView>
  )
}

export default HabitTrackerOnboarding