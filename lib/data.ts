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
    fundingGoal?: number
    fundingCurrent?: number
    likes?: number
    comments?: number
    walletAddress?: string
    isBookmarked?: boolean
    userHasLiked?: boolean
    userHasCommented?: boolean
    reportCount?: number
    boostAmount?: number
}

export const categories = ["See All", "Builders", "Eco Projects", "DApps"];
