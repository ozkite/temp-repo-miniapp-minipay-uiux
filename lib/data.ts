export const categories = ["Builders", "Eco Projects", "DApps"];

export interface Project {
    id: string
    name: string
    description: string
    category: string
    imageUrl: string
    website?: string
    twitter?: string
    discord?: string
    linkedin?: string
    farcaster?: string
    github?: string
    walletAddress?: string
    // ... other fields can remain optional
    fundingGoal?: number
    fundingCurrent?: number
    likes?: number
    comments?: number
    isBookmarked?: boolean
    userHasLiked?: boolean
    userHasCommented?: boolean
    reportCount?: number
    boostAmount?: number
}
