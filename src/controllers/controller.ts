import employeeModel from "../models/employee";
import managerModel from "../models/manager";
import task from "../types/task";
import { Request, Response } from 'express';
import { comparePassword, hashPassword } from "../utils/hashPassword";
import { uploadImageToCloud } from "../utils/cloudinary";
import employee from "../types/employee";
import manager from "../types/manager";
import { ObjectId } from "mongoose";
import jwt from 'jsonwebtoken';
import taskModel from "../models/tasks";

export const signup = async (req: Request, res: Response) => {
    try {
        const { name, email, password, role } = req.body;
        console.log(name, email, password, role)
        const hashedPassword = await hashPassword(password);
        const userData = { name, email, password: hashedPassword, role };
        if (role === 'Manager') {
            const exists = await managerModel.findOne({ email: email });
            if (!exists) {
                let newUser = new managerModel(userData);
                await newUser.save();
                res.status(200).json({ success: true });
            } else {
                res.status(409).json({ success: false, message: "Email already exists" });
            }
        } else {
            const exists = await employeeModel.findOne({ email: email });
            if (!exists) {
                let newUser = new employeeModel(userData);
                await newUser.save();
                res.status(200).json({ success: true });
            } else {
                res.status(409).json({ success: false, message: "Email already exists" });
            }
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}




export const login = async (req: any, res: any) => {
    try {
        const JWT_SECRET = process.env.JWT_SECRET as string
        const { email, password, role } = req.body;

        let data;
        if (role === 'Manager') {
            data = await managerModel.findOne({ email });
        } else {
            data = await employeeModel.findOne({ email });
        }

        if (data) {
            const isPasswordCorrect = await comparePassword(password, data.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect Password'
                });
            }

            // Create a token
            const token = jwt.sign({ id: data._id, role: role }, JWT_SECRET, { expiresIn: '1h' });

            res.status(200).json({ success: true, data, token });
        } else {
            res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
};

export const newTask = async (req: any, res: any) => {
    try {
        console.log(req.body)
        const userId = req.userId;
        const { taskName, taskDate, taskTime, assignee } = req.body.data;
        console.log(taskName, taskDate, taskTime, assignee,userId)
        const exists = await taskModel.findOne({ title: taskName });
        const emp = await employeeModel.findOne({ name: assignee });
        if (!exists) {
            let newTask: task = {
                title: taskName as string,
                startDate: taskDate as string,
                taskTime: taskTime as string,
                taskCreated: userId as string,
                taskAssigneddTo: emp?._id as unknown as string,

            }
            console.log(newTask)
            let camp = new taskModel(newTask);
            await camp.save();
            res.status(200).json({ success: true });
        } else {
            res.status(409).json({ success: false, message: "tASK already exists" });
        }

    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
}
export const getTasks = async (req: any, res: any) => {
    try {
        const userId = req.userId;
        let data = await taskModel.find({taskCreated:userId})
        console.log(data)
        if (data) {
            res.status(200).json({ success: true, data })
        } else {
            res.status(402).json({ success: false, message: 'Failed to get tasks' })
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
}
export const getEmployeesByManagerStatus = async (req: any, res: any) => {
    try {
        // Employees without a manager
        const employeesWithoutManager = await employeeModel.find({ manager: { $exists: false } });
        const userId = req.userId;
        // Employees with a manager
        const employeesWithManager = await employeeModel.find({ manager: userId }).populate('manager');

        res.status(200).json({
            success: true,
            data: {
                withManager: employeesWithManager,
                withoutManager: employeesWithoutManager
            }
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
export const acceptEmployee = async (req: any, res: any) => {
    try {
        const { employee } = req.body;
        const managerId = req.userId;  
        console.log(employee)
        const employeee = await employeeModel.findById(employee);
        console.log(employeee)
        if (!employeee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }

        employeee.manager = managerId;
        await employeee.save();
        await managerModel.findByIdAndUpdate(managerId, { $push: { employees: employee } });

        res.status(200).json({ success: true, message: 'Employee accepted and assigned to manager' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
export const getEmployeesUnderManager = async (req: any, res: Response):Promise<any> => {
    try {
        const managerId = req.userId;  
        const manager = await managerModel.findById(managerId).populate({
            path: 'employees',
            select: 'name'
        });

        if (!manager) {
            return { success: false, message: 'Manager not found' };
        }
        const employeeNames = manager.employees.map((employee: any) => employee.name);

        res.status(200).json({ success: true,employeeNames});
    } catch (error) {
        console.error(error);
     res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
};
export const getTasksAssignedToEmployee = async (req: any, res: any):Promise<any> => {
    try {
        const employeeId = req.userId; 
       console.log(employeeId)
        const tasks = await taskModel.find({ taskAssigneddTo: employeeId })
            .populate('taskCreated', 'name')
            .select('title startDate taskTime'); 

        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: 'No tasks found for this employee' });
        }

        return res.status(200).json({ success: true, tasks });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching tasks for employee' });
    }
};