'use client'

import { Dialog } from '@headlessui/react'

export default function ImagePreviewModal({
  imageUrl,
  onClose,
}: {
  imageUrl: string
  onClose: () => void
}) {
  return (
    <Dialog
      open={!!imageUrl}
      onClose={onClose}
      className="fixed inset-0 z-50 flex items-center justify-center"
    >
      <div className="fixed inset-0 bg-black/80" aria-hidden="true" onClick={onClose} />

      <div className="relative z-50 max-w-3xl max-h-[90vh] mx-auto p-4">
        <img
          src={imageUrl}
          alt="Preview"
          className="rounded-md max-h-[85vh] w-auto mx-auto object-contain"
          onClick={(e) => e.stopPropagation()} // evita que cerrar se dispare al hacer clic en la imagen
        />
      </div>
    </Dialog>
  )
}
