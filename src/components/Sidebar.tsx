'use client';

import { useAuth } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  collapsed: boolean;
  onCollapseToggle: () => void;
}

export default function Sidebar({ isOpen, onToggle, collapsed }: SidebarProps) {
  const { user, signout } = useAuth();

  if (!user) return null;

  const handleLogout = async () => {
    try {
      await signout();
    } catch (error) {
      console.error('Logout error:', error);
    }
  };

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed inset-y-0 left-0 z-50 ${collapsed ? 'w-20' : 'w-64'} bg-gray-900 border-r border-gray-800 transform transition-all duration-300 ease-in-out
          ${isOpen ? 'translate-x-0' : '-translate-x-full'} lg:translate-x-0`}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={`flex items-center ${collapsed ? 'justify-center' : 'justify-between'} h-16 px-4 border-b border-gray-800`}>
            {!collapsed && <h1 className="text-lg font-bold text-white">Task Vault</h1>}
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-800"
              aria-label="Close sidebar"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>

          {/* User Info */}
          <div className={`px-4 py-4 border-b border-gray-800 ${collapsed ? 'text-center' : ''}`}>
            <div className={`flex items-center ${collapsed ? 'justify-center' : ''}`}>
              <div className="h-9 w-9 rounded-full bg-indigo-600 flex items-center justify-center">
                <span className="text-sm font-semibold text-white">
                  {user.email?.[0].toUpperCase()}
                </span>
              </div>
              {!collapsed && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-white truncate">
                    {user.email}
                  </p>
                  <p className="text-xs text-gray-400">Online</p>
                </div>
              )}
            </div>
          </div>

          {/* Navigation Links */}
          <nav className="flex-1 px-3 py-4 overflow-y-auto space-y-6">
            {/* Quick Actions */}
            <div>
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Quick Actions
                </h3>
              )}
              {[
                { name: 'Add New Task', icon: 'plus', href: '#' },
                { name: 'All Tasks', icon: 'folder', href: '#' },
                { name: 'Completed', icon: 'check-circle', href: '#' },
              ].map((item) => (
                <a
                  key={item.name}
                  href={item.href}
                  className={`group flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition`}
                  title={collapsed ? item.name : undefined}
                >
                  <span className={`${collapsed ? '' : 'mr-3'} h-5 w-5 text-gray-400 group-hover:text-white`}>
                    •
                  </span>
                  {!collapsed && item.name}
                </a>
              ))}
            </div>

            {/* Settings & Logout */}
            <div>
              {!collapsed && (
                <h3 className="px-3 text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                  Settings
                </h3>
              )}
              <a
                href="#"
                className={`group flex items-center ${collapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition`}
                title={collapsed ? "Preferences" : undefined}
              >
                <span className={`${collapsed ? '' : 'mr-3'} h-5 w-5 text-gray-400 group-hover:text-white`}>⚙️</span>
                {!collapsed && "Preferences"}
              </a>

              <button
                onClick={handleLogout}
                className={`group flex items-center w-full ${collapsed ? 'justify-center' : 'px-3'} py-2 text-sm font-medium rounded-md text-gray-300 hover:text-white hover:bg-gray-800 transition`}
                title={collapsed ? "Sign Out" : undefined}
              >
                <span className={`${collapsed ? '' : 'mr-3'} h-5 w-5 text-gray-400 group-hover:text-white`}>🚪</span>
                {!collapsed && "Sign Out"}
              </button>
            </div>
          </nav>
        </div>
      </aside>
    </>
  );
}