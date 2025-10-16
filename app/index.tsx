import React from 'react';
import { View, Text, Image, TouchableOpacity, StatusBar } from 'react-native';

export default function Index() {
  return (
    <View className="flex-1 bg-[#E8EEF2]">
      <StatusBar barStyle="dark-content" />

      <View className="items-center pt-12">
        <Text className="text-gray-400 text-base font-light tracking-wider">
          skrabble
        </Text>
      </View>


      <View className="flex-1 items-center justify-center px-8">
        <View className="mb-8">
          <Text className="text-4xl font-bold text-black text-center leading-tight">
            set goals
          </Text>
          <Text className="text-4xl font-bold text-black text-center leading-tight">
            stay focused.
          </Text>
        </View>

        <Image
          source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/madison-lavern-4gcqRf3-f2I-unsplash-removebg-preview-o4haPxfaTWRrgeDRHdqFmLNhqK9D9c.png' }}
          className="w-full h-96"
          resizeMode="contain"
        />
      </View>

      <View className="px-6 pb-12">
        <TouchableOpacity 
          className="bg-white rounded-full py-4 shadow-lg"
          activeOpacity={0.8}
        >
          <Text className="text-center text-black text-base font-semibold">
            Get started
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}