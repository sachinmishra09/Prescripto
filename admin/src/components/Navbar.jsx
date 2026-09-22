import React, { useContext } from 'react'
import { assets } from '../assets/assets'
import { AdminContext } from '../context/AdminContext'
import { useNavigate } from 'react-router-dom'
import { DoctorContext } from '../context/DoctorContext'

const Navbar = () => {

    const { aToken, setAToken } = useContext(AdminContext)
    const { dToken, setDToken } = useContext(DoctorContext)

    const navigate = useNavigate()

    const logout = () => {
        navigate('/') // we will navigate to the login page after logout
        aToken && setAToken('') // we will set the token to empty string so that user is logged out
        aToken && localStorage.removeItem('atoken') // we will remove the token from the local storage so that user is logged out

        dToken && setDToken('') // we will set the token to empty string so that user is logged out
        dToken && localStorage.removeItem('dToken') // we will remove the token from the local storage so that user is logged out
    }

    return (
        <div className='flex justify-between items-center px-4 sm:px-10 py-3 border-b bg-white  border-gray-300'>
            <div className='flex items-center gap-2 text-xs'>
                <img onClick={() => navigate('/')} className='w-36 sm:w-40 cursor-pointer' src={assets.admin_logo} alt="" />
                <p className='border px-2.5 py-0.5 rounded-full border-gray-500 text-gray-600'>{aToken ? 'Admin' : 'Doctor'}</p>
            </div>
            <button onClick={logout} className='bg-primary text-white text-sm px-10 py-2 rounded-full cursor-pointer'>Logout</button>
        </div>
    )
}

export default Navbar
