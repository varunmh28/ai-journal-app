import { useAuth } from '@clerk/expo';
import { Stack } from 'expo-router';
import React from 'react';
import { Spinner } from 'tamagui';



export default function Layout() {
    const {isLoaded , isSignedIn} = useAuth({treatPendingAsSignedOut: false});

    if(!isLoaded){
        return <Spinner />;
    } 

  return (
    <Stack>
        <Stack.Protected guard={isSignedIn}>
            
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />

        </Stack.Protected>


        <Stack.Protected guard={!isSignedIn}>

        <Stack.Screen 
          name="sign-in"
          options={{
              
              headerShown: false,
            }}
        />
        <Stack.Screen
          name="sign-up"
          options={{
              headerShown: false,
            }}
            />

      
     </Stack.Protected>

    </Stack>
  )
}