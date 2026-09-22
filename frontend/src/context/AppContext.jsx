import { createContext, useEffect, useState } from "react";
// import { doctors } from "../assets/assets"; // now don't take the data from assests as the data will come from backend now
import axios from 'axios' // we will call the api and get the doctors data from api
import { ToastContainer, toast } from 'react-toastify';

export const AppContext = createContext()

const AppContextProvider = (props) => {

    const currencySymbol = '$'
    const backendUrl = import.meta.env.VITE_BACKEND_URL

    const [doctors, setDoctors] = useState([])
    const [token, setToken] = useState(localStorage.getItem('token') ? localStorage.getItem('token') : false) // whenever we will reload the page so it will check the token from the local storage and if it is available it will save the token in token state variable  // whenever the user will log in or register we will receive the jwt token

    // we will create a state variable to store the user data
    const [userData, setUserData] = useState(false)

    // arrow function to call the api 
    const getDoctorsData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/doctor/list') // here we will get all the doctors data from the api

            if (data.success) {
                // if success from backend api then store this doctor data in state variable
                setDoctors(data.doctors)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }

    }

    const loadUserProfileData = async () => {

        try {

            const { data } = await axios.get(backendUrl + '/api/user/get-profile', { headers: { atoken: token } }) // now we will receive the users profile data which is logged in

            if (data.success) {
                setUserData(data.userData)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            console.log(error)
            toast.error(error.message)
        }
    }

    const value = { // we are adding these values in context to access  in any component of frontend
        doctors, getDoctorsData,
        currencySymbol,
        token, setToken,
        backendUrl,
        userData, setUserData,
        loadUserProfileData
    }

    useEffect(() => {
        getDoctorsData()
    }, [])

    useEffect(() => {
        if(token) {
            loadUserProfileData() // we have call loadUserProfileData() every time user log in that means we get token
        } else {
            // when we are logged out from website token will be unavailable
            setUserData(false)
        }
    }, [token])


    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}

export default AppContextProvider;