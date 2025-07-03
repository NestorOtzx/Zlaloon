// utils/cropImage.ts
export async function getCroppedImg(imageSrc: string, crop: any) {
  const image = await createImage(imageSrc)
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')!

  canvas.width = crop.width
  canvas.height = crop.height

  ctx.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height
  )

  return new Promise<{ file: File; previewUrl: string }>((resolve) => {
    canvas.toBlob((blob) => {
      if (!blob) return
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(blob)
      resolve({ file, previewUrl })
    }, 'image/jpeg')
  })
}

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image()
    image.addEventListener('load', () => resolve(image))
    image.addEventListener('error', (err) => reject(err))
    image.setAttribute('crossOrigin', 'anonymous')
    image.src = url
  })
}
