class Response {
    constructor(data = null, message = null) {
        this.data = data
        this.message = message
    }

    success(res) {
        return res.status(200).json({ // success 200
            success: true,
            data: this.data,
            message: this.message ?? "Success",
        })
    }

    created(res) {
        return res.status(201).json({ // register 201
            succes: true,
            data: this.data,
            message: this.message ?? "Success",
        }) 
            
    }

    error500(res) {
        return res.status(500).json({
            success: false,
            data: this.data,
            message: this.message ?? "Failure err500",
        })
    }

    error400(res) {
        return res.status(400).json({
            success: false,
            data: this.data,
            message: this.message ?? "Failure unauthorized",
        })
    }

    error401(res) {
        return res.status(401).json({
            success: false,
            data: this.data,
            message: this.message ?? "please login",
        })
    }

    error404(res) {
        return res.status(404).json({
            succcess: false,
            data: this.data,
            message: this.message ?? "Error 404 unidentified error",
        })
    }

    error429(res) {
        return res.status(429).json({
            success: false,
            data: this.data,
            message: this.message ?? "too many requests",
        })
    }
}

module.exports = Response