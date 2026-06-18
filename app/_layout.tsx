import '@/polyfills';
import '../tamagui.generated.css';

import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Slot } from 'expo-router';
import { useColorScheme } from 'react-native';
import { TamaguiProvider } from 'tamagui';

import { ModalProvider } from '@/contexts/ModalContext';
import { ClerkProvider } from "@clerk/expo";
import { tokenCache } from '@clerk/expo/token-cache';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { tamaguiConfig } from '../tamagui.config';

// import { Platform } from 'react-native'

// if (Platform.OS === 'web' || typeof window !== 'undefined') {
//   const rn = require('react-native');
//   if (!rn.TurboModuleRegistry) {
//     rn.TurboModuleRegistry = {
//       get: () => null,
//       getEnforcing: () => null,
//     };
//   }
// }

export default function RootLayout() {
  const colorScheme = useColorScheme()
  const publishableKey = process.env.EXPO_PUBLIC_CLERK_PUBLISHABLE_KEY!
//const  publishableKey="pk_test_YnVzeS1vY3RvcHVzLTMwLmNsZXJrLmFjY291bnRzLmRldiQ"

if (!publishableKey) {
  throw new Error('Add your Clerk Publishable Key to the .env file')
}
  return (
    <SafeAreaProvider>
   <ClerkProvider tokenCache={tokenCache} publishableKey={publishableKey}>
    


    <TamaguiProvider config={tamaguiConfig} defaultTheme={colorScheme!}>
        {/* <PortalProvider shouldAddRootHost> */}
      <ModalProvider>

      <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>

      {/* <ClerkLoaded> */}
        <Slot />
    {/* </ClerkLoaded> */}
      </ThemeProvider>
      </ModalProvider>
      {/* </PortalProvider> */}
    </TamaguiProvider>
    </ClerkProvider>
    </SafeAreaProvider>
  )
}