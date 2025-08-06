'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import Header from '@/components/Header';
import TaskList from '@/components/TaskList';
import TaskForm from '@/components/TaskForm';
import Stats from '@/components/Stats';
import QuickActions from '@/components/QuickActions';
import SearchFilter from '@/components/SearchFilter';
import Breadcrumb from '@/components/Breadcrumb';

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [currentFilter, setCurrentFilter] = useState<'all' | 'active' | 'completed'>('all');

  useEffect(() => {
    if (!loading && !user) {
      router.push('/login');
    }
  }, [user, loading, router]);

  const handleAddTaskClick = () => {
    setIsTaskFormOpen(true);
  };

  const handleTaskFormClose = () => {
    setIsTaskFormOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 dark:bg-gray-900">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-4 text-gray-600 dark:text-gray-400">Loading...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // Will redirect to login
  }


  return (
    <div className="min-h-screen bg-gray-950">
      <Header />
      
      <main className="pt-16">  
        <div className="px-4 sm:px-6 lg:px-8 py-6">
          <Breadcrumb />
          
          {/* Stats at the top */}
          <div className="mb-8">
            <Stats />
          </div>
          
          {/* Quick Actions */}
          <div className="mb-6">
          <QuickActions 
              onAddTaskClick={handleAddTaskClick}
              onViewAll={() => setCurrentFilter('all')}
              onViewCompleted={() => setCurrentFilter('completed')}
            />
          </div>
          
          {/* Search Filter */}
          <div className="mb-6">
          <SearchFilter 
              currentFilter={currentFilter}
              onFilterChange={(filter) => setCurrentFilter(filter as 'all' | 'active' | 'completed')}
            />

          </div>
          
          {/* Task List - now full width */}
          <div className="bg-gray-800 rounded-lg border border-gray-700 p-4 sm:p-6">
            <div className="flex items-center justify-between mb-6">
              <h1 className="text-2xl font-bold text-white">
                My Tasks
              </h1>
            </div>
            <TaskList />
          </div>
        </div>
      </main>

      {/* Task Form Modal */}
      {isTaskFormOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
          <div className="bg-gray-800 rounded-lg border border-gray-700 w-full max-w-md">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold text-white">Add New Task</h2>
                <button
                  onClick={handleTaskFormClose}
                  className="text-gray-400 hover:text-white"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              <TaskForm onSuccess={handleTaskFormClose}  onClose={handleTaskFormClose}/>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}