'use client';

import { Task } from '@/types';

interface TaskItemProps {
  task: Task;
  onUpdate: (id: string, updates: Partial<Task>) => void;
  onDelete: (id: string) => void;
}

export default function TaskItem({ task, onUpdate, onDelete }: TaskItemProps) {
  const isCompleted = task.status === 'completed';
  const createdDate = new Date(task.created_at).toLocaleDateString();

  const handleToggleComplete = () => {
    const newStatus = isCompleted ? 'pending' : 'completed';
    onUpdate(task.id, { status: newStatus });
  };

  return (
    <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-600 p-4 mb-3 hover:shadow-xl hover:border-gray-500 transition-all duration-200">
      <div className="flex items-start gap-3">
        <input
          type="checkbox"
          checked={isCompleted}
          onChange={handleToggleComplete}
          className="mt-1 h-4 w-4 text-blue-400 rounded border-gray-500 focus:ring-blue-400 bg-gray-700"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <h3 
              className={`text-lg font-medium text-white ${
                isCompleted ? 'line-through text-gray-400' : ''
              }`}
            >
              {task.title}
            </h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.priority === 'high' ? 'bg-red-500/20 text-red-300 border border-red-500/30' :
              task.priority === 'medium' ? 'bg-yellow-500/20 text-yellow-300 border border-yellow-500/30' :
              'bg-green-500/20 text-green-300 border border-green-500/30'
            }`}>
              {task.priority}
            </span>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
              task.status === 'completed' ? 'bg-green-500/20 text-green-300 border border-green-500/30' :
              task.status === 'in_progress' ? 'bg-blue-500/20 text-blue-300 border border-blue-500/30' :
              'bg-gray-500/20 text-gray-300 border border-gray-500/30'
            }`}>
              {task.status.replace('_', ' ')}
            </span>
            {task.category && (
              <span className="px-2 py-1 text-xs font-medium rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30">
                {task.category}
              </span>
            )}
          </div>
          {task.description && (
            <p 
              className={`text-sm text-gray-600 dark:text-gray-300 mt-1 ${
                isCompleted ? 'line-through text-gray-400 dark:text-gray-500' : ''
              }`}
            >
              {task.description}
            </p>
          )}
          <div className="flex items-center gap-4 mt-2 text-xs text-gray-400 dark:text-gray-500">
            <span>Created: {createdDate}</span>
            {task.due_date && (
              <span>Due: {new Date(task.due_date).toLocaleDateString()}</span>
            )}
          </div>
        </div>
        <button
          onClick={() => onDelete(task.id)}
          className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300 transition-colors duration-200 p-1"
          title="Delete task"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>
    </div>
  );
} 