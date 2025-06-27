// app/search/page.tsx
'use client'

import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const params = useSearchParams()
  const query = params.get('q')

  return (
    <div className="pt-[60px] p-4">
      <h1 className="text-xl font-semibold">Resultados para: <span className="text-primary">{query}</span></h1>
      {/* Aquí puedes renderizar resultados basados en la query */}
    </div>
  )
}
