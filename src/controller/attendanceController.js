// attendanceController.js
const Attendance = require('../Model/attendanceModel');

const moment = require('moment');

const createAttendance = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;

        const currentLoginTime = new Date();

        let { logoutTime } = req.body;

        if (!employeeId) {
            return res.status(400).json({
                status: false,
                msg: "Employee ID is a required field."
            });
        }

        const attendanceRecord = await Attendance.create({
            employeeId,
            loginTime: currentLoginTime,
            logoutTime,
        });

        // Format the loginTime using moment
        const formattedLoginTime = moment(attendanceRecord.loginTime).format('YYYY-MM-DD HH:mm:ss');

        return res.status(201).json({
            status: true,
            msg: "Attendance record created successfully",
            data: {
                employeeId: attendanceRecord.employeeId,
                loginTime: formattedLoginTime,
                _id: attendanceRecord._id,
                __v: attendanceRecord.__v
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
}



const logoutAttendance = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;


        const currentLogoutTime = new Date();


        if (!employeeId) {
            return res.status(400).json({
                status: false,
                msg: "Employee ID is a required field."
            });
        }


        const attendanceRecord = await Attendance.findOne({
            employeeId,
            logoutTime: { $exists: false }
        });

        if (!attendanceRecord) {
            return res.status(404).json({
                status: false,
                msg: "No active attendance record found for the employee."
            });
        }


        attendanceRecord.logoutTime = currentLogoutTime;
        await attendanceRecord.save();

        const formattedLogoutTime = moment(attendanceRecord.logoutTime).format('YYYY-MM-DD HH:mm:ss');

        return res.status(200).json({
            status: true,
            msg: "Logout successful",
            data: {
                employeeId: attendanceRecord.employeeId,
                logoutTime: formattedLogoutTime,
                _id: attendanceRecord._id,
                __v: attendanceRecord.__v
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};


const getAttendance = async function (req, res) {
    try {
        const employeeId = req.params.employeeId;

        let attendanceRecord = await Attendance.findOne({ employeeId });

        if (!attendanceRecord) {
            attendanceRecord = new Attendance({ employeeId })
        }

        const formattedLogoutTime = moment(attendanceRecord.logoutTime).format('YYYY-MM-DD HH:mm:ss');

        return res.status(200).json({
            status: true,
            msg: "Successfully fetched the attendance record.",
            data: {
                ...attendanceRecord._doc
            }
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            msg: error.msg
        })

    }
}


const getdata = async (req, res) => {

    const employeeId = req.params.employeeId;



    const startOfMonth = moment().startOf('month');
    const endOfMonth = moment().endOf('month');

    try {
        let attendanceRecords = await Attendance.find({
            employeeId,
            loginTime: { $gte: startOfMonth, $lte: endOfMonth },
        });


        if (!attendanceRecords || attendanceRecords.length === 0) {
            return res.status(200).json({
                status: true,
                msg: "No attendance records found for the employee in the current month.",
                data: [],
            });
        }


        const formattedAttendanceRecords = attendanceRecords.map((record) => ({
            ...record._doc,
            loginTime: moment(record.loginTime).format('YYYY-MM-DD HH:mm:ss'),
            logoutTime: moment(record.logoutTime).format('YYYY-MM-DD HH:mm:ss'),
        }));


        return res.status(200).json({
            status: true,
            msg: "Successfully fetched the attendance records for the employee in the current month.",
            data: formattedAttendanceRecords,
        });

    } catch (error) {
        console.error(error);
        return res.status(500).json({
            status: false,
            msg: "Internal Server Error",
        });
    }
}




module.exports = {
    createAttendance, logoutAttendance, getAttendance, getdata
};
