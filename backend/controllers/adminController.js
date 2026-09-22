import validator from "validator"
import bcrypt from "bcrypt"
import { v2 as cloudinary } from "cloudinary"
import Doctor from "../models/doctorModel.js"
import jwt from "jsonwebtoken"
import doctorModel from "../models/doctorModel.js"
import appointmentModel from "../models/appointmentModel.js"
import userModel from "../models/userModel.js"

// API for adding doctor
const addDoctor = async (req, res) => {
    try {

        const { name, email, password, speciality, degree, experience, about, fees, address } = req.body;
        const imageFile = req.file

        // checking for all data to add doctor
        if (!name || !email || !password || !speciality || !degree || !experience || !about || !fees || !address || !imageFile) {
            return res.json({ success: false, message: "Missing details" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            return res.json({ success: false, message: "Please enter a valid email" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Please enter a strong password" })
        }

        // encrypt password
        // generate the salt to hash password
        const salt = await bcrypt.genSalt(10);
        // now we set user password to hashed password
        const hashedPassword = await bcrypt.hash(password, salt);

        // upload image to cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: "image", folder: "doctors" })
        const imageUrl = imageUpload.secure_url

        const doctorData = {
            name,
            email,
            image: imageUrl,
            password: hashedPassword,
            speciality,
            degree,
            experience,
            about,
            fees,
            address: JSON.parse(address), // store address as an object in the database
            date: Date.now()
        }

        const newDoctor = new Doctor(doctorData)
        await newDoctor.save() // data will be saved in the database

        res.json({ success: true, message: "Doctor added successfully" })

        // console.log({ name, email, password, speciality, degree, experience, about, fees, address, imageFile })

    } catch (error) {
        console.log('Failed to add doctor:', error)

        if (error.code === 11000) {
            return res.status(400).json({ success: false, message: "A doctor with this email already exists" })
        }

        res.status(500).json({ success: false, message: "Unable to add doctor" })
    }
}

// API for admin login
const loginAdmin = async (req, res) => {
    try {
        // we will get email and password from the request body and match this with the email and password stored in the .env file if that match we will create a token using jwt and send it to the frontend
        const { email, password } = req.body

        if (email === process.env.ADMIN_EMAIL && password === process.env.ADMIN_PASSWORD) {
            // create a token and send it to user
            const token = jwt.sign(email + password, process.env.JWT_SECRET)
            res.json({ success: true, message: "Login successful", token })

        } else {
            res.json({ success: false, message: "Invalid email or password" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: message.error })
    }
}

// API to get all the list of doctors along with their details from the database for Admin Panel Dashboard
const allDoctors = async (req, res) => {

    try {

        const doctors = await doctorModel.find({}).select('-password') // we will not send the password to the frontend for security reasons
        res.json({ success: true, doctors }) // send the list of doctors to the frontend

    } catch (error) {

        console.log(error)
        res.json({ success: false, message: error.message })

    }
}

// API to get all apointments list of a particular doctor for Admin Panel Dashboard
const appointmentsAdmin = async (req, res) => {

    try {

        const appointments = await appointmentModel.find({})
        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API for appointment cancellation by admin
const appointmentCancel = async (req, res) => {

    try {

        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found!!!" })
        }

        await appointmentModel.findByIdAndUpdate(appointmentId, { cancelled: true }) // update the appointment from database

        // releasing the doctor slot booked by user for this appointment
        const { docId, slotDate, slotTime } = appointmentData

        const doctorData = await doctorModel.findById(docId)

        let slots_booked = doctorData.slots_booked // copy of slots_booked from doctorData

        slots_booked[slotDate] = slots_booked[slotDate].filter(e => e !== slotTime) // remove the slotTime from slots_booked array for this slotDate 

        await doctorModel.findByIdAndUpdate(docId, { slots_booked }) // update the doctorData in database

        res.json({ success: true, message: "Appointment Cancelled!!!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get dashboard data for admin panel
const adminDashboard = async (req, res) => {
    try {

        const doctors = await doctorModel.find({}) // access all doctors from the database
        const users = await userModel.find({})  // access all users from the database
        const appointments = await appointmentModel.find({}) // access all appointments from the database

        const dashData = {
            doctors: doctors.length,
            appointments: appointments.length,
            patients: users.length,
            latestAppointments: appointments.reverse()
        }

        res.json({ success: true, dashData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard }