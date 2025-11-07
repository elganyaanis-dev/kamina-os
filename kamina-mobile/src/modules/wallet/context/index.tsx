// src/modules/wallet/context/index.tsx
import React, { createContext, useContext, useState, ReactNode } from 'react';

interface WalletBalance {
  symbol: string;
  amount: string;
  value: string;
}

interface WalletContextType {
  balances: WalletBalance[];
  totalValue: string;
  refreshBalances: () => Promise<void>;
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

interface WalletProviderProps {
  children: ReactNode;
}

export function WalletProvider({ children }: WalletProviderProps) {
  const [balances, setBalances] = useState<WalletBalance[]>([
    { symbol: 'KMINA', amount: '1,250.75', value: '$12,507.50' },
    { symbol: 'ETH', amount: '4.25', value: '$8,245.75' },
    { symbol: 'BTC', amount: '0.125', value: '$4,125.30' },
  ]);

  const [totalValue, setTotalValue] = useState('$29,878.55');

  const refreshBalances = async () => {
    // Simulate API call to refresh balances
    await new Promise(resolve => setTimeout(resolve, 1000));
    // In real app, this would fetch from blockchain
  };

  return (
    <WalletContext.Provider value={{
      balances,
      totalValue,
      refreshBalances,
    }}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within a WalletProvider');
  }
  return context;
}
