'use client';

interface QuickActionsProps {
  onAddTaskClick: () => void;
  onViewAll?: () => void;
  onViewCompleted?: () => void;
}

export default function QuickActions({ 
  onAddTaskClick, 
  onViewAll = () => {}, 
  onViewCompleted = () => {} 
}: QuickActionsProps) {
  const actions = [
    {
      name: 'Add New Task',
      description: 'Create a new task',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      ),
      onClick: onAddTaskClick,
      color: 'bg-blue-500',
    },
    {
      name: 'View All Tasks',
      description: 'See all your tasks',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
      ),
      onClick: onViewAll,
      color: 'bg-green-500',
    },
    {
      name: 'Completed Tasks',
      description: 'Review completed items',
      icon: (
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
      onClick: onViewCompleted,
      color: 'bg-purple-500',
    },
  ];

  return (
    <div className="mb-8">
      <h2 className="text-lg font-semibold text-white mb-4">Quick Actions</h2>
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {actions.map((action) => (
          <button
            key={action.name}
            onClick={action.onClick}
            className="bg-gray-800 rounded-lg border border-gray-700 p-6 text-left hover:shadow-md transition-all duration-200 group hover:border-gray-600"
          >
            <div className="flex items-center">
              <div className={`flex-shrink-0 p-3 rounded-lg ${action.color} bg-opacity-10 group-hover:bg-opacity-20 transition-all duration-200`}>
                <div className={`w-6 h-6 ${action.color.replace('bg-', 'text-')}`}>
                  {action.icon}
                </div>
              </div>
              <div className="ml-4">
                <h3 className="text-sm font-medium text-white group-hover:text-blue-400 transition-colors duration-200">
                  {action.name}
                </h3>
                <p className="text-sm text-gray-400">
                  {action.description}
                </p>
              </div>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}