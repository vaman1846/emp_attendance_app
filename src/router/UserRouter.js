const express = require("express")
const { createUser, userLogin, updateUser } = require("../controller/UserController")


const Router = express.Router()


Router.post("/user", createUser)

Router.post("/userlogin",userLogin)

Router.put('/:userId/update',updateUser)

Router.all("/**", function (req, res) {
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
})

module.exports = Router

