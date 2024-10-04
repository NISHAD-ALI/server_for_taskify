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
exports.comparePassword = exports.hashPassword = void 0;
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const hashPassword = (password) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 10);
        return hashedPassword;
    }
    catch (error) {
        console.error('Error while hashing Password', error);
        throw error;
    }
});
exports.hashPassword = hashPassword;
const comparePassword = (password, hashed) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        console.log(password, hashed);
        const compared = yield bcryptjs_1.default.compare(password, hashed);
        return compared;
    }
    catch (error) {
        console.error('Error while comparing:', error);
        throw error;
    }
});
exports.comparePassword = comparePassword;
