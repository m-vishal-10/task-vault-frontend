import { Category, Task, User } from "@/types";

// api.ts
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

interface Session {
  access_token: string;
  refresh_token: string;
  expires_at: number;
}

interface AuthResponse {
  user: User;
  session: Session | null;
  message?: string;
  requiresEmailConfirmation?: boolean;
}

class ApiService {
  private getAuthHeaders(): HeadersInit {
    const token = localStorage.getItem('access_token');
    return {
      'Content-Type': 'application/json',
      ...(token && { Authorization: `Bearer ${token}` }),
    };
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      
      if (response.status === 401) {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        window.location.href = '/login';
        throw new Error('Authentication required. Please log in.');
      }
      
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    return response.json();
  }

  // Authentication endpoints
  async signup(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signup`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
    }
    
    return data;
  }

  async signin(email: string, password: string): Promise<AuthResponse> {
    const response = await fetch(`${API_BASE_URL}/auth/signin`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });
    const data = await this.handleResponse<AuthResponse>(response);
    
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
    }
    
    return data;
  }

  async signout(): Promise<void> {
    const response = await fetch(`${API_BASE_URL}/auth/signout`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
    });
    
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    
    await this.handleResponse(response);
  }

  async getCurrentUser(): Promise<{ user: User }> {
    const response = await fetch(`${API_BASE_URL}/auth/me`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ user: User }>(response);
  }

  async refreshSession(refreshToken: string): Promise<{ session: Session }> {
    const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ refresh_token: refreshToken }),
    });
    const data = await this.handleResponse<{ session: Session }>(response);
    
    if (data.session?.access_token) {
      localStorage.setItem('access_token', data.session.access_token);
      localStorage.setItem('refresh_token', data.session.refresh_token);
    }
    
    return data;
  }

  async forgotPassword(email: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email }),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  async resetPassword(email: string, token: string, newPassword: string): Promise<{ message: string }> {
    const response = await fetch(`${API_BASE_URL}/auth/reset-password`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, token, newPassword }),
    });
    return this.handleResponse<{ message: string }>(response);
  }

  // Task endpoints
  async getTasks(): Promise<{ tasks: Task[] }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ tasks: Task[] }>(response);
  }

  async getTask(id: string): Promise<{ task: Task }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ task: Task }>(response);
  }

  async createTask(taskData: {
    title: string;
    description?: string;
    status?: string;
    priority?: string;
    due_date?: string;
    category?: string;
  }): Promise<{ task: Task }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return this.handleResponse<{ task: Task }>(response);
  }

  async updateTask(
    id: string, 
    taskData: Partial<{
      title: string;
      description: string;
      status: string;
      priority: string;
      due_date: string;
      category: string;
    }>
  ): Promise<{ task: Task }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'PUT',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(taskData),
    });
    return this.handleResponse<{ task: Task }>(response);
  }

  async deleteTask(id: string): Promise<void> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks/${id}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });
    await this.handleResponse(response);
  }

  async getTasksByStatus(status: string): Promise<{ tasks: Task[] }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks/status/${status}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ tasks: Task[] }>(response);
  }

  async getTasksByPriority(priority: string): Promise<{ tasks: Task[] }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks/priority/${priority}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ tasks: Task[] }>(response);
  }

  // Category endpoints
  async getCategories(): Promise<{ categories: Category[] }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/categories`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ categories: Category[] }>(response);
  }

  async createCategory(categoryData: { name: string }): Promise<{ category: Category }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/categories`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify(categoryData),
    });
    return this.handleResponse<{ category: Category }>(response);
  }

  async getTasksByCategory(category: string): Promise<{ tasks: Task[] }> {
    if (!this.isAuthenticated()) {
      throw new Error('Authentication required. Please log in.');
    }

    const response = await fetch(`${API_BASE_URL}/tasks/category/${encodeURIComponent(category)}`, {
      headers: this.getAuthHeaders(),
    });
    return this.handleResponse<{ tasks: Task[] }>(response);
  }

  // Utility methods
  isAuthenticated(): boolean {
    return !!localStorage.getItem('access_token');
  }

  getAccessToken(): string | null {
    return localStorage.getItem('access_token');
  }

  getRefreshToken(): string | null {
    return localStorage.getItem('refresh_token');
  }
}

export const apiService = new ApiService();