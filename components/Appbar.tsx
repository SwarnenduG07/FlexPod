"use client"

import { Button } from '@/components/ui/button'
import { signIn } from 'next-auth/react'
import React from 'react'

export const Appbar = () => {
  return (
    <div className='py-4 border-b border-purple-700 flex flex-wrap justify-between'>
        <div className='lg:text-2xl md:text-2xl text-xl md:ml-20 ml-10 font-bold cursor-pointer'>
            FluxPod 
        </div>
        <div className='md:mr-20 ml-10'>
            <Button className='w-24 h-10 bg-gradient-to-bl from-purple-600 to-rose-500 text-white  text-sm rounded-3xl' 
            onClick={() => {
                signIn()
            }}>Signin</Button>
        </div>
    </div>
  )
}


