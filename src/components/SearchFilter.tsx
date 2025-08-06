'use client';

import { useState, useEffect } from 'react';
import { useTasks } from '@/contexts/TaskContext';
import { useCategories } from '@/contexts/CategoryContext';

interface SearchFilterProps {
  currentFilter?: string;
  onFilterChange?: (filter: string) => void;
}

export default function SearchFilter({ 
  currentFilter: propFilter, 
  onFilterChange 
}: SearchFilterProps = {}) {
  const { 
    currentFilter: contextFilter, 
    searchQuery: contextSearchQuery, 
    categoryFilter,
    setFilter: contextSetFilter, 
    setSearch, 
    setCategoryFilter 
  } = useTasks();
  
  // Use prop filter if provided, otherwise use context filter
  const currentFilter = propFilter !== undefined ? propFilter : contextFilter;
  const setFilter = onFilterChange || contextSetFilter;
  
  const { categories } = useCategories();
  const [searchQuery, setSearchQuery] = useState(contextSearchQuery);

  // Sync local search query with context
  useEffect(() => {
    setSearchQuery(contextSearchQuery);
  }, [contextSearchQuery]);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const query = e.target.value;
    setSearchQuery(query);
    setSearch(query);
  };

  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const category = e.target.value || null;
    setCategoryFilter(category);
  };

  const filters = [
    { key: 'all', label: 'All', count: 0 },
    { key: 'active', label: 'Active', count: 0 },
    { key: 'completed', label: 'Completed', count: 0 },
  ] as const;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6 transition-colors duration-200">
      <div className="space-y-4">
        {/* Search and Category Filter Row */}
        <div className="flex flex-col sm:flex-row gap-4">
          {/* Search */}
          <div className="flex-1">
            <label htmlFor="search" className="sr-only">
              Search tasks
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <input
                id="search"
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                placeholder="Search tasks..."
              />
            </div>
          </div>

          {/* Category Filter */}
          <div className="w-full sm:w-48">
            <select
              value={categoryFilter || ''}
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg leading-5 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
            >
              <option value="">All Categories</option>
              {categories.map((category) => (
                <option key={category.id} value={category.name}>
                  {category.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Status Filters */}
        <div className="flex space-x-2">
          {filters.map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilter(filter.key)}
              className={`px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200 ${
                currentFilter === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
              }`}
            >
              {filter.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}