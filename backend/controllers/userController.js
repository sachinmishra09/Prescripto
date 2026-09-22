import validator from 'validator'
import bcrypt from 'bcrypt'
import userModel from '../models/userModel.js'
import jwt from 'jsonwebtoken'
import { v2 as cloudinary } from 'cloudinary'
import doctorModel from '../models/doctorModel.js'
import appointmentModel from '../models/appointmentModel.js'
import Razorpay from 'razorpay'

// create the api logic for user like login , register, get profile, uodate profile, book appointment, displaying book appointment, cancel appointment, payment gateway

// API to register user
const registerUser = async (req, res) => {
    try {

        const { name, email, password } = req.body // get name , email , password from the req.body

        if (!name || !password || !email) {
            return res.json({ success: false, message: "Missing Details !!!" })
        }

        // validating email format
        if (!validator.isEmail(email)) {
            // if email is not in correct format
            return res.json({ success: false, message: "Enter a valid email !!!" })
        }

        // validating strong password
        if (password.length < 8) {
            return res.json({ success: false, message: "Enter a strong password !!!" })
        }

        // now we will add this user in the database
        // hashing user password using bcrypt and salt
        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password, salt)

        const userData = {
            name,
            email,
            password: hashedPassword // we will not provide the original password provide the hashed password
        }

        // now we have to save this hashed password in database
        const newUser = new userModel(userData) // now we have created a new user using this userModel
        const user = await newUser.save() // now user data will be saved in database

        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET)

        // now we generate the response to send this token to user
        res.json({ success: true, token })

    } catch (error) {
        console.log(error)

        if (error.code === 11000) {
            return res.json({ success: false, message: "User already exists with this email" })
        }

        res.json({ success: false, message: error.message })
    }
}

// API for user login
const loginUser = async (req, res) => {

    try {

        const { email, password } = req.body  // get the email and password from user using body
        const user = await userModel.findOne({ email }) // now find that particular user with email id given

        // check if user exist or not
        if (!user) {
            return res.json({ success: false, message: 'User does not exist !!!' })
        }

        // now if user exist match his password
        const isMatch = await bcrypt.compare(password, user.password) // compare the given password of user with the hashed password stored on database

        if (isMatch) {
            const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET) // send the token to the user generated after login // if the user is logged in then we will send the user id as id to the authUser middleware
            res.json({ success: true, token })
        } else {
            res.json({ success: false, message: "Invalid Credentials!!!" })
        }

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get the users profile data from http://localhost:5175/my-profile frontend
const getProfile = async (req, res) => {
    try {

        // we will use the user id and by that id we will get the users data from database and provide that user details to frontend
        const { userId } = req // we will not get the user id from the user, user will send the token, this token will go to authUser middleware and this middleware will send the userId in req, by using that token we will get user id

        // now find this particular user from the database using usermodel
        const userData = await userModel.findById(userId).select('-password') // exclude the password from user data

        res.json({ success: true, userData })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to update the user profile
const updateProfile = async (req, res) => {

    try {

        // to update the user profile first we need the data from req
        const { name, phone, address, dob, gender } = req.body
        const { userId } = req
        // userId will be added from token in the authUser middleware
        const imageFile = req.file // we will get the image from multer

        if (!name || !phone || !dob || !gender) {
            // if these data will be there then only we need to update the profile
            return res.json({ success: false, message: "Data Missing !!!" })
        }

        // now update the users profile if we have all these data
        const updatedUser = await userModel.findByIdAndUpdate(userId, { name, phone, address: JSON.parse(address), dob, gender }, { new: true }) // here the userId will be used to find the user data

        if (!updatedUser) {
            return res.json({ success: false, message: "User not found" })
        }

        if (imageFile) {

            // upload image to cloudinary
            const imageUpload = await cloudinary.uploader.upload(imageFile.path, { resource_type: 'image' }) // from this we will get the image URL of the uploaded image to cloudinary 
            console.log(imageFile.path)
            const imageURL = imageUpload.secure_url // we will get cloudinary image url

            await userModel.findByIdAndUpdate(userId, { image: imageURL }) // by this first we will find the user data from database using userId, then update the user image url

        }

        res.json({ success: true, message: "Profile Updated!!!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to book appointment
const bookAppointment = async (req, res) => {

    try {

        const { docId, slotDate, slotTime } = req.body
        const { userId } = req

        // get the doctor data using docId
        const docData = await doctorModel.findById(docId).select('-password') // exclude the password

        // check if doctor is available to take booking or not
        if (!docData) {
            return res.json({ success: false, message: "Doctor not found!!!" })
        }

        if (!docData.available) {
            return res.json({ success: false, message: "Doctor not available!!!" })
        }

        let slots_booked = docData.slots_booked

        // checking for slots availablity
        if (slots_booked[slotDate]) {
            if (slots_booked[slotDate].includes(slotTime)) { // if is already booked 
                return res.json({ success: false, message: "Slot not available!!!" })
            } else {
                // slot is free
                slots_booked[slotDate].push(slotTime)
            }
        } else {
            slots_booked[slotDate] = []
            slots_booked[slotDate].push(slotTime)
        }

        // get the user data using docId
        const userData = await userModel.findById(userId).select('-password') // exclude the password

        if (!userData) {
            return res.json({ success: false, message: "User not found!!!" })
        }

        delete docData.slots_booked

        const appointmentData = {
            userId,
            docId,
            userData,
            docData,
            amount: docData.fees,
            slotTime,
            slotDate,
            date: Date.now() // current date
        }

        const newAppointment = new appointmentModel(appointmentData)
        await newAppointment.save() // save this new Appointment into database 

        // save new slots data in docData
        await doctorModel.findByIdAndUpdate(docId, { slots_booked })

        res.json({ success: true, message: "Appointment Booked!!!" })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to get the user appointments for frontend my appointments page
const listAppointment = async (req, res) => {

    try {

        const { userId } = req
        const appointments = await appointmentModel.find({ userId }) // we will get all the appointments of this user using userId

        res.json({ success: true, appointments })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }

}

// API to cancel the user appointment for frontend my appointments page
const cancelAppointment = async (req, res) => {

    try {

        const { appointmentId } = req.body
        const { userId } = req

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData) {
            return res.json({ success: false, message: "Appointment not found!!!" })
        }

        // verify appointment belongs to user or not
        if (appointmentData.userId !== userId) { // userId from middleware and appointmentData.userId from database must be same, if not then user is trying to cancel other users appointment
            return res.json({ success: false, message: "You are not authorized to cancel this appointment!!!" })
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

const razorpayInstance = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

// API to make payment for appointment using razorpay
const paymentRazorpay = async (req, res) => {

    try {

        // make the logic for payment using razorpay
        const { appointmentId } = req.body

        const appointmentData = await appointmentModel.findById(appointmentId)

        if (!appointmentData || appointmentData.cancelled) {
            return res.json({ success: false, message: "Appointment not found or already cancelled!!!" })
        }

        // creating options for razorpay payment
        const options = {
            amount: appointmentData.amount * 100, // amount in paise
            currency: process.env.CURRENCY,
            receipt: appointmentId, // appointmentId will be used as receipt
        }

        // creation of order in razorpay
        const order = await razorpayInstance.orders.create(options)

        res.json({ success: true, order })

    } catch (error) {
        console.log(error)
        res.json({ success: false, message: error.message })
    }
}

// API to verify the payment for appointment using razorpay
const verifyRazorpay = async (req, res) => {

    try {
        
        

    } catch (error) {
        
    }

}

export { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay }