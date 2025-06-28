'use client'

import { useEffect, useState } from 'react'

export default function PostDate({ date }: { date: string }) {
  const [localDate, setLocalDate] = useState('')

  useEffect(() => {
    const local = new Date(date).toLocaleString()
    setLocalDate(local)
  }, [date])

  return (
    <div className="text-sm text-gray-500 dark:text-gray-400">
      {localDate}
    </div>
  )
}
