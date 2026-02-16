import { apiClient } from '../api/client';

export interface Author {
    id: string
    name: string
    avatar: string | null
}

export type ArticleStatus = 'PUBLISHED' | 'DRAFT' | 'SCHEDULING' | 'ARCHIVED'

export interface Article {
    id: string
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
    coverImageUrl?: string
    seoTitle?: string
    seoDescription?: string
}

// --- Public Access ---

export const fetchArticleBySlug = async (blogSlug: string, slug: string): Promise<Article | undefined> => {
    try {
        const response = await apiClient.get<Article>(`/public/blogs/${blogSlug}/posts/${slug}`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch article with slug ${slug}:`, error);
        return undefined;
    }
}

export const fetchArticles = async (blogSlug: string, query?: string): Promise<Article[]> => {
    try {
        const params: Record<string, string> = {};
        if (query) params.search = query;
        const response = await apiClient.get<{ data: Article[] }>(`/public/blogs/${blogSlug}/posts`, params);
        return response.data;
    } catch (error) {
        console.error('Failed to search articles:', error);
        return [];
    }
}

export const fetchAllPublishedArticles = async (query?: string, categoryId?: string): Promise<Article[]> => {
    try {
        const params: Record<string, string> = {};
        if (query) params.search = query;
        if (categoryId && categoryId !== 'All') params.categoryId = categoryId;

        const response = await apiClient.get<{ data: Article[] }>(`/public/posts`, params);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch all published articles:', error);
        return [];
    }
}

export const fetchArticlesByCategory = async (blogSlug: string, categoryId?: string): Promise<Article[]> => {
    try {
        const params: Record<string, string> = {};
        if (categoryId && categoryId !== 'All') {
            params.categoryId = categoryId;
        }
        const response = await apiClient.get<{ data: Article[] }>(`/public/blogs/${blogSlug}/posts`, params);
        return response.data;
    } catch (error) {
        console.error('Failed to fetch articles by category:', error);
        return [];
    }
}

export const fetchFeaturedArticle = async (blogSlug?: string): Promise<Article | undefined> => {
    try {
        // If blogSlug is provided, fetch from specific blog, otherwise fetch from global
        const endpoint = blogSlug ? `/public/blogs/${blogSlug}/posts` : `/public/posts`;
        const response = await apiClient.get<{ data: Article[] }>(endpoint, { featured: true, limit: 1 });
        return response.data[0];
    } catch (error) {
        console.error('Failed to fetch featured article:', error);
        return undefined;
    }
}

// --- Author/Public Access ---

export const fetchArticlesByAuthor = async (authorId: string): Promise<Article[]> => {
    try {
        const response = await apiClient.get<{ data: Article[] }>(`/authors/${authorId}/posts`);
        return response.data;
    } catch (error) {
        console.error(`Failed to fetch articles for author ${authorId}:`, error);
        return [];
    }
}

// --- Dashboard/Management Access (Requires Auth) ---

export const fetchArticlesByBlogId = async (blogId: string, query?: string): Promise<Article[]> => {
    try {
        const params: Record<string, string> = {};
        if (query) params.search = query;
        // The backend `listByBlog` returns { data: Article[], meta: ... } or just data depending on implementation.
        // PostController.listByBlog returns `result` which is from `postUseCases.listByBlog`.
        // Usually paginated response. Let's assume it returns { data: [], meta: {} } structure or verify.
        // Looking at backend `post.controller.ts` -> `res.json(result)`.
        // `postUseCases.listByBlog` typically returns paginated result.
        // For now, let's type it as { data: Article[] } and return .data, or fit to Article[] return type.
        const response = await apiClient.get<{ data: Article[] }>(`/blogs/${blogId}/posts`, params);
        return response.data || [];
    } catch (error) {
        console.error('Failed to fetch articles for blog:', error);
        return [];
    }
}

export const fetchArticleById = async (blogId: string, postId: string): Promise<Article | undefined> => {
    try {
        // Backend hasn't explicitly documented GET /blogs/:blogId/posts/:postId but it's standard.
        // Or we use the public one if acceptable, but draft posts require auth.
        // Assuming GET /blogs/:blogId/posts/:postId exists for owners.
        const response = await apiClient.get<Article>(`/blogs/${blogId}/posts/${postId}`);
        return response;
    } catch (error) {
        console.error(`Failed to fetch article with id ${postId}:`, error);
        return undefined;
    }
}

export const createPost = async (blogId: string, data: Partial<Article>): Promise<Article> => {
    try {
        const response = await apiClient.post<Article>(`/blogs/${blogId}/posts`, data);
        return response;
    } catch (error) {
        console.error('Failed to create post:', error);
        throw error;
    }
}

export const updatePost = async (postId: string, data: Partial<Article>): Promise<Article> => {
    try {
        // Backend route is PUT /api/v1/posts/:id
        const response = await apiClient.put<Article>(`/posts/${postId}`, data);
        return response;
    } catch (error) {
        console.error('Failed to update post:', error);
        throw error;
    }
}
