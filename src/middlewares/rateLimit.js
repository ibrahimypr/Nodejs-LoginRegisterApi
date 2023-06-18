const rateLimit = require("express-rate-limit")

const allowList = ["::1"] // localden gelen isteklere onay verecek

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // çok fazla istek gelirse 15 dk engellenecek
    max: (req, res) => {
        console.log("api url :", req.url);
        console.log("api ip :", req.ip);
        if (req.url == "/login" || req.url == "/register")
            return 5
        else
            return 100
    },
    message: {
        success: false,
        message: "too many requests please try again in 15 minutes"
    },
    skip: (req, res) => allowList.includes(req.ip),
    standardHeaders: true,
    legacyHeaders: false,
})

module.exports = apiLimiter