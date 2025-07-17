import { cn } from '../../lib/utils'

export function Progress({ value, className, ...props }) {
  return (
    <div className={cn('w-full bg-gray-200 rounded-full h-2', className)} {...props}>
      <div 
        className="bg-primary-600 h-2 rounded-full transition-all duration-300"
        style={{ width: `${value}%` }}
      />
    </div>
  )
}
