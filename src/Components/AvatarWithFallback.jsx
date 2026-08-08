import React, { useState } from 'react'

export default function AvatarWithFallback({ src, initials }) {
  const [errored, setErrored] = useState(false)

  if (errored || !src) {
    return (
      <div className="w-full h-full flex items-center justify-center text-white font-bold text-5xl rounded-full bg-accent font-display max:bg-linear-to-br max:from-[#FF3AF2] max:via-[#7B2FFF] max:to-[#00F5D4]">
        {initials}
      </div>
    )
  }

  return (
    <img
      src={src}
      alt="Younes Basir"
      onError={() => setErrored(true)}
      className="w-full h-full object-cover rounded-full"
      loading="lazy"
    />
  )
}
