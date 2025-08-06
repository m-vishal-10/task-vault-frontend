'use client';

import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Category } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

interface CategoryContextType {
  categories: Category[];
  loading: boolean;
  error: string | null;
  loadCategories: () => Promise<void>;
  createCategory: (name: string) => Promise<Category>;
  refreshCategories: () => Promise<void>;
}

const CategoryContext = createContext<CategoryContextType | undefined>(undefined);

export function CategoryProvider({ children }: { children: ReactNode }) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const loadCategories = useCallback(async () => {
    if (authLoading || !user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getCategories();
      setCategories(response.categories || []);
    } catch (error) {
      console.error('Error loading categories:', error);
      setError('Failed to load categories. Please try again.');
      setCategories([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, user]);

  const createCategory = async (name: string): Promise<Category> => {
    try {
      setError(null);
      const response = await apiService.createCategory({ name });
      await loadCategories(); // Refresh categories after creation
      return response.category;
    } catch (error) {
      console.error('Error creating category:', error);
      setError('Failed to create category. Please try again.');
      throw error;
    }
  };

  const refreshCategories = async () => {
    await loadCategories();
  };

  // Load categories when user changes
  useEffect(() => {
    if (!authLoading && user) {
      loadCategories();
    }
  }, [user, authLoading, loadCategories]);

  return (
    <CategoryContext.Provider value={{
      categories,
      loading,
      error,
      loadCategories,
      createCategory,
      refreshCategories
    }}>
      {children}
    </CategoryContext.Provider>
  );
}

export function useCategories() {
  const context = useContext(CategoryContext);
  if (context === undefined) {
    throw new Error('useCategories must be used within a CategoryProvider');
  }
  return context;
}
