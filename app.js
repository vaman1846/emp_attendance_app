const express = require("express")
const adminRoutes = require('./src/router/adminRouter');
const commnMid = require('./src/Middleware/empauth')
require('dotenv').config();

const app = express();

const mongoose = require("mongoose")
const bodyParser = require("body-parser");
const Router = require("./src/router/empRouter");
const multer = require("multer");

const empProfile = require('./src/Model/profile')

const PORT = process.env.PORT || 3000;

app.use(bodyParser.json())

mongoose.set('strictQuery', false);




//=====================[Multer Storage]=================================
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './upload/images')
    },
    filename: function (req, file, cb) {
        return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`)
    }
});
const upload = multer({
    storage: storage,
    limits: {
        fileSize: 5000000000
    }
});
//============================[ User Profile]==============================

app.use('/image', express.static('./upload/images'))
app.post("/:employeeid/empProfile", upload.single('image'), async (req, res) => {
    try {
        console.log("Hello");
        let data = req.body;
        let file = req.file;
        let userid = req.params.employeeid;

        let { dob, gender, email, contact, image, employeeid } = data

        data.image = `/image/${file.filename}`;
        data.employeeid = userid;

        let employeeCreated = await empProfile.create(data)
        return res.status(201).send({
            data: employeeCreated
        })
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});
//===============================[ Get Image]===============================

app.get("/:employeeid/getImage", commnMid.jwtValidation, commnMid.authorization, async (req, res) => {
    try {
        let body = req.query

        let getImg = await empProfile.find(body)
        return res.status(200).send({
            status: true,
            message: 'Success',
            data: getImg
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            message: error.message
        })
    }
});






mongoose.connect("mongodb://localhost:27017/empAttendance")
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err))

app.use('/user', Router)

app.use('/api', adminRoutes)

app.listen(PORT, function () {
    console.log(`Server is connected on Port ${PORT} ✅✅✅`)
});

