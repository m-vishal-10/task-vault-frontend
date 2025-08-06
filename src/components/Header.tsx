'use client';

import { useAuth } from '@/contexts/AuthContext';

export default function Header() {
  const { user, signout } = useAuth();

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-900 border-b border-gray-800 z-40">
      <div className="px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Left side - App title */}
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-white">Task Vault</h1>
          </div>

          {/* Right side - User info and actions */}
          <div className="flex items-center gap-4">
            {user && (
              <div className="hidden sm:flex items-center gap-2">
                <div className="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center">
                  <span className="text-sm font-semibold text-white">
                    {user.email?.[0].toUpperCase()}
                  </span>
                </div>
                <span className="text-sm text-gray-300">
                  {user.email}
                </span>
              </div>
            )}
            
            <button
              onClick={handleLogout}
              className="flex items-center gap-1 px-3 py-1.5 text-sm font-medium text-gray-300 hover:text-white hover:bg-gray-800 rounded-md transition-colors"
            >
              <span className="hidden sm:inline">Sign Out</span>
              <svg 
                className="w-5 h-5 sm:hidden" 
                fill="none" 
                stroke="currentColor" 
                viewBox="0 0 24 24"
              >
                <path 
                  strokeLinecap="round" 
                  strokeLinejoin="round" 
                  strokeWidth={2} 
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" 
                />
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}