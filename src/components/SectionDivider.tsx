
export default function SectionDivider({ title, subtitle }: { title: string; subtitle?: string }) {
    return (
        <div className='relative py-8 sm:py-12'>
            {/* Curtain drape decoration */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
                <div className='absolute top-0 left-1/2 -translate-x-1/2 w-[200%] h-16' />
            </div>

            <div className='relative text-center space-y-3'>
                <div className='flex items-center justify-center gap-4'>
                    {/* Left decorative flourish */}
                    <div className='hidden sm:flex items-center gap-2'>
                        <div className='w-8 h-px bg-gradient-to-l from-kolping-500 to-transparent' />
                        <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
                        <div className='w-16 h-px bg-gradient-to-l from-kolping-500/80 to-transparent' />
                    </div>

                    <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-kolping-400 drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]'>
                        {title}
                    </h2>

                    {/* Right decorative flourish */}
                    <div className='hidden sm:flex items-center gap-2'>
                        <div className='w-16 h-px bg-gradient-to-r from-kolping-500/80 to-transparent' />
                        <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
                        <div className='w-8 h-px bg-gradient-to-r from-kolping-500 to-transparent' />
                    </div>
                </div>

                {subtitle && (
                    <p className='text-site-100 text-sm sm:text-base max-w-lg mx-auto'>
                        {subtitle}
                    </p>
                )}
            </div>
        </div>
    )
}
