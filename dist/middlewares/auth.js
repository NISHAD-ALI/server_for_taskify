"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyToken = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const JWT_SECRET = process.env.JWT_SECRET;
const verifyToken = (req, res, next) => {
    var _a;
    const token = (_a = req.headers['authorization']) === null || _a === void 0 ? void 0 : _a.split(' ')[1];
    if (!token) {
        return res.status(401).json({ success: false, message: 'No token provided' });
    }
    jsonwebtoken_1.default.verify(token, JWT_SECRET, (err, decoded) => {
        if (err) {
            console.log(err.message);
            return res.status(403).json({ success: false, message: 'Failed to authenticate token. Please Login Again' });
        }
        const decodedToken = decoded;
        req.userId = decodedToken.id;
        req.role = decodedToken.role;
        next();
    });
};
exports.verifyToken = verifyToken;
