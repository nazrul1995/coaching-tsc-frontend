import axiosSecure from "../axiosSecure";

export type RegisterPayload = {
  name: string;
  email: string;
  password: string;
  role: 'student' | 'teacher' | 'guardian';
  image?: string;
};

export type LoginPayload = {
  email: string;
  password: string;
};
export type SocialPayload = {
  name?: string;
  email?: string;
  image?: string;
  credential?: string;
};
export type User = {
  _id: string;
  email: string;
  name: string;
  role: 'student' | 'teacher' | 'guardian' | 'admin';
  image?: string;
  createdAt?: string;
  updatedAt?: string;
};

export type AuthResponse = {
  success: boolean;
  message: string;
  token: string;
  user: User;
};

export const registerUser = async (data: RegisterPayload): Promise<AuthResponse> => {
  const res = await axiosSecure.post("/users/register", data);
  return res.data;
};

export const loginUser = async (data: LoginPayload): Promise<AuthResponse> => {
  const res = await axiosSecure.post("/users/login", data);
  return res.data;
};
export const socialLogin = async (data: SocialPayload): Promise<AuthResponse> => {
  const res = await axiosSecure.post("/users/social-login", data);
  return res.data;
};

export const logoutUser = () => {
  // Clear token and user from localStorage
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  // Optional: Call backend logout endpoint if needed for session tracking
  return Promise.resolve();
};