/*
  Thumbnail and blurhash generator
  - Scans public/img/gallery_full/{play}/Bild_*.jpg
  - Writes thumbnails to public/img/gallery_thumbs/{play}/Bild_*.jpg
  - Emits src/data/images.json mapping { [play]: [{ width,height, tw, th, alt, index, blurhash, blurDataURL }] }
*/

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')
const { encode } = require('blurhash')

const ROOT = process.cwd()
const FULL_DIR = path.join(ROOT, 'public', 'img', 'gallery_full')
const THUMBS_DIR = path.join(ROOT, 'public', 'img', 'gallery_thumbs')
const PICS_JSON = path.join(ROOT, 'src', 'data', 'pics.json')
const OUT_JSON = path.join(ROOT, 'src', 'data', 'images.json')

/**
 * @param {string} file
 * @param {number} compX
 * @param {number} compY
 */
async function computeBlurhashAndDataURL(file, compX = 4, compY = 3) {
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
  // small preview PNG from the downscaled buffer
  const previewPng = await sharp(data, {
    raw: { width: info.width, height: info.height, channels: 4 },
  })
    .png({ quality: 50 })
    .toBuffer()
  const blurDataURL = `data:image/png;base64,${previewPng.toString('base64')}`
  return { blurhash, blurDataURL }
}

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function generate() {
  // Check if full images directory exists (won't exist in CI/CD)
  try {
    await fs.promises.access(FULL_DIR)
  } catch {
    console.log(`${FULL_DIR} not found - skipping image generation (using existing images.json)`)
    return
  }

  const plays = await fs.promises.readdir(FULL_DIR)
  /** @type {Record<string, { width:number, height:number, alt:string, index:number, blurhash:string, blurDataURL:string, tw:number, th:number }[]>} */
  const output = {}

  /** @type {Record<string, string[]>} */
  let captionsByPlay = {}
  try {
    const raw = await fs.promises.readFile(PICS_JSON, 'utf-8')
    captionsByPlay = JSON.parse(raw)
  } catch {}

  for (const play of plays) {
    const fullDir = path.join(FULL_DIR, play)
    const stat = await fs.promises.stat(fullDir)
    if (!stat.isDirectory()) continue

    const files = (await fs.promises.readdir(fullDir))
      .filter((f) => /^Bild_\d+\.jpe?g$/i.test(f))
      .sort((a, b) => {
        const ai = parseInt(a.match(/(\d+)/)?.[1] || '0', 10)
        const bi = parseInt(b.match(/(\d+)/)?.[1] || '0', 10)
        return ai - bi
      })

    if (!files.length) continue
    output[play] = []

    const thumbsPlayDir = path.join(THUMBS_DIR, play)
    await ensureDir(thumbsPlayDir)

    const captions = captionsByPlay[play] || []

    for (const file of files) {
      const index = parseInt(file.match(/(\d+)/)?.[1] || '0', 10) - 1
      const fullPath = path.join(fullDir, file)
      const thumbPath = path.join(thumbsPlayDir, file)

      const img = sharp(fullPath)
      const meta = await img.metadata()
      let width = meta.width || 0
      let height = meta.height || 0

      // Check if image has EXIF orientation and needs rotation
      const hasExifOrientation = meta.orientation && meta.orientation > 1
      if (hasExifOrientation) {
        console.log(`Rotating ${play}/${file} (EXIF orientation: ${meta.orientation})`)
        // Rotate based on EXIF and strip all metadata
        await sharp(fullPath)
          .rotate() // Sharp automatically rotates based on EXIF orientation
          .toFile(fullPath + '.tmp')
        await fs.promises.rename(fullPath + '.tmp', fullPath)
        
        // Re-read metadata after rotation
        const rotatedMeta = await sharp(fullPath).metadata()
        width = rotatedMeta.width || 0
        height = rotatedMeta.height || 0
      }

      // Resize and compress source images larger than 3MB
      const stats = await fs.promises.stat(fullPath)
      const fileSizeMB = stats.size / (1024 * 1024)
      const MAX_SIZE_MB = 3
      
      if (fileSizeMB > MAX_SIZE_MB) {
        console.log(`Compressing ${play}/${file} (${fileSizeMB.toFixed(2)}MB → target <${MAX_SIZE_MB}MB)`)
        const MAX_DIMENSION = 4000
        await sharp(fullPath)
          .resize(MAX_DIMENSION, MAX_DIMENSION, { fit: 'inside', withoutEnlargement: true })
          .jpeg({ quality: 85, progressive: true, mozjpeg: true })
          .toFile(fullPath + '.tmp')
        
        // Replace original with resized version
        await fs.promises.rename(fullPath + '.tmp', fullPath)
        
        // Update dimensions
        const newMeta = await sharp(fullPath).metadata()
        width = newMeta.width || 0
        height = newMeta.height || 0
      }

      // thumbnail target width per column layout (~3 columns desktop)
      const TARGET_W = 1200
      const tw = Math.min(TARGET_W, width)
      const th = Math.round((tw / width) * height)

      await sharp(fullPath)
        .resize({ width: tw })
        .jpeg({ quality: 74, progressive: true, mozjpeg: true })
        .toFile(thumbPath)

      const { blurhash, blurDataURL } = await computeBlurhashAndDataURL(fullPath)
      const alt = captions[index] || ''

      output[play].push({ width, height, tw, th, alt, index, blurhash, blurDataURL })
    }
  }

  await fs.promises.writeFile(OUT_JSON, JSON.stringify(output), 'utf-8')
  console.log(`Wrote ${OUT_JSON}`)
}

generate().catch((err) => {
  console.error(err)
  process.exit(1)
})


