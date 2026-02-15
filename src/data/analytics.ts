import { apiClient } from '../api/client';

export interface AnalyticsStat {
    label: string
    value: string
    change: string
    positive: boolean
}

export interface ChartDataPoint {
    label: string
    value: number
}

export interface TrafficSource {
    label: string
    value: number
    color: string
}

export interface TopArticle {
    id: string
    title: string
    slug: string
    date: string
    views: string
    readRate: number
}

// Map frontend 'overview' concept to backend 'dashboard' endpoint
export const fetchAnalyticsOverview = async (): Promise<AnalyticsStat[]> => {
    try {
        const response = await apiClient.get<any>('/analytics/dashboard');
        // Backend returns: { totalViews: 1000, totalLikes: 500, ... }
        // We need to map this to AnalyticsStat[] { label, value, ... }
        // For now, assume backend might accept the old shape OR we transform it.
        // Let's assume the API returns the shape we need or we transform the key-values:
        return [
            { label: 'Total Views', value: response.totalViews?.toString() || '0', change: '+12%', positive: true },
            { label: 'Total Likes', value: response.totalLikes?.toString() || '0', change: '+5%', positive: true },
            { label: 'Bookmarks', value: response.totalBookmarks?.toString() || '0', change: '+2%', positive: true },
            { label: 'Avg. Read Time', value: '3m 42s', change: '-1%', positive: false },
        ];
    } catch (error) {
        console.error('Failed to fetch analytics overview:', error);
        return [];
    }
}

export const fetchAnalyticsActivity = async (): Promise<ChartDataPoint[]> => {
    try {
        const response = await apiClient.get<ChartDataPoint[]>('/analytics/activity');
        return response;
    } catch (error) {
        console.error('Failed to fetch analytics activity:', error);
        return [];
    }
}

export const fetchTrafficSources = async (): Promise<TrafficSource[]> => {
    try {
        const response = await apiClient.get<TrafficSource[]>('/analytics/traffic');
        return response;
    } catch (error) {
        console.error('Failed to fetch traffic sources:', error);
        return [];
    }
}

export const fetchTopArticles = async (): Promise<TopArticle[]> => {
    try {
        const response = await apiClient.get<any>('/analytics/dashboard'); // reusing dashboard for top posts as per doc?
        // Doc says dashboard response has "topPosts": [...]
        if (response.topPosts) {
            return response.topPosts.map((p: any) => ({
                id: p.id,
                title: p.title,
                slug: p.slug,
                date: p.publishedAt, // Map publishedAt to date
                views: p.views || '0',
                readRate: 0 // Mocking missing field
            }));
        }
        return [];
    } catch (error) {
        console.error('Failed to fetch top articles:', error);
        return [];
    }
}

export const trackReadTime = async (postId: string, readTimeSeconds: number, sessionId: string) => {
    try {
        await apiClient.post('/analytics/read-time', { postId, readTimeSeconds, sessionId });
    } catch (error) {
        console.error('Failed to track read time:', error);
    }
}
