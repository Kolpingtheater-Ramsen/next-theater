export const runtime = 'edge'
import ClientGrid from './ClientGrid'
import pics from '@/data/pics.json'
import imagesMeta from '@/data/images.json'
import timeline from '@/data/timeline.json'
import { notFound } from 'next/navigation'
import Link from 'next/link'

type PhotoMeta = { width: number; height: number; alt: string; index: number }

export default async function PlayGalleryPage({
  params,
}: {
  params: Promise<{ play: string }>
}) {
  const { play } = await params
  const key = play as keyof typeof pics
  const captions = (pics as unknown as Record<string, string[]>)[key] as
    | string[]
    | undefined
  const metas = (imagesMeta as unknown as Record<string, PhotoMeta[]>)[key] as
    | PhotoMeta[]
    | undefined
  if (!captions || !metas) return notFound()
  const show = (
    timeline as unknown as { galleryHash?: string; header?: string; date?: string }[]
  ).find((t) => t.galleryHash === play)
  const title = show?.header ?? play
  const date = show?.date

  return (
    <div className='space-y-8 sm:space-y-12 md:space-y-16'>
      {/* Epic Hero Section */}
      <section className='relative -mt-8 pt-8 pb-12 sm:pb-16 overflow-hidden'>
        {/* Background theatrical elements */}
        <div className='absolute inset-0 pointer-events-none'>
          {/* Stage spotlights */}
          <div className='absolute top-0 left-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/10 to-transparent blur-3xl' />
          <div className='absolute top-0 right-1/4 w-96 h-96 bg-gradient-radial from-kolping-500/10 to-transparent blur-3xl' />
        </div>
        
        <div className='relative text-center space-y-6'>
          {/* Back link */}
          <Link 
            href='/gallery' 
            className='inline-flex items-center gap-2 text-site-300 hover:text-kolping-400 transition-colors duration-300 group'
          >
            <svg 
              className='w-4 h-4 transition-transform duration-300 group-hover:-translate-x-1' 
              fill='none' 
              viewBox='0 0 24 24' 
              stroke='currentColor'
            >
              <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M11 17l-5-5m0 0l5-5m-5 5h12' />
            </svg>
            <span className='text-sm font-medium'>Zurück zur Galerie</span>
          </Link>
          
          {/* Decorative top element */}
          <div className='flex justify-center'>
            <div className='relative'>
              <div className='absolute -inset-4 bg-kolping-500/20 blur-2xl rounded-full' />
              <svg className='relative w-12 h-12 text-kolping-500' fill='none' viewBox='0 0 24 24' stroke='currentColor'>
                <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={1} d='M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z' />
              </svg>
            </div>
          </div>
          
          <div className='space-y-2'>
            <h1 
              className='font-display text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-kolping-400 drop-shadow-[0_0_30px_rgba(255,122,0,0.4)]'
              style={{ viewTransitionName: `gallery-title-${play}` }}
            >
              {title}
            </h1>
            
            {date && (
              <div className='flex justify-center'>
                <div className='px-3 py-1 rounded-full bg-site-800/50 border border-kolping-500/30'>
                  <span className='text-sm font-mono text-kolping-400'>{date}</span>
                </div>
              </div>
            )}
          </div>
          
          <p className='text-site-100 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed'>
            Entdecken Sie die <span className='text-kolping-400'>Highlights</span> dieser Produktion – 
            {metas.length} unvergessliche Momente.
          </p>
        </div>
      </section>

      {/* Gallery Grid Section */}
      <section>
        {/* Section Divider */}
        <div className='relative py-8 sm:py-12'>
          <div className='relative text-center space-y-3'>
            <div className='flex items-center justify-center gap-4'>
              {/* Left decorative flourish */}
              <div className='hidden sm:flex items-center gap-2'>
                <div className='w-8 h-px bg-gradient-to-l from-kolping-500 to-transparent' />
                <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
                <div className='w-16 h-px bg-gradient-to-l from-kolping-500/80 to-transparent' />
              </div>
              
              <h2 className='font-display text-2xl sm:text-3xl md:text-4xl font-extrabold tracking-tight text-kolping-400 drop-shadow-[0_0_20px_rgba(255,122,0,0.3)]'>
                Fotogalerie
              </h2>
              
              {/* Right decorative flourish */}
              <div className='hidden sm:flex items-center gap-2'>
                <div className='w-16 h-px bg-gradient-to-r from-kolping-500/80 to-transparent' />
                <div className='w-2 h-2 rotate-45 bg-kolping-500/60' />
                <div className='w-8 h-px bg-gradient-to-r from-kolping-500 to-transparent' />
              </div>
            </div>
            
            <p className='text-site-100 text-sm sm:text-base max-w-lg mx-auto'>
              Klicken Sie auf ein Bild, um es in voller Größe zu betrachten
            </p>
          </div>
        </div>
        
        <ClientGrid play={play} metas={metas} captions={captions} />
      </section>
    </div>
  )
}
