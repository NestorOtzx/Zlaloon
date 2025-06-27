'use client'

import useTheme from '@/hooks/useTheme'

export default function DarkLightTheme() {
  const { theme, toggleTheme } = useTheme()

  return (
    <button
      onClick={toggleTheme}
      className="bg-white dark:bg-gray-800 text-black dark:text-white px-3 py-1 rounded"
    >
      Switch to {theme === 'light' ? 'dark mode' : 'light mode'}
    </button>
  )
}
