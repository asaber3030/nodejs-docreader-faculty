"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultyRouter = exports.userRouter = exports.authRouter = void 0;
const auth_1 = __importDefault(require("./auth"));
exports.authRouter = auth_1.default;
const users_1 = __importDefault(require("./users"));
exports.userRouter = users_1.default;
const faculties_1 = __importDefault(require("./faculties"));
exports.facultyRouter = faculties_1.default;
