'use client'

import Navbar from '@/components/Navbar'
import Content from '@/components/Content'
import { useSearchParams } from 'next/navigation'

export default function SearchPage() {
  const searchParams = useSearchParams()
  const pattern = searchParams.get('q') || ''

  return (
    <div>
      <Navbar />
      <div className='flex flex-row justify-center'>
        <div className="w-[700px] pt-[50px]
        border-l border-r border-primary-light dark:border-primary-dark
        opacity-90 hover:opacity-95 transition-opacity duration-300
        bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-[calc(100vh)]
        ">
          <div className='p-5  border-b border-text-light dark:border-text-dark text-[15pt]'>
            Results for "{pattern}"
          </div>
          <div className=''>
            <Content
              query="http://localhost:5000/getprofileslike"
              contentType="profile"
              pattern={pattern}
              limit={3}
              loadOnScroll={false}
              />
          </div>
          <div className="p-4">
            <Content
              query="http://localhost:5000/getpostslike"
              contentType="post"
              pattern=""
              limit={5}
              loadOnScroll={true}
              />
          </div>
        </div>
      </div>
    </div>
  )
}
