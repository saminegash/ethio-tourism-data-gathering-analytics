"use client";

import { useEffect, useRef } from "react";
import { supabase } from "../../lib/supabase";
import { useAppDispatch, useAppSelector } from "../../lib/store/hooks";
import {
  setUser,
  setProfile,
  fetchUserProfile,
  initializeAuth,
  resetAuth,
} from "../../lib/store/slices/authSlice";
import {
  selectAuthInitialized,
  selectUser,
} from "../../lib/store/selectors/authSelectors";

interface AuthProviderProps {
  children: React.ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const dispatch = useAppDispatch();
  const initialized = useAppSelector(selectAuthInitialized);
  const currentUser = useAppSelector(selectUser);
  const lastFetchedUserId = useRef<string | null>(null);

  useEffect(() => {
    // Initialize auth state on mount
    if (!initialized) {
      dispatch(initializeAuth());
    }

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      const user = session?.user ?? null;

      dispatch(setUser(user));

      if (user) {
        // Only fetch profile if it's a different user or we haven't fetched it yet
        if (lastFetchedUserId.current !== user.id) {
          console.log("Fetching profile for user:", user.id);
          lastFetchedUserId.current = user.id;
          dispatch(fetchUserProfile(user.id));
        }
      } else {
        // Clear profile when user signs out
        dispatch(setProfile(null));
        lastFetchedUserId.current = null;
      }

      // Handle specific auth events
      switch (event) {
        case "SIGNED_IN":
          console.log("User signed in:", user?.email);
          break;
        case "SIGNED_OUT":
          console.log("User signed out");
          dispatch(resetAuth());
          break;
        case "TOKEN_REFRESHED":
          console.log("Token refreshed");
          // Don't fetch profile on token refresh
          break;
        case "USER_UPDATED":
          console.log("User updated");
          // Only fetch profile if user actually changed
          if (user && user.id !== currentUser?.id) {
            dispatch(fetchUserProfile(user.id));
          }
          break;
      }
    });

    // Cleanup subscription on unmount
    return () => {
      subscription.unsubscribe();
    };
  }, [dispatch, initialized, currentUser?.id]);

  return <>{children}</>;
}
