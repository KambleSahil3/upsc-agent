import { useState, useEffect } from 'react'
import { Card } from './ui/Card'
import { getRandomQuote } from '../lib/utils'

export function LoadingScreen() {
  const [quote, setQuote] = useState('')
  const [dots, setDots] = useState('.')

  useEffect(() => {
    setQuote(getRandomQuote())
    
    const interval = setInterval(() => {
      setDots(prev => prev.length >= 3 ? '.' : prev + '.')
    }, 500)

    return () => clearInterval(interval)
  }, [])

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 to-secondary-50 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="max-w-md w-full text-center">
        <div className="p-8">
          <div className="mb-6">
            <div className="relative">
              <div className="h-16 w-16 mx-auto mb-4 bg-primary-600 rounded-full flex items-center justify-center">
                <span className="text-2xl animate-bounce">📝</span>
              </div>
              <div className="absolute -top-2 -right-2 h-6 w-6 bg-yellow-400 rounded-full animate-pulse"></div>
            </div>
          </div>

          <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
            Evaluating like a UPSC examiner{dots}
          </h2>
          
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Hold your coffee tight ☕, this might take a minute...
          </p>

          <div className="bg-primary-50 dark:bg-primary-900/20 rounded-lg p-4 mb-6">
            <p className="text-sm text-primary-700 dark:text-primary-300 italic">
              "{quote}"
            </p>
          </div>

          <div className="flex justify-center space-x-2">
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce"></div>
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="h-2 w-2 bg-primary-600 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </Card>
    </div>
  )
}
