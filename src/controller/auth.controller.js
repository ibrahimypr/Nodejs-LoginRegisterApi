const Response = require("../utils/response")
const user = require("../models/user.model")
const bcrypt = require("bcrypt");
const APIError = require("../utils/errors");
const { createToken , createTemporaryToken, decodedTemporaryToken } = require("../middlewares/auth");
const crypto = require("crypto");
const sendEmail = require("../utils/sendMail");
const moment = require("moment/moment");

const login = async (req, res) => {
    const { email, password } = req.body

    const userInfo = await user.findOne({ email })

    if (!userInfo) {
        throw new APIError("Invalid password or email", 401)
    }

    const comparePassword = await bcrypt.compare(password, userInfo.password) // şifreyi çözümler true false

    if (!comparePassword) {
        throw new APIError("Invalid password or email", 401)
    }

    createToken(userInfo, res)
}

const register = async (req, res) => {
    const { email } = req.body

    const userCheck = await user.findOne({ email }) // normalde email : req.body.email denir ama biz yukarıda zaten alıyoruz. email: email yazmamıza da gerek yok anahtar ve değer aynı ise sadece birini versek yeter

    if (userCheck) {
        throw new APIError("This email already exists", 401) // error.js
    }

    req.body.password = await bcrypt.hash(req.body.password, 10)

    console.log("hash pw : ", req.body.password)

    const userSave = new user(req.body)

    // await (asenkron) data parametresi, promise'nin çözümlenen değerini temsil eder. Bu durumda, userSave.save() işlemi tarafından döndürülen ve veritabanına başarıyla kaydedilen kullanıcı verilerini içerir.
    // user.save() çağrısı yaptığınızda, Mongoose tarafından sağlanan .save() yöntemi, belirtilen modelin verilerini otomatik olarak veritabanına kaydeder.
    await userSave.save()
        .then((data) => {
            return new Response(data, "registration successfully added").created(res)
        })
        .catch((err) => {
            throw new APIError("user could not be registered", 400)
        })
}

const me = async (req, res) => {
    return new Response(req.user).success(res)
}

const forgetPassword = async (req, res) => {
    const { email } = req.body

    const userInfo = await user.findOne({email}).select("name lastname email")

    if (!userInfo) {
        return new APIError("User not found", 400)
    }
    const resetCode = crypto.randomBytes(2).toString("hex")

    await sendEmail({
        from: "smtptest2424@outlook.com",
        to: userInfo.email,
        subject: "password reset",
        text: `Password reset code ${resetCode}`,
    })

    await user.updateOne(
        {email},
        {
            reset: {
                code: resetCode,
                time: moment (new Date()).add(15, "minute").format("YYYY-MM-DD HH:mm:ss"),
            }
        }
    )
    return new Response(true, "Please check your mailbox").success(res)
}

const resetCodeCheck = async (req, res) => {
    const { email, code } = req.body

    const userInfo = await user.findOne({email}).select("_id name lastname email reset")

    if (!userInfo)
        throw new APIError("Invalid code", 401)
    const dbTime = moment(userInfo.reset.time)
    const nowTime = moment(new Date()) // şuanki zaman
    const timeDiff = dbTime.diff(nowTime, "minutes")

    if (timeDiff <= 0 || userInfo.reset.code !== code) // eğer ki kod belirtilen sürede girilmemişse
        throw new APIError("Invalid code", 401)
    const temporaryToken = await createTemporaryToken(userInfo._id, userInfo.email)

    return new Response({temporaryToken}, "you can reset password").success(res)
}

const resetPassword = async (req, res) => {
    const { password, temporaryToken } = req.body;
  
    const decodedToken = await decodedTemporaryToken(temporaryToken);
    console.log("decodedToken : ", decodedToken);
  
    const hashPassword = await bcrypt.hash(password, 10);
  
    await user.findByIdAndUpdate(
      { _id: decodedToken._id },
      {
        reset: {
          code: null,
          time: null,
        },
        password: hashPassword,
      }
    );
  
    return new Response(decodedToken, "password reset successful").success(res)
  };


module.exports = {
    login,
    register,
    me,
    forgetPassword,
    resetCodeCheck,
    resetPassword,
}