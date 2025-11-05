import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';

interface MenuItem {
  id: string;
  icon: string;
  label: string;
  onPress: () => void;
  showArrow?: boolean;
}

export default function ProfileScreen() {
  const [streak, setStreak] = useState(257);

  const menuItems: MenuItem[] = [
    {
      id: 'friends',
      icon: '👥',
      label: 'Friends',
      onPress: () => Alert.alert('Friends', 'View your friends list'),
      showArrow: true,
    },
    {
      id: 'settings',
      icon: '⚙️',
      label: 'Settings',
      onPress: () => Alert.alert('Settings', 'Manage your settings'),
      showArrow: true,
    },
    {
      id: 'notifications',
      icon: '🔔',
      label: 'Notifications',
      onPress: () => Alert.alert('Notifications', 'Notification preferences'),
      showArrow: true,
    },
    {
      id: 'account',
      icon: '👤',
      label: 'Account Setting',
      onPress: () => Alert.alert('Account', 'Manage your account'),
      showArrow: true,
    },
  ];

  const footerItems: MenuItem[] = [
    {
      id: 'terms',
      icon: '📋',
      label: 'Terms of Service',
      onPress: () => Alert.alert('Terms of Service', 'Our terms and conditions'),
      showArrow: false,
    },
    {
      id: 'privacy',
      icon: '🔒',
      label: 'Privacy Policy',
      onPress: () => Alert.alert('Privacy Policy', 'Our privacy practices'),
      showArrow: false,
    },
    {
      id: 'teams',
      icon: '🏢',
      label: 'Teams',
      onPress: () => Alert.alert('Teams', 'View and manage teams'),
      showArrow: false,
    },
    {
      id: 'review',
      icon: '⭐',
      label: 'Give us a review',
      onPress: () => Alert.alert('Review', 'Leave us a review on the store'),
      showArrow: false,
    },
  ];

  return (
    <View className="flex-1 bg-neutral-950">
      <ScrollView
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="px-5 pt-16 pb-6">
          <Text className="text-3xl font-bold text-white">My Account</Text>
        </View>

        {/* Profile Card */}
        <View className="mx-4 mb-6 bg-neutral-900 rounded-2xl p-4">
          <View className="flex-row items-center gap-3">
            <View className="mr-1">
              <View className="w-14 h-14 rounded-full bg-neutral-700 items-center justify-center">
                <Text className="text-2xl font-bold text-white">S</Text>
              </View>
            </View>
            <View className="flex-1">
              <Text className="text-base font-bold text-white mb-1">@satya</Text>
              <Text className="text-sm text-neutral-400">{streak} Days Streak</Text>
            </View>
            <TouchableOpacity className="w-8 h-8 rounded-full bg-neutral-800 items-center justify-center">
              <Text className="text-base text-white font-semibold">→</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Main Menu Section */}
        <View className="mx-4 mb-6 bg-neutral-900 rounded-2xl overflow-hidden">
          {menuItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center justify-between px-4 py-3.5 ${
                index !== menuItems.length - 1 ? 'border-b border-neutral-800' : ''
              }`}
              onPress={item.onPress}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-lg">{item.icon}</Text>
                <Text className="text-base font-medium text-white">{item.label}</Text>
              </View>
              {item.showArrow && (
                <Text className="text-lg text-neutral-600 ml-2">›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Footer Menu Section */}
        <View className="mx-4 mb-6 bg-neutral-900 rounded-2xl overflow-hidden">
          {footerItems.map((item, index) => (
            <TouchableOpacity
              key={item.id}
              className={`flex-row items-center justify-between px-4 py-3.5 ${
                index !== footerItems.length - 1 ? 'border-b border-neutral-800' : ''
              }`}
              onPress={item.onPress}
            >
              <View className="flex-row items-center gap-3 flex-1">
                <Text className="text-lg">{item.icon}</Text>
                <Text className="text-base font-medium text-white">{item.label}</Text>
              </View>
              {item.showArrow && (
                <Text className="text-lg text-neutral-600 ml-2">›</Text>
              )}
            </TouchableOpacity>
          ))}
        </View>

        {/* Social Links */}
        <View className="flex-row justify-center gap-5 mt-3 pb-5">
          <TouchableOpacity className="w-11 h-11 rounded-full bg-neutral-900 items-center justify-center">
            <Text className="text-xl">📷</Text>
          </TouchableOpacity>
          <TouchableOpacity className="w-11 h-11 rounded-full bg-neutral-900 items-center justify-center">
            <Text className="text-xl">𝕏</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
}