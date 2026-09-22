import jwt from "jsonwebtoken"

// ADMIN authentication middleware - authenticating the admin
const authAdmin = async (req, res, next) => {
    try {
        // get the token from the request header then only allow we will allow to make api call otherwise terminate the request
        const { atoken } = req.headers

        if (!atoken) {
            return res.json({ success: false, message: "Not authorized Login Again." })
        }

        // verify the token
        // decode the token using jwt.verify() method and check if the decoded token is valid or not
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET) 

        // this will decode the token and return the email and password that we have used to create the token
        if (token_decode !== process.env.ADMIN_EMAIL + process.env.ADMIN_PASSWORD) {
            return res.json({ success: false, message: "Not authorized Login Again." })
        }

        next() // if the token is valid then we will call the next middleware function

    } catch (error) {
        // console.log(error)
        res.json({ success: false, message: message.error })
    }
}

export default authAdmin