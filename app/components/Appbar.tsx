"use client"

import { useRouter } from 'next/navigation'
import React from 'react'

export const Appbar = () => {
    const router = useRouter()
  return (
    <div>
          <button onClick={() => {
            router.push("api/auth/signin")
          }}>Signin</button>
    </div>
  )
}


