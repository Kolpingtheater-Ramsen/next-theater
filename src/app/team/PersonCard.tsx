
import Image from 'next/image'
import Link from 'next/link'

export type Person = {
    id: string
    name?: string
    images?: number
    placeholderAvatar?: boolean
}

function avatarPath(id: string) {
    const filename = `${id}.jpg`
    return `/img/team/avatar/${filename}`
}

export default function PersonCard({
    person,
    type,
    index
}: {
    person: Person
    type: 'current' | 'former' | 'tech'
    index: number
}) {
    const isFormer = type === 'former'
    const isTech = type === 'tech'

    return (
        <Link
            href={`/team/${encodeURIComponent(person.id)}`}
            className='group relative block'
            aria-label={`Profil von ${person.name ?? person.id} ansehen${isFormer ? ' (ehemalig)' : ''}`}
            style={{
                viewTransitionName: `person-${person.id}`,
                animationDelay: `${index * 50}ms`,
            }}
        >
            {/* Card container with epic glow */}
            <div className={`
        relative poster-frame border-epic bg-site-800 
        transition-all duration-500 ease-out
        hover:scale-[1.03] hover:-translate-y-2
        animate-fade-in-up
        ${isFormer ? 'opacity-85 hover:opacity-100' : ''}
      `}>
                {/* Theatrical spotlight glow on hover */}
                <div className='absolute -inset-4 bg-gradient-to-b from-kolping-500/20 via-kolping-500/5 to-transparent rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl pointer-events-none' />

                {/* Image container */}
                <div className='relative aspect-[3/4] overflow-hidden bg-site-800'>
                    {/* Animated spotlight beam */}
                    <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none z-10'>
                        <div className='absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-kolping-500/20 via-transparent to-transparent' />
                    </div>

                    <Image
                        src={
                            person.placeholderAvatar
                                ? '/img/team/avatar/placeholder.svg'
                                : avatarPath(person.id)
                        }
                        alt={person.name ?? person.id}
                        fill
                        className={`
              object-cover transition-all duration-700 ease-out
              group-hover:scale-110 group-hover:brightness-110
              ${isFormer ? 'filter sepia-[0.3] grayscale-[0.2] group-hover:sepia-[0.1] group-hover:grayscale-[0]' : ''}
            `}
                        style={{
                            viewTransitionName: `person-image-${person.id}`,
                        }}
                    />

                    {/* Dramatic gradient overlays */}
                    <div className='absolute inset-x-0 bottom-0 h-32 bg-gradient-to-t from-black via-black/60 to-transparent z-10' />
                    <div className='absolute inset-0 bg-gradient-to-r from-black/20 via-transparent to-black/20 z-10' />

                    {/* Type badge */}
                    {isTech && (
                        <div className='absolute top-3 right-3 z-20'>
                            <div className='px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-sm border border-kolping-500/40'>
                                <span className='text-[10px] font-bold uppercase tracking-wider text-kolping-400'>Crew</span>
                            </div>
                        </div>
                    )}

                    {/* Name overlay on image */}
                    <div className='absolute bottom-0 inset-x-0 p-4 z-20'>
                        <h3 className='font-display font-bold text-lg sm:text-xl text-white group-hover:text-kolping-400 transition-colors duration-300 drop-shadow-lg'>
                            {person.name ?? person.id}
                        </h3>
                        <div className='flex items-center gap-2 mt-1'>
                            <div className='w-6 h-0.5 bg-kolping-500 rounded-full transition-all duration-500 group-hover:w-12' />
                            <span className='text-xs text-white/70 font-medium'>
                                {isFormer ? 'Ehemaliges Mitglied' : isTech ? 'Technik & Crew' : 'Schauspieler/in'}
                            </span>
                        </div>
                    </div>
                </div>

                {/* Bottom accent bar */}
                <div className='h-1 bg-gradient-to-r from-transparent via-kolping-500/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
            </div>
        </Link>
    )
}
