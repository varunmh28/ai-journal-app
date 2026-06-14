import { useSSO } from "@clerk/expo";
import * as AuthSession from "expo-auth-session";
import * as WebBrowser from "expo-web-browser";
import React, { useCallback, useEffect } from "react";
import { Platform } from "react-native";
import { Button } from "tamagui";

// 1. Warm-up hook for Android
export const useWarmUpBrowser = () => {
  useEffect(() => {
    if (Platform.OS !== "android") return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
};

WebBrowser.maybeCompleteAuthSession();

export default function SignInWithGoogle() {
  useWarmUpBrowser();

  const { startSSOFlow } = useSSO();

  const onPress = useCallback(async () => {
    try {
      // 🚀 THE NEW PATTERN: We don't use setActive anymore.
      // We rely on the promise resolving to confirm auth.
      const { createdSessionId, signIn, signUp } = await startSSOFlow({
        strategy: "oauth_google",
        // Ensure this matches your app.json scheme!
        redirectUrl: AuthSession.makeRedirectUri({ path: "/(tabs)" }),
      });

      // 🚀 Check if the session was created successfully
      if (createdSessionId) {
        // If createdSessionId exists, the session is already active!
        // Do NOT call setActive. The system is already signed in.
        // The RootLayout's <Stack.Protected> will automatically handle navigation.
        console.log("Successfully signed in via Google!");
      } else {
        // If createdSessionId is null but signIn is populated, 
        // handle the 'transfer' logic for returning users (as we discussed)
        if (signIn?.firstFactorVerification?.status === "transferable") {
          await signIn.create({ transfer: true });
          console.log("Transfer successful, user authenticated.");
        }
      }
    } catch (err) {
      console.error("OAuth Error:", JSON.stringify(err, null, 2));
    }
  }, [startSSOFlow]);

  return (
    <Button
      variant="outlined"
      borderColor="#904BFF"
      borderWidth={1}
      color="#904BFF"
      onPress={onPress}
    >
      Sign in with Google
    </Button>
  );
}