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
    id: number
    title: string
    slug: string
    date: string
    views: string
    readRate: number
}

export const fetchAnalyticsOverview = async (): Promise<AnalyticsStat[]> => {
    try {
        const response = await apiClient.get<AnalyticsStat[]>('/analytics/overview');
        return response;
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
        const response = await apiClient.get<TopArticle[]>('/analytics/top-articles');
        return response;
    } catch (error) {
        console.error('Failed to fetch top articles:', error);
        return [];
    }
}
