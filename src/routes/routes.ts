import express from "express";
const router = express.Router()
import {  signup,login, newTask, getTasks, getEmployeesByManagerStatus, acceptEmployee, getEmployeesUnderManager, getTasksAssignedToEmployee } from "../controllers/controller";
import { verifyToken } from "../middlewares/auth";

router.post('/signup', (req, res) => signup(req, res));
router.post('/login', (req, res) => login(req, res));
router.post('/createTask',verifyToken, (req, res) => newTask(req, res));
router.get('/getTasks',verifyToken,(req,res)=>getTasks(req,res))
router.get('/getEmployeesByManagerStatus',verifyToken,(req,res)=>getEmployeesByManagerStatus(req,res))
router.post('/assignManger',verifyToken, (req, res) => acceptEmployee(req, res));
router.get('/getEmployeesUnderManager',verifyToken,(req,res)=>getEmployeesUnderManager(req,res))
router.get('/getTasksAssignedToEmployee',verifyToken,(req,res)=>getTasksAssignedToEmployee(req,res))

export default router