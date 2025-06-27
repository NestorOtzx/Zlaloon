// app/login/page.tsx
'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function LoginPage() {
  const [emailOrUser, setEmailOrUser] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const router = useRouter()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    console.log("submiting: ", emailOrUser, password);
    const res = await signIn('credentials', {
      redirect: false,
      email: emailOrUser,
      password,
    })

    if (res?.error) {
      setError('Invalid credentials')
    } else {
      router.push('/')
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className="h-full bg-background-light dark:bg-background-dark border-l border-r border-primary-light dark:border-primary-dark p-6 max-w-xl w-full  flex flex-col align-center justify-between">
        <div className='space-y-4'>
          <span className=" text-3xl font-extrabold text-text-light dark:text-text-dark select-none align-center flex flex-col justify-center">Z</span>
        </div>
        <form
          onSubmit={handleSubmit}
          className='space-y-4'
        >
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Sign in to your account
          </h1>

          {error && (
            <p className="text-sm text-red-500 text-center">
              {error}
            </p>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email or Username
            </label>
            <input
              type="text"
              value={emailOrUser}
              onChange={(e) => setEmailOrUser(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-background-lightContrast dark:bg-background-darkContrast text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="mt-1 w-full px-3 py-2 bg-background-lightContrast dark:bg-background-darkContrast text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
              required
            />
          </div>

          <div className='h-[1px] w-[100%] bg-primary-light dark:bg-primary-dark'></div>

          <button
            type="submit"
            className="w-full bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            Sign in
          </button>

          
        </form>
        <div>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            Don't have an account?{' '}
            <span
              onClick={() => router.push('/register')}
              className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer"
            >
              Register
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
