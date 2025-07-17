import Link from 'next/link'
import { ThemeToggle } from './ui/ThemeToggle'

export function Navbar() {
  return (
    <nav className="bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="flex items-center space-x-3">
            <div className="bg-primary-600 p-2 rounded-lg">
              <span className="text-white font-bold text-xl">📝</span>
            </div>
            <span className="text-xl font-bold text-gray-900 dark:text-white">
              UPSC Evaluator
            </span>
          </Link>
          
          <div className="flex items-center space-x-4">
            <ThemeToggle />
          </div>
        </div>
      </div>
    </nav>
  )
}
