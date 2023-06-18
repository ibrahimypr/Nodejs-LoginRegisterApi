const joi = require("joi")
const APIError = require("../../utils/errors")

class authValidation {
    constructor() { }
    static register = async (req, res, next) => {
        try {
            await joi.object({
                name: joi.string().trim().min(4).max(20).required().messages({
                    "string.base": "name must be text",
                    "string.empty": "name cannot be empty",
                    "string.min": "name must be at least 4 characters",
                    "string.max": "name must be no more than 20 characters",
                    "string.required": "name is required"
                }),
                lastname: joi.string().trim().min(4).max(20).required().messages({
                    "string.base": "surname must be text",
                    "string.empty": "surname cannot be empty",
                    "string.min": "surname must be at least 4 characters",
                    "string.max": "surname must be no more than 20 characters",
                    "string.required": "surname is required"
                }),
                email: joi.string().email().trim().min(4).max(60).required().messages({
                    "string.base": "email must be text",
                    "string.empty": "email cannot be empty",
                    "string.min": "email must be at least 4 characters",
                    "string.max": "email must be no more than 60 characters",
                    "string.email": "please enter a valid email",
                    "string.required": "email is required"
                }),
                password: joi.string().trim().min(4).max(20).required().messages({
                    "string.base": "password must be text",
                    "string.empty": "password cannot be empty",
                    "string.min": "password must be at least 4 characters",
                    "string.max": "password must be no more than 40 characters",
                    "string.required": "password is required"
                })
            }).validateAsync(req.body)  // request'in body'sinden gelen değerlere bakacak
        } catch (error) {
            if (error.details && error?.details[0].message) 
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Please Follow Validation Terms", 400)
        }
        next()
    }

    static login = async (req, res, next) => {
        try {
            await joi.object({
                email: joi.string().email().trim().min(4).max(60).required().messages({
                    "string.base": "email must be text",
                    "string.empty": "email cannot be empty",
                    "string.min": "email must be at least 4 characters",
                    "string.max": "email must be no more than 60 characters",
                    "string.email": "please enter a valid email",
                    "string.required": "email is required"
                }),
                password: joi.string().trim().min(4).max(20).required().messages({
                    "string.base": "password must be text",
                    "string.empty": "password cannot be empty",
                    "string.min": "password must be at least 4 characters",
                    "string.max": "password must be no more than 40 characters",
                    "string.required": "password is required"
                })
            }).validateAsync(req.body)
        } catch (error) {
            if (error.details && error?.details[0].message) 
                throw new APIError(error.details[0].message, 400)
            else throw new APIError("Lütfen Validasyon Kullarına Uyun", 400)
        }
        next()
    }
}

module.exports = authValidation