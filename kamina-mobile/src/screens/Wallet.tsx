// src/screens/Wallet.tsx
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, RefreshControl } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { useNavigation } from '@react-navigation/native';

interface WalletBalance {
  symbol: string;
  amount: string;
  value: string;
  change: string;
}

export function WalletScreen() {
  const navigation = useNavigation();
  const [refreshing, setRefreshing] = useState(false);
  const [balances, setBalances] = useState<WalletBalance[]>([
    { symbol: 'KMINA', amount: '1,250.75', value: '$12,507.50', change: '+2.5%' },
    { symbol: 'ETH', amount: '4.25', value: '$8,245.75', change: '+1.2%' },
    { symbol: 'BTC', amount: '0.125', value: '$4,125.30', change: '-0.5%' },
    { symbol: 'USDC', amount: '5,000.00', value: '$5,000.00', change: '0.0%' },
  ]);

  const [totalValue, setTotalValue] = useState('$29,878.55');

  const onRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setRefreshing(false);
  };

  const handleSend = () => {
    navigation.navigate('Trading' as never);
  };

  const handleReceive = () => {
    Alert.alert('Receive', 'Your wallet address: 0x742...d35e1');
  };

  const handleAIAssistant = () => {
    navigation.navigate('AIAssistant' as never);
  };

  return (
    <LinearGradient
      colors={['#667eea', '#764ba2']}
      style={styles.container}
    >
      <ScrollView 
        style={styles.scrollView}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>My Wallet</Text>
          <TouchableOpacity onPress={() => navigation.navigate('Settings' as never)}>
            <Text style={styles.settingsIcon}>⚙️</Text>
          </TouchableOpacity>
        </View>

        {/* Total Balance */}
        <View style={styles.balanceCard}>
          <Text style={styles.balanceLabel}>Total Balance</Text>
          <Text style={styles.balanceAmount}>{totalValue}</Text>
          <Text style={styles.balanceChange}>+3.2% today</Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actions}>
          <TouchableOpacity style={styles.actionButton} onPress={handleSend}>
            <Text style={styles.actionIcon}>📤</Text>
            <Text style={styles.actionText}>Send</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleReceive}>
            <Text style={styles.actionIcon}>📥</Text>
            <Text style={styles.actionText}>Receive</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton} onPress={handleAIAssistant}>
            <Text style={styles.actionIcon}>🤖</Text>
            <Text style={styles.actionText}>AI Assistant</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.actionButton}>
            <Text style={styles.actionIcon}>📊</Text>
            <Text style={styles.actionText}>Stake</Text>
          </TouchableOpacity>
        </View>

        {/* Assets List */}
        <View style={styles.assetsSection}>
          <Text style={styles.sectionTitle}>My Assets</Text>
          {balances.map((asset, index) => (
            <View key={index} style={styles.assetItem}>
              <View style={styles.assetLeft}>
                <View style={styles.assetIcon}>
                  <Text style={styles.assetSymbol}>{asset.symbol}</Text>
                </View>
                <View>
                  <Text style={styles.assetName}>{asset.symbol}</Text>
                  <Text style={styles.assetAmount}>{asset.amount}</Text>
                </View>
              </View>
              <View style={styles.assetRight}>
                <Text style={styles.assetValue}>{asset.value}</Text>
                <Text style={[
                  styles.assetChange,
                  asset.change.startsWith('+') ? styles.positive : styles.negative
                ]}>
                  {asset.change}
                </Text>
              </View>
            </View>
          ))}
        </View>

        {/* Recent Activity */}
        <View style={styles.activitySection}>
          <Text style={styles.sectionTitle}>Recent Activity</Text>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>🔄</Text>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Swapped ETH to KMINA</Text>
              <Text style={styles.activityTime}>2 hours ago</Text>
            </View>
            <Text style={styles.activityAmount}>+1,200 KMINA</Text>
          </View>
          <View style={styles.activityItem}>
            <Text style={styles.activityIcon}>📥</Text>
            <View style={styles.activityDetails}>
              <Text style={styles.activityTitle}>Received USDC</Text>
              <Text style={styles.activityTime}>5 hours ago</Text>
            </View>
            <Text style={styles.activityAmount}>+5,000 USDC</Text>
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
  scrollView: {
    flex: 1,
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
  },
  settingsIcon: {
    fontSize: 24,
  },
  balanceCard: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 20,
    borderRadius: 15,
    alignItems: 'center',
    marginBottom: 25,
  },
  balanceLabel: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 16,
    marginBottom: 5,
  },
  balanceAmount: {
    color: 'white',
    fontSize: 36,
    fontWeight: 'bold',
    marginBottom: 5,
  },
  balanceChange: {
    color: '#4CAF50',
    fontSize: 14,
    fontWeight: '600',
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 30,
  },
  actionButton: {
    alignItems: 'center',
    flex: 1,
    marginHorizontal: 5,
  },
  actionIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  actionText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '600',
  },
  assetsSection: {
    marginBottom: 25,
  },
  sectionTitle: {
    color: 'white',
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15,
  },
  assetItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  assetLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  assetIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  assetSymbol: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 12,
  },
  assetName: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
  },
  assetAmount: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: 14,
  },
  assetRight: {
    alignItems: 'flex-end',
  },
  assetValue: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  assetChange: {
    fontSize: 12,
    fontWeight: '600',
  },
  positive: {
    color: '#4CAF50',
  },
  negative: {
    color: '#f44336',
  },
  activitySection: {
    marginBottom: 30,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
  },
  activityIcon: {
    fontSize: 20,
    marginRight: 12,
  },
  activityDetails: {
    flex: 1,
  },
  activityTitle: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
    marginBottom: 2,
  },
  activityTime: {
    color: 'rgba(255,255,255,0.6)',
    fontSize: 12,
  },
  activityAmount: {
    color: '#4CAF50',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
