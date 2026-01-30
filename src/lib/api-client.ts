/**
 * API Client utility for making authenticated requests
 * Handles automatic token refresh on 401 errors
 */

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || '/api';

interface FetchOptions extends RequestInit {
    headers?: Record<string, string>;
}

/**
 * Get access token from sessionStorage
 */
function getAccessToken(): string | null {
    if (typeof window === 'undefined') return null;
    return sessionStorage.getItem('accessToken');
}

/**
 * Set access token in sessionStorage
 */
function setAccessToken(token: string): void {
    if (typeof window === 'undefined') return;
    sessionStorage.setItem('accessToken', token);
}

/**
 * Clear access token from sessionStorage
 */
function clearAccessToken(): void {
    if (typeof window === 'undefined') return;
    sessionStorage.removeItem('accessToken');
}

/**
 * Refresh access token using refresh token cookie
 */
async function refreshAccessToken(): Promise<string | null> {
    try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
            method: 'POST',
            credentials: 'include',
        });

        if (response.ok) {
            const data = await response.json();
            setAccessToken(data.accessToken);
            return data.accessToken;
        }

        return null;
    } catch (error) {
        console.error('Token refresh failed:', error);
        return null;
    }
}

/**
 * Make an authenticated API request
 * Automatically refreshes token on 401 and retries
 */
export async function apiClient<T = any>(endpoint: string, options: FetchOptions = {}): Promise<T> {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    // Get access token
    let token = getAccessToken();

    // Prepare headers
    const headers: Record<string, string> = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }

    // Make request
    let response = await fetch(url, {
        ...options,
        credentials: 'include',
        headers,
    });

    // If 401, try to refresh token and retry
    if (response.status === 401 && token) {
        const newToken = await refreshAccessToken();

        if (newToken) {
            // Retry with new token
            headers['Authorization'] = `Bearer ${newToken}`;
            response = await fetch(url, {
                ...options,
                credentials: 'include',
                headers,
            });
        } else {
            // Refresh failed, redirect to login
            clearAccessToken();
            if (typeof window !== 'undefined') {
                window.location.href = '/login';
            }
            throw new Error('Authentication failed');
        }
    }

    // Parse response
    const data = await response.json();

    // Handle errors
    if (!response.ok) {
        const errorMessage = Array.isArray(data.message) ? data.message.join(', ') : data.message || 'Request failed';
        throw new Error(errorMessage);
    }

    return data;
}

/**
 * API client methods
 */
export const api = {
    // Auth
    register: (email: string, password: string, name?: string, role?: string) =>
        apiClient('/auth/register', {
            method: 'POST',
            body: JSON.stringify({ email, password, name, role }),
        }),

    login: async (email: string, password: string) => {
        const data = await apiClient<{ accessToken: string }>('/auth/login', {
            method: 'POST',
            body: JSON.stringify({ email, password }),
        });
        setAccessToken(data.accessToken);
        return data;
    },

    logout: async () => {
        await apiClient('/auth/logout', { method: 'POST' });
        clearAccessToken();
    },

    refresh: async () => {
        const data = await apiClient<{ accessToken: string }>('/auth/refresh', { method: 'POST' });
        setAccessToken(data.accessToken);
        return data;
    },

    getMe: () => apiClient('/auth/me'),

    // Admin
    getUsers: () => apiClient('/admin/users'),
    assignNGO: (userId: string) => apiClient('/admin/assign-ngo', { method: 'POST', body: JSON.stringify({ userId }) }),
    activateUser: (userId: string, isActive: boolean) =>
        apiClient('/admin/activate', { method: 'POST', body: JSON.stringify({ userId, isActive }) }),
    getAdminStats: () => apiClient('/admin/stats'),

    // Beneficiaries
    getBeneficiaries: () => apiClient('/beneficiaries'),
    getBeneficiary: (id: string) => apiClient(`/beneficiaries/${id}`),
    createBeneficiary: (data: { name: string; age: number; income: number; bplStatus: boolean }) =>
        apiClient('/beneficiaries', { method: 'POST', body: JSON.stringify(data) }),
    updateBeneficiary: (id: string, data: Partial<{ name: string; age: number; income: number; bplStatus: boolean }>) =>
        apiClient(`/beneficiaries/${id}`, { method: 'PUT', body: JSON.stringify(data) }),
    deleteBeneficiary: (id: string) => apiClient(`/beneficiaries/${id}`, { method: 'DELETE' }),

    // Policies
    getPolicies: () => apiClient('/policies'),
    createPolicy: (data: { policyType: string; coverage: number; premium: number; startDate: string; endDate: string; userId?: string }) =>
        apiClient('/policies', { method: 'POST', body: JSON.stringify(data) }),

    // Claims
    getClaims: () => apiClient('/claims'),
    getClaim: (id: string) => apiClient(`/claims/${id}`),
    createClaim: (data: { beneficiaryId?: string; policyType: string; amount: number; description?: string }) =>
        apiClient('/claims', { method: 'POST', body: JSON.stringify(data) }),
    updateClaim: (id: string, data: { status?: string; description?: string }) =>
        apiClient(`/claims/${id}`, { method: 'PUT', body: JSON.stringify(data) }),

    // Eligibility
    checkEligibility: (data: { age: number; income: number; bplStatus: boolean; name?: string; district?: string }) =>
        apiClient('/eligibility', { method: 'POST', body: JSON.stringify(data) }),

    // Health
    health: () => apiClient('/health'),
};

export { getAccessToken, setAccessToken, clearAccessToken };
