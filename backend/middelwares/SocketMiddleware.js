
const cookie=require("cookie")
const { verifyToken } = require('../utils/constant');

function SocketIdMiddleware(socket, next) {

    try {
        const cookies = socket.handshake.headers.cookie
        if (!cookies) {
            return next(new Error("Authentication Error"))
        }
        const parsedCookie = cookie.parse(cookies)
        const authToken = parsedCookie.token

        if (!authToken) {
            return next(new Error("Authentication Error"))
        }
        const data = verifyToken(authToken)
        if (data.success) {
            socket.username = data.data.username
            socket.userId = data.data.id
            return next()
        }
        if(!data.success && data.jwtExpire){
            return next(new Error("JwtTokenExpired"))
        }
        return next(new Error("Authentication Error"))

    } catch (error) {
        console.log("Error :", error.message)
        return next(new Error("Internal Error occured."))
    }
}

module.exports = { SocketIdMiddleware }
