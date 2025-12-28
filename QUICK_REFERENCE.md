# Quick Reference: Auth Implementation

## Core Hook Usage

```typescript
import useAuth from '@/hooks/useAuth';

const { 
  user,                    // Current user: { id, email, role, isActive, createdAt }
  token,                   // Access token string
  loading,                 // Loading state
  register,                // Async: register(email, password)
  login,                   // Async: login(email, password)
  logout,                  // Async: logout()
  refresh,                 // Async: refresh() → boolean
  authenticatedFetch       // Async: authenticatedFetch(url, options)
} = useAuth();
```

## Common Patterns

### 1. Protected Component
```typescript
import RoleGuard from '@/components/RoleGuard';

export function AdminPanel() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <h1>Admin Content</h1>
    </RoleGuard>
  );
}
```

### 2. Login Form
```typescript
const { login } = useAuth();

async function handleLogin(email, password) {
  const result = await login(email, password);
  if (result.ok) {
    router.push('/'); // Auto-redirects based on role
  } else {
    showError(result.message);
  }
}
```

### 3. Fetch Protected Data
```typescript
const { authenticatedFetch } = useAuth();

async function loadUsers() {
  const response = await authenticatedFetch('/admin/users');
  // Automatically handles:
  // - Authorization header
  // - Credentials/cookies
  // - 401 refresh + retry
  // - Redirect to login on failure
  
  if (response.ok) {
    const users = await response.json();
    return users;
  }
}
```

### 4. Logout
```typescript
const { logout } = useAuth();

async function handleLogout() {
  await logout();
  // Automatically:
  // - Calls /auth/logout
  // - Clears sessionStorage
  // - Redirects to /login
}
```

## API Responses

### Success
```json
{
  "ok": true
}
```

### Error
```json
{
  "statusCode": 400,
  "message": ["email must be valid", "password too short"],
  "error": "Bad Request"
}
```

## Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| 200 | Success | Proceed |
| 201 | Created | Proceed (register) |
| 400 | Bad Request | Show validation errors |
| 401 | Unauthorized | Auto-refresh, then login |
| 403 | Forbidden | Check role, show access denied |
| 404 | Not Found | Show not found error |
| 500 | Server Error | Show generic error |

## User Roles

```typescript
type Role = 'CITIZEN' | 'NGO' | 'ADMIN';

// Check role in component
if (user?.role === 'ADMIN') {
  // Admin content
}

// Or use RoleGuard
<RoleGuard allowedRoles={['ADMIN', 'NGO']}>
  <Content />
</RoleGuard>
```

## Token Storage

```typescript
// ✅ Correct (sessionStorage)
sessionStorage.getItem('accessToken')

// ❌ Wrong (localStorage)
localStorage.getItem('token')

// ❌ Wrong (cookie in JS - HttpOnly prevents this)
document.cookie // Cannot access refresh token
```

## Environment Variables

```bash
# Frontend
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

## Common Errors

### "useAuth must be used within AuthProvider"
- Make sure component is inside `<AppShell>` (automatic in app/layout.tsx)

### Token always null after login
- Check `sessionStorage` in DevTools
- Verify `NEXT_PUBLIC_API_BASE_URL` is correct
- Check browser console for fetch errors

### 401 errors keep happening
- Token might be expired
- Try manual refresh: `await refresh()`
- If still 401, refresh token is invalid → login again

### Can't access admin routes as non-admin
- Check `user.role` in DevTools
- Verify user role was assigned by admin
- Backend might not be returning role in JWT

## Debugging Tips

```typescript
// Check current auth state
const { user, token, loading } = useAuth();
console.log('User:', user);
console.log('Token:', token?.substring(0, 20) + '...');
console.log('Loading:', loading);

// Check stored token
console.log('Stored:', sessionStorage.getItem('accessToken'));

// Manually test API call
const { authenticatedFetch } = useAuth();
const res = await authenticatedFetch('/admin/users');
console.log('Status:', res.status);
console.log('Data:', await res.json());
```

## Next.js App Router Notes

- Pages in `(public)` folder: No auth required
- Pages in other folders: Auth required (AppShell redirects)
- Use `useRouter` from `'next/navigation'` (not 'next/router')
- Use `usePathname` from `'next/navigation'` to get current route

## TypeScript Types

```typescript
// User type
type User = {
  id: string;
  email: string;
  role: 'CITIZEN' | 'NGO' | 'ADMIN';
  isActive: boolean;
  createdAt: string;
} | null;

// Auth context
type AuthContextType = {
  user: User;
  token: string | null;
  loading: boolean;
  register: (email: string, password: string) => Promise<{ ok: boolean; message?: string; user?: User }>;
  login: (email: string, password: string) => Promise<{ ok: boolean; message?: string }>;
  logout: () => Promise<void>;
  refresh: () => Promise<boolean>;
  authenticatedFetch: (input: RequestInfo, init?: RequestInit) => Promise<Response>;
};
```

## File Locations

| File | Purpose |
|------|---------|
| `src/lib/AuthContext.tsx` | Auth state & API |
| `src/hooks/useAuth.ts` | Auth hook |
| `src/components/AppShell.tsx` | Auth routing |
| `src/components/RoleGuard.tsx` | Role-based access |
| `src/app/(public)/login/page.tsx` | Login page |
| `src/app/(public)/register/page.tsx` | Register page |
| `src/lib/api.ts` | API helpers |

---

**Last Updated**: December 28, 2025
