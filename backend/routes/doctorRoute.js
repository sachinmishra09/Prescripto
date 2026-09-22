import express from 'express'
import { doctorList, loginDoctor, appointmentsDoctor, appointmentComplete, appointmentCancel, doctorDashboard, doctorProfile, updateDoctorProfile } from '../controllers/doctorController.js'
import authDoctor from '../middleware/authDoctor.js'

// router instance
const doctorRouter = express.Router()

// create API endpoints
doctorRouter.get('/list', doctorList)
doctorRouter.post('/login', loginDoctor) // we will create a new API endpoint for doctor login
doctorRouter.get('/appointments', authDoctor, appointmentsDoctor) // we will create a new API endpoint for doctor appointments
doctorRouter.post('/complete-appointment', authDoctor, appointmentComplete) // we will create a new API endpoint for doctor to mark appointment completed
doctorRouter.post('/cancel-appointment', authDoctor, appointmentCancel) // we will create a new API endpoint for doctor to cancel appointment
doctorRouter.get('/dashboard', authDoctor, doctorDashboard) // we will create a new API endpoint for doctor dashboard
doctorRouter.get('/profile', authDoctor, doctorProfile) // we will create a new API endpoint for doctor profile
doctorRouter.post('/update-profile', authDoctor, updateDoctorProfile) // we will create a new API endpoint for doctor to update profile

export default doctorRouter