import { useAuth } from '@/context/AuthContext';

/**
 * Hook to check if user is logged in and has specific role
 */
export const useHasRole = (requiredRoles: string | string[]) => {
  const { user } = useAuth();
  
  const roles = Array.isArray(requiredRoles) ? requiredRoles : [requiredRoles];
  return user ? roles.includes(user.role) : false;
};

/**
 * Hook to check if user is a teacher
 */
export const useIsTeacher = () => {
  const { user } = useAuth();
  return user?.role === 'teacher';
};

/**
 * Hook to check if user is a student
 */
export const useIsStudent = () => {
  const { user } = useAuth();
  return user?.role === 'student';
};

/**
 * Hook to check if user is an admin
 */
export const useIsAdmin = () => {
  const { user } = useAuth();
  return user?.role === 'admin';
};

/**
 * Hook to check if user is a guardian
 */
export const useIsGuardian = () => {
  const { user } = useAuth();
  return user?.role === 'guardian';
};
