/*
  Rotate images based on EXIF orientation and remove EXIF data
  - Scans all images in public/img/gallery_full/{play}/
  - Rotates them according to EXIF orientation
  - Removes all EXIF metadata
  - Overwrites original files
*/

const fs = require('fs')
const path = require('path')
const sharp = require('sharp')

const ROOT = process.cwd() + '/..'
const FULL_DIR = path.join(ROOT, 'public', 'img', 'gallery_full')

async function ensureDir(dir) {
  await fs.promises.mkdir(dir, { recursive: true })
}

async function rotateAndStripExif() {
  // Check if full images directory exists
  try {
    await fs.promises.access(FULL_DIR)
  } catch {
    console.log(`${FULL_DIR} not found - skipping EXIF rotation and stripping`)
    return
  }

  const plays = await fs.promises.readdir(FULL_DIR)
  let totalProcessed = 0
  let totalRotated = 0

  for (const play of plays) {
    const fullDir = path.join(FULL_DIR, play)
    const stat = await fs.promises.stat(fullDir)
    if (!stat.isDirectory()) continue

    const files = (await fs.promises.readdir(fullDir))
      .filter((f) => /\.(jpe?g|png|webp)$/i.test(f))

    if (!files.length) continue

    console.log(`Processing ${play}/...`)

    for (const file of files) {
      const fullPath = path.join(fullDir, file)
      
      try {
        const img = sharp(fullPath)
        const meta = await img.metadata()

        // Check if image has EXIF orientation
        if (meta.orientation) {
          console.log(`  ${file}: rotating (orientation: ${meta.orientation})`)
          totalRotated++
          
          // Rotate based on EXIF and remove all metadata
          await img
            .rotate() // sharp automatically rotates based on EXIF orientation
            .toFile(fullPath + '.tmp')
          
          // Replace original with rotated version
          await fs.promises.rename(fullPath + '.tmp', fullPath)
        } else {
          // Even if no rotation needed, strip EXIF metadata
          await img.toFile(fullPath + '.tmp')
          await fs.promises.rename(fullPath + '.tmp', fullPath)
        }

        totalProcessed++
      } catch (err) {
        console.error(`  ERROR processing ${file}:`, err.message)
      }
    }
  }

  console.log(`\n✓ Processed ${totalProcessed} images`)
  console.log(`✓ Rotated ${totalRotated} images based on EXIF orientation`)
  console.log(`✓ Removed EXIF metadata from all images`)
}

rotateAndStripExif().catch((err) => {
  console.error(err)
  process.exit(1)
})
