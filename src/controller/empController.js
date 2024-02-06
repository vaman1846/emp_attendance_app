const empModel = require("../Model/empModel");
const bcrypt = require("bcrypt");
require('dotenv').config();

const jwt = require("jsonwebtoken");



const JWT_SECRET = process.env.JWT_SECRET;

if (!JWT_SECRET) {
    console.error('JWT_SECRET is not set in the environment.');
    process.exit(1);
}

const createEmp = async function (req, res) {
    try {
        console.log("Hello World");
        let data = req.body;
        let { employeeId, name, email, phone, role, position, department, password } =
            data;

        const empPhone = await empModel.findOne({ phone: phone });
        if (empPhone) {
            return res.status(400).send({ msg: "User Phone Already Registered" });
        }

        const empEmail = await empModel.findOne({ email: email });
        if (empEmail) {
            return res.status(400).send({ msg: "User Email Already Registered" });
        }

        const saltRounds = 10;
        const salt = bcrypt.genSaltSync(saltRounds);
        let encryptedPassword = bcrypt.hashSync(password, salt);
        req.body["password"] = encryptedPassword;

        const emp = empModel.create(data);
        if (!emp)
            return res.status(400).send({
                status: false,
                message: "Failed to add employee",
            });

        return res.status(201).json({
            status: true,
            data: data,
            message: "Employee added Successfully",
        });
    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.msg, status: false });
    }
};

const empLogin = async function (req, res) {
    try {
        console.log("Hello");
        let data = req.body;
        let { employeeId, email, phone, password } = data;

        let employee = await empModel.findOne({ employeeId: employeeId });
        if (!employee) {
            return res
                .status(400)
                .send({ msg: "Your EmployeeId Does Not Match", status: false });
        }


        let compared = await bcrypt.compare(password, employee.password);
        if (!compared) {
            return res.status(400).send({
                status: false,
                message: "Your Password Does Not Match",
            });
        }

        // const token ="Bearer " +

        const generateToken = (employee) => {
            const token = jwt.sign(
                {
                    employeeId: employee._id,
                },
                JWT_SECRET,
                { expiresIn: '1h' }
            );
            return token;
        }

        //     let empModel = await empModel
        //     .findOne({ userId: employee._id })
        //     .select({ _id: 0, createdAt: 0, updatedAt: 0, __v: 0 });
        //   let type = empModel ? "Yes" : "No";
        // //   user.user_details_submit = type;







        const token = generateToken(employee);
        res.status(200).send({
            status: true,
            token: token,
            data: {
                employee_id: employee._id,
                employeeId: employee.employeeId,
                name: employee.name,
                role: employee.role,
                phone: employee.phone,
                password: employee.password,
                employee: employee
            },
        });


    } catch (error) {
        console.log(error);
        res.status(500).send({ msg: error.msg, status: false });
    }
};



// ..........................................................
const updateEmployee = async function (req, res) {
    try {
        console.log("Hedescszdc");
        let employee_id = req.params.employeeid;
        let data = req.body;


        const existingEmployee = await empModel.findById(employee_id);

        if (!existingEmployee) {
            return res.status(404).json({
                status: false,
                msg: 'Employee not found',
            });
        }

        // Check if the new email is already registered by another user
        if (data.email && data.email !== existingEmployee.email) {
            const empEmail = await empModel.findOne({ email: data.email });
            if (empEmail) {
                return res.status(400).send({ msg: "User Email Already Registered" });
            }
        }

        // Check if the new phone is already registered by another user
        if (data.phone && data.phone !== existingEmployee.phone) {
            const empPhone = await empModel.findOne({ phone: data.phone });
            if (empPhone) {
                return res.status(400).send({ msg: "User Phone Already Registered" });
            }
        }

        // Update employee details
        Object.assign(existingEmployee, data);
        await existingEmployee.save();

        return res.status(200).json({
            status: true,
            data: existingEmployee,
            message: "Employee details updated successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).send({ msg: "Internal Server Error", status: false });
    }
};




module.exports = { createEmp, empLogin, updateEmployee };
