'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { Task } from '@/types';
import { apiService } from '@/services/api';
import { useAuth } from './AuthContext';

interface TaskContextType {
  tasks: Task[];
  filteredTasks: Task[];
  loading: boolean;
  error: string | null;
  currentFilter: 'all' | 'active' | 'completed';
  searchQuery: string;
  categoryFilter: string | null;
  loadTasks: () => Promise<void>;
  createTask: (taskData: Omit<Partial<Task>, 'title'> & { title: string }) => Promise<void>;
  updateTask: (taskId: string, updates: Partial<Task>) => Promise<void>;
  deleteTask: (taskId: string) => Promise<void>;
  refreshTasks: () => Promise<void>;
  setFilter: (filter: 'all' | 'active' | 'completed') => void;
  setSearch: (query: string) => void;
  setCategoryFilter: (category: string | null) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'completed'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState<string | null>(null);
  const { user, loading: authLoading } = useAuth();

  const loadTasks = useCallback(async () => {
    if (authLoading || !user) return;
    
    try {
      setLoading(true);
      setError(null);
      const response = await apiService.getTasks();
      setTasks(response.tasks || []);
    } catch (error) {
      console.error('Error loading tasks:', error);
      setError('Failed to load tasks. Please try again.');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  }, [authLoading, user]);

  // ... (keep all other functions the same)

  // Load tasks when user changes
  useEffect(() => {
    if (!authLoading && user) {
      loadTasks();
    }
  }, [user, authLoading, loadTasks]);

  const createTask = async (taskData: Omit<Partial<Task>, 'title'> & { title: string }) => {
    try {
      setError(null);
      await apiService.createTask({
        title: taskData.title,
        description: taskData.description,
        status: taskData.status,
        priority: taskData.priority,
        due_date: taskData.due_date,
        category: taskData.category
      });
      await loadTasks();
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Please try again.');
      throw error;
    }
  };

  const updateTask = async (taskId: string, updates: Partial<Task>) => {
    try {
      setError(null);
      await apiService.updateTask(taskId, updates);
      // Refresh tasks after update
      await loadTasks();
    } catch (error) {
      console.error('Error updating task:', error);
      setError('Failed to update task. Please try again.');
      throw error;
    }
  };

  const deleteTask = async (taskId: string) => {
    try {
      setError(null);
      await apiService.deleteTask(taskId);
      // Refresh tasks after deletion
      await loadTasks();
    } catch (error) {
      console.error('Error deleting task:', error);
      setError('Failed to delete task. Please try again.');
      throw error;
    }
  };

  const refreshTasks = async () => {
    await loadTasks();
  };

  // Filter functions
  const setFilter = (filter: 'all' | 'active' | 'completed') => {
    setCurrentFilter(filter);
  };

  const setSearch = (query: string) => {
    setSearchQuery(query);
  };

  const setCategoryFilterValue = (category: string | null) => {
    setCategoryFilter(category);
  };

  // Compute filtered tasks
  const filteredTasks = React.useMemo(() => {
    let filtered = [...tasks];

    // Apply status filter
    if (currentFilter === 'active') {
      filtered = filtered.filter(task => task.status !== 'completed');
    } else if (currentFilter === 'completed') {
      filtered = filtered.filter(task => task.status === 'completed');
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase().trim();
      filtered = filtered.filter(task => 
        task.title.toLowerCase().includes(query) ||
        (task.description && task.description.toLowerCase().includes(query))
      );
    }

    // Apply category filter
    if (categoryFilter) {
      filtered = filtered.filter(task => task.category === categoryFilter);
    }

    return filtered;
  }, [tasks, currentFilter, searchQuery, categoryFilter]);

  // Load tasks when user changes
  useEffect(() => {
    if (!authLoading && user) {
      loadTasks();
    }
  }, [user, authLoading, loadTasks]);

  return (
    <TaskContext.Provider value={{
      tasks,
      filteredTasks,
      loading,
      error,
      currentFilter,
      searchQuery,
      categoryFilter,
      loadTasks,
      createTask,
      updateTask,
      deleteTask,
      refreshTasks,
      setFilter,
      setSearch,
      setCategoryFilter: setCategoryFilterValue
    }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTasks must be used within a TaskProvider');
  }
  return context;
}
