import { apiClient } from '../api/client';

export interface Category {
    id: string
    name: string
    slug: string
    description?: string
    parentId?: string | null
    children?: Category[]
    postCount: number
}

export interface Tag {
    id: string
    name: string
    slug: string
    postCount: number
}

export const fetchCategories = async (blogId: string): Promise<Category[]> => {
    try {
        const response = await apiClient.get<Category[]>(`/blogs/${blogId}/categories/hierarchy`);
        return response;
    } catch (error) {
        console.error('Failed to fetch categories:', error);
        return [];
    }
}

export const createCategory = async (blogId: string, data: { name: string; slug: string; parentId?: string }): Promise<Category> => {
    try {
        const response = await apiClient.post<Category>(`/blogs/${blogId}/categories`, data);
        return response;
    } catch (error) {
        console.error('Failed to create category:', error);
        throw error;
    }
}

export const fetchTags = async (blogId: string): Promise<Tag[]> => {
    try {
        // Endpoints for tags usually follow similar pattern: GET /blogs/:blogId/tags
        const response = await apiClient.get<Tag[]>(`/blogs/${blogId}/tags`);
        return response;
    } catch (error) {
        console.error('Failed to fetch tags:', error);
        return [];
    }
}

export const createTag = async (blogId: string, data: { name: string; slug: string }): Promise<Tag> => {
    try {
        const response = await apiClient.post<Tag>(`/blogs/${blogId}/tags`, data);
        return response;
    } catch (error) {
        console.error('Failed to create tag:', error);
        throw error;
    }
}
