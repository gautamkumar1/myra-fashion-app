import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import {
  loginSalesman,
  loginWarehouse,
  logoutSalesman,
  logoutWarehouse,
  type LoginResponse,
} from '@/utils/api';

interface User {
  id: string;
  name: string;
  email: string;
}

type Role = 'salesman' | 'warehouse' | null;

interface AuthState {
  user: User | null;
  role: Role;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
  loginSalesman: (email: string, password: string) => Promise<void>;
  loginWarehouse: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  initializeAuth: () => Promise<void>;
}

const TOKEN_KEY = '@auth_token';
const ROLE_KEY = '@auth_role';
const USER_KEY = '@auth_user';

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  role: null,
  token: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,

  setLoading: (loading: boolean) => set({ isLoading: loading }),

  setError: (error: string | null) => set({ error }),

  loginSalesman: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response: LoginResponse = await loginSalesman(email, password);

      if (response.success && response.token && response.user) {
        const user: User = response.user;
        const token = response.token;
        const role: Role = 'salesman';

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(ROLE_KEY, role);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        set({
          user,
          role,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  loginWarehouse: async (email: string, password: string) => {
    try {
      set({ isLoading: true, error: null });
      const response: LoginResponse = await loginWarehouse(email, password);

      if (response.success && response.token && response.warehouse) {
        const user: User = response.warehouse;
        const token = response.token;
        const role: Role = 'warehouse';

        await AsyncStorage.setItem(TOKEN_KEY, token);
        await AsyncStorage.setItem(ROLE_KEY, role);
        await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));

        set({
          user,
          role,
          token,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        });
      } else {
        throw new Error(response.message || 'Login failed');
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed';
      set({
        isLoading: false,
        error: errorMessage,
        isAuthenticated: false,
      });
      throw error;
    }
  },

  logout: async () => {
    try {
      const { role } = get();
      set({ isLoading: true });

      if (role === 'salesman') {
        await logoutSalesman();
      } else if (role === 'warehouse') {
        await logoutWarehouse();
      }

      await AsyncStorage.multiRemove([TOKEN_KEY, ROLE_KEY, USER_KEY]);

      set({
        user: null,
        role: null,
        token: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      });
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Logout failed';
      set({ isLoading: false, error: errorMessage });
    }
  },

  initializeAuth: async () => {
    try {
      const [token, role, userJson] = await AsyncStorage.multiGet([
        TOKEN_KEY,
        ROLE_KEY,
        USER_KEY,
      ]);

      if (token[1] && role[1] && userJson[1]) {
        const user: User = JSON.parse(userJson[1]);
        set({
          token: token[1],
          role: role[1] as Role,
          user,
          isAuthenticated: true,
        });
      }
    } catch (error) {
      console.error('Failed to initialize auth:', error);
      await AsyncStorage.multiRemove([TOKEN_KEY, ROLE_KEY, USER_KEY]);
    }
  },
}));

