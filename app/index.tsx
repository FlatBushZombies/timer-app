import React from 'react';
import {
  View,
  Text,
  ImageBackground,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  Image,
} from 'react-native';
import { useFonts, Inter_400Regular, Inter_600SemiBold } from '@expo-google-fonts/inter';
import { Poppins_700Bold } from '@expo-google-fonts/poppins';

export default function Index() {
  let [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Poppins_700Bold,
  });

  const handleGetStarted = () => {
    // Navigate to next screen
    console.log('Get started pressed');
  };

  if (!fontsLoaded) {
    return null;
  }

  return (
    <SafeAreaView className="flex-1 bg-black">
      <StatusBar barStyle="dark-content" />
      <ImageBackground
        source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/madison-lavern-4gcqRf3-f2I-unsplash-SdogJGUFc2W4YkWEjSfrsStXhsaIvq.jpg' }}
        className="flex-1 w-full h-full"
        resizeMode="cover"
      >
        <View className="flex-1 bg-white/10">
          <View className="flex-1 px-6 pt-16 pb-10">
            {/* Brand name */}
            <Text 
              className="text-base text-gray-400 text-center mb-5 tracking-widest font-bold"
              style={{ fontFamily: 'Inter_400Regular' }}
            >
              skrabble
            </Text>

            {/* Main headline */}
            <View className="mt-2">
              <Text 
                className="text-4xl text-black leading-tight"
                style={{ fontFamily: 'Poppins_700Bold' }}
              >
                set goals
              </Text>
              <Text 
                className="text-4xl text-black leading-tight"
                style={{ fontFamily: 'Poppins_700Bold' }}
              >
                stay focused.
              </Text>
            </View>

            
            <View className="flex-1" />

            
            <TouchableOpacity
              className="bg-white py-5 px-8 rounded-full items-center justify-center flex-row shadow-lg"
              onPress={handleGetStarted}
              activeOpacity={0.8}
            >
              <Text 
                className="text-base text-black mr-2"
                style={{ fontFamily: 'Inter_600SemiBold' }}
              >
                Get started
              </Text>
              <Image
                source={{ uri: 'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/45-degrees-jtLFZ48ZNm9SDP6Ga67bHvsfYJGI1o.png' }}
                className="w-5 h-5"
                resizeMode="contain"
              />
            </TouchableOpacity>
          </View>
        </View>
      </ImageBackground>
    </SafeAreaView>
  );
}