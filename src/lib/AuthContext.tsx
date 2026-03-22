'use client';

import React, { createContext, useContext, useState, useEffect, useCallback, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { apiFetch } from './api';

console.log('[AuthContext] API path configured for internal mock API');

export type UserRole = 'ADMIN' | 'USER';

export interface User {
    id: string;
    email: string;
    role: UserRole;
    name?: string;
}

interface AuthContextType {
    user: User | null;
    token: string | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<{ ok: boolean; message: string; role?: UserRole }>;
    register: (email: string, password: string, role?: UserRole, name?: string) => Promise<{ ok: boolean; message: string }>;
    forgotPassword: (email: string) => Promise<{ ok: boolean; message: string }>;
    logout: () => Promise<void>;
    refresh: () => Promise<boolean>;
    authenticatedFetch: (endpoint: string, options?: RequestInit) => Promise<Response>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Helper to decode JWT payload without a library (for UI info only)
function parseJwt(token: string) {
    try {
        const base64Url = token.split('.')[1];
        if (!base64Url) return null;
        let base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
        // Pad the base64 string to be a multiple of 4
        while (base64.length % 4) {
            base64 += '=';
        }
        const jsonPayload = decodeURIComponent(
            atob(base64)
                .split('')
                .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
                .join('')
        );
        return JSON.parse(jsonPayload);
    } catch (e) {
        console.error('[AuthContext] Failed to parse JWT:', e);
        return null;
    }
}

export function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    const handleToken = useCallback((accessToken: string | null) => {
        if (accessToken) {
            setToken(accessToken);
            const payload = parseJwt(accessToken);
            if (payload) {
                setUser({
                    id: payload.sub || payload.id || payload.userId,
                    email: payload.email,
                    role: payload.role as UserRole,
                });
            }
        } else {
            setToken(null);
            setUser(null);
        }
    }, []);

    const refresh = useCallback(async (): Promise<boolean> => {
        try {
            const response = await apiFetch('/auth/refresh', { method: 'POST' });
            if (response.ok) {
                const data = await response.json();
                handleToken(data.accessToken);
                return true;
            }
            handleToken(null);
            return false;
        } catch (error) {
            handleToken(null);
            return false;
        }
    }, [handleToken]);

    const login = async (email: string, password: string) => {
        try {
            const response = await apiFetch('/auth/login', {
                method: 'POST',
                body: JSON.stringify({ email, password }),
            });

            const data = await response.json();

            if (response.ok) {
                handleToken(data.accessToken);
                // Redirect logic can be added here or in the component
                return { ok: true, message: 'Logged in successfully', role: data.user.role as UserRole };
            }

            return {
                ok: false,
                message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Login failed'),
            };
        } catch (error) {
            return { ok: false, message: 'An error occurred during login' };
        }
    };

    const register = async (email: string, password: string, role: UserRole = 'USER', name?: string) => {
        try {
            const response = await apiFetch('/auth/register', {
                method: 'POST',
                body: JSON.stringify({ email, password, role, name }),
            });

            const data = await response.json();

            if (response.ok) {
                return { ok: true, message: 'Registration successful' };
            }

            return {
                ok: false,
                message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Registration failed'),
            };
        } catch (error) {
            return { ok: false, message: 'An error occurred during registration' };
        }
    };

    const forgotPassword = async (email: string) => {
        try {
            const response = await apiFetch('/auth/forgot-password', {
                method: 'POST',
                body: JSON.stringify({ email }),
            });

            const data = await response.json();

            if (response.ok) {
                return { ok: true, message: data.message || 'Password reset link sent' };
            }

            return {
                ok: false,
                message: Array.isArray(data.message) ? data.message[0] : (data.message || 'Request failed'),
            };
        } catch (error) {
            return { ok: false, message: 'An error occurred during the request' };
        }
    };

    const logout = async () => {
        try {
            await apiFetch('/auth/logout', {
                method: 'POST',
                headers: { Authorization: `Bearer ${token}` },
            });
        } catch (error) {
            console.error('Logout error', error);
        } finally {
            handleToken(null);
            router.push('/login');
        }
    };

    const authenticatedFetch = useCallback(
        async (endpoint: string, options: RequestInit = {}): Promise<Response> => {
            // Add auth header using memory state
            const headers = {
                ...options.headers,
                Authorization: `Bearer ${token}`,
            };

            let response = await apiFetch(endpoint, { ...options, headers });

            // Handle 401 Unauthorized - attempt refresh
            if (response.status === 401) {
                const refreshRes = await apiFetch('/auth/refresh', { method: 'POST' });
                if (refreshRes.ok) {
                    const refreshData = await refreshRes.json();
                    const newToken = refreshData.accessToken;
                    handleToken(newToken);
                    const retryHeaders = {
                        ...options.headers,
                        Authorization: `Bearer ${newToken}`,
                    };
                    response = await apiFetch(endpoint, { ...options, headers: retryHeaders });
                } else {
                    handleToken(null);
                    router.push('/login');
                }
            }

            return response;
        },
        [token, handleToken, router]
    );

    // Initialize auth state
    useEffect(() => {
        const initAuth = async () => {
            // No sessionStorage - always try to refresh from cookie on mount
            setLoading(true);
            await refresh();
            setLoading(false);
        };

        initAuth();
    }, [refresh]);

    // Periodic auto-refresh (every 13 minutes)
    useEffect(() => {
        const interval = setInterval(() => {
            if (token) {
                refresh();
            }
        }, 13 * 60 * 1000);

        return () => clearInterval(interval);
    }, [token, refresh]);

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                loading,
                login,
                register,
                forgotPassword,
                logout,
                refresh,
                authenticatedFetch,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
