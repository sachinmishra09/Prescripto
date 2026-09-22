import React from 'react'
import { specialityData } from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div
      className="
        flex flex-col items-center
        gap-5
        py-16
        px-4
        sm:px-6
        md:px-10
        text-gray-800
      "
      id="speciality"
    >

      {/* Heading */}
      <div className="text-center">
        <h1
          className="
            text-3xl
            sm:text-4xl
            font-semibold
            text-gray-800
            tracking-tight
          "
        >
          Find by Speciality
        </h1>

        <p
          className="
            mt-3
            max-w-2xl
            text-center
            text-sm
            sm:text-base
            leading-6
            text-gray-500
          "
        >
          Simply browse through our extensive list of trusted doctors
          and schedule your appointment hassle-free.
        </p>
      </div>


      {/* Speciality Cards */}
      <div
        className="
          mt-6
          w-full
          flex
          gap-4
          sm:gap-5
          overflow-x-auto
          px-1
          pb-4
          justify-start
          sm:justify-center

          [&::-webkit-scrollbar]:hidden
          [-ms-overflow-style:none]
          [scrollbar-width:none]
        "
      >

        {specialityData.map((item, index) => (

          <Link
            key={index}
            to={`/doctors/${item.speciality}`}
            onClick={() => scrollTo(0, 0)}
            className="
              group
              relative
              flex
              flex-col
              items-center
              justify-center

              min-w-[110px]
              sm:min-w-[125px]

              px-3
              py-4

              rounded-2xl

              border
              border-transparent

              hover:border-[#D9E3FF]
              hover:bg-white
              hover:shadow-[0_10px_30px_rgba(0,0,0,0.08)]

              transition-all
              duration-300
              ease-out

              hover:-translate-y-2
            "
          >

            {/* Image Container */}
            <div
              className="
                relative
                flex
                items-center
                justify-center

                w-20
                h-20
                sm:w-24
                sm:h-24

                rounded-full

                bg-[#EAEFFF]

                overflow-hidden

                transition-all
                duration-300

                group-hover:bg-[#DDE6FF]
                group-hover:shadow-md
              "
            >

              <img
                src={item.image}
                alt={item.speciality}
                className="
                  w-full
                  h-full
                  object-contain

                  transition-transform
                  duration-500
                  ease-out

                  group-hover:scale-110
                "
              />

            </div>


            {/* Speciality Name */}
            <p
              className="
                mt-3
                text-xs
                sm:text-sm
                font-medium
                text-gray-600
                text-center

                group-hover:text-primary

                transition-colors
                duration-300
              "
            >
              {item.speciality}
            </p>


            {/* Arrow */}
            <span
              className="
                mt-1

                text-xs
                text-primary

                opacity-0
                translate-y-1

                group-hover:opacity-100
                group-hover:translate-y-0

                transition-all
                duration-300
              "
            >
              View doctors →
            </span>

          </Link>

        ))}

      </div>

    </div>
  )
}

export default SpecialityMenu


/*

import React from 'react'
import {specialityData} from '../assets/assets'
import { Link } from 'react-router-dom'

const SpecialityMenu = () => {
  return (
    <div className='flex flex-col items-center gap-4 py-16 text-gray-800 mx-2 sm:mx-6 md:mx-10' id='speciality'>
      <h1 className='text-3xl font-medium'>Find by Speciality</h1>
      <p className='sm:w-1/3 text-center text-sm'>Simply browse through our extensive list of trusted doctors,schedule your appointment hassle-free.</p>
      <div className='flex sm:justify-center gap-4 pt-5 w-full overflow-scroll'>
        {specialityData.map((item, index)=>(
            <Link onClick={()=>scrollTo(0,0)} className='flex flex-col items-center text-xs cursor-pointer flex-shrink-0 hover:translate-y-[-10px] transition-all duration-500' key={index} to={`/doctors/${item.speciality}`}>
                <img className='w-16 sm:w-24 mb-2' src={item.image} alt="" />
                <p>{item.speciality}</p>
            </Link>
        ))}
      </div>
    </div>
  )
}

export default SpecialityMenu


make this component look some good UI UX

*/