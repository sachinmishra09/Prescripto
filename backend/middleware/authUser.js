import jwt from "jsonwebtoken"

// USER authentication middleware - authenticating the user
const authUser = async (req, res, next) => {
    try {
        // get the token from the request header then only allow we will allow to make api call otherwise terminate the request
        const { atoken } = req.headers

        if (!atoken) {
            return res.json({ success: false, message: "Not authorized Login Again." })
        }

        // verify the token
        // decode the token using jwt.verify() method and check if the decoded token is valid or not
        const token_decode = jwt.verify(atoken, process.env.JWT_SECRET) // we will get the user id from this token_decode
        req.userId = token_decode.id // The authUser middleware verifies that token and stores its id on the request in authUser.js:16:
        next() // if the token is valid then we will call the next middleware function

    } catch (error) {
        // console.log(error)
        res.json({ success: false, message: error.message })
    }
}

export default authUser