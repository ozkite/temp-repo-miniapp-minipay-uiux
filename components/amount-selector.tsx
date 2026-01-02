"use client"

import { useState } from "react"

export type DonationAmount = "0.01¢" | "0.10¢" | "0.50¢" | "1 Stable"
export type StableCoin = "cUSD" | "cEUR" | "USDT" | "USDC" | "USDD" | "GLO"
export type ConfirmSwipes = 20 | 30 | 50

interface AmountSelectorProps {
    onSelect: (amount: DonationAmount, currency: StableCoin, swipes: ConfirmSwipes) => void
}

export function AmountSelector({ onSelect }: AmountSelectorProps) {
    const [selectedAmount, setSelectedAmount] = useState<DonationAmount>("0.01¢")
    // Force USDT default
    const [selectedCurrency, setSelectedCurrency] = useState<StableCoin>("USDT")
    const [selectedSwipes, setSelectedSwipes] = useState<ConfirmSwipes>(20)

    const amounts: DonationAmount[] = ["0.01¢", "0.10¢", "0.50¢", "1 Stable"]
    const currenciesRow1: StableCoin[] = ["cUSD", "cEUR", "USDT"]
    const currenciesRow2: StableCoin[] = ["USDC", "GLO"]

    const swipeOptions: ConfirmSwipes[] = [20, 30, 50]

    const handleConfirm = () => {
        // Enforce USDT regardless of what might have been clicked (if we allowed clicking)
        onSelect(selectedAmount, "USDT", selectedSwipes)
    }

    const handleCurrencySelect = (currency: StableCoin) => {
        if (currency === "USDT") {
            setSelectedCurrency(currency);
        } else {
            // Optional: Alert user or just do nothing
            // alert("Only USDT is available at this time.");
        }
    }

    return (
        <div className="px-6 mt-8">
            <h2 className="text-xl font-bold mb-8 text-white text-center">Select Donation Amount</h2>

            <div className="space-y-8">
                {/* Amount Selection */}
                <div>
                    <h3 className="text-base font-medium mb-3 text-gray-300 text-center">Amount per swipe:</h3>
                    <div className="grid grid-cols-4 gap-2">
                        {amounts.map((amount) => (
                            <button
                                key={amount}
                                onClick={() => setSelectedAmount(amount)}
                                className={`py-3 px-2 rounded-lg font-medium transition-colors text-sm ${selectedAmount === amount ? "bg-[#FFD600] text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                            >
                                {amount}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Stablecoin Selection */}
                <div>
                    <h3 className="text-base font-medium mb-3 text-gray-300 text-center">Stablecoins:</h3>
                    <div className="flex flex-col space-y-3">
                        <div className="grid grid-cols-3 gap-3">
                            {currenciesRow1.map((currency) => (
                                <button
                                    key={currency}
                                    onClick={() => handleCurrencySelect(currency)}
                                    disabled={currency !== "USDT"}
                                    className={`py-3 px-4 rounded-lg font-medium transition-colors ${selectedCurrency === currency
                                        ? "bg-[#FFD600] text-black"
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700 opacity-50"
                                        }`}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>
                        <div className="flex justify-center space-x-3">
                            {currenciesRow2.map((currency) => (
                                <button
                                    key={currency}
                                    onClick={() => handleCurrencySelect(currency)}
                                    disabled={currency !== "USDT"}
                                    className={`py-3 px-4 rounded-lg font-medium transition-colors w-1/3 ${selectedCurrency === currency
                                        ? "bg-[#FFD600] text-black"
                                        : "bg-gray-800 text-gray-500 cursor-not-allowed border border-gray-700 opacity-50"
                                        }`}
                                >
                                    {currency}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Confirm Swipes Selection */}
                <div className="mb-8">
                    <h3 className="text-base font-medium mb-3 text-gray-300 text-center">Confirm swipes:</h3>
                    <div className="grid grid-cols-3 gap-3">
                        {swipeOptions.map((swipes) => (
                            <button
                                key={swipes}
                                onClick={() => setSelectedSwipes(swipes)}
                                className={`py-3 px-4 rounded-lg font-medium transition-colors ${selectedSwipes === swipes ? "bg-[#FFD600] text-black" : "bg-gray-700 text-gray-300 hover:bg-gray-600"
                                    }`}
                            >
                                {swipes}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Start Swiping Button */}
            <button
                onClick={handleConfirm}
                className="w-full py-4 bg-[#FFD600] hover:bg-[#E6C200] text-black font-bold rounded-lg transition-colors mt-4"
            >
                Start Swiping
            </button>
            <p className="text-white text-base text-center mt-6">
                Top your wallet with Stablecoins on Celo.
            </p>
        </div>
    )
}
