const express = require('express')
const { createEmp, empLogin, updateEmployee } = require('../controller/empController');
const {createLeave, getLeave, updateLeave, showLeaveByEmployeeId, deleteLeave} = require('../controller/leaveRequest');
const { createAttendance, updateLogoutTime, logoutAttendance, getAttendance, getdata } = require('../controller/attendanceController');
const { createTask } = require('../controller/taskController');

// Middleware for admin authorization
const authorizeAdmin = (req, res, next) => {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Forbidden - Admin access required' });
    }
    next();
  };


const commnMid = require('../Middleware/empauth');
const { authenticateUser } = require('../controller/adminController');

const Router = express.Router()

Router.post('/register',authenticateUser, createEmp);

Router.post('/login',empLogin)

Router.put('/:employeeid/update', commnMid.jwtValidation,commnMid.authorization, updateEmployee)



//................Leave Router .................

Router.post('/:employeeid/leave',commnMid.jwtValidation,commnMid.authorization, createLeave);

Router.get('/:employeeid/leave',authenticateUser,commnMid.jwtValidation,commnMid.authorization, showLeaveByEmployeeId)

Router.get('/:employeeid/leave',commnMid.jwtValidation,commnMid.authorization, getLeave);

Router.put('/:employeeid/update/leave/:id',commnMid.jwtValidation,commnMid.authorization,updateLeave)

Router.delete('/:employeeid/delete/leave/:id',commnMid.jwtValidation,commnMid.authorization,deleteLeave)



// ............................Attendance Router ..............

Router.post('/attendance/login/:employeeId',createAttendance);

Router.put('/attendance/logout/:employeeId',logoutAttendance);

Router.get('/attendance/get/:employeeId', getAttendance)

Router.post('/attendance/get/:employeeId', getdata)



//.............................Task Created ..........................

Router.post('/created', createTask)

Router.all("/**", function (req, res) {
    
    res.status(404).send({
        status: false,
        message: "Make Sure Your Endpoint is Correct or Not!"
    })
})

module.exports = Router ; 