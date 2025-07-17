import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function generateDeviceFingerprint() {
  // Simple device fingerprinting for anonymous users
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')
  ctx.textBaseline = 'top'
  ctx.font = '14px Arial'
  ctx.fillText('Device fingerprint', 2, 2)
  
  const fingerprint = canvas.toDataURL() + 
    navigator.userAgent + 
    navigator.language + 
    screen.width + 
    screen.height + 
    new Date().getTimezoneOffset()
  
  return btoa(fingerprint).slice(0, 20)
}

export const upscQuotes = [
  "Success is a series of small wins",
  "Every expert was once a beginner",
  "Consistency beats perfection",
  "Your dedication will pay off",
  "Focus on progress, not perfection",
  "The best time to plant a tree was 20 years ago. The second best time is now",
  "A journey of a thousand miles begins with a single step",
  "Success is not final, failure is not fatal: it is the courage to continue that counts"
]

export function getRandomQuote() {
  return upscQuotes[Math.floor(Math.random() * upscQuotes.length)]
}

export function formatScore(score, total = 250) {
  const percentage = (score / total) * 100
  if (percentage >= 80) return { grade: 'A+', color: 'text-green-600' }
  if (percentage >= 70) return { grade: 'A', color: 'text-green-500' }
  if (percentage >= 60) return { grade: 'B+', color: 'text-blue-600' }
  if (percentage >= 50) return { grade: 'B', color: 'text-blue-500' }
  if (percentage >= 40) return { grade: 'C+', color: 'text-yellow-600' }
  if (percentage >= 30) return { grade: 'C', color: 'text-yellow-500' }
  return { grade: 'D', color: 'text-red-500' }
}
