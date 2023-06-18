const router = require("express").Router()

const auth = require("./auth.routers")

router.use(auth)

module.exports = router