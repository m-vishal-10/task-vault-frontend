'use client';

import { useAuth } from '@/contexts/AuthContext';
import { useTasks } from '@/contexts/TaskContext';

export default function Stats() {
  const { user, loading: authLoading } = useAuth();
  const { tasks, loading } = useTasks();

  // Don't render anything if auth is still loading
  if (authLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[...Array(4)].map((_, i) => (
          <div
            key={i}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-6 animate-pulse"
          >
            <div className="flex items-center">
              <div className="flex-shrink-0 p-3 rounded-lg bg-gray-200 dark:bg-gray-700">
                <div className="w-6 h-6 bg-gray-300 dark:bg-gray-600 rounded"></div>
              </div>
              <div className="ml-4">
                <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-20 mb-2"></div>
                <div className="h-6 bg-gray-200 dark:bg-gray-700 rounded w-12"></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Don't render if user is not authenticated
  if (!user) {
    return null;
  }

  // Safely handle undefined or empty tasks
  const safeTasks = tasks || [];

  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter(task => task.status === 'completed').length;
  const activeTasks = totalTasks - completedTasks;
  const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const stats = [
    {
      name: 'Total Tasks',
      value: loading ? '...' : totalTasks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      color: 'bg-blue-500',
    },
    {
      name: 'Active Tasks',
      value: loading ? '...' : activeTasks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-yellow-500',
    },
    {
      name: 'Completed',
      value: loading ? '...' : completedTasks,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      color: 'bg-green-500',
    },
    {
      name: 'Completion Rate',
      value: loading ? '...' : `${completionRate}%`,
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
        </svg>
      ),
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      {stats.map((stat) => (
        <div
          key={stat.name}
          className="bg-gray-800 rounded-lg border border-gray-700 p-6"
        >
          <div className="flex items-center">
            <div className={`flex-shrink-0 p-3 rounded-lg ${stat.color} bg-opacity-20`}>
              <div className={`w-6 h-6 ${stat.color.replace('bg-', 'text-')}`}>
                {stat.icon}
              </div>
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-400">
                {stat.name}
              </p>
              <p className="text-2xl font-semibold text-white">
                {stat.value}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
} 