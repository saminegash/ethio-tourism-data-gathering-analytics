export interface CreateUserData {
  email: string;
  password?: string;
  full_name: string;
  role: "admin" | "viewer" | "api_client" | "partner";
}

export interface UserWithProfile {
  id: string;
  email: string;
  created_at: string;
  profile: {
    role: string;
    full_name: string;
  } | null;
}

// Default password for new users
const DEFAULT_PASSWORD = "TempPassword123!";

export class UserService {
  // Create a new user (admin only) - through API route
  static async createUser(
    userData: CreateUserData
  ): Promise<{ data: any; error: any }> {
    try {
      const response = await fetch("/api/admin/users", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(userData),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Get all users with profiles (admin/super_agent only) - through API route
  static async getAllUsers(): Promise<{
    data: UserWithProfile[] | null;
    error: any;
  }> {
    try {
      const response = await fetch("/api/admin/users", {
        method: "GET",
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Update user role (admin/super_agent only) - through API route
  static async updateUserRole(
    userId: string,
    newRole: string
  ): Promise<{ data: any; error: any }> {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ role: newRole }),
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Delete user (admin only) - through API route
  static async deleteUser(userId: string): Promise<{ data: any; error: any }> {
    try {
      const response = await fetch(`/api/admin/users/${userId}`, {
        method: "DELETE",
      });

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }

  // Reset user password (admin/super_agent only) - through API route
  static async resetUserPassword(
    userId: string,
    newPassword?: string
  ): Promise<{ data: any; error: any }> {
    try {
      const response = await fetch(
        `/api/admin/users/${userId}/reset-password`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ password: newPassword }),
        }
      );

      const result = await response.json();

      if (!response.ok) {
        return { data: null, error: { message: result.error } };
      }

      return { data: result.data, error: null };
    } catch (error: any) {
      return { data: null, error: { message: error.message } };
    }
  }
}
