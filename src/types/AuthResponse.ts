import { User } from "./User";

export interface AuthResponse {
  user: User;
  accessToken: string;
}

export interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  loading: boolean;
  error: string | null;
}