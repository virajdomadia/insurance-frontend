import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-for-development-do-not-use';

export interface JWTPayload {
    userId: string;
    role: string;
}

export function signJwt(payload: JWTPayload, expiresIn: any = '24h'): string {
    return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token: string): JWTPayload | null {
    try {
        const decoded = jwt.verify(token, JWT_SECRET) as JWTPayload;
        return decoded;
    } catch (error) {
        return null; // Invalid or expired token
    }
}
