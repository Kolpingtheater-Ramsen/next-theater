const sharp = require('sharp')
const { encode, decode } = require('blurhash')

async function imagePlaceholder(file) {
  const metadata = await sharp(file).metadata()
  const rotated = metadata.orientation >= 5 && metadata.orientation <= 8
  const width = rotated ? metadata.height : metadata.width
  const height = rotated ? metadata.width : metadata.height
  const { data, info } = await sharp(file)
    .rotate()
    .resize(Math.min(64, width), Math.min(64, height), { fit: 'inside' })
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true })
  const blurhash = encode(new Uint8ClampedArray(data), info.width, info.height, 4, 3)
  const previewWidth = 32
  const previewHeight = Math.max(1, Math.round(previewWidth * info.height / info.width))
  const pixels = decode(blurhash, previewWidth, previewHeight)

  // BlurHash only stores RGB. Retain the alpha channel for logos and cutouts.
  if (metadata.hasAlpha) {
    const alpha = await sharp(data, { raw: { ...info, channels: 4 } })
      .resize(previewWidth, previewHeight)
      .extractChannel(3)
      .toBuffer()
    for (let i = 0; i < alpha.length; i++) pixels[i * 4 + 3] = alpha[i]
  }

  const preview = await sharp(Buffer.from(pixels), {
    raw: { width: previewWidth, height: previewHeight, channels: 4 },
  }).webp({ quality: 65 }).toBuffer()

  return { width, height, blurhash, blurDataURL: `data:image/webp;base64,${preview.toString('base64')}` }
}

module.exports = { imagePlaceholder }
