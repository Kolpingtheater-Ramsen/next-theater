type LoadingSpinnerProps = {
  text?: string
  size?: 'sm' | 'md' | 'lg'
}

export default function LoadingSpinner({ text, size = 'md' }: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16'
  }

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  return (
    <div className='flex flex-col items-center justify-center gap-4 py-12'>
      <div className={`${sizeClasses[size]} relative`}>
        <div className='absolute inset-0 rounded-full border-4 border-site-700'></div>
        <div className='absolute inset-0 rounded-full border-4 border-kolping-500 border-t-transparent animate-spin'></div>
      </div>
      {text && (
        <p className={`${textSizeClasses[size]} text-site-100 animate-pulse`}>
          {text}
        </p>
      )}
    </div>
  )
}

