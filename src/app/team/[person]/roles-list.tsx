type Role = {
  role: string
  play: string
}

type RolesListProps = {
  roles: Role[]
}

export default function RolesList({ roles }: RolesListProps) {
  return (
    <ul className='grid sm:grid-cols-2 gap-3 text-sm'>
      {roles.map((x, i) => (
        <li
          key={`${x.play}-${i}`}
          className='group relative overflow-hidden rounded-lg border border-site-700 bg-gradient-to-br from-site-800 to-site-900 p-4 transition-all duration-300 hover:border-kolping-500/50'
        >
          {/* Subtle background pattern */}
          <div className='absolute inset-0 opacity-5 bg-gradient-to-br from-kolping-500/20 to-transparent pointer-events-none' />
          
          <div className='relative space-y-1.5'>
            <div className='flex items-center gap-2'>
              <div className='w-8 h-0.5 bg-gradient-to-r from-kolping-500 to-transparent rounded-full' />
              <span className='text-xs text-site-100 font-mono uppercase tracking-wider'>
                {x.play.replace('(Kreativbühne)', '')}
              </span>
            </div>
            <div className='flex items-baseline gap-2'>
              <svg className='w-4 h-4 text-kolping-500 flex-shrink-0 mt-0.5' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z' />
              </svg>
              <span className='font-display font-bold text-base text-site-50'>
                {x.role}
              </span>
            </div>
          </div>
        </li>
      ))}
      {roles.length === 1 && (
        // Add empty block
        <li
          key={`empty-1`}
          className='group relative overflow-hidden rounded-lg border border-site-700 bg-gradient-to-br from-site-800 to-site-900 p-4 transition-all duration-300 hover:border-kolping-500/50'
        >
          {/* Subtle background pattern */}
          <div className='absolute inset-0 opacity-5 bg-gradient-to-br from-kolping-500/20 to-transparent pointer-events-none' />
          
          <div className='relative space-y-1.5'>
            <div className='flex items-baseline gap-2'>
            </div>
          </div>
        </li>
      )}
      
    </ul>
  )
}

