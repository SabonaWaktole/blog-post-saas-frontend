
import { apiClient } from '../api/client';

export interface AuthorProfile {
    id: number
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
}

export const fetchAuthorById = async (id: number): Promise<AuthorProfile | undefined> => {
    try {
        const response = await apiClient.get<AuthorProfile>(`/authors/${id}/profile`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch author ${id}:`, error);
        return undefined;
    }
}
