// src/screens/AIAssistant.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export function AIAssistantScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Kamina AI Assistant</Text>
      <Text style={styles.subtitle}>Coming Soon - KaminaLLM-7B Integration</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#666',
  },
});
