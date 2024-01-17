const express = require("express")
const app = express();

const mongoose = require("mongoose")
const bodyParser = require("body-parser")


const port = process.env.PORT || 3000

app.use(bodyParser.json())

mongoose.set('strictQuery', false);

mongoose.connect("mongodb://localhost:27017/empAttendance")
    .then(() => console.log("Database is connected successfully.."))
    .catch((Err) => console.log(Err))



app.listen(port, function () {
    console.log(`Server is connected on Port ${port} ✅✅✅`)
});

