
import { apiClient } from '../api/client';

export interface Author {
    id: number
    name: string
    avatar: string | null
}

export type ArticleStatus = 'Published' | 'Draft' | 'Scheduled' | 'Archived'

export interface Article {
    id: number
    slug: string
    title: string
    excerpt: string
    content: string
    category: string
    author: Author
    date: string
    readTime: string
    featured: boolean
    image: string | null
    status: ArticleStatus
    tags: string[]
}

// NOTE: Static 'articles' array removed in favor of API calls.

export const fetchArticleBySlug = async (slug: string): Promise<Article | undefined> => {
    try {
        // Assuming API structure: GET /public/blogs/:blogSlug/posts/:postSlug
        // Since we don't have multitenancy fully set up in frontend context yet,
        // we might mock the blog slug or use a default one, or the API might be structured differently.
        // Based on Documentation.md: GET /api/v1/public/blogs/:blogSlug/posts/:postSlug
        // For now, let's assume a default blog or that the slug is unique globally for this demo.
        const response = await apiClient.get<Article>(`/public/blogs/default-blog/posts/${slug}`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch article with slug ${slug}:`, error);
        return undefined;
    }
}

export const fetchArticleById = async (id: number): Promise<Article | undefined> => {
    try {
        // Assuming generic ID fetch or reusing slug logic if ID not supported directly publicily
        // But likely an admin endpoint exists: GET /posts/:id
        // Using a hypothetical endpoint
        const response = await apiClient.get<Article>(`/posts/${id}`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch article with id ${id}:`, error);
        return undefined;
    }
}

export const fetchArticlesByCategory = async (category: string): Promise<Article[]> => {
    try {
        // If category is 'All', usually we just fetch all posts.
        // Otherwise we pass categoryId or category slug.
        // Documentation implies categoryId query param.
        const params: Record<string, string> = {};
        if (category !== 'All') {
            // Ideally we'd map name to ID, but let's pass it as is for now or assume backend handles names.
            // Or we might need to fetch categories first to get IDs.
            // For this step, I'll pass it as a query param 'category'.
            params.category = category;
        }

        const response = await apiClient.get<{ data: Article[] }>(`public/blogs/default-blog/posts`, params);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles:', error);
        return [];
    }
}

export const fetchFeaturedArticle = async (): Promise<Article | undefined> => {
    try {
        // Maybe a specific endpoint or just fetch list and find one?
        // Let's assume we fetch a list and take the first featured one or use a param `featured=true`
        const response = await apiClient.get<{ data: Article[] }>(`public/blogs/default-blog/posts`, { featured: 'true', limit: 1 });
        return response.data[0];
    } catch (error) {
        console.error('Failed to fetch featured article:', error);
        return undefined;
    }
}

export const fetchArticlesByAuthor = async (authorId: number): Promise<Article[]> => {
    try {
        const response = await apiClient.get<{ data: Article[] }>(`/authors/${authorId}/posts`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch articles for author ${authorId}:`, error);
        return [];
    }
}

export const fetchArticles = async (query: string): Promise<Article[]> => {
    try {
        const response = await apiClient.get<{ data: Article[] }>(`public/blogs/default-blog/posts`, { search: query });
        return response.data;
    } catch (error) {
        console.error('Failed to search articles:', error);
        return [];
    }
}

