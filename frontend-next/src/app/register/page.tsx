'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { signIn } from 'next-auth/react'

export default function RegisterPage() {
  const router = useRouter()
  const [form, setForm] = useState({
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value })
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (form.password !== form.confirmPassword) {
      setError('Passwords do not match.')
      return
    }

    setLoading(true)

    const res = await fetch('/api/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: form.email,
        username: form.username,
        password: form.password
      })
    })

    if (!res.ok) {
      const data = await res.json()
      setError(data.error || 'Registration failed')
      setLoading(false)
      return
    }

    const loginRes = await signIn('credentials', {
      redirect: false,
      email: form.email,
      password: form.password
    })

    console.log(loginRes)

    if (loginRes?.ok) {
      router.push('/')
    } else {
      setError('Could not log in automatically.')
      setLoading(false)
    }
  }

  return (
    <div className="h-screen flex items-center justify-center">
      <div className='h-full bg-background-light dark:bg-background-dark border-l border-r border-primary-light dark:border-primary-dark p-6 max-w-xl w-full flex flex-col align-center justify-between'>
        <div className='space-y-4'>
          <span className=" text-3xl font-extrabold text-text-light dark:text-text-dark select-none align-center flex flex-col justify-center">Z</span>
        </div>

        <form onSubmit={handleSubmit} className='space-y-4'>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
            Create an Account
          </h1>

          {error && <p className="text-sm text-red-500 text-center">{error}</p>}

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Username
            </label>
            <input
              type="text"
              name="username"
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 bg-background-lightContrast dark:bg-background-darkContrast text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Email
            </label>
            <input
              type="email"
              name="email"
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 bg-background-lightContrast dark:bg-background-darkContrast text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Password
            </label>
            <input
              type="password"
              name="password"
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 bg-background-lightContrast dark:bg-background-darkContrast text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-200">
              Confirm Password
            </label>
            <input
              type="password"
              name="confirmPassword"
              onChange={handleChange}
              required
              className="mt-1 w-full px-3 py-2 bg-background-lightContrast dark:bg-background-darkContrast text-text-light dark:text-text-dark focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark"
            />
          </div>
          <div className='h-[1px] w-[100%] bg-primary-light dark:bg-primary-dark'></div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-light dark:bg-primary-dark hover:bg-primary-dark dark:hover:bg-primary-light text-white font-semibold py-2 px-4 rounded transition-colors"
          >
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>
        <div>
          <p className="text-sm text-center text-gray-700 dark:text-gray-300">
            Already have an account?{' '}
            <span
              onClick={() => router.push('/login')}
              className="text-primary-light dark:text-primary-dark hover:underline cursor-pointer"
            >
              Sign in
            </span>
          </p>
        </div>
      </div>
    </div>
  )
}
