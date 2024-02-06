const adminModel = require("../Model/adminModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//.....................................................admin registered ..............................
const adminRegistered = async function (req, res) {
    try {
        console.log("Hellooooo");
        let data = req.body;
        let { name, email, phone, role, post, department, password } = data;

        const adminEmail = await adminModel.findOne({ email: email });
        if (adminEmail) {
            return res
                .status(400)
                .send({ status: false, msg: "Admin Email Already Registered " });
        }

        const adminPhone = await adminModel.findOne({ phone: phone });
        if (adminPhone) {
            return res
                .status(400)
                .send({ status: false, msg: "Admin Phone Already Registered " });
        }

        const saltrounds = 10;
        const salt = bcrypt.genSaltSync(saltrounds);
        const encryptedPassword = bcrypt.hashSync(password, salt);
        req.body["password"] = encryptedPassword;
        const adminCreate = adminModel.create(data);
        if (!adminCreate)
            return res.status(400).send({
                status: false,
                message: "Failed to add employee",
            });

        const payload = {
            userId: "12345",
            username: "exampleUser",
        };

        const expiresIn = "100d";

        const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn });

        return res.status(201).send({
            msg: "Admin Registered Successfully",
            status: true,
            data: data,
            token: token,
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, msg: error.msg });
    }
};

// .................................................admin login ....................................
const adminLogin = async function (req, res) {
    try {
        let adminData = req.body;
        let { email, password } = adminData;
        const adminDetails = await adminModel.findOne({ email });
        if (!adminDetails)
            return res
                .status(400)
                .json({ status: false, message: "Invalid Credentials" });

        let validPass = bcrypt.compareSync(password, adminDetails.password);
        if (!validPass) {
            return res
                .status(400)
                .json({ status: false, message: "Invalid Password" })
                .end();
        }
        const token = jwt.sign({ id: adminDetails._id }, process.env.JWT_SECRET, {
            expiresIn: "365d",
        });

        return res.status(201).header("auth-token", token).send({
            status: true,
            msg: "Admin Login Successfully",
            adminData: adminData,

            token: token,
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({ msg: "Internal Server Error" });
    }
};

//..................................................admin Update Our detail ............................

const adminUpdate = async function (req, res) {
    try {
        const adminId = req.params.id;
        const updateData = req.body;

        // Check if the admin exists
        const existingAdmin = await adminModel.findById(adminId);
        if (!existingAdmin) {
            return res.status(404).json({ status: false, msg: "Admin not found" });
        }
        if (updateData.password) {
            const saltrounds = 10;
            const salt = bcrypt.genSaltSync(saltrounds);
            const encryptedPassword = bcrypt.hashSync(updateData.password, salt);
            updateData.password = encryptedPassword;
        }

        // Update admin data
        const updatedAdmin = await adminModel.findByIdAndUpdate(
            adminId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            msg: "Admin details updated successfully",
            status: true,
            data: updatedAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, msg: error.message });
    }
};

//..........................................................admin Delete our Detail ............................

const adminDelete = async function (req, res) {
    try {
        const adminId = req.params.id;
        const updateData = req.body;

        const existingAdmin = await adminModel.findById(adminId);
        if (!existingAdmin) {
            return res.status(404).json({ status: false, msg: "Admin not found" });
        }
        if (updateData.password) {
            const saltrounds = 10;
            const salt = bcrypt.genSaltSync(saltrounds);
            const encryptedPassword = bcrypt.hashSync(updateData.password, salt);
            updateData.password = encryptedPassword;
        }

        // Update admin data
        const updatedAdmin = await adminModel.findByIdAndDelete(
            adminId,
            updateData,
            { new: true }
        );

        return res.status(200).json({
            msg: "Admin details updated successfully",
            status: true,
            data: updatedAdmin,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ status: false, msg: error.message });
    }
};

// .................admin logout.......................

console.log("Secret Key:", process.env.JWT_SECRET);

const tokenBlacklist = [];

const authenticateAdmin = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .send({ status: false, msg: "Unauthorized - Missing token" });
    }

    if (!token.startsWith("Bearer ")) {
        return res
            .status(401)
            .send({ status: false, msg: "Unauthorized - Invalid token format" });
    }

    const tokenWithoutBearer = token.slice(7);

    try {
        console.log("helo");
        const decoded = jwt.verify(tokenWithoutBearer, process.env.JWT_SECRET);
        console.log("Decoded Token:", decoded);
        req.admin = decoded;
        next();
    } catch (error) {
        return res
            .status(401)
            .send({ status: false, msg: "Unauthorized - Invalid token" });
    }
};

// Logout API
const authenticate = async function (req, res) {
    try {
        tokenBlacklist.push(req.header("Authorization"));

        return res
            .status(200)
            .send({ msg: "Admin logout successful", status: true });
    } catch (error) {
        console.log(error);
        res.status(500).send({ status: false, msg: error.message });
    }
};

// ........................addmin Middleware

const authenticateUser = (req, res, next) => {
    const token = req.header("Authorization");

    if (!token) {
        return res
            .status(401)
            .json({ message: "Unauthorized - No token provided" });
    }

    try {
        const decoded = jwt.verify(token, "JWT_SECRET");

        req.user = decoded.user;

        next();
    } catch (error) {
        return res.status(401).json({ message: "Unauthorized - Invalid token" });
    }
};

module.exports = {
    adminRegistered,
    adminLogin,
    adminUpdate,
    adminDelete,
    authenticate,
    authenticateAdmin,
    authenticateUser,
};
