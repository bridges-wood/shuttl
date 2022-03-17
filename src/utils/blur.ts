import imageSize from 'image-size'
import { ISizeCalculationResult } from 'image-size/dist/types/interface'
import path from 'path'
import { getPlaiceholder } from 'plaiceholder'
import { promisify } from 'util'

const sizeOf = promisify(imageSize)

/**
 * Base64 encodes a blurred version of the image specified in src.
 *
 * @param src Source of the image. Has to be included in domains in next.config.js.
 */
export const blur = async (src: string) => {
  let res: ISizeCalculationResult
  let blur64: string

  const isExternal = src.startsWith('http')

  if (!isExternal) {
    res = await sizeOf(path.join(process.cwd(), 'public', src))
    blur64 = (await getPlaiceholder(src)).base64
  } else {
    const imageRes = await fetch(src)
    const arrayBuffer = await imageRes.arrayBuffer()
    const buffer = Buffer.from(arrayBuffer)

    res = imageSize(buffer)
    blur64 = (await getPlaiceholder(buffer)).base64
  }

  if (!res) throw Error(`Invalid image with src "${src}"`)

  return blur64
}
