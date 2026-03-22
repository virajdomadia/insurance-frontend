/**
 * Base API utility for insurance-frontend
 */

// Hardcoded for testing with internal mock API
const API_BASE_URL = '/api';
// const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || '/api';

export async function apiFetch(endpoint: string, options: RequestInit = {}) {
    const url = endpoint.startsWith('http') ? endpoint : `${API_BASE_URL}${endpoint}`;

    const headers = {
        'Content-Type': 'application/json',
        ...options.headers,
    };

    console.log(`[API Fetch] calling: ${url}`);
    return fetch(url, {
        ...options,
        headers,
        credentials: 'include', // Always include cookies for refresh token
    });
}
