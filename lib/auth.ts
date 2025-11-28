// lib/auth.ts
import * as SecureStore from "expo-secure-store";
import * as Linking from "expo-linking";
import * as WebBrowser from "expo-web-browser";
import { fetchAPI } from "@/lib/fetch";

WebBrowser.maybeCompleteAuthSession();

export const tokenCache = {
  async getToken(key: string) {
    try {
      const item = await SecureStore.getItemAsync(key);
      if (__DEV__) console.log(item ? `${key} found 🔐` : `No token for ${key}`);
      return item;
    } catch (error) {
      console.error("SecureStore get error:", error);
      await SecureStore.deleteItemAsync(key);
      return null;
    }
  },

  async saveToken(key: string, value: string) {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error("SecureStore save error:", error);
    }
  },
};

// Updated Google OAuth function for Expo Go and new user redirect
export const googleOAuth = async (startOAuthFlow: any) => {
  try {
    // Redirect to onboarding for new users
    const redirectUrl = Linking.createURL("/", { scheme: "freelanceapp" });
    if (__DEV__) console.log("🔗 Redirect URL:", redirectUrl);

    const { createdSessionId, setActive, user } = await startOAuthFlow({
      redirectUrl,
    });

    if (createdSessionId && setActive) {
      await setActive({ session: createdSessionId });
      if (__DEV__) console.log("✅ Clerk session activated:", createdSessionId);
      if (__DEV__) console.log("👤 User object:", {
        id: user?.id,
        firstName: user?.firstName,
        lastName: user?.lastName,
        emailAddress: user?.primaryEmailAddress?.emailAddress
      });

      let isNewUser = false;

      try {
        // Check backend if user exists
        if (!user?.id) {
          if (__DEV__) console.log("⚠️ User ID is undefined, skipping backend check");
          isNewUser = true;
        } else {
          const userCheckResponse = await fetch(`https://quickhands-api.vercel.app/api/user/${user.id}`, { method: "GET" });
        
        if (__DEV__) console.log("User check response status:", userCheckResponse.status);

          if (userCheckResponse.status === 404) {
            // Create new user
            if (__DEV__) console.log("Creating new user in backend...");
            await fetchAPI("https://quickhands-api.vercel.app/api/user", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                name: `${user?.firstName || ""} ${user?.lastName || ""}`.trim(),
                email: user?.primaryEmailAddress?.emailAddress,
                clerkId: user?.id,
              }),
            });
            isNewUser = true;
            if (__DEV__) console.log("New user created successfully");
          } else if (userCheckResponse.ok) {
            const userData = await userCheckResponse.json();
            if (__DEV__) console.log("Existing user found:", userData);
            // Check if user has completed onboarding
            isNewUser = !userData.user?.completedOnboarding;
          }
        }
      } catch (apiError) {
        console.error("⚠️ Backend sync failed:", apiError);
        // Assume new user if backend check fails
        isNewUser = true;
        if (__DEV__) console.log("Backend unavailable, treating as new user");
      }

      return {
        success: true,
        isNewUser,
        message: isNewUser
          ? "Welcome! Your account has been created."
          : "Welcome back!",
      };
    }

    return { success: false, message: "Unable to create session during sign-in." };
  } catch (err: any) {
    if (
      err?.code === "oauth_callback_error" ||
      err?.message?.includes("cancelled") ||
      err?.message?.includes("redirect")
    ) {
      console.warn("⚠️ OAuth non-fatal:", err?.message);
      return { success: false, cancelled: true, message: "Sign-in cancelled." };
    }

    console.error("❌ OAuth unexpected error:", err);
    return {
      success: false,
      code: err?.code || "UNKNOWN",
      message: err?.message || "Unknown OAuth error occurred.",
    };
  }
};
