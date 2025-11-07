import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { StatusBar } from 'expo-status-bar';

// Context Providers
import { AuthProvider } from '../modules/auth/context';
import { WalletProvider } from '../modules/wallet/context';
import { ThemeProvider } from '../components/design-system/ThemeProvider';

// Screens
import { OnboardingScreen } from '../screens/Onboarding';
import { LoginScreen } from '../screens/Login';
import { WalletScreen } from '../screens/Wallet';
import { TradingScreen } from '../screens/Trading';
import { AIAssistantScreen } from '../screens/AIAssistant';
import { SettingsScreen } from '../screens/Settings';

// Security
import BiometricLockScreen from '../security/BiometricLockScreen';

const Stack = createNativeStackNavigator();

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAppReady, setIsAppReady] = useState(false);

  useEffect(() => {
    const initializeApp = async () => {
      // Check biometric auth
      const isBioAvailable = await checkBiometricAvailability();
      if (isBioAvailable) {
        const bioResult = await authenticateBiometric();
        setIsAuthenticated(bioResult);
      } else {
        setIsAuthenticated(true); // Fallback to password
      }
      setIsAppReady(true);
    };

    initializeApp();
  }, []);

  if (!isAppReady) {
    return null; // Splash screen handled by Expo
  }

  if (!isAuthenticated) {
    return <BiometricLockScreen onSuccess={() => setIsAuthenticated(true)} />;
  }

  return (
    <SafeAreaProvider>
      <ThemeProvider>
        <AuthProvider>
          <WalletProvider>
            <NavigationContainer>
              <StatusBar style="auto" />
              <Stack.Navigator
                initialRouteName="Onboarding"
                screenOptions={{
                  headerShown: false,
                  gestureEnabled: false,
                }}
              >
                <Stack.Screen name="Onboarding" component={OnboardingScreen} />
                <Stack.Screen name="Login" component={LoginScreen} />
                <Stack.Screen name="Wallet" component={WalletScreen} />
                <Stack.Screen name="Trading" component={TradingScreen} />
                <Stack.Screen name="AIAssistant" component={AIAssistantScreen} />
                <Stack.Screen name="Settings" component={SettingsScreen} />
              </Stack.Navigator>
            </NavigationContainer>
          </WalletProvider>
        </AuthProvider>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}

// Biometric helpers
async function checkBiometricAvailability(): Promise<boolean> {
  // Implementation will be added later
  return true;
}

async function authenticateBiometric(): Promise<boolean> {
  // Implementation will be added later
  return true;
}
