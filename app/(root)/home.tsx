import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  ScrollView,
  StatusBar,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';

const currentUser = {
  name: 'Antony Jacob',
  avatar: 'https://i.pravatar.cc/150?img=12',
};

// Mock members data
const members = [
  { id: 1, avatar: 'https://i.pravatar.cc/150?img=1' },
  { id: 2, avatar: 'https://i.pravatar.cc/150?img=2' },
  { id: 3, avatar: 'https://i.pravatar.cc/150?img=3' },
  { id: 4, avatar: 'https://i.pravatar.cc/150?img=4' },
  { id: 5, avatar: 'https://i.pravatar.cc/150?img=5' },
  { id: 6, avatar: 'https://i.pravatar.cc/150?img=6' },
  { id: 7, avatar: 'https://i.pravatar.cc/150?img=7' },
  { id: 8, avatar: 'https://i.pravatar.cc/150?img=8' },
];

// Mock tasks with countdown
const tasks = [
  {
    id: 1,
    title: 'Healthcare Dashboard UI',
    team: 'Design team',
    color: '#8B7FE8',
    deadline: new Date(Date.now() + 2 * 60 * 60 * 1000), // 2 hours from now
    assignedMembers: [
      'https://i.pravatar.cc/150?img=9',
      'https://i.pravatar.cc/150?img=10',
      'https://i.pravatar.cc/150?img=11',
    ],
  },
];

export default function HomeScreen() {
  const [timeLeft, setTimeLeft] = useState('');

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date();
      const deadline = tasks[0].deadline;
      const diff = deadline.getTime() - now.getTime();

      if (diff > 0) {
        const hours = Math.floor(diff / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);
        setTimeLeft(`${hours}h ${minutes}m ${seconds}s`);
      } else {
        setTimeLeft('Expired');
      }
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View className="flex-1 bg-[#F5F5FA]">
      <StatusBar barStyle="dark-content" />

      <ScrollView className="flex-1" showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View className="px-6 pt-14 pb-6 bg-white rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <Image
                source={{ uri: currentUser.avatar }}
                className="w-12 h-12 rounded-full mr-3"
              />
              <View>
                <Text className="text-gray-500 text-xs font-quicksand-light">
                  Good Morning !
                </Text>
                <Text className="text-black text-base font-quicksand-bold">
                  {currentUser.name}
                </Text>
              </View>
            </View>
            <TouchableOpacity>
              <Ionicons name="notifications-outline" size={24} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Task Count */}
          <View className="mb-6">
            <Text className="text-3xl text-black font-quicksand-light">
              You have <Text className="font-quicksand-bold">3</Text>
            </Text>
            <Text className="text-3xl text-black font-quicksand-bold">
              task for today
            </Text>
          </View>

          {/* Members Section */}
          <View className="flex-row items-center justify-between">
            <Text className="text-black text-lg font-quicksand-bold">
              8 Members
            </Text>
            <TouchableOpacity className="w-10 h-10 bg-[#8B7FE8] rounded-full items-center justify-center">
              <Ionicons name="add" size={24} color="#fff" />
            </TouchableOpacity>
          </View>

          <View className="flex-row mt-4">
            {members.map((member, index) => (
              <Image
                key={member.id}
                source={{ uri: member.avatar }}
                className="w-12 h-12 rounded-full border-2 border-white"
                style={{ marginLeft: index > 0 ? -12 : 0 }}
              />
            ))}
          </View>
        </View>

        {/* Next Task Section */}
        <View className="px-6 mt-6">
          <Text className="text-black text-lg font-quicksand-bold mb-4">
            Next Task
          </Text>

          {/* Task Card */}
          <View
            className="rounded-3xl p-6 shadow-lg"
            style={{ backgroundColor: tasks[0].color }}
          >
            {/* Task Header */}
            <View className="flex-row items-start justify-between mb-4">
              <View className="flex-1">
                <Text className="text-white text-xl font-quicksand-bold mb-1">
                  {tasks[0].title}
                </Text>
                <Text className="text-white/80 text-sm font-quicksand-medium">
                  {tasks[0].team}
                </Text>
              </View>
              <View className="flex-row">
                {tasks[0].assignedMembers.map((avatar, index) => (
                  <Image
                    key={index}
                    source={{ uri: avatar }}
                    className="w-8 h-8 rounded-full border-2 border-white"
                    style={{ marginLeft: index > 0 ? -8 : 0 }}
                  />
                ))}
              </View>
            </View>

            {/* Task Icons */}
            <View className="flex-row items-center justify-between mb-4">
              <View className="flex-row space-x-3">
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">📍</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">💡</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">⏰</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">🎯</Text>
                </View>
                <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                  <Text className="text-2xl">✅</Text>
                </View>
              </View>
            </View>

            {/* Countdown Timer */}
            <View className="bg-white/20 rounded-2xl p-3 mb-4">
              <Text className="text-white text-center font-quicksand-semibold">
                Time Left: {timeLeft}
              </Text>
            </View>

            {/* Arrow Button */}
            <TouchableOpacity className="w-12 h-12 bg-white rounded-full items-center justify-center self-end">
              <Ionicons name="arrow-forward" size={24} color={tasks[0].color} />
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}
