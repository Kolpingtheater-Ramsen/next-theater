export const runtime = 'edge'
import ClientGrid from './ClientGrid'
import pics from '@/data/pics.json'
import imagesMeta from '@/data/images.json'
import timeline from '@/data/timeline.json'
import { notFound } from 'next/navigation'

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
    timeline as unknown as { galleryHash?: string; header?: string }[]
  ).find((t) => t.galleryHash === play)
  const title = show?.header ?? play

  return (
    <div className='space-y-8 sm:space-y-12'>
      <div className='relative'>
        {/* Decorative theater curtain top accent */}
        <div className='absolute -top-4 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-kolping-500 to-transparent opacity-50' />
        
        <div className='text-center space-y-3'>
          <h1 
            className='font-display text-3xl sm:text-4xl md:text-5xl font-extrabold tracking-tight text-kolping-400'
            style={{ viewTransitionName: `gallery-title-${play}` }}
          >
            {title}
          </h1>
          <p className='text-site-100 text-sm'>
            Entdecken Sie die Highlights dieser Produktion
          </p>
        </div>
      </div>
      
      <ClientGrid play={play} metas={metas} captions={captions} />
    </div>
  )
}
