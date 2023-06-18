const nodeMailer = require("nodemailer")

const sendEmail = async (mailOptions) => {
    const transporter = nodeMailer.createTransport({
        host: "smtp-mail.outlook.com",
        port: 587,
        secure: false,
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PW,
        }
    })

    transporter.sendMail(mailOptions, (error, info) => {
        if (error)
            console.log("Error occurred while sending mail", error);
    })
    return true
}

module.exports = sendEmail