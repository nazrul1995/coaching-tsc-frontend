# 🔐 Authentication System Implementation Guide

## Overview
Complete authentication system with Login, Register, and Logout functionality using:
- **TanStack Query** - Data fetching & caching
- **Axios** - HTTP client with JWT interceptor
- **React Context** - Global auth state management
- **React Hook Form** - Form validation
- **SweetAlert2** - User notifications
- **JWT** - Token-based authentication
- **bcrypt** - Password hashing (backend)

---

## 📁 Files Created/Modified

### New Files Created:
1. **`src/context/AuthContext.tsx`** - Auth state management with hooks
2. **`src/components/ProtectedRoute.tsx`** - Route protection component
3. **`src/hooks/useAuthRole.ts`** - Role-based access hooks

### Files Modified:
1. **`src/lib/api/auth.ts`** - Enhanced with types and logout function
2. **`src/provider/Provider.tsx`** - Added AuthProvider wrapper
3. **`src/app/login/page.tsx`** - Updated to use AuthContext
4. **`src/app/register/page.tsx`** - Updated to use AuthContext
5. **`src/components/shared/Header/Nabvar.tsx`** - Added logout and user menu

---

## 🎯 How to Use

### 1. **Get Current User & Auth State**
```tsx
'use client';

import { useAuth } from '@/context/AuthContext';

export function MyComponent() {
  const { user, isLoggedIn, token, isLoading } = useAuth();

  if (isLoading) return <div>Loading...</div>;

  if (!isLoggedIn) {
    return <div>Please login first</div>;
  }

  return (
    <div>
      <p>Welcome, {user.name}!</p>
      <p>Email: {user.email}</p>
      <p>Role: {user.role}</p>
    </div>
  );
}
```

### 2. **Check User Role**
```tsx
import { 
  useIsTeacher, 
  useIsStudent, 
  useIsAdmin,
  useHasRole 
} from '@/hooks/useAuthRole';

export function RoleBasedUI() {
  const isTeacher = useIsTeacher();
  const isAdmin = useIsAdmin();
  const isStudent = useIsStudent();
  const hasMultipleRoles = useHasRole(['teacher', 'admin']);

  return (
    <>
      {isTeacher && <div>Teacher Content</div>}
      {isAdmin && <div>Admin Panel</div>}
      {isStudent && <div>Student Dashboard</div>}
      {hasMultipleRoles && <div>Exclusive Content</div>}
    </>
  );
}
```

### 3. **Protect Routes**
```tsx
// app/dashboard/page.tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';

export default function Dashboard() {
  return (
    <ProtectedRoute requiredRole={['student', 'teacher']}>
      <div>Protected Dashboard Content</div>
    </ProtectedRoute>
  );
}
```

### 4. **Redirect on Login**
Already implemented in login & register pages:
```tsx
const { login } = useAuth();

// After successful login:
login(data.token, data.user);  // Stores in context & localStorage
router.push('/');  // Redirect to home
```

### 5. **Logout User**
```tsx
import { useAuth } from '@/context/AuthContext';

export function LogoutButton() {
  const { logout } = useAuth();

  const handleLogout = () => {
    logout();  // Clears context & localStorage
    router.push('/');  // Redirect home
  };

  return <button onClick={handleLogout}>Logout</button>;
}
```

---

## 🔄 Auth Flow

### Registration Flow
```
User fills form
    ↓
validateForm (React Hook Form)
    ↓
uploadImage (optional, to ImgBB)
    ↓
registerUser(payload) → POST /api/v1/users/register
    ↓
Backend: Hash password (bcrypt), create user, generate JWT
    ↓
Response: { token, user: { id, email, name, role, image } }
    ↓
login(token, user) → Save to context & localStorage
    ↓
Redirect to home page
```

### Login Flow
```
User enters email & password
    ↓
validateForm (React Hook Form)
    ↓
loginUser(payload) → POST /api/v1/users/login
    ↓
Backend: Compare password with hash, verify user, generate JWT
    ↓
Response: { token, user: { id, email, name, role, image } }
    ↓
login(token, user) → Save to context & localStorage
    ↓
Redirect to home page
```

### Logout Flow
```
User clicks logout
    ↓
Confirmation dialog (SweetAlert)
    ↓
logout() → Clear context & localStorage
    ↓
Redirect to home page
    ↓
Navbar shows "Login" & "Join Now" buttons
```

### API Request Flow
```
Component needs to make authenticated request
    ↓
Axios interceptor reads token from localStorage
    ↓
Adds header: Authorization: Bearer {token}
    ↓
Backend middleware (verifyToken) validates JWT
    ↓
If valid: Attach user info to req, continue
    ↓
If invalid: Return 401 Unauthorized
    ↓
Component handles error with SweetAlert notification
```

---

## 📊 Auth Context Structure

```typescript
interface AuthContextType {
  user: User | null;              // Current logged-in user
  token: string | null;            // JWT token
  isLoggedIn: boolean;             // Is user authenticated
  isLoading: boolean;              // Loading state on mount
  login: (token, user) => void;    // Set auth state
  logout: () => void;              // Clear auth state
  setUser: (user) => void;         // Update user info
}

interface User {
  email: string;
  role: 'student' | 'teacher' | 'guardian' | 'admin';
  id?: string;
  name?: string;
  image?: string;
}
```

---

## 🔒 Security Features

✅ **Token Storage**
- JWT stored in `localStorage` (accessible to JS)
- Consider using `httpOnly` cookies for higher security (backend change needed)

✅ **Password Hashing**
- Backend uses bcrypt with 12 salt rounds
- Password never sent in plain text except over HTTPS

✅ **JWT Validation**
- Token validated on every API request via interceptor
- Middleware verifies signature and expiration

✅ **Role-Based Access Control**
- Frontend: `ProtectedRoute` component & role-checking hooks
- Backend: `authorizeRoles` middleware on protected endpoints

✅ **Middleware Protection**
- Three JWT middleware:
  - `verifyToken` - Validates token existence & validity
  - `authorizeRoles` - Checks if user has required role
  - `isOwnerOrAdmin` - Resource-level access control

---

## 🚀 Next Steps to Enhance

### High Priority
1. **Token Refresh Logic** - Implement refresh tokens for longer sessions
2. **User Profile API** - Create `/api/v1/users/me` endpoint
3. **Change Password** - Add password change functionality
4. **Email Verification** - Verify email before account activation

### Medium Priority
1. **httpOnly Cookies** - More secure than localStorage (backend required)
2. **Forgot Password** - Password reset via email
3. **Two-Factor Authentication** - Additional security layer
4. **Social Login** - Google/GitHub OAuth integration

### Low Priority
1. **Session Timeout** - Auto-logout after inactivity
2. **Device Management** - Track logged-in devices
3. **Activity Log** - Record user actions for audit

---

## 🐛 Troubleshooting

### "Token not found" Error
```
→ Ensure backend is returning token in response
→ Check if localStorage.setItem() is being called
→ Verify JWT is valid in browser DevTools
```

### User stays logged in after logout
```
→ Ensure logout() clears both context and localStorage
→ Check if hard refresh is needed (Ctrl+Shift+R)
→ Verify no other code is re-setting token
```

### "Unauthorized" on API calls
```
→ Check if JWT token exists: localStorage.getItem('token')
→ Verify Authorization header is being sent
→ Check token expiration: jwt.io
→ Ensure backend middleware is checking token
```

### Protected routes not working
```
→ Wrap route with <ProtectedRoute> component
→ Check isLoading state before redirecting
→ Verify requiredRole prop matches user.role
```

---

## 📝 Type Definitions

```typescript
// API Request/Response Types
type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'guardian';
  image?: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    role: 'student' | 'teacher' | 'guardian' | 'admin';
    image?: string;
  };
};
```

---

## 🎯 Example: Building a Teacher Dashboard

```tsx
'use client';

import { ProtectedRoute } from '@/components/ProtectedRoute';
import { useAuth } from '@/context/AuthContext';
import { useIsTeacher } from '@/hooks/useAuthRole';

export default function TeacherDashboard() {
  const { user } = useAuth();
  const isTeacher = useIsTeacher();

  return (
    <ProtectedRoute requiredRole={['teacher']}>
      <div className="p-8">
        <h1>Teacher Dashboard</h1>
        
        {isTeacher && (
          <>
            <p>Welcome, {user?.name}!</p>
            
            {/* Teacher-specific content */}
            <div>
              <h2>Your Courses</h2>
              {/* Add teacher's courses here */}
            </div>
            
            <div>
              <h2>Student Enrollments</h2>
              {/* List of enrolled students */}
            </div>
          </>
        )}
      </div>
    </ProtectedRoute>
  );
}
```

---

## ✅ Checklist

- [x] AuthContext created with useAuth hook
- [x] AuthProvider added to Providers wrapper
- [x] Login page updated with AuthContext
- [x] Register page updated with AuthContext
- [x] Navbar shows different UI for logged-in users
- [x] Logout functionality with confirmation
- [x] User menu with profile dropdown
- [x] ProtectedRoute component for securing pages
- [x] Role-based access hooks (useIsTeacher, etc.)
- [x] API functions with TypeScript types
- [x] JWT auto-injection via Axios interceptor
- [x] User data persisted in localStorage

---

Happy authenticating! 🚀
