import React from 'react'
import { assets } from '../assets/assets'

const Header = () => {
  return (
    <div className='flex flex-col md:flex-row flex-wrap bg-primary rounded-lg px-6 md:px-10 lg:px-20 mx-2 sm:mx-6 md:mx-10'>
      {/* -------------- Left Side ------------------*/}
      <div className='md:w-1/2 flex flex-col items-start justify-center gap-4 py-10 m-auto md:py-[10vw] md:mb-[-30px]'>
        <p className='text-3xl md:text-4xl lg:text-5xl text-white font-semibold leading-tight md:leading-tight  lg:leading-tight '>
          Book Appointment <br /> With Trusted Doctors
        </p>
        <div className='flex flex-col md:flex-row items-center gap-3 text-white text-sm font-light '>
          <img className='w-28' src={assets.group_profiles} alt="" />
          <p>Simply browse through our extensive lest of trusted doctors,<br className='hidden sm:block' /> schedule your appointment hassle-free.</p>
        </div>
        <a
          href="#speciality"
          className="
          hover:bg-primary hover:text-white transition-all
            relative
            overflow-hidden
            flex
            items-center
            gap-2
            bg-white
            px-8
            py-3
            rounded-full
            text-gray-600
            text-sm
            m-auto
            md:m-0
            cursor-pointer

            before:content-['']
            before:absolute
            before:inset-0
            before:w-full
            before:h-full
            before:rounded-full
            before:bg-gradient-to-r
            before:from-[#b8b6bc]
            before:to-[#7e75fe]
            before:origin-left
            before:scale-x-0
            before:transition-transform
            before:duration-[475ms]
            before:ease-in-out
            hover:before:scale-x-100

            hover:text-white
            hover:scale-105
            transition-all
            duration-300
          "
        >
          <span className="relative z-10 flex items-center gap-2">
            Book appointment
            <img
              className="relative z-10 w-3"
              src={assets.arrow_icon}
              alt=""
            />
          </span>
        </a>
      </div>


      {/* -------------- Right Side ------------------*/}
      <div className='md:w-1/2 relative'>
        <img className='w-full md:absolute bottom-0 h-auto rounded-lg' src={assets.header_img} alt="" />
      </div>
    </div>
  )
}

export default Header
