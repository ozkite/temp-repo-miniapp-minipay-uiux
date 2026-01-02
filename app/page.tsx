'use client';

import { useState, useEffect } from 'react';
import { useAccount, useConnect, useDisconnect, useWriteContract, useWaitForTransactionReceipt } from 'wagmi';
import { injected } from 'wagmi/connectors';
import { parseEther } from 'viem';
import { Loader2 } from 'lucide-react';

import { isMiniPay } from '../lib/minipay-connector';
import { shuffleCards } from '../utils/shuffle-cards';
import { categories, type Project } from '../lib/data';
import { StarryBackground } from '@/components/starry-background';
import { ToggleMenu } from '@/components/toggle-menu';
import { AmountSelector, type DonationAmount, type StableCoin, type ConfirmSwipes } from '@/components/amount-selector';
import { CategoryMenu } from '@/components/category-menu';
import { ProjectCard } from '@/components/project-card';
import { CategorySection } from '@/components/category-section';

// Contract Addresses
const USDT_ADAPTER_ADDRESS = "0x0e2a3e05bc9a16f5292ddf5e1cD6D6A887483D5e"; // Provided in prompt
const USDT_ADDRESS = "0x48065fbBE25f71C9282dd5222dEFa1B3D5610b05"; // Celo USDT
const CUSD_ADDRESS = "0x765DE816845861e75A25fCA122bb6898B8B1282a"; // Celo cUSD

// ABI for SwipeDonation/Adapter (donate function)
const donationAbi = [
  {
    inputs: [
      { internalType: "address", name: "token", type: "address" },
      { internalType: "address", name: "recipient", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "donate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

// ERC20 ABI for Approve
const erc20Abi = [
  {
    constant: false,
    inputs: [
      { name: "_spender", type: "address" },
      { name: "_value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ name: "", type: "bool" }],
    payable: false,
    stateMutability: "nonpayable",
    type: "function",
  },
] as const;

export default function Home() {
  const { address, isConnected } = useAccount();
  const { connect } = useConnect();
  const { disconnect } = useDisconnect();

  const [projects, setProjects] = useState<Project[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  const [viewMode, setViewMode] = useState<"swipe" | "list">("swipe");
  const [donationAmount, setDonationAmount] = useState<DonationAmount | null>(null);
  const [donationCurrency, setDonationCurrency] = useState<StableCoin>("cUSD");
  const [confirmSwipes, setConfirmSwipes] = useState<ConfirmSwipes>(20);
  const [selectedCategory, setSelectedCategory] = useState("See All");

  // Load and shuffle project data
  useEffect(() => {
    const loadProjects = async () => {
      try {
        setLoading(true);
        // Load JSON files
        const kCardsModule = await import('../lib/k_cards.json');
        const bCardsModule = await import('../lib/b_cards.json');
        const eCardsModule = await import('../lib/e_cards.json');

        // Handle both default export and direct array
        const kCards = (kCardsModule.default || kCardsModule) as any[];
        const bCards = (bCardsModule.default || bCardsModule) as any[];
        const eCards = (eCardsModule.default || eCardsModule) as any[];

        // Normalize data to fit Project interface
        const normalize = (items: any[], category: string) => items.map((item, idx) => ({
          id: item.id || `${category}-${idx}`,
          name: item["Name of Project"] || item.name || "Unknown",
          description: item["Description of Project"] || item.bio || item.description || "",
          category: item.Category || category, // Use provided category or fallback
          imageUrl: item["URL to Logo"] || item.image || "NA",
          website: item.Website || item.website || "NA",
          twitter: item.Twitter || item.twitter || "NA",
          walletAddress: item.wallet || item.walletAddress || "0x0000000000000000000000000000000000000000", // Fallback
          ...item
        }));

        const normalizedK = normalize(kCards, "DApps");
        const normalizedB = normalize(bCards, "Builders");
        const normalizedE = normalize(eCards, "Eco Projects");

        // Combine and shuffle all cards
        const allCards = [...normalizedK, ...normalizedB, ...normalizedE];
        const shuffledCards = shuffleCards(allCards);

        setProjects(shuffledCards);
        setLoading(false);
      } catch (error) {
        console.error('Error loading project data:', error);
        setLoading(false);
      }
    };

    loadProjects();
  }, []);

  // Check for MiniPay and auto-connect
  useEffect(() => {
    if (isMiniPay() && !isConnected) {
      connect({ connector: injected({ target: 'metaMask' }) });
    }
  }, [isConnected, connect]);

  // Handle Amount Selection
  const handleAmountSelect = (amount: DonationAmount, currency: StableCoin, swipes: ConfirmSwipes) => {
    setDonationAmount(amount);
    setDonationCurrency(currency);
    setConfirmSwipes(swipes);
  };

  // Filter projects by category for swipe mode
  const filteredProjects = selectedCategory === "See All"
    ? projects
    : projects.filter(p => p.category === selectedCategory || (selectedCategory === "Builders" && p.category === "Regeneration"));

  // Donation Contract Logic
  const { writeContractAsync } = useWriteContract();

  const handleSwipeRightUI = () => {
    // Just move UI without donating (called after donation success)
    if (currentIndex < filteredProjects.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0); // Loop
    }
  };

  const handleDonate = async (project: Project, forceAmount?: number) => {
    if (!isConnected || !address) {
      alert("Please connect your wallet first.");
      connect({ connector: injected({ target: 'metaMask' }) });
      return;
    }

    const amountStr = donationAmount?.split(" ")[0].replace(/[^0-9.]/g, "") || "0";
    const amount = forceAmount || parseFloat(amountStr);

    if (!amount || amount <= 0) {
      alert("Invalid donation amount");
      return;
    }

    // Determine token address
    let tokenAddr = CUSD_ADDRESS as `0x${string}`;
    if (donationCurrency === "USDT") tokenAddr = USDT_ADDRESS as `0x${string}`;

    try {
      // 1. Approve (Optimistic)
      const weiAmount = parseEther(amount.toString());

      await writeContractAsync({
        address: tokenAddr,
        abi: erc20Abi,
        functionName: "approve",
        args: [USDT_ADAPTER_ADDRESS, weiAmount],
      });

      // 2. Donate
      await writeContractAsync({
        address: USDT_ADAPTER_ADDRESS,
        abi: donationAbi,
        functionName: "donate",
        args: [tokenAddr, project.walletAddress as `0x${string}`, weiAmount],
      });

      // Success UI update (mocked)
      alert(`Donated ${amount} ${donationCurrency} to ${project.name}!`);

      // Move to next card if swiping
      if (viewMode === "swipe") {
        handleSwipeRightUI();
      }

    } catch (e) {
      console.error("Donation failed:", e);
      alert("Transaction failed. ensure you have balance and approved.");
    }
  };

  const handleSwipeRight = () => {
    if (filteredProjects[currentIndex]) {
      handleDonate(filteredProjects[currentIndex]);
    }
  };

  const handleSwipeLeft = () => {
    if (currentIndex < filteredProjects.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      setCurrentIndex(0);
    }
  };

  const handleRewind = () => {
    if (currentIndex > 0) setCurrentIndex(currentIndex - 1);
  };

  // Render List View Projects
  const renderListView = () => {
    return (
      <div className="pt-20 pb-20 px-0">
        {categories.filter(c => c !== "See All").map(cat => {
          let catProjects = projects.filter(p => p.category === cat);
          if (cat === "Eco Projects") catProjects = projects.filter(p => ["Nature", "Climate Action", "Regeneration"].includes(p.category));
          if (cat === "DApps") catProjects = projects.filter(p => p.category === "DApps" || p.category === "DeFi" || p.category === "Social Impact");

          if (catProjects.length === 0) return null;

          return (
            <CategorySection
              key={cat}
              category={cat}
              projects={catProjects}
              onDonate={(p, amt) => handleDonate(p, amt || 5)}
            />
          );
        })}
      </div>
    );
  }

  return (
    <main className="flex min-h-screen flex-col font-sans text-white overflow-hidden relative selection:bg-yellow-500/30">
      <StarryBackground />

      {/* Header */}
      <div className="fixed top-0 w-full z-40 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        <div className="flex flex-col items-center py-2 px-4">
          <h1 className="text-xl font-bold font-mono tracking-tighter" style={{ fontFamily: "Pixelify Sans, monospace" }}>SwipePad</h1>
          {isConnected && (
            <div className="flex items-center space-x-2 mt-1">
              <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
              <span className="text-xs text-gray-400">{address?.slice(0, 6)}...{address?.slice(-4)}</span>
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 w-full max-w-md mx-auto relative pt-16">
        <ToggleMenu viewMode={viewMode} setViewMode={setViewMode} large={donationAmount === null} />

        {loading ? (
          <div className="flex items-center justify-center h-[60vh]">
            <Loader2 className="w-10 h-10 animate-spin text-yellow-400" />
            <span className="ml-2">Loading Projects...</span>
          </div>
        ) : (
          <>
            {viewMode === "swipe" ? (
              <>
                {donationAmount === null ? (
                  <AmountSelector onSelect={handleAmountSelect} />
                ) : (
                  <div className="h-full flex flex-col">
                    <CategoryMenu
                      selectedCategory={selectedCategory}
                      setSelectedCategory={setSelectedCategory}
                      setCurrentProjectIndex={() => setCurrentIndex(0)}
                    />

                    <div className="px-4 pb-2 flex justify-between items-center text-sm">
                      <span className="text-gray-400">Donating: <span className="text-yellow-400 font-bold">{donationAmount} {donationCurrency}</span></span>
                      <button onClick={() => setDonationAmount(null)} className="text-xs text-gray-500 underline">Change</button>
                    </div>

                    <div className="flex-1 px-4 flex items-center justify-center pb-20">
                      {filteredProjects.length > 0 && filteredProjects[currentIndex] ? (
                        <div className="w-full max-w-sm aspect-[3/4]">
                          <ProjectCard
                            project={filteredProjects[currentIndex]}
                            viewMode="swipe"
                            onSwipeLeft={handleSwipeLeft}
                            onSwipeRight={handleSwipeRight}
                            onRewind={currentIndex > 0 ? handleRewind : undefined}
                            donationAmount={donationAmount}
                            donationCurrency={donationCurrency}
                          />
                        </div>
                      ) : (
                        <div className="text-center text-gray-500">No projects found in this category.</div>
                      )}
                    </div>
                  </div>
                )}
              </>
            ) : (
              renderListView()
            )}
          </>
        )}
      </div>
    </main>
  );
}
