
import { apiClient } from '../api/client';

export interface DashboardStat {
    label: string
    value: string
    trend?: string
    trendType?: 'positive' | 'negative' | 'neutral'
    sublabel?: string
    progress?: number
    chartBars?: number[] // For the bar chart view
    users?: string[] // abbreviations or initials
}

export interface ActivityItem {
    id: number
    icon: string
    color: string
    user: string
    action: string
    target: string
    time: string
}

export const fetchDashboardStats = async (): Promise<DashboardStat[]> => {
    try {
        const response = await apiClient.get<DashboardStat[]>('/dashboard/stats');
        return response;
    } catch (error) {
        console.error('Failed to fetch dashboard stats:', error);
        return [];
    }
}

export const fetchDashboardActivity = async (): Promise<ActivityItem[]> => {
    try {
        const response = await apiClient.get<ActivityItem[]>('/dashboard/activities');
        return response;
    } catch (error) {
        console.error('Failed to fetch dashboard activity:', error);
        return [];
    }
}

export const seoScore = 88 // Keeping static for now or should move to API?
export const topTags = ['#Minimalism', '#Architecture', '#Productivity', '#Design'] // Keeping static or move to API?
// Assuming these might also come from API eventually, but let's keep them static if no endpoint was defined for them explicitly.
// Or effectively, I should just assume they are part of "stats" or create new fetches.
// Given Documentation.md didn't explicitly have "seoScore", I'll leave them as consts if the component uses them directly,
// but actually, 'topTags' might be typically fetched.
// For now, I'll update 'topTags' to be a fetch if possible, or leave as is if not critical.
// Actually, I'll leave them for now to minimize breakage if I'm not sure where they come from.
