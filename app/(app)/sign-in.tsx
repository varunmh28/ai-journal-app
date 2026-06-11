import Logo from "@/components/Logo";
import SignInWithGoogle from "@/components/SignInWithGoogle";
import { useModal } from "@/contexts/ModalContext";
import { isClerkAPIResponseError, useSignIn } from "@clerk/expo";
import type { ClerkAPIResponseError } from "@clerk/expo/types";
import { Link, useRouter } from "expo-router";
import React, { useState } from "react";
import { SafeAreaView } from "react-native-safe-area-context";
import {
  Button,
  Card,
  H1,
  Input,
  Label,
  Paragraph,
  ScrollView,
  Spacer,
  XStack,
  YStack,
} from "tamagui";

export default function Page() {
  // ⚡ Modern Core-3 Hook returns: 'signIn' handles state reactively under-the-hood
  const { signIn, fetchStatus } = useSignIn();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { showModal } = useModal();

  // Handle the submission of the sign-in form
  const onSignInPress = async () => {
    // ⚡ Check if signIn is ready to be used
    if (!signIn) return;
    setIsLoading(true);

    try {
      // ⚡ Step 1: Initialize the attempt with the identifier
      await signIn.create({
        identifier: emailAddress,
      });

      // ⚡ Step 2: Provide the password to the existing attempt state
      await signIn.password({
        password: password,
      });

      // ⚡ Step 3: Verify the reactive status and finalize securely
      if (signIn.status === "complete") {
        await signIn.finalize({
          navigate: () => router.replace("/"),
        });
      } else {
        // Handles secondary auth steps (like MFA, user trust checks, etc.)
        console.error("Additional factors needed:", JSON.stringify(signIn, null, 2));
      }
    } catch (err) {
      const clerkError = isClerkAPIResponseError(err)
        ? (err as ClerkAPIResponseError)
        : null;

      showModal({
        type: "dialog",
        title: "Error",
        description:
          clerkError?.errors[0]?.longMessage ||
          clerkError?.errors[0]?.message ||
          "Whoops an error occurred, please try again!",
        onCancel: () => {
          setIsLoading(false);
        },
      });
    } finally {
      setIsLoading(false);
    }
  };

  // ⚡ Use 'fetchStatus' from Clerk to know if network requests are actively flying
  const isButtonDisabled = fetchStatus === "fetching" || isLoading;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <ScrollView flex={1} bg="$background" contentContainerStyle={{ flex: 1 }}>
        <YStack
          flex={1}
          p="$4"
          gap="$4"
          style={{ justifyContent: "center", minHeight: "100%" }}
        >
          <Logo />

          <YStack gap="$2" style={{ alignItems: "center" }}>
            <H1 color="$color" style={{ textAlign: "center" }}>
              Welcome
            </H1>
            <Paragraph
              color="$color"
              opacity={0.7}
              style={{ textAlign: "center" }}
            >
              Sign in to Journal.ai to continue
            </Paragraph>
          </YStack>

          <Card elevation={4} padding="$4" gap="$2" backgroundColor="$background">
            <YStack gap="$2">
              <YStack gap="$2">
                <Label color="$color">Email Address</Label>
                <Input
                  autoCapitalize="none"
                  keyboardType="email-address"
                  value={emailAddress}
                  placeholder="Enter your email"
                  onChangeText={setEmailAddress}
                  borderColor="$borderColor"
                  focusStyle={{
                    borderColor: "$purple10",
                  }}
                />
              </YStack>

              <YStack gap="$2">
                <Label color="$color">Password</Label>
                <Input
                  secureTextEntry
                  value={password}
                  placeholder="Enter your password"
                  onChangeText={setPassword}
                  borderColor="$borderColor"
                  focusStyle={{
                    borderColor: "$purple10",
                  }}
                />
              </YStack>

              <Spacer size="$2" />

              <Button
                size="$4"
                bg="#904BFF"
                color="white"
                borderColor="#904BFF"
                onPress={onSignInPress}
                disabled={isButtonDisabled}
                opacity={isButtonDisabled ? 0.5 : 1}
              >
                {fetchStatus === "fetching" ? "Signing in..." : "Sign In"}
              </Button>

              <SignInWithGoogle />
            </YStack>
          </Card>

          <XStack
            gap="$2"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph color="$color" opacity={0.7}>
              Don&apos;t have an account?
            </Paragraph>
            <Link href="/sign-up" asChild>
              <Button
                variant="outlined"
                size="$3"
                borderColor="#904BFF"
                color="#904BFF"
              >
                Sign Up
              </Button>
            </Link>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}