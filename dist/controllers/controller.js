"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTasksAssignedToEmployee = exports.getEmployeesUnderManager = exports.acceptEmployee = exports.getEmployeesByManagerStatus = exports.getTasks = exports.newTask = exports.login = exports.signup = void 0;
const employee_1 = __importDefault(require("../models/employee"));
const manager_1 = __importDefault(require("../models/manager"));
const hashPassword_1 = require("../utils/hashPassword");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const tasks_1 = __importDefault(require("../models/tasks"));
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { name, email, password, role } = req.body;
        console.log(name, email, password, role);
        const hashedPassword = yield (0, hashPassword_1.hashPassword)(password);
        const userData = { name, email, password: hashedPassword, role };
        if (role === 'Manager') {
            const exists = yield manager_1.default.findOne({ email: email });
            if (!exists) {
                let newUser = new manager_1.default(userData);
                yield newUser.save();
                res.status(200).json({ success: true });
            }
            else {
                res.status(409).json({ success: false, message: "Email already exists" });
            }
        }
        else {
            const exists = yield employee_1.default.findOne({ email: email });
            if (!exists) {
                let newUser = new employee_1.default(userData);
                yield newUser.save();
                res.status(200).json({ success: true });
            }
            else {
                res.status(409).json({ success: false, message: "Email already exists" });
            }
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.signup = signup;
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const JWT_SECRET = process.env.JWT_SECRET;
        const { email, password, role } = req.body;
        let data;
        if (role === 'Manager') {
            data = yield manager_1.default.findOne({ email });
        }
        else {
            data = yield employee_1.default.findOne({ email });
        }
        if (data) {
            const isPasswordCorrect = yield (0, hashPassword_1.comparePassword)(password, data.password);
            if (!isPasswordCorrect) {
                return res.status(401).json({
                    success: false,
                    message: 'Incorrect Password'
                });
            }
            // Create a token
            const token = jsonwebtoken_1.default.sign({ id: data._id, role: role }, JWT_SECRET, { expiresIn: '1h' });
            res.status(200).json({ success: true, data, token });
        }
        else {
            res.status(404).json({
                success: false,
                message: 'Email not found'
            });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: "Internal Server Error" });
    }
});
exports.login = login;
const newTask = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(req.body);
        const userId = req.userId;
        const { taskName, taskDate, taskTime, assignee } = req.body.data;
        console.log(taskName, taskDate, taskTime, assignee, userId);
        const exists = yield tasks_1.default.findOne({ title: taskName });
        const emp = yield employee_1.default.findOne({ name: assignee });
        if (!exists) {
            let newTask = {
                title: taskName,
                startDate: taskDate,
                taskTime: taskTime,
                taskCreated: userId,
                taskAssigneddTo: emp === null || emp === void 0 ? void 0 : emp._id,
            };
            console.log(newTask);
            let camp = new tasks_1.default(newTask);
            yield camp.save();
            res.status(200).json({ success: true });
        }
        else {
            res.status(409).json({ success: false, message: "tASK already exists" });
        }
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.newTask = newTask;
const getTasks = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const userId = req.userId;
        let data = yield tasks_1.default.find({ taskCreated: userId });
        console.log(data);
        if (data) {
            res.status(200).json({ success: true, data });
        }
        else {
            res.status(402).json({ success: false, message: 'Failed to get tasks' });
        }
    }
    catch (error) {
        res.status(500).json({ success: false, message: 'Internal server error!' });
    }
});
exports.getTasks = getTasks;
const getEmployeesByManagerStatus = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // Employees without a manager
        const employeesWithoutManager = yield employee_1.default.find({ manager: { $exists: false } });
        const userId = req.userId;
        // Employees with a manager
        const employeesWithManager = yield employee_1.default.find({ manager: userId }).populate('manager');
        res.status(200).json({
            success: true,
            data: {
                withManager: employeesWithManager,
                withoutManager: employeesWithoutManager
            }
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getEmployeesByManagerStatus = getEmployeesByManagerStatus;
const acceptEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { employee } = req.body;
        const managerId = req.userId;
        console.log(employee);
        const employeee = yield employee_1.default.findById(employee);
        console.log(employeee);
        if (!employeee) {
            return res.status(404).json({ success: false, message: 'Employee not found' });
        }
        employeee.manager = managerId;
        yield employeee.save();
        yield manager_1.default.findByIdAndUpdate(managerId, { $push: { employees: employee } });
        res.status(200).json({ success: true, message: 'Employee accepted and assigned to manager' });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.acceptEmployee = acceptEmployee;
const getEmployeesUnderManager = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const managerId = req.userId;
        const manager = yield manager_1.default.findById(managerId).populate({
            path: 'employees',
            select: 'name'
        });
        if (!manager) {
            return { success: false, message: 'Manager not found' };
        }
        const employeeNames = manager.employees.map((employee) => employee.name);
        res.status(200).json({ success: true, employeeNames });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Internal Server Error' });
    }
});
exports.getEmployeesUnderManager = getEmployeesUnderManager;
const getTasksAssignedToEmployee = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const employeeId = req.userId;
        console.log(employeeId);
        const tasks = yield tasks_1.default.find({ taskAssigneddTo: employeeId })
            .populate('taskCreated', 'name')
            .select('title startDate taskTime');
        if (!tasks || tasks.length === 0) {
            return res.status(404).json({ success: false, message: 'No tasks found for this employee' });
        }
        return res.status(200).json({ success: true, tasks });
    }
    catch (error) {
        console.error(error);
        return res.status(500).json({ success: false, message: 'Error fetching tasks for employee' });
    }
});
exports.getTasksAssignedToEmployee = getTasksAssignedToEmployee;
