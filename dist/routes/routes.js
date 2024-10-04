"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const controller_1 = require("../controllers/controller");
const auth_1 = require("../middlewares/auth");
router.post('/signup', (req, res) => (0, controller_1.signup)(req, res));
router.post('/login', (req, res) => (0, controller_1.login)(req, res));
router.post('/createTask', auth_1.verifyToken, (req, res) => (0, controller_1.newTask)(req, res));
router.get('/getTasks', auth_1.verifyToken, (req, res) => (0, controller_1.getTasks)(req, res));
router.get('/getEmployeesByManagerStatus', auth_1.verifyToken, (req, res) => (0, controller_1.getEmployeesByManagerStatus)(req, res));
router.post('/assignManger', auth_1.verifyToken, (req, res) => (0, controller_1.acceptEmployee)(req, res));
router.get('/getEmployeesUnderManager', auth_1.verifyToken, (req, res) => (0, controller_1.getEmployeesUnderManager)(req, res));
router.get('/getTasksAssignedToEmployee', auth_1.verifyToken, (req, res) => (0, controller_1.getTasksAssignedToEmployee)(req, res));
exports.default = router;
