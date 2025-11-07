// src/screens/Login.tsx
import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

export function LoginScreen() {
  const navigation = useNavigation();
  const [walletAddress, setWalletAddress] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleWebAuthnLogin = async () => {
    if (!walletAddress) {
      Alert.alert('Error', 'Please enter your wallet address');
      return;
    }

    setIsLoading(true);
    
    try {
      // Simulate WebAuthn authentication
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Navigate to wallet on success
      navigation.navigate('Wallet' as never);
    } catch (error) {
      Alert.alert('Login Failed', 'WebAuthn authentication failed');
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateWallet = () => {
    Alert.alert('Coming Soon', 'Wallet creation feature will be available soon');
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.header}>
          <Text style={styles.title}>Welcome Back</Text>
          <Text style={styles.subtitle}>Secure login with WebAuthn</Text>
        </View>

        <View style={styles.form}>
          <TextInput
            style={styles.input}
            placeholder="Enter your wallet address"
            placeholderTextColor="#999"
            value={walletAddress}
            onChangeText={setWalletAddress}
            autoCapitalize="none"
            autoCorrect={false}
          />

          <TouchableOpacity 
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleWebAuthnLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Authenticating...' : '🔐 Login with WebAuthn'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={styles.createWalletButton}
            onPress={handleCreateWallet}
          >
            <Text style={styles.createWalletText}>Create New Wallet</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.features}>
          <Text style={styles.featuresTitle}>Why Kamina OS?</Text>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>⚡</Text>
            <Text style={styles.featureText}>Biometric Authentication</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🔒</Text>
            <Text style={styles.featureText}>Zero-Trust Security</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureIcon}>🌐</Text>
            <Text style={styles.featureText}>Cross-Platform</Text>
          </View>
        </View>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    padding: 20,
  },
  header: {
    alignItems: 'center',
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255,255,255,0.8)',
  },
  form: {
    marginBottom: 40,
  },
  input: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
    marginBottom: 20,
    fontSize: 16,
  },
  loginButton: {
    backgroundColor: '#4CAF50',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 15,
  },
  loginButtonDisabled: {
    backgroundColor: '#81C784',
  },
  loginButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: 'bold',
  },
  createWalletButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  createWalletText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  features: {
    alignItems: 'center',
  },
  featuresTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 8,
  },
  featureIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  featureText: {
    fontSize: 16,
    color: 'white',
  },
});
