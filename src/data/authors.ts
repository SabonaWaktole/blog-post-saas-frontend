import { apiClient } from '../api/client';

export interface AuthorProfile {
    id: string
    name: string
    avatar: string | null
    role: string
    bio: string
    location: string
    stats: {
        articles: number
        following: number
        followers: number
    }
    website?: string
    twitter?: string
    github?: string
}

export const fetchAuthorById = async (id: string): Promise<AuthorProfile | undefined> => {
    try {
        const response = await apiClient.get<AuthorProfile>(`/authors/${id}/profile`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch author ${id}:`, error);
        // Return dummy data if API fails 404 for now to prevent crash? 
        // Or just undefined.
        return undefined;
    }
}
