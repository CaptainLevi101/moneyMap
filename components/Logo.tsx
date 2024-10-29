import { BadgeIndianRupee } from 'lucide-react'
import Link from 'next/link'
import React from 'react'

export const Logo = () => {
  return (
   <Link href='/' className='flex items-center justify-center gap-2'>
       <BadgeIndianRupee className='stroke 
       stroke-[1.5]
       w-11 h-11 stroke-cyan-900'/>
       <p className='text-3xl
        font-bold 
        tracking-wide
        bg-gradient-to-r from-cyan-700 to-cyan-900
        text-transparent
        bg-clip-text
         '>MoneyMap</p>
   </Link>
  )
}
export const MobileLogo=()=>{
  return (
    <Link href='/' className='flex items-center justify-center'>
        <BadgeIndianRupee className='stroke 
        stroke-[1.5]
        w-3 h-3 stroke-cyan-900'/>
        <p className='
         font-bold 
          text-xs
         bg-gradient-to-r from-cyan-700 to-cyan-900
         text-transparent
         bg-clip-text
          '>MoneyMap</p>
    </Link>
   )
}



