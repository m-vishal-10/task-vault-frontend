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
import { useTasks } from '@/contexts/TaskContext';
import { createClientComponentClient } from "@supabase/auth-helpers-nextjs";

function PasswordRecoveryInline() {
  const [show, setShow] = useState(false);
  const [token, setToken] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();
  const supabase = createClientComponentClient();

  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash.substring(1);
      const params = new URLSearchParams(hash);
      if (params.get("type") === "recovery" && params.get("access_token")) {
        setToken(params.get("access_token") || "");
        setShow(true);
      }
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!token) {
      setError("Missing token.");
      return;
    }
    await supabase.auth.setSession({ access_token: token, refresh_token: "" });
  const { error } = await supabase.auth.updateUser({ password: newPassword });
    if (error) {
      setError(error.message);
    } else {
      setSuccess("Password updated! You can now log in.");
      setTimeout(() => router.push("/login"), 2000);
    }
  };

  if (!show) return null;
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8 fixed inset-0 z-50" style={{ background: "rgba(0,0,0,0.5)" }}>
      <div className="max-w-md w-full space-y-8 bg-white p-8 rounded shadow">
        <h2 className="text-center text-2xl font-bold">Reset your password</h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          <input
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={e => setNewPassword(e.target.value)}
            required
            className="appearance-none rounded relative block w-full px-3 py-2 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
          <button
            type="submit"
            className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Set New Password
          </button>
          {error && <div className="text-red-600 text-sm text-center">{error}</div>}
          {success && <div className="text-green-600 text-sm text-center">{success}</div>}
        </form>
      </div>
    </div>
  );
}

export default function HomePage() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const { setFilter, currentFilter } = useTasks();

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
    <>
      <PasswordRecoveryInline />
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
  onViewAll={() => setFilter('all')}
  onViewCompleted={() => setFilter('completed')}
/>
            </div>
            
            {/* Search Filter */}
            <div className="mb-6">
            <SearchFilter 
  currentFilter={currentFilter}
  onFilterChange={(filter) => setFilter(filter as 'all' | 'active' | 'completed')}
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
    </>
  );
}