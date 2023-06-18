require("express-async-errors")
const express = require("express")
const app = express()
require("dotenv").config()
const port = process.env.PORT || 5002
require("./src/db/dbConnection")
const errorHandlerMiddleware = require("./src/middlewares/errorHandler")
const router = require("./src/routers") // index dosyasını dikkate alacak
const cors = require("cors")
const corsOptions = require("./src/helpers/corsOptions")
const mongoSanitize = require("express-mongo-sanitize")
const apiLimiter = require("./src/middlewares/rateLimit")
const moment = require("moment-timezone")

moment.tz.setDefault("Europe/Istanbul")

// Middlewares
app.use(express.json())
app.use(express.json({limit: "50mb"}))
app.use(express.urlencoded({limit: "50mb", extended: true, parameterLimit: 50000}))

app.use(cors(corsOptions))

app.use("/api", apiLimiter) // /api ile başlayan rotolarda kontrol yapacak

app.use( // injectionları engellemek için
    mongoSanitize({
        replaceWith: '_',
    }),
)

app.use("/api", router) // bunu yaptıktan sonra artık bütün endpointlerimiz /api/ şeklinde devam edecek örneğin /api/login /api/register

app.get("/", (req, res) => {
    res.json({
        message: "Welcome"
    })
})


// Hata yakalama
app.use(errorHandlerMiddleware)

app.listen(port, () => {
    console.log(`Server working from ${port}`);
})