const jwt = require("jsonwebtoken")
const user = require("../models/user.model")
const APIError = require("../utils/errors");

const createToken = async (user, res) => {
    
    const payload = {
        sub: user._id, // id otomatik atanır
        name: user.name, // name
    }

    const token = await jwt.sign(payload, process.env.JWT_SECRET_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_EXPIRED_IN,
    })

    return res.status(201).json({
        success: true,
        token, // token : token olarak algılayacak
        message: "Success"
    })
}

const tokenCheck = async(req, res, next) => {
    const headerToken = req.headers.authorization && req.headers.authorization.startsWith("Bearer ") 

    if (!headerToken) {
        throw new APIError("unauthorized user please login", 401 )
    }

    const token = req.headers.authorization.split(" ")[1] // get token without bearer

    await jwt.verify(token, process.env.JWT_SECRET_KEY, async (err, decoced) => {
        if (err) {
            throw new APIError("invalid token", 401)
        }

        const userInfo = await user.findById(decoced.sub).select("_id name lastname email") // ID

        if (!userInfo) {
            throw new APIError("Invalid Token - User not found", 401)
        }
    
        req.user = userInfo
        next()
    })
}

const createTemporaryToken = async(userId, email) => {
    const payload = {
        sub: userId,
        email,
    }
    const token = await jwt.sign(payload, process.env.JWT_TEMPORARY_KEY, {
        algorithm: "HS512",
        expiresIn: process.env.JWT_TEMPORARY_EXPIRED_IN
    })

    return "Bearer " + token
}

const decodedTemporaryToken = async(temporaryToken) => {
    const token = temporaryToken.split(" ")[1] // without bearer
    let userInfo
    await jwt.verify(token, process.env.JWT_TEMPORARY_KEY, async (err, decoded) => {
        if (err)
            throw new APIError("Invalid token", 401)
        userInfo = await user.findById(decoded.sub).select("_id name lastname email") // sub = id
        if (!userInfo)
            throw new APIError("Invalid Token", 401)
    })
    return userInfo
}

module.exports = {
    createToken,
    tokenCheck,
    createTemporaryToken,
    decodedTemporaryToken,
}