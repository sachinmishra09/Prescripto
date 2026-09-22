import express from 'express'
import { registerUser, loginUser, getProfile, updateProfile, bookAppointment, listAppointment, cancelAppointment, paymentRazorpay } from '../controllers/userController.js'
import authUser from '../middleware/authUser.js'
import upload from '../middleware/multer.js'

// create instance of router
const userRouter = express.Router()

userRouter.post('/register', registerUser)
userRouter.post('/login', loginUser)

userRouter.get('/get-profile', authUser, getProfile)
userRouter.post('/update-profile', upload.single('image'), authUser, updateProfile) // here we are using two middleware first one to upload the image to cloudinary and second one is to authenticate the user and getting userId
userRouter.post('/book-appointment', authUser, bookAppointment)
userRouter.get('/appointments', authUser, listAppointment) // we will get the userId from the authUser middleware and then we will use that userId to get the appointments of that user
userRouter.post('/cancel-appointment', authUser, cancelAppointment) // we will get the userId from the authUser middleware and then we will use that userId to cancel the appointment of that user
userRouter.post('/payment-razorpay', authUser, paymentRazorpay) // we will get the userId from the authUser middleware and then we will use that userId to make the payment of that user

export default userRouter