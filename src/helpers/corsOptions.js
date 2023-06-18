const whiteList = ["http://localhost:3000"]

const corsOptions = (req, callback) => {
    let corsOptions  
    if (whiteList.indexOf(req.header("Origin")) !== -1) { // 3000 harici farklı portta arama yaptığı taktirde -1 gelecek yani burada -1 değilse if' e girecek 
        corsOptions = {origin: true}
    }
    else {
        corsOptions = {origin: false}
    }
    callback(null, corsOptions)
}

module.exports = corsOptions