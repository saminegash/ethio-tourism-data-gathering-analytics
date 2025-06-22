import { supabase } from "@/lib/supabase";
import { createSlice, createAsyncThunk, PayloadAction } from "@reduxjs/toolkit";
import { User } from "@supabase/supabase-js";

// Define types
export interface UserProfile {
  id: string;
  role: "admin" | "super_agent" | "agent" | "user";
  email?: string;
  full_name?: string;
  avatar_url?: string;
  created_at?: string;
  updated_at?: string;
}

export interface AuthState {
  user: User | null;
  profile: UserProfile | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  initialized: boolean;
}

// Initial state
const initialState: AuthState = {
  user: null,
  profile: null,
  loading: false,
  error: null,
  isAuthenticated: false,
  initialized: false,
};

// Async thunks
export const fetchUserProfile = createAsyncThunk(
  "auth/fetchUserProfile",
  async (userId: string, { rejectWithValue }) => {
    try {
      const { data, error } = await supabase
        .from("profiles")
        .select("*")
        .eq("id", userId)
        .single();

      if (error) {
        throw error;
      }

      return data as UserProfile;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signIn = createAsyncThunk(
  "auth/signIn",
  async (
    { email, password }: { email: string; password: string },
    { dispatch, rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        throw error;
      }

      if (data.user) {
        // Fetch user profile after successful sign in
        const profileResult = await dispatch(fetchUserProfile(data.user.id));

        if (profileResult.meta.requestStatus === "fulfilled") {
          return {
            user: data.user,
            profile: profileResult.payload as UserProfile,
          };
        } else {
          // If profile fetch fails, still return user but with null profile
          console.warn("Profile fetch failed:", profileResult.payload);
          return {
            user: data.user,
            profile: null,
          };
        }
      }

      // This should not happen, but for type safety
      throw new Error("No user returned from sign in");
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signUp = createAsyncThunk(
  "auth/signUp",
  async (
    {
      email,
      password,
      fullName,
    }: { email: string; password: string; fullName: string },
    { rejectWithValue }
  ) => {
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: fullName,
          },
        },
      });

      if (error) {
        throw error;
      }

      return data;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const signOut = createAsyncThunk(
  "auth/signOut",
  async (_, { rejectWithValue }) => {
    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      return null;
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

export const initializeAuth = createAsyncThunk(
  "auth/initializeAuth",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      const {
        data: { user },
        error,
      } = await supabase.auth.getUser();

      if (error) {
        throw error;
      }

      if (user) {
        // Fetch user profile
        const profileResult = await dispatch(fetchUserProfile(user.id));
        return {
          user,
          profile: profileResult.payload as UserProfile,
        };
      }

      return { user: null, profile: null };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  }
);

// Create slice
const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User | null>) => {
      state.user = action.payload;
      state.isAuthenticated = !!action.payload;
    },
    setProfile: (state, action: PayloadAction<UserProfile | null>) => {
      state.profile = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.loading = action.payload;
    },
    resetAuth: (state) => {
      state.user = null;
      state.profile = null;
      state.isAuthenticated = false;
      state.error = null;
      state.loading = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Initialize Auth
      .addCase(initializeAuth.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(initializeAuth.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = !!action.payload.user;
        state.initialized = true;
      })
      .addCase(initializeAuth.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.initialized = true;
      })
      // Fetch User Profile
      .addCase(fetchUserProfile.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserProfile.fulfilled, (state, action) => {
        state.loading = false;
        state.profile = action.payload;
      })
      .addCase(fetchUserProfile.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign In
      .addCase(signIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.profile = action.payload.profile;
        state.isAuthenticated = true;
      })
      .addCase(signIn.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign Up
      .addCase(signUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload.user;
        state.isAuthenticated = !!action.payload.user;
      })
      .addCase(signUp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Sign Out
      .addCase(signOut.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(signOut.fulfilled, (state) => {
        state.loading = false;
        state.user = null;
        state.profile = null;
        state.isAuthenticated = false;
      })
      .addCase(signOut.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setUser, setProfile, clearError, setLoading, resetAuth } =
  authSlice.actions;
export default authSlice.reducer;
