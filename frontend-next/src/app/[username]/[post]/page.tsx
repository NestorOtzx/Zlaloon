import Navbar from '@/components/Navbar'
import PostPageClient from '@/components/PostPageClient'

export const dynamic = 'force-dynamic'

export default function PostView() {
  return (
    <div>
      <Navbar />
      <div className="pt-[50px] flex flex-row justify-center">
        <div className="w-[700px] min-h-[calc(100vh-50px)]
          opacity-90 hover:opacity-95 transition-opacity duration-300
          border-l border-r border-primary-light dark:border-primary-dark
          bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark"
        >
          <PostPageClient />
        </div>
      </div>
    </div>
  )
}
