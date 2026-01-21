import { apiClient } from '../api/client';

export interface Blog {
    id: number
    name: string
    subdomain: string
    customDomain?: string
    icon: string
    color: string
    posts: number
    visitors: string
    status: 'Live' | 'Draft' | 'Maintenance'
    role: 'Owner' | 'Editor' | 'Admin'
}

// NOTE: Static 'blogs' array removed in favor of API calls.

export const fetchBlogs = async (): Promise<Blog[]> => {
    try {
        const response = await apiClient.get<Blog[]>('/blogs'); // Assuming endpoint /blogs exists for my blogs
        return response;
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return [];
    }
}
