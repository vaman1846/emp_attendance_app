const userModel = require("../Model/UserModel")
const jwt = require("jsonwebtoken")
const bcrypt = require("bcrypt");



const createUser = async function (req, res) {
    try {
        let data = req.body;
        let { name, phone, email, password } = data

        if (await userModel.findOne({ phone: phone }))
            return res.status(400).send({ message: "Phone already exist" })

        if (await userModel.findOne({ email: email }))
            return res.status(400).send({ message: "Email already exist" })

        const encryptedPassword = bcrypt.hashSync(password, 12)
        req.body['password'] = encryptedPassword;

        let savedData = await userModel.create(data)
        res.status(201).send({ status: true, data: savedData })
    }
    catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }
};

const userLogin = async function (req, res) {
    try {
        let data = req.body
        let { email, password } = data

        let user = await userModel.findOne({ email: email })
        if (!user) {
            return res.status(400).send({
                status: false,
                msg: "Email and Password is Invalid"
            })
        }

        let compared = await bcrypt.compare(password, user.password)
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Your password is invalid"
            })
        };
        // let getStatus = await profileModel.findOne();
        // if(getStatus == 0){
        //    result = "No"
        // }
        // else{
        //    result= "Yes"
        // };

        let token = jwt.sign({
            userId: user._id,
        }, "project",

        )
        return res.status(200).send({
            status: true,
            msg: "User login successfull",
            data: {
                userId: user._id,
                name: user.name,
                phone: user.phone,
                email: user.email,
                password: user.password,
                token: token
            }
        })
    }
    catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.message
        })
    }
};




 const updateUser =async function (request,response) {
    try {
        const email = request.body.email;

        let update = await userModel.findOneAndUpdate({email:email},{$set:{email:email}}, {new:true} )
        if(!update){
            response.status(404).json({message:'User not found'});
        }
        else{
            return response.status(200).send({
                message:"Data updated",
                data: update
            })
        }
        
     } catch (error) {
        response.status(500).send({message:"Internal Server Error"})
     }   
}


module.exports = { createUser, userLogin,updateUser}
    