const fs = require('node:fs/promises')
const path = require('node:path')
const { imagePlaceholder } = require('./image-placeholder')

const root = path.join(__dirname, '..')
const imageDir = path.join(root, 'public', 'img')
const outputFile = path.join(root, 'src', 'data', 'image-placeholders.json')

async function* imageFiles(dir) {
  const entries = await fs.readdir(dir, { withFileTypes: true })
  entries.sort((a, b) => a.name.localeCompare(b.name, 'en'))
  for (const entry of entries) {
    const file = path.join(dir, entry.name)
    if (entry.isDirectory() && entry.name !== 'gallery_full') yield* imageFiles(file)
    else if (entry.isFile() && /\.(jpe?g|png|webp|avif|svg)$/i.test(entry.name)) yield file
  }
}

async function generate() {
  const placeholders = {}
  for await (const file of imageFiles(imageDir)) {
    const { width, height, blurDataURL } = await imagePlaceholder(file)
    const src = `/img/${path.relative(imageDir, file).split(path.sep).join('/')}`
    placeholders[src] = { width, height, blurDataURL }
  }
  await fs.writeFile(outputFile, JSON.stringify(placeholders) + '\n')
  console.log(`Generated inline previews for ${Object.keys(placeholders).length} images`)
}

generate().catch((error) => {
  console.error(error)
  process.exitCode = 1
})
