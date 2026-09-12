'use client'

import Image, { type ImageProps } from 'next/image'
import { useState } from 'react'
import placeholders from '@/data/image-placeholders.json'

type Placeholder = { width: number; height: number; blurDataURL: string }

function LoadingImage({
  src, alt, width, height, fill, className = '', style,
  blurDataURL, onLoad, onError, ...props
}: ImageProps) {
  const [loaded, setLoaded] = useState(false)
  const [failed, setFailed] = useState(false)
  const image = typeof src === 'string' ? undefined : 'default' in src ? src.default : src
  const path = typeof src === 'string' ? src : image!.src
  const metadata = (placeholders as Record<string, Placeholder>)[path]
  const imageWidth = Number(width ?? image?.width ?? metadata?.width)
  const imageHeight = Number(height ?? image?.height ?? metadata?.height)
  const preview = blurDataURL ?? image?.blurDataURL ?? metadata?.blurDataURL
  // Give the tiny preview the source's exact aspect ratio, including contain
  // layouts. Object fit/position are inherited by both image layers below.
  const previewSrc = preview && `data:image/svg+xml,${encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="${imageWidth}" height="${imageHeight}"><image href="${preview}" width="100%" height="100%" preserveAspectRatio="none"/></svg>`,
  )}`

  return (
    <span
      className={`progressive-image ${className}`}
      data-loaded={loaded}
      style={{
        position: fill ? 'absolute' : 'relative',
        ...(fill
          ? { inset: 0, width: '100%', height: '100%' }
          : { width: imageWidth, aspectRatio: `${imageWidth} / ${imageHeight}` }),
        ...style,
      }}
    >
      <span className='progressive-image-layers'>
        {previewSrc && (
          <Image
            src={previewSrc}
            alt=''
            aria-hidden='true'
            fill
            unoptimized
            loading='eager'
            className='progressive-image-placeholder'
          />
        )}
        <Image
          {...props}
          src={src}
          alt={alt}
          {...(fill ? { fill: true } : { width: imageWidth, height: imageHeight })}
          blurDataURL={preview}
          className='progressive-image-content'
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%' }}
          onLoad={(event) => {
            setLoaded(true)
            setFailed(false)
            onLoad?.(event)
          }}
          onError={(event) => {
            setFailed(true)
            onError?.(event)
          }}
        />
      </span>
      {failed && alt && (
        <span role='status' className='absolute inset-0 grid place-items-center bg-black/50 p-2 text-center text-xs text-white'>
          Bild konnte nicht geladen werden.
        </span>
      )}
    </span>
  )
}

export default function ProgressiveImage(props: ImageProps) {
  const src = typeof props.src === 'string' ? props.src : 'default' in props.src ? props.src.default.src : props.src.src
  // A new source owns a fresh load state, even during fast slideshow changes.
  return <LoadingImage key={src} {...props} />
}
