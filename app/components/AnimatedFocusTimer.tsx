import { useState, useEffect, useRef } from "react"
import { View, Text, TouchableOpacity, Animated, Easing } from "react-native"
import { Ionicons } from "@expo/vector-icons"
import { SafeAreaView } from "react-native-safe-area-context"
import { formatTime } from "@/lib/timer-utils"
import Svg, { Circle } from "react-native-svg"

interface Goal {
  id: string
  title: string
  duration: number
  category: string
  color: string
  icon: string
  isRunning?: boolean
  elapsedSeconds?: number
  isCompleted?: boolean
}

interface AnimatedFocusTimerProps {
  goal: Goal
  onClose: () => void
  onToggleTimer: () => void
}

export default function AnimatedFocusTimer({
  goal,
  onClose,
  onToggleTimer,
}: AnimatedFocusTimerProps) {
  const animatedRotation = useRef(new Animated.Value(0)).current
  const pulseAnim = useRef(new Animated.Value(1)).current
  
  const circumference = 2 * Math.PI * 120
  const progress = Math.min((goal.elapsedSeconds || 0) / (goal.duration * 60), 1)
  const strokeDashoffset = circumference * (1 - progress)

  // <CHANGE> Animated rotation effect for the circular progress
  useEffect(() => {
    if (goal.isRunning) {
      Animated.loop(
        Animated.timing(animatedRotation, {
          toValue: 1,
          duration: 3000,
          easing: Easing.linear,
          useNativeDriver: true,
        })
      ).start()

      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {
            toValue: 1.05,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(pulseAnim, {
            toValue: 1,
            duration: 1500,
            easing: Easing.inOut(Easing.ease),
            useNativeDriver: true,
          }),
        ])
      ).start()
    } else {
      animatedRotation.setValue(0)
      pulseAnim.setValue(1)
    }
  }, [goal.isRunning])

  const rotation = animatedRotation.interpolate({
    inputRange: [0, 1],
    outputRange: ["0deg", "360deg"],
  })

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: goal.color }}>
      {/* Close Button */}
      <View className="flex-row items-center justify-between px-5 py-4">
        <TouchableOpacity
          onPress={onClose}
          className="w-12 h-12 rounded-full bg-white/20 items-center justify-center"
        >
          <Ionicons name="chevron-down" size={28} color="white" />
        </TouchableOpacity>
        <Text className="text-white text-lg font-bold">{goal.category}</Text>
        <View className="w-12 h-12" />
      </View>

      {/* Main Content */}
      <View className="flex-1 items-center justify-center px-5">
        {/* Animated Background Circles */}
        <View className="absolute w-80 h-80 rounded-full opacity-20" style={{ backgroundColor: "#000" }} />
        <Animated.View
          className="absolute w-96 h-96 rounded-full border-2 border-white opacity-10"
          style={{ transform: [{ rotate: rotation }] }}
        />

        {/* Main Circular Progress */}
        <Animated.View
          style={{
            transform: [{ scale: pulseAnim }],
          }}
        >
          <View className="relative w-80 h-80 items-center justify-center">
            {/* SVG Circle Background */}
            <Svg width="320" height="320" viewBox="0 0 320 320" className="absolute">
              <Circle
                cx="160"
                cy="160"
                r="120"
                fill="none"
                stroke="rgba(255, 255, 255, 0.1)"
                strokeWidth="2"
              />
            </Svg>

            {/* SVG Animated Progress Circle */}
            <Animated.View
              style={{
                transform: [{ rotate: rotation }],
              }}
            >
              <Svg width="320" height="320" viewBox="0 0 320 320">
                <Circle
                  cx="160"
                  cy="160"
                  r="120"
                  fill="none"
                  stroke="white"
                  strokeWidth="8"
                  strokeDasharray={circumference}
                  strokeDashoffset={strokeDashoffset}
                  strokeLinecap="round"
                />
              </Svg>
            </Animated.View>

            {/* Center Content */}
            <View className="absolute items-center justify-center">
              <Text className="text-white text-7xl font-bold">
                {formatTime(goal.elapsedSeconds || 0)}
              </Text>
              <Text className="text-white text-lg font-semibold mt-2 opacity-80">
                / {goal.duration} min
              </Text>
              <Text className="text-white text-base font-semibold mt-6 text-center px-4">
                {goal.title}
              </Text>
            </View>
          </View>
        </Animated.View>
      </View>

      {/* Bottom Controls */}
      <View className="px-5 pb-8">
        {/* Progress Info */}
        <View className="bg-white/10 rounded-2xl p-4 mb-6">
          <View className="flex-row items-center justify-between">
            <View>
              <Text className="text-white text-sm opacity-80">Progress</Text>
              <Text className="text-white text-2xl font-bold mt-1">
                {Math.round(progress * 100)}%
              </Text>
            </View>
            {goal.isCompleted && (
              <View className="flex-row items-center bg-green-500 rounded-full px-4 py-2">
                <Ionicons name="checkmark-circle" size={20} color="white" />
                <Text className="text-white font-bold ml-2">Completed!</Text>
              </View>
            )}
          </View>
        </View>

        {/* Play/Pause Button */}
        <TouchableOpacity
          onPress={onToggleTimer}
          disabled={goal.isCompleted}
          className="bg-white/20 rounded-full py-6 flex-row items-center justify-center mb-4"
          style={{ opacity: goal.isCompleted ? 0.5 : 1 }}
        >
          <Ionicons
            name={goal.isRunning ? "pause" : "play"}
            size={32}
            color="white"
          />
          <Text className="text-white text-lg font-bold ml-3">
            {goal.isRunning ? "Pause" : "Resume"}
          </Text>
        </TouchableOpacity>

        {/* Close Button */}
        <TouchableOpacity
          onPress={onClose}
          className="bg-white/10 rounded-full py-4"
        >
          <Text className="text-white text-lg font-bold text-center">Back to Home</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}