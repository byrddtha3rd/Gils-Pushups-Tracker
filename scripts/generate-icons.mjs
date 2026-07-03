import sharp from 'sharp'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'

const source = await readFile(new URL('../public/icons/icon.svg', import.meta.url))
await Promise.all([
  sharp(source).resize(192, 192).png().toFile(fileURLToPath(new URL('../public/icons/icon-192.png', import.meta.url))),
  sharp(source).resize(512, 512).png().toFile(fileURLToPath(new URL('../public/icons/icon-512.png', import.meta.url))),
  sharp(source).resize(180, 180).png().toFile(fileURLToPath(new URL('../public/icons/apple-touch-icon.png', import.meta.url))),
])
