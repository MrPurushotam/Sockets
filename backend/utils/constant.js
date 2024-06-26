const jwt= require('jsonwebtoken')

function createToken(object){
    const token = jwt.sign(object,process.env.SECRET_KEY,{expiresIn:'3d'})
    return token
}

function verifyToken(token){
    try {
        const data = jwt.verify(token,process.env.SECRET_KEY)
        return {success:true, data}
    } catch (error) {
        console.log(error.message)
        return {success:false}
    }
}

module.exports={verifyToken , createToken}