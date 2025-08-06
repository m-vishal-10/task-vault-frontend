import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { ThemeProvider } from '@/contexts/ThemeContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { TaskProvider } from '@/contexts/TaskContext'
import { CategoryProvider } from '@/contexts/CategoryContext'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'Task Vault',
  description: 'A modern task management application',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <ThemeProvider>
          <AuthProvider>
            <CategoryProvider>
              <TaskProvider>
                {children}
              </TaskProvider>
            </CategoryProvider>
          </AuthProvider>
        </ThemeProvider>
      </body>
    </html>
  )
}
