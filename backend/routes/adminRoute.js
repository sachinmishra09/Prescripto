import express from "express";
import { addDoctor, loginAdmin, allDoctors, appointmentsAdmin, appointmentCancel, adminDashboard } from "../controllers/adminController.js";
import upload from "../middleware/multer.js";
import authAdmin from "../middleware/authAdmin.js";
import { changeAvailability } from "../controllers/doctorController.js";

const adminRouter = express.Router()

adminRouter.post('/add-doctor', authAdmin, upload.single('image'), addDoctor)
adminRouter.post('/login', loginAdmin)
adminRouter.post('/all-doctors', authAdmin, allDoctors) // we have to add the middleware authAdmin here because we want to protect this route and only allow access to the admin who is logged in  // http://localhost:4001/api/admin/all-doctors
/*
{
    "success": true,
    "doctors": [
        {
            "_id": "6a9821b9768425b7d2034bd1",
            "name": "Dr. Richard James",
            "email": "richard@demo.com",
            "image": "https://res.cloudinary.com/d8jncdaw/image/upload/v1788355001/doctors/doiazgbyiyckum1hwav5.png",
            "speciality": "General physician",
            "degree": "MBBS",
            "experience": "4 years",
            "about": "Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies. Dr. Davis has a strong commitment to delivering comprehensive medical care, focusing on preventive medicine, early diagnosis, and effective treatment strategies.",
            "available": true,
            "fees": 50,
            "address": "{\r\n            line1: '17th Cross, Richmond',\r\n            line2: 'Circle, Ring Road, London'\r\n        }",
            "date": 1788355001780,
            "slots_booked": {},
            "__v": 0
        }
    ]
}
*/
adminRouter.post('/change-availability', authAdmin, changeAvailability)
adminRouter.get('/appointments', authAdmin, appointmentsAdmin) // we have to add the middleware authAdmin here because we want to protect this route and only allow access to the admin who is logged in  // http://localhost:4001/api/admin/all-appointments
adminRouter.post('/cancel-appointment', authAdmin, appointmentCancel) // we have to add the middleware authAdmin here because we want to protect this route and only allow access to the admin who is logged in  // http://localhost:4001/api/admin/cancel-appointment
adminRouter.get('/dashboard', authAdmin, adminDashboard) // we have to add the middleware authAdmin here because we want to protect this route and only allow access to the admin who is logged in  // http://localhost:4001/api/admin/dashboard

export default adminRouter