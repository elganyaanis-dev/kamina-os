// src/security/BiometricLockScreen.tsx
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';

interface BiometricLockScreenProps {
  onSuccess: () => void;
}

export default function BiometricLockScreen({ onSuccess }: BiometricLockScreenProps) {
  const handleBiometricAuth = () => {
    // Simulate biometric authentication
    onSuccess();
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <View style={styles.content}>
        <Text style={styles.icon}>🔒</Text>
        <Text style={styles.title}>Secure Access</Text>
        <Text style={styles.subtitle}>Authenticate to access your wallet</Text>
        
        <TouchableOpacity style={styles.authButton} onPress={handleBiometricAuth}>
          <Text style={styles.authButtonText}>Authenticate with Biometrics</Text>
        </TouchableOpacity>
        
        <Text style={styles.hint}>Touch ID / Face ID / Pattern</Text>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  icon: {
    fontSize: 80,
    marginBottom: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
    marginBottom: 40,
    textAlign: 'center',
  },
  authButton: {
    backgroundColor: 'white',
    paddingHorizontal: 30,
    paddingVertical: 15,
    borderRadius: 25,
    marginBottom: 20,
  },
  authButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#667eea',
  },
  hint: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 14,
  },
});
