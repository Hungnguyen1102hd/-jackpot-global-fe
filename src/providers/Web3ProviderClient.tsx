'use client';

import * as React from 'react';
import {
    RainbowKitProvider,
    getDefaultConfig,
    darkTheme,
} from '@rainbow-me/rainbowkit';
import { bsc, bscTestnet } from 'wagmi/chains';
import { WagmiProvider, createStorage, cookieStorage } from 'wagmi';
import { QueryClientProvider, QueryClient } from '@tanstack/react-query';
import '@rainbow-me/rainbowkit/styles.css';

const config = getDefaultConfig({
    appName: 'Jackpot Global FE',
    projectId: '1732d1f8-809d-4c14-a64c-bab5ea87403a', // Replace with your WalletConnect Project ID
    chains: [bsc, bscTestnet],
    ssr: true, // Enable Server-Side Rendering support
    storage: createStorage({
        storage: cookieStorage,
    }),
});

const queryClient = new QueryClient();

export default function Web3ProviderClient({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = React.useState(false);

    React.useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <WagmiProvider config={config}>
            <QueryClientProvider client={queryClient}>
                <RainbowKitProvider
                    theme={darkTheme({
                        accentColor: '#39FF14', // Cyberpunk Neon Green
                        accentColorForeground: 'black',
                        borderRadius: 'none', // Sharp blocks instead of rounded defaults
                        fontStack: 'system',
                        overlayBlur: 'small',
                    })}
                >
                    {mounted ? children : null}
                </RainbowKitProvider>
            </QueryClientProvider>
        </WagmiProvider>
    );
}
