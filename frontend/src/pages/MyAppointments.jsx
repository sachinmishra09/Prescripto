import React, { useContext, useEffect, useState } from 'react'
import { AppContext } from '../context/AppContext'
import axios from 'axios'
import { toast } from 'react-toastify'
// import { get } from 'mongoose'

const MyAppointments = () => {

  const { backendUrl, token, getDoctorsData } = useContext(AppContext)

  // create state variable to store the appointments data
  const [appointments, setAppointments] = useState([])
  const months = ["", "Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

  const slotDateFormat = (slotDate) => {
    const dateArray = slotDate.split('_')
    return dateArray[0] + " " + months[Number(dateArray[1])] + " " + dateArray[2]
  }

  // create a function to get the user appointments
  const getUserAppointments = async () => {

    try {

      // api call to get the user appointments
      const { data } = await axios.get(backendUrl + '/api/user/appointments', { headers: { atoken: token } })

      if (data.success) {
        setAppointments(data.appointments.reverse()) // reverse the array to show the latest appointment first
        console.log(data.appointments)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const cancelAppointment = async (appointmentId) => {

    try {

      // console.log(appointmentId)
      const { data } = await axios.post(backendUrl + '/api/user/cancel-appointment', { appointmentId }, { headers: { atoken: token } })

      if (data.success) {
        toast.success(data.message)
        getUserAppointments() // call the function to get the user appointments after cancelling the appointment
        getDoctorsData()
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  const initPay = (order) => {

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // Enter the Key ID generated from the Dashboard
      amount: order.amount, // Amount is in currency subunits. Default currency is INR. Hence, 50000 refers to 50000 paise
      currency: order.currency,
      name: "Appointment Payment",
      description: "Appointment Payment",
      order_id: order.id, //This is a sample Order ID. Pass the `id` obtained in the response of Step 1
      receipt: order.receipt,
      handler: function (response) {
        // Handle the payment success response
        console.log(response)
      }
    }

    const rzp = new window.Razorpay(options)
    rzp.open()

  }

  const appintmentRazorpay = async (appointmentId) => {
    try {

      const { data } = await axios.post(backendUrl + '/api/user/payment-razorpay', { appointmentId }, { headers: { atoken: token } })

      if (data.success) {
        // Handle the successful payment response
        // console.log(data.order);
        initPay(data.order) // call the function to initiate the payment
      } else {
        toast.error(data.message)
      }

    } catch (error) {
      console.log(error)
      toast.error(error.message)
    }

  }

  useEffect(() => {
    if (token) {
      getUserAppointments() // call the function to get the user appointments when the component is mounted and when the token changes
    }
  }, [token])

  return (
    <div className='mx-2 sm:mx-6 md:mx-10'>
      <div className='text-center'>
        <p className=' pb-3 mt-10 font-medium text-2xl text-zinc-700 border-b'>My Appointments</p>
      </div>
      <div className='sm:mx-90 md:mx-10'>
        {appointments.map((item, index) => (
          <div className='grid grid-cols-[1fr_2fr] gap-4 sm:flex sm:gap-6 py-2 border-b' key={index}>
            <div>
              <img className='w-40 bg-indigo-100 rounded' src={item.docData.image} alt="" />
            </div>
            <div className='flex-1 text-sm text-zinc-600'>
              <p className='text-neutral-800 font-semibold'>{item.docData.name}</p>
              <p>{item.docData.speciality}</p>
              <p className='text-zinc-700 font-medium mt-1'>Address:</p>
              <p className='text-xs'>{item.docData.address.line1}</p>
              <p className='text-xs'>{item.docData.address.line2}</p>
              <p className='text-sm mt-1'><span className='text-sm text-neutral-700 font-medium'>Date & Time:</span> {slotDateFormat(item.slotDate)} | {item.slotTime} </p>
            </div>
            <div className="col-span-2 w-full text-center sm:col-span-auto sm:w-auto sm:text-left">
              <div className="flex flex-col gap-2 justify-end w-full sm:w-auto">
                {!item.cancelled && item.payment && !item.isCompleted && <button className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border-black border rounded-full hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>Paid</button>}
                {!item.cancelled && !item.payment && !item.isCompleted && <button onClick={() => appintmentRazorpay(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border-black border rounded-full hover:bg-primary hover:text-white transition-all duration-300 cursor-pointer'>Pay Online</button>}
                {!item.cancelled && !item.isCompleted && <button onClick={() => cancelAppointment(item._id)} className='text-sm text-stone-500 text-center sm:min-w-48 py-2 border-black border rounded-full hover:bg-red-600 hover:text-white transition-all duration-300 cursor-pointer'>Cancel Appointment</button>}
                {item.cancelled && !item.isCompleted && <button className='text-sm text-red-600 text-center sm:min-w-48 py-2 border-black border rounded-full hover:bg-green-600 hover:text-white transition-all duration-300 cursor-pointer'>Appointment Cancelled</button>}
                {item.isCompleted && <button className='text-sm text-green-600 text-center sm:min-w-48 py-2 border-black border rounded-full hover:bg-orange-600 hover:text-white transition-all duration-300 cursor-pointer'>Appointment Completed</button>}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MyAppointments
