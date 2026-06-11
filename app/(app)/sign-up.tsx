import Logo from "@/components/Logo";
import { useModal } from "@/contexts/ModalContext";
import { isClerkAPIResponseError, useSignUp } from "@clerk/expo";
import type { ClerkAPIResponseError } from "@clerk/expo/types";
import { useRouter } from "expo-router";
import * as React from "react";
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

export default function SignUpScreen() {
  // ⚡ Modern Core-3 Hook returns: 'signUp' and network state tracking
  const { signUp, fetchStatus } = useSignUp();
  const router = useRouter();

  const [emailAddress, setEmailAddress] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [pendingVerification, setPendingVerification] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const { showModal } = useModal();

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!signUp) return;
    setIsLoading(true);

    try {
      // ⚡ Step 1: Initialize creation with credentials sequentially
      await signUp.create({
        emailAddress,
        password,
      });

      // Send user an email with verification code
      // ⚡ CLERK CORE-3 DOCS SPECIFICATION: Sends the email OTP code
      await signUp.verifications.sendEmailCode();

      // Set 'pendingVerification' to true to display second form
      setPendingVerification(true);
    } catch (err) {
      const clerkError = isClerkAPIResponseError(err)
        ? (err as ClerkAPIResponseError)
        : null;

      showModal({
        type: "alert",
        title: "Registration Error",
        description: 
          clerkError?.errors[0]?.longMessage ||
          clerkError?.errors[0]?.message || 
          "Whoops an error occurred, please try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!signUp) return;
    setIsLoading(true);

    try {
      // ⚡ Step 2: Attempt verification directly off the hook instance
      await signUp.verifications.verifyEmailCode({
        code: code,
      });

      // ⚡ Step 3: Check reactive status directly and finalize session
      if (signUp.status === "complete") {
        await signUp.finalize({
          navigate: () => router.replace("/"),
        });
      } else {
        console.error("Additional verification steps required:", JSON.stringify(signUp, null, 2));
      }
    } catch (err) {
      const clerkError = isClerkAPIResponseError(err)
        ? (err as ClerkAPIResponseError)
        : null;

      showModal({
        type: "alert",
        title: "Verification Failed",
        description:
          clerkError?.errors[0]?.longMessage ||
          clerkError?.errors[0]?.message ||
          "Invalid verification code, please try again!",
      });
    } finally {
      setIsLoading(false);
    }
  };

  // Track shared network status across both interactive buttons
  const isButtonDisabled = fetchStatus === "fetching" || isLoading;

  if (pendingVerification) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <ScrollView
          flex={1}
          bg="$background"
          contentContainerStyle={{ flex: 1 }}
        >
          <YStack
            flex={1}
            p="$4"
            gap="$4"
            style={{ justifyContent: "center", minHeight: "100%" }}
          >
            <Logo />

            <YStack gap="$2" style={{ alignItems: "center" }}>
              <H1 color="$color" style={{ textAlign: "center" }}>
                Verify Your Email
              </H1>
              <Paragraph
                color="$color"
                opacity={0.7}
                style={{ textAlign: "center" }}
              >
                We&apos;ve sent a verification code to {emailAddress}
              </Paragraph>
            </YStack>

            {/* ⚡ Updated elevate to numerical elevation=4 */}
            <Card elevation={4} padding="$4" gap="$2" backgroundColor="$background">
              <YStack gap="$2">
                <YStack gap="$2">
                  <Label color="$color">Verification Code</Label>
                  <Input
                    value={code}
                    placeholder="Enter verification code"
                    onChangeText={setCode}
                    borderColor="$borderColor"
                    focusStyle={{
                      borderColor: "$purple10",
                    }}
                    keyboardType="numeric"
                    autoComplete="one-time-code"
                  />
                </YStack>

                <Spacer />

                <Button
                  size="$4"
                  bg="#904BFF"
                  color="white"
                  borderColor="#904BFF"
                  onPress={onVerifyPress}
                  disabled={isButtonDisabled}
                  opacity={isButtonDisabled ? 0.5 : 1}
                >
                  {fetchStatus === "fetching" ? "Verifying..." : "Verify Email"}
                </Button>
              </YStack>
            </Card>

            <XStack
              gap="$2"
              style={{ justifyContent: "center", alignItems: "center" }}
            >
              <Paragraph color="$color" opacity={0.7}>
                Didn&apos;t receive the code?
              </Paragraph>
              <Button
                variant="outlined"
                size="$3"
                borderColor="#904BFF"
                color="#904BFF"
                onPress={() => setPendingVerification(false)}
              >
                Resend
              </Button>
            </XStack>
          </YStack>
        </ScrollView>
      </SafeAreaView>
    );
  }

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
              Create Account
            </H1>
            <Paragraph
              color="$color"
              opacity={0.7}
              style={{ textAlign: "center" }}
            >
              Sign up to get started with your account
            </Paragraph>
          </YStack>

          {/* ⚡ Updated elevate to numerical elevation=4 */}
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
                  placeholder="Create a password"
                  onChangeText={setPassword}
                  borderColor="$borderColor"
                  focusStyle={{
                    borderColor: "$purple10",
                  }}
                />
              </YStack>

              <Spacer />

              <Button
                size="$4"
                bg="#904BFF"
                color="white"
                borderColor="#904BFF"
                onPress={onSignUpPress}
                disabled={isButtonDisabled}
                opacity={isButtonDisabled ? 0.5 : 1}
              >
                {fetchStatus === "fetching" ? "Creating Account..." : "Create Account"}
              </Button>
            </YStack>
          </Card>

          <XStack
            gap="$2"
            style={{ justifyContent: "center", alignItems: "center" }}
          >
            <Paragraph color="$color" opacity={0.7}>
              Already have an account?
            </Paragraph>

            <Button
              variant="outlined"
              size="$3"
              borderColor="#904BFF"
              color="#904BFF"
              onPress={() => router.canGoBack() && router.back()}
            >
              Sign In
            </Button>
          </XStack>
        </YStack>
      </ScrollView>
    </SafeAreaView>
  );
}