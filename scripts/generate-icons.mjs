import sharp from 'sharp'
import { mkdir, readFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const __dirname = dirname(fileURLToPath(import.meta.url))
const root = resolve(__dirname, '..')

const targets = [
  { src: 'assets/icon-source.svg',   out: 'public/icons/icon-192.png',          size: 192 },
  { src: 'assets/icon-source.svg',   out: 'public/icons/icon-512.png',          size: 512 },
  { src: 'assets/icon-source.svg',   out: 'public/icons/apple-touch-icon.png',  size: 180 },
  { src: 'assets/icon-source.svg',   out: 'public/favicon-32.png',              size: 32 },
  { src: 'assets/icon-source.svg',   out: 'public/favicon-16.png',              size: 16 },
  { src: 'assets/icon-maskable.svg', out: 'public/icons/icon-maskable-192.png', size: 192 },
  { src: 'assets/icon-maskable.svg', out: 'public/icons/icon-maskable-512.png', size: 512 },
]

await Promise.all(
  targets.map(async ({ src, out, size }) => {
    const absIn = resolve(root, src)
    const absOut = resolve(root, out)
    await mkdir(dirname(absOut), { recursive: true })
    const svg = await readFile(absIn)
    await sharp(svg)
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png()
      .toFile(absOut)
    console.log(`✓ ${out}  (${size}px)`)
  }),
)

console.log('\nAll icons generated.')
