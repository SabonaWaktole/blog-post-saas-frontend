const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000/api/v1';

class ApiClient {
    private baseUrl: string;
    private isRefreshing = false;

    constructor(baseUrl: string) {
        this.baseUrl = baseUrl;
    }

    private getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    private getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    private setTokens(accessToken: string, refreshToken: string) {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    private clearTokens() {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    private async refreshTokens(): Promise<boolean> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) return false;

        try {
            const response = await fetch(`${this.baseUrl}/auth/refresh`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ refreshToken })
            });

            if (!response.ok) throw new Error('Refresh failed');

            const data = await response.json();
            this.setTokens(data.accessToken, data.refreshToken);
            return true;
        } catch (error) {
            console.error('Session expired:', error);
            this.clearTokens();
            return false;
        }
    }

    private async request<T>(endpoint: string, options: RequestInit = {}, retry = true): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        
        const headers: Record<string, string> = {
            'Content-Type': 'application/json',
            ...(options.headers as Record<string, string>),
        };

        const token = this.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const config: RequestInit = {
            ...options,
            headers,
        };

        try {
            const response = await fetch(url, config);

            // Handle 401 Unauthorized (Token Expired)
            if (response.status === 401 && retry && !endpoint.includes('/auth/login')) {
                if (!this.isRefreshing) {
                    this.isRefreshing = true;
                    const refreshed = await this.refreshTokens();
                    this.isRefreshing = false;
                    
                    if (refreshed) {
                        return this.request<T>(endpoint, options, false);
                    } else {
                        // Refresh failed, user needs to login again
                        window.location.href = '/login'; // Simple redirect for now
                    }
                }
            }

            if (!response.ok) {
                const errorBody = await response.text();
                throw new Error(`API Error: ${response.statusText} (${response.status}) - ${errorBody}`);
            }

            if (response.status === 204) {
                return {} as T;
            }

            return await response.json();
        } catch (error) {
            console.error('API Request Failed:', error);
            throw error;
        }
    }

    get<T>(endpoint: string, params?: Record<string, string | number | boolean | undefined>): Promise<T> {
        let url = endpoint;
        if (params) {
            const searchParams = new URLSearchParams();
            Object.entries(params).forEach(([key, value]) => {
                if (value !== undefined && value !== null && value !== '') {
                    searchParams.append(key, String(value));
                }
            });
            const queryString = searchParams.toString();
            if (queryString) url += `?${queryString}`;
        }
        return this.request<T>(url, { method: 'GET' });
    }

    post<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'POST',
            body: JSON.stringify(body),
        });
    }

    put<T>(endpoint: string, body: any): Promise<T> {
        return this.request<T>(endpoint, {
            method: 'PUT',
            body: JSON.stringify(body),
        });
    }

    delete<T>(endpoint: string): Promise<T> {
        return this.request<T>(endpoint, { method: 'DELETE' });
    }

    async upload<T>(endpoint: string, file: File): Promise<T> {
        const url = `${this.baseUrl}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
        const formData = new FormData();
        formData.append('file', file);

        const headers: Record<string, string> = {};
        const token = this.getAccessToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const response = await fetch(url, {
            method: 'POST',
            headers,
            body: formData
        });

        if (!response.ok) {
            throw new Error('Upload failed');
        }

        return await response.json();
    }
}

export const apiClient = new ApiClient(API_BASE_URL);
