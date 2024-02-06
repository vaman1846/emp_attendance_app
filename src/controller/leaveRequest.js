const empModel = require('../Model/empModel');
const leaveModel = require('../Model/leaveRequest');

// ................................................Create Leave ................................

const createLeave = async function (req, res) {
    try {
        console.log("Hello");
        let employeeId = req.params.employeeid;
        let data = req.body;
        let { leaveType, startDate, endDate, reason, status } = data;


        const existingEmployee = await empModel.findById(employeeId);

        if (!existingEmployee) {
            return res.status(404).json({
                status: false,
                msg: 'Employee not found',
            });
        }

        const currentDate = new Date()
        const userStartDate = new Date(startDate)
        if (userStartDate < currentDate) {
            return res.status(400).send({
                status: false,
                msg: "Please Enter Valid Date"
            })
        }
        //Checking Leave Type is valid or not
        if (!leaveType || !startDate || !endDate || !reason) {
            return res.status(400).json({
                status: false,
                message: "Field can't be empty!"
            });
        } else if (leaveType != 'Sick Leave' && leaveType != 'CLF' && leaveType != 'EL') {
            var dt1 = new Date(startDate);
            var dt2 = new Date(endDate);
            if (dt1 > dt2) {
                return res.status(400).send({
                    status: false,
                    msg: "End date should be greater than Start date."
                })
            } else {
                var timeDiff = dt2.getTime() - dt1.getTime();
                var days = Math.ceil(timeDiff / (1000 * 360
                    * 24));
                if (days < 1) {
                    return res.status(400).send({
                        status: false,
                        msg: "The duration of the leave must be at least one day."
                    })
                }
                if (days > 90) {
                    return res.status(400).json({
                        status: false,
                        msg: "The duration of the leave is too long."
                    });
                }

            }

        }

        let newLeave = await leaveModel.create(data);
        res.status(201).json({
            message: 'Leave request created successfully',
            data: newLeave
        });


    } catch (error) {
        console.log(error);
        return res.status(500).send({
            status: false,
            msg: error.msg
        })
    }
}


// ........................................show leave by employee id ..................

const showLeaveByEmployeeId = async (req, res) => {
    try {
        const employeeId = req.params.employeeId;


        const leaveDetails = await leaveModel.find({ employeeId });

        if (!leaveDetails || leaveDetails.length === 0) {
            return res.status(404).json({
                status: false,
                msg: "No leave records found for the specified employeeId"
            });
        }

        res.status(200).json({
            status: true,
            data: leaveDetails
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};








const getLeave = async function (req, res) {
    try {
        const getleave =
            await leaveModel.find().populate('emplyeeId').sort('start-date');
        var from_date = req.query.from_date;
        var to_date = req.query.to_date;
        var userid = req.userData.userId;

        if (from_date && to_date) {
            var filterDate = {
                "createdAt": {
                    $gte: from_date, $lte
                        : to_date
                }
            }
            var filterUserId = { 'employeeId': userid };
            var finalFilter = { $and: [filterDate, filterUserId] };
        } else {
            var finalFilter = { 'employeeId': userid };
        }
        const leaves = await leaveModel.find(finalFilter).sort("-createdAt");
        // console.log(leaves);
        if (!leaves) {
            return res.status(404).json({ message: "No Leave requests found." });
        } else {
            return res.status(200).json(leaves);
        }


    } catch (error) {
        return res.status(500).send({
            status: false,
            msg: error.msg
        })

    }
}



// ..............................................Update Leave ...........................

const updateLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;


        const updatedLeaveData = req.body;


        const result = await leaveModel.findByIdAndUpdate(
            leaveId,
            updatedLeaveData,
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                status: false,
                msg: "Leave record not found"
            });
        }

        res.status(200).json({
            status: true,
            msg: "Leave record updated successfully",
            data: result
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};


// ........................................Deleted Leave Data ......................
const deleteLeave = async (req, res) => {
    try {
        const leaveId = req.params.id;


        const deletedLeaveData = req.body;


        const result = await leaveModel.findByIdAndDelete(
            leaveId,
            deletedLeaveData,
            { new: true }
        );

        if (!result) {
            return res.status(404).json({
                status: false,
                msg: "Leave record not found"
            });
        }

        res.status(200).json({
            status: true,
            msg: "Leave record Deleted Successfully",
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({
            status: false,
            msg: "Internal Server Error"
        });
    }
};








module.exports = { createLeave, getLeave, showLeaveByEmployeeId, updateLeave, deleteLeave };