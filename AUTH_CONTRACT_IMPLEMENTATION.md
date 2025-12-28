# Auth API Contract Implementation

This document describes the implementation of the Auth API contract in the insurance frontend.

## Overview

The frontend implements a secure authentication system using:
- **Access Token**: JWT token (short-lived, 15 minutes)
- **Refresh Token**: HttpOnly cookie (long-lived, 14 days)
- **Storage**: sessionStorage for access token (NOT localStorage)
- **Auto-refresh**: Automatic token refresh on 401 responses

## File Structure

```
src/
├── lib/
│   ├── AuthContext.tsx    # Main auth state management
│   └── api.ts             # API helper functions
├── hooks/
│   └── useAuth.ts         # useAuth hook
├── components/
│   ├── AppShell.tsx       # Auth routing and initialization
│   └── RoleGuard.tsx      # Role-based access control
└── app/
    └── (public)/
        ├── login/         # Login page
        └── register/      # Registration page
```

## Core Components

### AuthContext (`src/lib/AuthContext.tsx`)

Main authentication state management and API operations.

**Features:**
- ✅ `register(email, password)` - Create new CITIZEN account
- ✅ `login(email, password)` - Authenticate and receive access token
- ✅ `logout()` - Clear auth and invalidate refresh token
- ✅ `refresh()` - Get new access token from refresh token cookie
- ✅ `authenticatedFetch()` - Make API calls with auto-refresh on 401
- ✅ Auto-refresh token every 13 minutes

**Key Implementation Details:**
```typescript
// Access token stored in sessionStorage (NOT localStorage)
sessionStorage.setItem('accessToken', token);

// Refresh token automatically in HttpOnly cookie (managed by browser)
// No need to handle manually

// Auto-refresh on 401 response
if (response.status === 401) {
  const refreshed = await refresh();
  if (refreshed) {
    // Retry original request
  } else {
    // Redirect to login
  }
}
```

### useAuth Hook (`src/hooks/useAuth.ts`)

Simple hook to access auth context.

```typescript
const { user, token, loading, login, logout, register, authenticatedFetch } = useAuth();
```

### RoleGuard Component (`src/components/RoleGuard.tsx`)

Protects routes based on user role.

```typescript
<RoleGuard allowedRoles={['ADMIN', 'NGO']}>
  <AdminPanel />
</RoleGuard>
```

## Security Implementation

### DO ✅

- [x] Use `credentials: 'include'` on all requests (enables cookie sending)
- [x] Store access token in **sessionStorage** only
- [x] Include `Authorization: Bearer <token>` header for protected routes
- [x] Auto-refresh access token on 401 response
- [x] Clear sessionStorage on logout
- [x] Extract user role from JWT payload for UI (verified server-side)

### DON'T ❌

- [x] NOT storing refresh token in localStorage or sessionStorage (it's HttpOnly cookie)
- [x] NOT storing access token in localStorage
- [x] NOT sending tokens in query parameters
- [x] NOT accepting `role` from frontend (backend assigns it)
- [x] NOT trusting role alone without server-side verification
- [x] NOT logging tokens in console

## API Endpoints

All endpoints are relative to `process.env.NEXT_PUBLIC_API_BASE_URL` (default: `http://localhost:5000`)

### POST /auth/register
Create new account (always as CITIZEN role)

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Success (201):**
```json
{
  "id": "uuid",
  "email": "user@example.com",
  "role": "CITIZEN",
  "isActive": true,
  "createdAt": "2025-12-28T14:00:00Z"
}
```

**Usage:**
```typescript
const { register } = useAuth();
const result = await register('user@example.com', 'Password123!');
if (result.ok) {
  router.push('/login');
}
```

### POST /auth/login
Authenticate and receive access token

**Request:**
```json
{
  "email": "user@example.com",
  "password": "Password123!"
}
```

**Success (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Cookies Set (auto-managed):**
```
refreshToken: HttpOnly, Secure, SameSite=Lax
```

**Usage:**
```typescript
const { login } = useAuth();
const result = await login('user@example.com', 'Password123!');
if (result.ok) {
  // Token in sessionStorage, refresh cookie in browser
  router.push('/');
}
```

### POST /auth/refresh
Get new access token using refresh token cookie

**Request:**
- No body required
- Refresh token auto-sent via cookie

**Success (200):**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Usage (automatic in AuthContext):**
```typescript
// Automatically called on 401 or every 13 minutes
const refreshed = await refresh();
if (!refreshed) {
  // Redirect to login
}
```

### POST /auth/logout
Invalidate refresh token and clear cookie

**Request Headers:**
```
Authorization: Bearer <access_token>
```

**Success (200):**
```json
{
  "ok": true
}
```

**Usage:**
```typescript
const { logout } = useAuth();
await logout(); // Clears token and redirects to login
```

### Protected Routes (with RBAC)

#### GET /admin/users (ADMIN only)
```typescript
const { authenticatedFetch } = useAuth();
const response = await authenticatedFetch('/admin/users');
if (response.ok) {
  const users = await response.json();
}
```

## Usage Examples

### Login Flow

```typescript
import { useRouter } from 'next/navigation';
import useAuth from '@/hooks/useAuth';

export function LoginForm() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    const result = await login(email, password);
    if (result.ok) {
      router.push('/'); // Redirects to appropriate dashboard
    } else {
      setError(result.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {error && <div className="error">{error}</div>}
      <button type="submit">Sign in</button>
    </form>
  );
}
```

### Protected Fetch

```typescript
import useAuth from '@/hooks/useAuth';

export function UsersList() {
  const { authenticatedFetch } = useAuth();
  const [users, setUsers] = useState([]);

  useEffect(() => {
    const loadUsers = async () => {
      try {
        // authenticatedFetch handles:
        // - Authorization header
        // - credentials: 'include' for cookies
        // - Auto-refresh on 401
        // - Redirect to login on refresh failure
        const response = await authenticatedFetch('/admin/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        } else if (response.status === 403) {
          setError('Insufficient permissions');
        }
      } catch (err) {
        setError('Failed to load users');
      }
    };
    loadUsers();
  }, [authenticatedFetch]);

  return (
    <div>
      {users.map(user => (
        <div key={user.id}>{user.email}</div>
      ))}
    </div>
  );
}
```

### Logout

```typescript
import useAuth from '@/hooks/useAuth';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = async () => {
    await logout(); // Redirects to /login
  };

  return <button onClick={handleLogout}>Sign out</button>;
}
```

### Role-Based Routes

```typescript
import RoleGuard from '@/components/RoleGuard';

export function AdminPage() {
  return (
    <RoleGuard allowedRoles={['ADMIN']}>
      <div>Admin content only</div>
    </RoleGuard>
  );
}
```

## Environment Configuration

### Frontend
```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:5000
```

### Backend (for reference)
```bash
JWT_SECRET=your_secret
ACCESS_TOKEN_EXPIRES=15m
NODE_ENV=development
DATABASE_URL=postgresql://...
```

## Error Handling

The API returns standardized error responses:

```json
{
  "statusCode": 400,
  "message": ["email must be an email", "password too short"],
  "error": "Bad Request"
}
```

or

```json
{
  "statusCode": 401,
  "message": "Invalid credentials",
  "error": "Unauthorized"
}
```

**Frontend Error Handling:**

```typescript
const result = await login(email, password);
if (!result.ok) {
  // result.message is already formatted
  console.error(result.message);
}
```

## Testing Checklist

- [ ] User can register with email and password
- [ ] User receives 403 when trying to register with existing email
- [ ] User can login with correct credentials
- [ ] User receives 401 with incorrect credentials
- [ ] Access token stored in sessionStorage (not localStorage)
- [ ] Refresh token in HttpOnly cookie (not visible in JS)
- [ ] User auto-redirected to appropriate dashboard after login
- [ ] User can access protected routes with token
- [ ] User receives 401 accessing protected route without token
- [ ] User receives 403 accessing admin routes without ADMIN role
- [ ] Token auto-refreshes on 401 response
- [ ] Token auto-refreshes every 13 minutes
- [ ] User can logout and is redirected to login
- [ ] Token cleared from sessionStorage on logout
- [ ] Refresh token cookie cleared on logout
- [ ] User cannot access protected routes after logout

## Common Issues & Solutions

### Issue: Cookies not persisting
- **Cause**: Missing `credentials: 'include'` in fetch
- **Solution**: All fetch calls use `credentials: 'include'` automatically

### Issue: Token always undefined
- **Cause**: Not using sessionStorage (was using localStorage)
- **Solution**: Access token now stored in sessionStorage correctly

### Issue: Infinite 401 loop
- **Cause**: Refresh token expired or invalid
- **Solution**: User is redirected to login; refresh endpoint returns 401

### Issue: CORS errors
- **Cause**: Backend not allowing credentials
- **Solution**: Backend must set `Access-Control-Allow-Credentials: true`

## Migration from Old Implementation

### What Changed
1. **Token Storage**: localStorage → sessionStorage
2. **Token Field**: `token` → `accessToken`
3. **Cookie Handling**: Manual → HttpOnly automatic
4. **Auto-refresh**: Not implemented → Implemented with fallback

### Breaking Changes
- `fetchWithAuth` → `authenticatedFetch` (with auto-refresh)
- User data now extracted from JWT payload
- No longer storing user in localStorage

### Migration Steps
1. Clear old localStorage tokens manually
2. Update API calls to use `authenticatedFetch`
3. Update login flows to expect `accessToken` in response
4. Test all auth flows with new implementation
