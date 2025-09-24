export const runtime = 'edge'
import Image from 'next/image'
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
    <div className='space-y-12'>
      <h1 className='font-display text-3xl md:text-4xl font-extrabold tracking-tight'>{title}</h1>
      <ClientGrid play={play} metas={metas} captions={captions} />
    </div>
  )
}
