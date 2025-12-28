/**
 * API utility functions for making authenticated requests
 * Handles:
 * - Authorization header injection
 * - Automatic token refresh on 401
 * - Error handling and parsing
 * - Credentials/cookie management
 */

import { useAuthContext } from "@/lib/AuthContext";

export type ApiError = {
  statusCode: number;
  message: string | string[];
  error: string;
};

export type ApiResponse<T> = {
  ok: boolean;
  data?: T;
  error?: ApiError;
};

/**
 * Parse error response from API
 */
export function parseApiError(data: any, status: number): ApiError {
  if (Array.isArray(data.message)) {
    return {
      statusCode: status,
      message: data.message,
      error: data.error || "Bad Request",
    };
  }
  return {
    statusCode: status,
    message: data.message || "Unknown error",
    error: data.error || "Error",
  };
}

/**
 * Format error message for display
 */
export function formatErrorMessage(error: ApiError | string): string {
  if (typeof error === "string") return error;
  if (Array.isArray(error.message)) {
    return error.message.join(", ");
  }
  return error.message;
}

/**
 * Hook: Get authenticated fetch function with auto-refresh
 * Usage:
 * ```
 * const { authenticatedFetch } = useAuthContext();
 * const response = await authenticatedFetch('/api/users');
 * ```
 */
export async function useAuthenticatedFetch(
  getAuthContext: () => ReturnType<typeof useAuthContext>
) {
  const { authenticatedFetch } = getAuthContext();
  return authenticatedFetch;
}

/**
 * Standalone fetch helper for authenticated requests
 * Use in server components or standalone utilities
 */
export async function fetchWithErrorHandling<T>(
  url: string,
  options: RequestInit = {},
  token?: string
): Promise<ApiResponse<T>> {
  try {
    const headers = new Headers(options.headers || {});
    headers.set("Content-Type", "application/json");
    
    if (token) {
      headers.set("Authorization", `Bearer ${token}`);
    }

    const response = await fetch(url, {
      ...options,
      credentials: "include",
      headers,
    });

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      return {
        ok: false,
        error: parseApiError(data, response.status),
      };
    }

    return {
      ok: true,
      data: data as T,
    };
  } catch (err: any) {
    return {
      ok: false,
      error: {
        statusCode: 500,
        message: err?.message ?? "Network error",
        error: "Error",
      },
    };
  }
}

/**
 * Example usage in a React component:
 * 
 * ```tsx
 * export function UsersList() {
 *   const { authenticatedFetch } = useAuth();
 *   const [users, setUsers] = useState([]);
 * 
 *   useEffect(() => {
 *     async function loadUsers() {
 *       try {
 *         const response = await authenticatedFetch('/admin/users');
 *         if (response.ok) {
 *           const data = await response.json();
 *           setUsers(data);
 *         } else if (response.status === 403) {
 *           setError("You don't have permission to view users");
 *         }
 *       } catch (e) {
 *         setError("Failed to load users");
 *       }
 *     }
 *     loadUsers();
 *   }, [authenticatedFetch]);
 * 
 *   return (
 *     <div>
 *       {users.map(user => <UserCard key={user.id} user={user} />)}
 *     </div>
 *   );
 * }
 * ```
 */
