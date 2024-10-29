import Navbar from '@/components/Navbar'
import React from 'react'

const layout = ({children}:{children:React.ReactNode}) => {
  return (
    <div className='relative h-screen flex flex-col w-full'>
        <Navbar/>
        <div className='w-full'>
        {children}
        </div>
    </div>
  )
}

export default layout
