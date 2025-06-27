'use client'

import useAuth from '@/hooks/useAuth'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { signOut } from 'next-auth/react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, Menu, ChevronDown } from 'lucide-react'
import DarkLightTheme from './DarkLightTheme'

export default function NavBar() {
  const { user, isAuthenticated, loading } = useAuth()
  const [query, setQuery] = useState('')
  const [showInput, setShowInput] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [userDropdownOpen, setUserDropdownOpen] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  const searchContainerRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const userDropdownRef = useRef<HTMLDivElement>(null)
  const router = useRouter()

  const handleSearchClick = () => {
    if (!showInput) {
      setShowInput(true)
    } else if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowInput(false)
      setQuery('')
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`)
      setShowInput(false)
      setQuery('')
    }
  }

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (showInput && searchContainerRef.current && !searchContainerRef.current.contains(target)) {
        setShowInput(false)
        setQuery('')
      }

      if (menuOpen && menuRef.current && !menuRef.current.contains(target)) {
        setMenuOpen(false)
      }

      if (userDropdownOpen && userDropdownRef.current && !userDropdownRef.current.contains(target)) {
        setUserDropdownOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [showInput, menuOpen, userDropdownOpen])

  useEffect(() => {
    if (showInput && inputRef.current) {
      inputRef.current.focus()
    }
  }, [showInput])

  return (
    <motion.nav
      initial={{ y: -50 }}
      animate={{ y: 0 }}
      transition={{ duration: 0.4 }}
      className="pl-2 fixed top-0 left-0 w-full h-[50px] z-50 
        backdrop-blur-2xl
        opacity-95 hover:opacity-100 transition-opacity duration-300
        border-b-2 border-primary-light dark:border-primary-dark bg-navbar-light dark:bg-navbar-dark
        flex justify-between items-center"
    >
      {/* Logo and Search */}
      <div>
        <motion.div
          ref={searchContainerRef}
          className="flex items-center gap-2 relative"
          layout
          transition={{ layout: { duration: 0.3, ease: 'easeInOut' } }}
        >
          <span className="pb-1 text-3xl font-extrabold text-text-light dark:text-text-dark select-none align-center flex flex-col justify-center">Z</span>

          <AnimatePresence mode="wait">
            {showInput && (
              <motion.div
                key="search-wrapper"
                initial={{ width: 0, opacity: 0 }}
                animate={{ width: '180px', opacity: 1 }}
                exit={{ width: 0, opacity: 0 }}
                transition={{ duration: 0.3, ease: 'easeInOut' }}
                className="overflow-hidden"
              >
                <input
                  ref={inputRef}
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder="Search..."
                  className="w-full px-3 py-1 rounded-md bg-gray-100 dark:bg-gray-800 text-sm outline-none"
                />
              </motion.div>
            )}
          </AnimatePresence>

          <motion.button
            layout
            onClick={handleSearchClick}
            className="p-2 rounded-md bg-[#4f4f4f] hover:bg-[#0f0f0f] text-white flex items-center justify-center transition-colors"
          >
            <Search size={18} />
          </motion.button>
        </motion.div>
      </div>

      {/* Right Side */}
      <div className="h-full flex flex-row items-center space-x-2">
        {/* User button or login */}
        {!loading && isAuthenticated ? (
          <div className="relative h-full" ref={userDropdownRef}>
            <button
              onClick={() => setUserDropdownOpen(!userDropdownOpen)}
              className="h-full px-4 flex items-center gap-1 font-semibold text-inherit bg-inherit hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors"
            >
              {user?.name}
              <ChevronDown size={16} />
            </button>

            <AnimatePresence>
              {userDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: -5 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95, y: -5 }}
                  transition={{ duration: 0.2 }}
                  className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50"
                >
                  <div
                    className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setUserDropdownOpen(false)
                      router.push('/'+user?.name)
                    }}
                  >
                    Profile
                  </div>
                  <div
                    className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer"
                    onClick={() => {
                      setUserDropdownOpen(false)
                      signOut()
                    }}
                  >
                    Sign out
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ) : (
          <button
            onClick={() => router.push('/login')}
            className="h-full px-4 text-sm font-semibold text-inherit bg-inherit hover:bg-background-lightContrast dark:hover:bg-background-darkContrast transition-colors"
          >
            Sign in
          </button>
        )}

        {/* Menu */}
        <div className="relative h-full" ref={menuRef}>
          <div className="h-full p-1">
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="px-2 h-full rounded-md bg-[#4f4f4f] hover:bg-[#0f0f0f] text-white transition-colors"
            >
              <Menu size={18} />
            </button>
          </div>

          <AnimatePresence>
            {menuOpen && (
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: -5 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: -5 }}
                transition={{ duration: 0.2 }}
                className="absolute right-0 mt-2 w-40 bg-white dark:bg-gray-800 rounded-md shadow-lg py-2 z-50"
              >
                <div className="px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer">
                  <DarkLightTheme />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.nav>
  )
}
