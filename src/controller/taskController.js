const taskModel = require('../Model/taskModel')
const validator = require('validator')



const createTask = async function (req, res) {
    try {
        let data = req.body;
        let { employeeId, taskName, description, dueDate, isCompleted } = data;

        // if (!validator.isMongoId(employeeId)) {
        //     return res.status(400).json({
        //         status: false,
        //         msg: 'Invalid Employee ID'
        //     });
        // }

        // Create the task
        const task = await taskModel.create({
            employeeId,
            taskName,
            description,
            dueDate,
            isCompleted,
        });

        if (!task) {
            return res.status(400).send({
                status: false,
                message: "Failed to create task",
            });
        }

        return res.status(201).json({
            status: true,
            data: task,
            message: "Task created successfully",
        });

    } catch (error) {
        console.error(error);
        res.status(500).send({
            status: false,
            msg: "Internal Server Error",
        });
    }
};

module.exports = {
    createTask,
};
