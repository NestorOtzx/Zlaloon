'use client'

import { useRef, useState } from 'react'
import { Dialog } from '@headlessui/react'
import Cropper from 'react-cropper'
import 'cropperjs/dist/cropper.css'

export default function ImageCropperModal({
  imageSrc,
  previousCropData,
  onClose,
  onCropComplete,
}: {
  imageSrc: string
  previousCropData?: any
  onClose: () => void
  onCropComplete: (result: { file: File; previewUrl: string; cropData: any }) => void
}) {
  const cropperRef = useRef<any>(null) // ✅ compatible con react-cropper@2.x
  const [cropping, setCropping] = useState(false)

  const handleCrop = () => {
    const cropper = cropperRef.current?.cropper
    if (!cropper) return

    setCropping(true)

    const canvas = cropper.getCroppedCanvas()
    if (!canvas) {
      alert('Cropping failed')
      return
    }

    const cropData = cropper.getData() // <- coordenadas relativas a la imagen original

    canvas.toBlob((blob: Blob | null) => {
      if (!blob) return
      const file = new File([blob], 'cropped.jpg', { type: 'image/jpeg' })
      const previewUrl = URL.createObjectURL(blob)
      onCropComplete({ file, previewUrl, cropData })
    }, 'image/jpeg')
  }

  const handleReady = () => {
    const cropper = cropperRef.current?.cropper
    if (cropper && previousCropData) {
      // Esperar al siguiente ciclo para asegurar render completo
      setTimeout(() => {
        cropper.setData(previousCropData)
      }, 0)
    }
  }

  return (
    <Dialog
      open={true}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60"
    >
      <div className="relative w-[90vw] max-w-3xl bg-white dark:bg-background-dark rounded-md shadow-lg p-4 space-y-4">
        <h2 className="text-lg font-semibold text-center text-gray-800 dark:text-gray-200">
          Crop Image
        </h2>

        <div className="w-full max-h-[60vh] overflow-hidden rounded-md">
          <Cropper
            src={imageSrc}
            style={{ height: '400px', width: '100%' }}
            aspectRatio={NaN} // ← libre por defecto
            viewMode={1}
            autoCropArea={1}
            guides={false}
            background={false}
            responsive={true}
            dragMode="move"
            cropBoxResizable={true}
            cropBoxMovable={true}
            checkOrientation={false}
            ready={handleReady} // <- el evento correcto para react-cropper@2
            ref={cropperRef}
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-4 py-2 rounded-md bg-gray-300 hover:bg-gray-400 text-sm font-medium"
          >
            Cancel
          </button>
          <button
            onClick={handleCrop}
            disabled={cropping}
            className="px-4 py-2 rounded-md bg-blue-600 text-white hover:bg-blue-700 text-sm font-semibold disabled:opacity-50"
          >
            {cropping ? 'Cropping...' : 'Crop'}
          </button>
        </div>
      </div>
    </Dialog>
  )
}
