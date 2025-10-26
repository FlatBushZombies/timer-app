import { images } from "@/constants"
import { View, Text, Image, Dimensions } from "react-native"
import Swiper from "react-native-swiper"

const { width } = Dimensions.get("window")

interface OnboardingSlide {
  id: number
  image: string
  title: string
  description: string
}

const slides: OnboardingSlide[] = [
  {
    id: 1,
    image: images.achievement,
    title: "Set meaningful goals",
    description: "Define your wellness journey with personalized goals that inspire and motivate you every day.",
  },
  {
    id: 2,
    image: images.focused,
    title: "Stay focused, stay present",
    description: "Build lasting habits with mindful practices that keep you centered and on track.",
  },
  {
    id: 3,
    image: images.sleep,
    title: "Track your progress",
    description: "Celebrate every milestone and watch your transformation unfold with detailed insights.",
  },
]

const OnboardingCarousel = () => {
  return (
    <View className="h-[480px] mb-8">
      <Swiper
        loop={false}
        dot={<View className="w-2 h-2 rounded-full bg-gray-300 mx-1" />}
        activeDot={<View className="w-8 h-2 rounded-full bg-amber-500 mx-1" />}
        paginationStyle={{
          bottom: 10,
        }}
      >
        {slides.map((slide) => (
          <View key={slide.id} className="flex-1 items-center justify-center px-8">
            {/* Illustration */}
            <View className="w-72 h-72 items-center justify-center mb-6">
              <Image source={{ uri: slide.image }} className="w-full h-full" resizeMode="contain" />
            </View>

            {/* Title */}
            <Text className="text-2xl text-center text-gray-900 mb-3" style={{ fontFamily: "Poppins_700Bold" }}>
              {slide.title}
            </Text>

            {/* Description */}
            <Text
              className="text-base text-center text-gray-600 leading-relaxed px-4"
              style={{ fontFamily: "Inter_400Regular" }}
            >
              {slide.description}
            </Text>
          </View>
        ))}
      </Swiper>
    </View>
  )
}

export default OnboardingCarousel
