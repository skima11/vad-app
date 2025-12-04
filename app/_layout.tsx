import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useColorScheme } from '@/hooks/use-color-scheme';
import { auth } from '../firebase/auth'; // Firebase Auth
import { useEffect, useState } from 'react';
import { useRouter } from 'expo-router';
import { doc, getDoc } from "firebase/firestore";
import { db } from '../firebase/firestore'; // Firebase Firestore

export const unstable_settings = {
  anchor: '(tabs)', // Navigates to tabs once authenticated
};

export default function RootLayout() {
  const colorScheme = useColorScheme();
  const [loading, setLoading] = useState(true); // Track loading state
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Track auth state
  const [profileCompleted, setProfileCompleted] = useState(false); // Track if profile is completed
  const router = useRouter();

  useEffect(() => {
    const checkAuthAndProfile = async () => {
      const user = auth.currentUser;
      if (user) {
        setIsAuthenticated(true);
        
        // Fetch the user's profile from Firestore
        const userRef = doc(db, "users", user.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          // Check if profile is set up (e.g., check if the username exists)
          setProfileCompleted(!!userDoc.data().username);
        } else {
          setProfileCompleted(false);
        }

        setLoading(false);
      } else {
        setIsAuthenticated(false);
        setLoading(false);
      }
    };

    checkAuthAndProfile();
  }, []);

  if (loading) {
    return <StatusBar style="auto" />;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        {isAuthenticated ? (
          profileCompleted ? (
            <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          ) : (
            <Stack.Screen name="auth/profileSetup" options={{ presentation: 'modal', title: 'Complete Profile' }} />
          )
        ) : (
          <>
            <Stack.Screen name="auth/register" options={{ title: 'Register' }} />
            <Stack.Screen name="auth/login" options={{ title: 'Login' }} />
          </>
        )}
        <Stack.Screen name="modal" options={{ presentation: 'modal', title: 'Modal' }} />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

