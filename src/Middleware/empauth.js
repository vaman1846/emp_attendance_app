const jwt = require("jsonwebtoken");
const empModel = require("../Model/empModel");

//**************** Authentication *****************************

const jwtValidation = async function (req, res, next) {
    try {
        console.log("jwt validation");
        let token = req.headers["authorization"];

        if (!token || !token.startsWith('Bearer ')) {
            return res.status(401).send({
                status: false,
                message: "Authentication Failed: Invalid token format"
            });
        }

        token = token.slice(7); // Remove 'Bearer ' prefix



        jwt.verify(token, "456789", (err, decoded) => {
            if (err) {
                console.error("JWT Verification Error:", err);
                return res.status(401).send({
                    status: false,
                    message: "Authentication Failed"
                });
            } else {
                console.log("Decoded Token:", decoded);
                req.token = decoded;
                next();
            }
        });
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

//**************** Authorization ************************************

const authorization = async function (req, res, next) {
    try {


        console.log('authorization');
        let userLoggedIn = req.token.employeeId;
        let userId = req.params.employeeid;
        console.log('userLoggedIn:', userLoggedIn);
        console.log('userId:', userId);

        if (userLoggedIn != userId) {
            return res.status(403).send({
                status: false,
                message: "Authorization failed"
            });
        }
        next();
    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: false,
            message: error.message
        });
    }
};

module.exports = { jwtValidation, authorization };
