import { injected } from 'wagmi/connectors';
import { createConfig, http } from 'wagmi';
import { celo } from 'wagmi/chains';

export const config = createConfig({
    chains: [celo],
    connectors: [
        injected({
            target: 'metaMask',
        }),
    ],
    transports: {
        [celo.id]: http(),
    },
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
