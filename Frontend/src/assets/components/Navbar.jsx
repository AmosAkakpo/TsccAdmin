import React from 'react'
import { RiAccountCircleFill } from "react-icons/ri";
const Navbar = () => {
  return (
    <div className='flex flex-row justify-between px-[3vw] pb-2 items-center font-poppins border-b-2'>
      <div className='text-center  pt-3'>
        <p className='text-7xl text-green-800 font-bold'>TSCC</p>
        <span className='font-medium text-slate-700'>Admin Panel</span>
      </div>
      <RiAccountCircleFill className='text-5xl text-slate-600' />
    </div>
  )
}

export default Navbar
