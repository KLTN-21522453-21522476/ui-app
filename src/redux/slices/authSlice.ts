import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { authApi } from '../../api/authApi'; 
import { Models } from 'appwrite'; 
import Cookies from 'js-cookie';
import { jwtUtils } from '../../utils/jwtUtils';

interface AuthState {
  user: Models.User<Models.Preferences> | null;
  loading: boolean;
  error: string | null;
  sessionId: string | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
}

const initialState: AuthState = {
  user: null,
  loading: false,
  error: null,
  sessionId: null,
  isAuthenticated: false,
  isInitialized: false,
};

// Async thunk để xử lý đăng nhập
export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password, rememberMe }: { email: string; password: string; rememberMe?: boolean }, { rejectWithValue }) => {
    try {
      const session = await authApi.login(email, password, rememberMe);
      const user = await authApi.getCurrentUser();
      return { sessionId: session.$id, user };
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Login failed');
    }
  }
);

// Async thunk để xử lý đăng ký
export const register = createAsyncThunk(
  'auth/register',
  async ({ email, password, name, phone }: { email: string; password: string; name: string; phone: string }, { rejectWithValue }) => {
    try {
      await authApi.register(email, password, name, phone);
      return;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Registration failed');
    }
  }
);

// Async thunk để xử lý đăng xuất
export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, rejectWithValue }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      if (auth.sessionId) {
        Cookies.remove('app_session');
        jwtUtils.clearTokens();
        await authApi.logout(auth.sessionId);
      }
      return null;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Logout failed');
    }
  }
);

// Async thunk để kiểm tra trạng thái xác thực hiện tại
export const checkAuth = createAsyncThunk(
  'auth/checkAuth',
  async (_, { rejectWithValue }) => {
    try {
      const user = await authApi.getCurrentUser();
      return { user };
    } catch (error) {
      return rejectWithValue(null);
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    resetError(state) {
      state.error = null;
    },
    setUser(state, action) {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    resetAuth(state) {
      state.user = null;
      state.loading = false;
      state.error = null;
      state.sessionId = null;
      state.isAuthenticated = false;
      state.isInitialized = true;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login cases
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.sessionId = action.payload.sessionId;
        state.isAuthenticated = true;
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Login failed';
        state.isAuthenticated = false;
      })
      
      // Register cases
      .addCase(register.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state) => {
        state.loading = false;
        // Thường thì sau khi đăng ký, người dùng cần đăng nhập
        // hoặc bạn có thể tự động đăng nhập họ ở đây
      })
      .addCase(register.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Registration failed';
      })
      
      // Logout cases
      .addCase(logout.pending, (state) => {
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.sessionId = null;
        state.isAuthenticated = false;
      })
      .addCase(logout.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string || 'Logout failed';
      })
      
      // Check auth cases
      .addCase(checkAuth.pending, (state) => {
        state.loading = true;
        state.isInitialized = false;
      })
      .addCase(checkAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
        state.isInitialized = true;
      })
      .addCase(checkAuth.rejected, (state) => {
        state.loading = false;
        state.user = null;
        state.isInitialized = true;
        state.isAuthenticated = false;
      });
  },
});

export const { resetError, setUser, resetAuth } = authSlice.actions;
export default authSlice.reducer;
