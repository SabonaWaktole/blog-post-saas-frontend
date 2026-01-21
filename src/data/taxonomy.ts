
import { apiClient } from '../api/client';

export interface Category {
    id: number
    name: string
    slug: string
    description?: string
    parentId?: number | null
    postCount: number
}

export interface Tag {
    id: number
    name: string
    slug: string
    postCount: number
}

export const fetchCategories = async (): Promise<Category[]> => {
    try {
        const response = await apiClient.get<Category[]>('/categories');
        return response;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export const fetchTags = async (): Promise<Tag[]> => {
    try {
        const response = await apiClient.get<Tag[]>('/tags');
        return response;
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}
