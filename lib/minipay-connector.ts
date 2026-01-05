import { injected, walletConnect } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';
import { celo } from 'wagmi/chains';
import { getDefaultConfig } from 'connectkit';

const projectId = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID;

if (!projectId) {
    throw new Error('NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID is not set');
}

const connectKitConfig = getDefaultConfig({
    appName: 'SwipePad MiniPay',
    walletConnectProjectId: projectId,
    chains: [celo],
    connectors: [
        injected({
            target: 'metaMask',
        }),
        walletConnect({
            projectId,
            metadata: {
                name: 'SwipePad MiniPay',
                description: 'Swipe through ReFi projects on MiniPay',
                url: 'https://minipay.swipepad.xyz',
                icons: ['https://minipay.swipepad.xyz/icon.png'],
            },
        }),
    ],
    transports: {
        [celo.id]: http(),
    },
});

export const config = createConfig({
    ...connectKitConfig,
    ssr: true,
});

export const isMiniPay = () => {
    if (typeof window === 'undefined') return false;
    return window.ethereum?.isMiniPay === true;
};

declare global {
    interface Window {
        ethereum?: any;
    }
}
