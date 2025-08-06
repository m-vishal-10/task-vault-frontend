'use client';

interface BreadcrumbProps {
  items?: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
}

export default function Breadcrumb({ items = [] }: BreadcrumbProps) {
  return (
    <nav className="flex mb-6" aria-label="Breadcrumb">
      <ol className="flex items-center space-x-2">
        {items.map((item, index) => (
          <li key={item.label} className="flex items-center">
            {index > 0 && (
              <svg className="flex-shrink-0 h-4 w-4 text-gray-400 dark:text-gray-500" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            )}
            {item.current ? (
              <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                {item.label}
              </span>
            ) : item.href ? (
              <a
                href={item.href}
                className="text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors duration-200"
              >
                {item.label}
              </a>
            ) : (
              <span className="text-sm font-medium text-gray-700 dark:text-gray-300">
                {item.label}
              </span>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
} 