'use client'

import Image from 'next/image'
import { useState } from 'react'

export default function ProfileImage() {
  const [imageError, setImageError] = useState(false)

  return (
    <div className="relative w-[280px] h-[280px] mx-auto md:mx-0">
      {/* Glow effect */}
      <div className="absolute -inset-4 bg-gradient-to-br from-pink-300 via-purple-300 to-pink-300 rounded-full blur-2xl opacity-40 animate-pulse"></div>
      
      {/* Image container */}
      <div className="relative w-full h-full rounded-full overflow-hidden ring-4 ring-pink-200/50 shadow-2xl bg-gradient-to-br from-pink-200 to-purple-200">
        {!imageError ? (
          <Image 
            src="/profile.jpg"
            alt="Asma Drummond - UX Designer and Developer"
            width={280}
            height={280}
            priority
            quality={90}
            className="object-cover w-full h-full"
            style={{ objectPosition: 'center' }}
            onError={() => {
              console.error('Profile image not found at /profile.jpg - make sure the file is in the public folder')
              setImageError(true)
            }}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-pink-200 to-purple-200">
            <div className="text-center">
              <div className="text-6xl mb-2">👤</div>
              <p className="text-sm text-purple-600 font-semibold">Add profile.jpg</p>
              <p className="text-xs text-purple-500 mt-1">to public folder</p>
            </div>
          </div>
        )}
      </div>
      
      {/* Decorative ring */}
      <div className="absolute -inset-2 rounded-full border-2 border-purple-200/30 pointer-events-none"></div>
    </div>
  )
}

