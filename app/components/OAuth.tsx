
import { useState } from "react";
import { useOAuth } from "@clerk/clerk-expo";
import { router } from "expo-router";
import { Alert, Image, Text, View } from "react-native";
import CustomButton from "./CustomButton";
import { icons } from "@/constants";
import { googleOAuth } from "@/lib/auth";

const OAuth = () => {
  const { startOAuthFlow } = useOAuth({ strategy: "oauth_google" });
  const [loading, setLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    if (loading) return;
    setLoading(true);

    try {
      const result = await googleOAuth(startOAuthFlow);
      console.log("OAuth result:", result);

      if (result.success) {
        // Use setTimeout to ensure navigation happens after current render cycle
        setTimeout(() => {
          if (result.isNewUser) {
            console.log("Navigating to onboarding for new user");
            router.replace("/(auth)/onboarding");
          } else {
            console.log("Navigating to home for existing user");
            router.replace("/(root)/home");
          }
        }, 100);
      } else if (result.cancelled) {
        Alert.alert("Cancelled", result.message || "Sign-in cancelled.");
      } else {
        Alert.alert("Error", result.message || "Google login failed");
      }
    } catch (error) {
      console.error("Google Sign-In Error:", error);
      Alert.alert(
        "Authentication Error", 
        "There was an issue with Google sign-in. Please try again or use email/password login."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 justify-center items-center p-6 bg-white">
      <View className="flex-row justify-center items-center w-full mb-4">
        <View className="flex-1 h-[1px] bg-gray-200" />
        <Text className="mx-3 text-gray-500 text-lg">Or</Text>
        <View className="flex-1 h-[1px] bg-gray-200" />
      </View>

      <CustomButton
        title={loading ? "Signing in..." : "Log In with Google"}
        className="w-full"
        IconLeft={() => (
          <Image source={icons.google} resizeMode="contain" className="w-5 h-5 mx-2" />
        )}
        onPress={handleGoogleSignIn}
        disabled={loading}
      />
    </View>
  );
};

export default OAuth;
