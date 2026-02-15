import { apiClient } from '../api/client';

export interface Blog {
    id: string
    title: string
    slug: string
    description?: string
    subdomain: string // Ensure this is always a string for UI safety
    customDomain?: string
    icon: string
    color: string
    posts: number
    visitors: string
    status: 'LIVE' | 'DRAFT' | 'MAINTENANCE'
    role: 'OWNER' | 'EDITOR' | 'ADMIN'
    createdAt?: string
}

export const fetchBlogs = async (): Promise<Blog[]> => {
    try {
        const response = await apiClient.get<Blog[]>('/blogs/my');
        // Backend maps to { id, title, role, slug, ... }
        // We might need to map backend props to frontend mock props if they are missing (like icon/color/stats)
        // For now, assuming backend returns basics, we might need to enrich or the UI will break on missing props.
        // Let's assume we enrich them here with defaults if missing to keep UI happy.
        return response.map(b => ({
            ...b,
            icon: b.icon || 'article',
            color: b.color || 'bg-blue-100 text-blue-600',
            posts: b.posts || 0,
            visitors: b.visitors || '0',
            status: (b.status as any)?.toUpperCase() || 'DRAFT', // Normalize status to uppercase
            subdomain: b.slug || '' // Map slug to subdomain for UI compatibility if needed
        }));
    } catch (error) {
        console.error('Failed to fetch blogs:', error);
        return [];
    }
}

export const createBlog = async (data: { title: string; slug: string; description?: string }): Promise<Blog> => {
    try {
        const response = await apiClient.post<Blog>('/blogs', data);
        return {
            ...response,
            icon: 'article',
            color: 'bg-green-100 text-green-600',
            posts: 0,
            visitors: '0',
            status: 'DRAFT',
            subdomain: response.slug || ''
        };
    } catch (error) {
        console.error('Failed to create blog:', error);
        throw error;
    }
}
