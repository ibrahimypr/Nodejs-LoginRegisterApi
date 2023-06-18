const APIError = require("../utils/errors")

// instaneceof belirli bir objenin belirli sınıfa ait olup olmadığını kontrol eder
// burada error ApıError'a ait mi diye bakıyoruz
const errorHandlerMiddleware = (err, req, res, next) => {
    if (err instanceof APIError) {
        return res.status(err.statusCode || 400)
            .json({
                succes: false,
                message: err.message
            })
    }
    return res.status(500).json({
        succes: false,
        message : "we encountered an error check your api"
    }) // 500 api hatası
}


module.exports = errorHandlerMiddleware