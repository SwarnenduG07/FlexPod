"use client"

import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import React from 'react'

export const Appbar = () => {
    const router = useRouter()
  return (
    <div className='py-4 border-b border-purple-700 flex flex-wrap justify-between'>
        <div className='lg:text-2xl md:text-2xl text-xl ml-14 font-bold'>
            FluxPod 
        </div>
        <div className='mr-10'>
            <Button className='w-24 h-10 bg-gradient-to-bl from-purple-600 to-neutral-900 text-white  text-sm' 
            onClick={() => {
                router.push("/api/auth/signin")
            }}>Signin</Button>
        </div>
    </div>
  )
}


