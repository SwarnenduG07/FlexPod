import React from 'react'
import { Spotlight } from './ui/spotlight'
import { Button } from './ui/button'

const LandingContent = () => {
  return (
    <div className="h-[35rem] w-full rounded-md flex md:items-center md:justify-center bg-black/[0.96] antialiased bg-grid-white/[0.02] relative overflow-hidden">
      <Spotlight
        className="-top-40 left-0 md:left-60 md:-top-20"
        fill="white"
      />
      <div className=" p-4 max-w-7xl  mx-auto relative z-10  w-full pt-20 md:pt-0">
        <h1 className="text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b from-neutral-50 to-neutral-800 bg-opacity-50">
           FluxPod <br/>  
        </h1>
        <h1 className='text-4xl md:text-7xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-b bg-opacity-50 from-amber-400 to-lime-400'>100x Podcast Platform.</h1>
        <p className="mt-4 font-normal text-base text-neutral-300 max-w-lg text-center mx-auto">
        FlexPod is a cutting-edge <span className=' max-w-lg font-bold text-lg text-center mx-auto text-blue-600'>100x</span> podcast platform that simplifies creating, sharing, and managing audio content. With user-friendly tools and powerful features, FlexPod helps you focus on storytelling while handling the rest. FlexPod makes amplifying your voice effortless.
         </p>
         <div className='flex flex-col items-center mt-16 text-4xl md:text-5xl bg-gradient-to-tr text-transparent bg-clip-text from-purple-600 to-amber-400 font-semibold'>
                 Join Us To Make 100X Podcast with FluxPod
                 <Button className='rounded-full mt-3' variant="outline">
                     Start Creating For Free
                 </Button>
        </div>
      </div>
    </div>
  )
}

export default LandingContent
