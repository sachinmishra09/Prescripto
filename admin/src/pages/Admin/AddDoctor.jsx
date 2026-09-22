import React, { useContext, useState } from 'react'
import { assets } from '../../assets/assets'
import { toast } from 'react-toastify'
import axios from 'axios'
import { AdminContext } from '../../context/AdminContext'

const AddDoctor = () => {

    // create state to store doctor image, name, email, password, experience, fees, about, speciality, degree, address1, address2
    const [docImg, setDocImg] = useState(false)
    const [name, setName] = useState('')
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [experience, setExperience] = useState('Fresher')
    const [fees, setFees] = useState('')
    const [about, setAbout] = useState('')
    const [speciality, setSpeciality] = useState('General physician')
    const [degree, setDegree] = useState('')
    const [address1, setAddress1] = useState('')
    const [address2, setAddress2] = useState('')

    // we will get the backend url and the admin token from the context
    const { backendUrl, aToken } = useContext(AdminContext)

    const onSubmitHandler = async (event) => {
        event.preventDefault()

        try {

            if (!docImg) {
                return toast.error('Image Not Selected')
            }

            if (Number(fees) <= 0) {
                return toast.error('Fees must be greater than 0')
            }

            // formdata is used to send the image to the backend because we cannot send the image in json format so we will use formdata to send the image to the backend
            const formData = new FormData();

            // add the details of doctor to the form data
            formData.append('image', docImg)
            formData.append('name', name)
            formData.append('email', email)
            formData.append('password', password)
            formData.append('experience', experience)
            formData.append('fees', Number(fees))
            formData.append('about', about)
            formData.append('speciality', speciality)
            formData.append('degree', degree)
            formData.append('address', JSON.stringify({ line1: address1, line2: address2 }))

            // console log formdata            
            formData.forEach((value, key) => {
                console.log(`${key}: ${value}`);
            });

            // make the api call to the backend to add the doctor and we will send the formdata to the backend and we will also send the admin token in the headers so that the backend can verify that the request is coming from an admin
            const { data } = await axios.post(backendUrl + '/api/admin/add-doctor', formData, { headers: { aToken } })

            if (data.success) {
                toast.success(data.message)

                // clear the form after successful submission
                setDocImg(false)
                setName('')
                setPassword('')
                setEmail('')
                setAddress1('')
                setAddress2('')
                setDegree('')
                setAbout('')
                setFees('')
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message)
            } else {
                toast.error("Something went wrong. Please try again.")
            }
            console.log(error)
        }

    }

    return (
        <form onSubmit={onSubmitHandler} className='m-5 w-full'>

            <p className='mb-3 text-lg font-medium'>Add Doctor</p>

            <div className='bg-white px-8 py-8 border rounded w-full max-w-4xl max-h-[80vh] overflow-y-scroll border-gray-300'>
                <div className='flex items-center gap-4 mb-8 text-gray-500'>
                    <label htmlFor="doc-img">
                        <img className='w-16 bg-gray-100 rounded-full cursor-pointer' src={docImg ? URL.createObjectURL(docImg) : assets.upload_area} alt="" />
                    </label>
                    <input onChange={(e) => setDocImg(e.target.files[0])} type="file" name="" id="doc-img" hidden />
                    <p>Upload doctor <br /> picture</p>
                </div>

                <div className='flex flex-col lg:flex-row items-start gap-10 text-gray-600'>

                    <div className='w-full lg:flex-1 flex flex-col gap-4 ' >

                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="name">Doctor Name</label>
                            <input id='name' onChange={e => setName(e.target.value)} value={name} className='border rounded px-3 py-2 border-gray-300' type="text" placeholder='Name' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="email">Doctor Email</label>
                            <input id='email' onChange={e => setEmail(e.target.value)} value={email} className='border rounded px-3 py-2 border-gray-300' type="email" placeholder='Email' required />
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="password">Doctor Password</label>
                            <input id='password' onChange={e => setPassword(e.target.value)} value={password} className='border rounded px-3 py-2 border-gray-300' type="password" placeholder='Password' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="experience">Experience</label>
                            <select id='experience' onChange={e => setExperience(e.target.value)} value={experience} className='border rounded px-2 py-2  border-gray-300 cursor-pointer' >
                                <option value="Fresher">Fresher</option>
                                <option value="1 Year">1 Year</option>
                                <option value="2 Year">2 Years</option>
                                <option value="3 Year">3 Years</option>
                                <option value="4 Year">4 Years</option>
                                <option value="5 Year">5 Years</option>
                                <option value="6 Year">6 Years</option>
                                <option value="7 Year">7 Years</option>
                                <option value="8 Year">8 Years</option>
                                <option value="9 Year">9 Years</option>
                                <option value="10+ Year">10+ Years</option>
                            </select>
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="fees">Fees</label>
                            <input
                                id='fees'
                                type="number"
                                min="0"
                                value={fees}
                                onChange={(e) => {
                                    const value = e.target.value
                                    if (value === '' || Number(value) >= 0) {
                                        setFees(value)
                                    }
                                }}
                                className='border rounded px-3 py-2 border-gray-300'
                                placeholder='Doctor fees'
                                required
                            />
                        </div>

                    </div>

                    <div className='w-full lg:flex-1 flex flex-col gap-4'>

                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="speciality">Speciality</label>
                            <select id='speciality' onChange={e => setSpeciality(e.target.value)} value={speciality} className='border rounded px-2 py-2 border-gray-300 cursor-pointer'>
                                <option value="General physician">General physician</option>
                                <option value="Gynecologist">Gynecologist</option>
                                <option value="Dermatologist">Dermatologist</option>
                                <option value="Pediatricians">Pediatricians</option>
                                <option value="Neurologist">Neurologist</option>
                                <option value="Gastroenterologist">Gastroenterologist</option>
                            </select>
                        </div>


                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="degree">Education / Degree</label>
                            <input id='degree' onChange={e => setDegree(e.target.value)} value={degree} className='border rounded px-3 py-2 border-gray-300' type="text" placeholder='Degree' required />
                        </div>

                        <div className='flex-1 flex flex-col gap-1'>
                            <label htmlFor="address1">Address</label>
                            <input id='address1' onChange={e => setAddress1(e.target.value)} value={address1} className='border rounded px-3 py-2 border-gray-300' type="text" placeholder='Address 1' required />
                            <input id='address2' onChange={e => setAddress2(e.target.value)} value={address2} className='border rounded px-3 py-2 border-gray-300' type="text" placeholder='Address 2' required />
                        </div>

                    </div>

                </div>

                <div className='flex-1 flex flex-col gap-1'>
                    <label htmlFor="about" className='mt-4 mb-2'>About Doctor</label>
                    <textarea id='about' onChange={e => setAbout(e.target.value)} value={about} className='w-full px-4 pt-2 border rounded border-gray-300' rows={5} placeholder='write about doctor'></textarea>
                </div>

                <button type='submit' className='bg-primary px-10 py-3 mt-4 text-white rounded-full cursor-pointer'>Add doctor</button>

            </div>


        </form>
    )
}

export default AddDoctor