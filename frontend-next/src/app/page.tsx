

import Navbar from "@/components/Navbar";
import Content from "@/components/Content";
import PostCreator from "@/components/PostCreator";

export default function Home() {
  return (
    <main className="">
      <Navbar></Navbar>
      <div className="flex flex-row justify-center">
        {/* center */}
        <div className="w-[700px] min-h-[calc(100vh-50px)] pt-[50px]
        opacity-90 hover:opacity-95 transition-opacity duration-300
        border-l border-r border-primary-light dark:border-primary-dark
        bg-background-light dark:bg-background-dark text-text-light dark:text-text-dark min-h-[calc(100vh)]
        ">
          <PostCreator></PostCreator>
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
      
    </main>
  );
}
