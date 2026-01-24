import { NextRequest } from 'next/server';
import { verifyAccessToken, extractBearerToken, JWTPayload } from '@/lib/auth';
import { UserRole } from '@/models/User';

export interface AuthenticatedRequest extends NextRequest {
    user?: JWTPayload;
}

/**
 * Middleware to verify JWT token and attach user to request
 */
export function authenticate(request: NextRequest): JWTPayload | null {
    const authHeader = request.headers.get('authorization');
    const token = extractBearerToken(authHeader || '');

    if (!token) {
        return null;
    }

    const payload = verifyAccessToken(token);
    return payload;
}

/**
 * Middleware to require authentication
 */
export function requireAuth(request: NextRequest): { user: JWTPayload } | { error: string; status: number } {
    const user = authenticate(request);

    if (!user) {
        return { error: 'Unauthorized', status: 401 };
    }

    return { user };
}

/**
 * Middleware to require specific role
 */
export function requireRole(
    request: NextRequest,
    allowedRoles: UserRole[]
): { user: JWTPayload } | { error: string; status: number } {
    const authResult = requireAuth(request);

    if ('error' in authResult) {
        return authResult;
    }

    const { user } = authResult;

    if (!allowedRoles.includes(user.role as UserRole)) {
        return { error: 'Forbidden: Insufficient permissions', status: 403 };
    }

    return { user };
}

/**
 * Helper to check if user is admin
 */
export function requireAdmin(request: NextRequest): { user: JWTPayload } | { error: string; status: number } {
    return requireRole(request, [UserRole.ADMIN]);
}

/**
 * Helper to check if user is NGO or Admin
 */
export function requireNGOOrAdmin(request: NextRequest): { user: JWTPayload } | { error: string; status: number } {
    return requireRole(request, [UserRole.NGO, UserRole.ADMIN]);
}
