import { apiClient } from '../api/client';

export const likePost = async (postId: string): Promise<{ liked: boolean }> => {
    try {
        const response = await apiClient.post<{ liked: boolean }>(`/posts/${postId}/like`, {});
        return response;
    } catch (error) {
        console.error('Failed to like post:', error);
        throw error;
    }
}

export const bookmarkPost = async (postId: string): Promise<{ bookmarked: boolean }> => {
    try {
        const response = await apiClient.post<{ bookmarked: boolean }>(`/posts/${postId}/bookmark`, {});
        return response;
    } catch (error) {
        console.error('Failed to bookmark post:', error);
        throw error;
    }
}
