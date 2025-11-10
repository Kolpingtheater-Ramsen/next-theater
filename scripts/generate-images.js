/*
  Thumbnail optimizer and blurhash generator
  - Processes raw images in public/img/gallery_thumbs/{play}/Bild_*.jpg
  - Rotates images based on EXIF orientation
  - Compresses images larger than 3MB
  - Generates thumbnails (max width 1200px)
  - Emits src/data/images.json mapping { [play]: [{ width,height, tw, th, alt, index, blurhash }] }
*/

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { encode } = require('blurhash')

const ROOT = process.cwd()
const THUMBS_DIR = path.join(ROOT, 'public', 'img', 'gallery_thumbs')
const PICS_JSON = path.join(ROOT, 'src', 'data', 'pics.json')
const OUT_JSON = path.join(ROOT, 'src', 'data', 'images.json')

/**
 * @param {string} file
 * @param {number} compX
 * @param {number} compY
 */
async function computeBlurhash(file, compX = 4, compY = 3) {
  const image = sharp(file)
  const { width, height } = await image.metadata()
  const w = Math.min(64, width || 64)
  const h = Math.min(64, height || 64)
  const { data, info } = await image
    .raw()
    .ensureAlpha()
    .resize(w, h, { fit: 'inside' })
    .toBuffer({ resolveWithObject: true })
  const blurhash = encode(new Uint8ClampedArray(data), info.width, info.height, compX, compY)
  
  return { blurhash }
}

async function generate() {
  // Check if thumbs directory exists (won't exist in CI/CD)
  try {
    await fs.promises.access(THUMBS_DIR)
  } catch {
    console.log(`${THUMBS_DIR} not found - skipping image generation (using existing images.json)`)
    return
  }

  const plays = await fs.promises.readdir(THUMBS_DIR)
  /** @type {Record<string, { width:number, height:number, alt:string, index:number, blurhash:string, tw:number, th:number }[]>} */
  const output = {}

  /** @type {Record<string, string[]>} */
  let captionsByPlay = {}
  try {
    const raw = await fs.promises.readFile(PICS_JSON, 'utf-8')
    captionsByPlay = JSON.parse(raw)
  } catch {}

  for (const play of plays) {
    const thumbsPlayDir = path.join(THUMBS_DIR, play)
    const stat = await fs.promises.stat(thumbsPlayDir)
    if (!stat.isDirectory()) continue

    const files = (await fs.promises.readdir(thumbsPlayDir))
      .filter((f) => /^Bild_\d+\.jpe?g$/i.test(f))
      .sort((a, b) => {
        const ai = parseInt(a.match(/(\d+)/)?.[1] || '0', 10)
        const bi = parseInt(b.match(/(\d+)/)?.[1] || '0', 10)
        return ai - bi
      })

    if (!files.length) continue
    output[play] = []

    const captions = captionsByPlay[play] || []

    for (const file of files) {
      const index = parseInt(file.match(/(\d+)/)?.[1] || '0', 10) - 1
      const thumbPath = path.join(thumbsPlayDir, file)

      const img = sharp(thumbPath)
      const meta = await img.metadata()
      let width = meta.width || 0
      let height = meta.height || 0
      let needsProcessing = false

      // Check if image has EXIF orientation and needs rotation
      const hasExifOrientation = meta.orientation && meta.orientation > 1
      if (hasExifOrientation) {
        console.log(`Rotating ${play}/${file} (EXIF orientation: ${meta.orientation})`)
        needsProcessing = true
        // Rotate based on EXIF and strip all metadata
        await sharp(thumbPath)
          .rotate() // Sharp automatically rotates based on EXIF orientation
          .toFile(thumbPath + '.tmp')
        await fs.promises.rename(thumbPath + '.tmp', thumbPath)
        
        // Re-read metadata after rotation
        const rotatedMeta = await sharp(thumbPath).metadata()
        width = rotatedMeta.width || 0
        height = rotatedMeta.height || 0
      }

      // Check file size
      const stats = await fs.promises.stat(thumbPath)
      const fileSizeMB = stats.size / (1024 * 1024)
      const MAX_SIZE_MB = 1
      
      // Only process if image is above size threshold
      if (fileSizeMB > MAX_SIZE_MB) {
        console.log(`Compressing ${play}/${file} (${fileSizeMB.toFixed(2)}MB → target <${MAX_SIZE_MB}MB)`)
        needsProcessing = true
        const MAX_DIMENSION = 4000
        await sharp(thumbPath)
          .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true, mozjpeg: true })
          .toFile(thumbPath + '.tmp')
        
        // Replace original with resized version
        await fs.promises.rename(thumbPath + '.tmp', thumbPath)
        
        // Update dimensions
        const newMeta = await sharp(thumbPath).metadata()
        width = newMeta.width || 0
        height = newMeta.height || 0
      }

      // thumbnail target width per column layout (~3 columns desktop)
      const TARGET_W = 1200
      const tw = Math.min(TARGET_W, width)
      const th = Math.round((tw / width) * height)

      // Only generate thumbnail if image needs processing (size above threshold or needed rotation)
      // or if image is larger than target width
      if (needsProcessing || width > TARGET_W) {
        console.log(`Generating thumbnail for ${play}/${file}`)
        await sharp(thumbPath)
          .resize({ width: tw })
          .jpeg({ quality: 74, progressive: true, mozjpeg: true })
          .toFile(thumbPath + '.thumb')
        
        // Replace original with thumbnail
        await fs.promises.rename(thumbPath + '.thumb', thumbPath)
      } else {
        console.log(`Skipping ${play}/${file} (already optimized: ${fileSizeMB.toFixed(2)}MB, ${width}x${height})`)
      }

      const { blurhash } = await computeBlurhash(thumbPath)
      const alt = captions[index] || ''

      output[play].push({ width, height, tw, th, alt, index, blurhash })
    }
  }

  await fs.promises.writeFile(OUT_JSON, JSON.stringify(output), 'utf-8')
  console.log(`Wrote ${OUT_JSON}`)
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})


