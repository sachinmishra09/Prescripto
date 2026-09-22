import React from 'react'
import { assets } from '../assets/assets'
import { useNavigate } from 'react-router-dom'

const Footer = () => {

    const navigate = useNavigate();

    return (
        <div className='mx-4 sm:mx-6 md:mx-10'>
            <div className='flex flex-col sm:grid sm:grid-cols-[2fr_1fr_1fr] gap-10 sm:gap-12 md:gap-14 my-10 md:mt-40 text-sm'>

                {/* -----------Left Section----------- */}
                <div>
                    <img onClick={() => { navigate('/'); scrollTo(0, 0) }} className='mb-5 w-36 sm:w-40 cursor-pointer' src={assets.logo} alt="" />
                    <p className='w-full sm:max-w-xl md:w-2/3 text-gray-600 leading-6'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Veniam, corporis quaerat. Eligendi eius sed, consequuntur reiciendis repudiandae inventore, sit molestias illum iusto earum odit enim maxime et alias autem id.
                    Quo rerum ipsa veniam maiores dolor placeat voluptatum culpa nam corrupti tempora fugit numquam exercitationem optio, fugiat beatae commodi illum perferendis, id deserunt illo.</p>
                </div>

                {/* -----------Center Section----------- */}
                <div className="text-center sm:text-left">
                    <p className='text-xl font-medium mb-5'>COMPANY</p>
                    <ul className='flex flex-col gap-2 text-gray-600'>
                        <li onClick={() => { navigate('/'); scrollTo(0, 0) }} className=' hover:text-primary transition-all duration-300 cursor-pointer'>Home</li>
                        <li onClick={() => { navigate('/about'); scrollTo(0, 0) }} className='hover:text-primary transition-all duration-300 cursor-pointer'>About us</li>
                        <li onClick={() => { navigate('/contact'); scrollTo(0, 0) }} className='hover:text-primary transition-all duration-300 cursor-pointer'>Contact us</li>
                        <li className='hover:text-primary transition-all duration-300 cursor-pointer'>Privacy policy</li>
                    </ul>
                </div>

                {/* -----------Right Section----------- */}
                <div className="text-center sm:text-left">
                    <p className='text-xl font-medium mb-5'>GET IN TOUCH</p>
                    <ul className='flex flex-col gap-2 text-gray-600 '>
                        <li className='hover:text-primary transition-all duration-300 cursor-pointer'>Sachin Mishra</li>
                        <li className='hover:text-primary transition-all duration-300 cursor-pointer'>+91-9738529529</li>
                        <li className='hover:text-primary transition-all duration-300 cursor-pointer'>sachinmishra0973@gmail.com</li>
                    </ul>
                </div>
            </div>

            {/* ----------Copyright Text------------- */}
            <div>
                <hr />
                <p className='py-5 text-sm text-center'>Copyright 2026@ Prescripto - All Right Reserved.</p>
            </div>
        </div>
    )
}

export default Footer
