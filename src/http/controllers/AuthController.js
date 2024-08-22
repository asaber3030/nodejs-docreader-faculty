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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
const responses_1 = require("../../utlis/responses");
const helpers_1 = require("../../utlis/helpers");
const schema_1 = require("../../schema");
const client_1 = require("@prisma/client");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../utlis/db"));
const User_1 = __importDefault(require("../models/User"));
const Faculty_1 = __importDefault(require("../models/Faculty"));
const dotenv_1 = __importDefault(require("dotenv"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = schema_1.userSchema.login.safeParse(req.body);
                const data = body.data;
                if (!body.success) {
                    const errors = (0, helpers_1.extractErrors)(body);
                    return res.status(400).json({
                        errors,
                        message: "Form validation errors."
                    });
                }
                if (!data)
                    return (0, responses_1.send)(res, "No data was submitted.", 409);
                const user = yield User_1.default.findBy(data.email);
                if (!user)
                    return (0, responses_1.notFound)(res, "No User was found");
                const comparePasswords = yield bcrypt_1.default.compare(data.password, user.password);
                if (!comparePasswords) {
                    return res.status(400).json({
                        message: "Invalid email or password."
                    });
                }
                const { password } = user, mainUser = __rest(user, ["password"]);
                const token = jsonwebtoken_1.default.sign(mainUser, _a.secret);
                return res.status(200).json({
                    message: "Logged in successfully.",
                    status: 200,
                    data: { token, user: mainUser }
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    message: "Error - Something went wrong.",
                    status: 500,
                    errorObject
                });
            }
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = schema_1.userSchema.register.safeParse(req.body);
                const data = body.data;
                if (!body.success) {
                    const errors = (0, helpers_1.extractErrors)(body);
                    return res.status(400).json({
                        errors,
                        message: "Form validation errors.",
                        status: 400
                    });
                }
                if (!data) {
                    return res.status(400).json({
                        message: "Please check there's valid JSON data in the request body.",
                        status: 400
                    });
                }
                const userByEmail = yield User_1.default.findBy(data.email);
                if (userByEmail) {
                    return res.status(409).json({
                        message: "E-mail Already exists.",
                        status: 409
                    });
                }
                const findFaculty = yield Faculty_1.default.find(data.facultyId);
                if (!findFaculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist with provided Id: " + data.facultyId);
                const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                const { confirmationPassword } = data, restData = __rest(data, ["confirmationPassword"]);
                const newUser = yield db_1.default.user.create({
                    data: Object.assign(Object.assign({}, restData), { status: true, password: hashedPassword, createdAt: (0, helpers_1.currentDate)() })
                });
                const { password } = newUser, mainUser = __rest(newUser, ["password"]);
                const token = jsonwebtoken_1.default.sign(mainUser, _a.secret);
                return res.status(201).json({
                    message: "User Registered successfully",
                    status: 201,
                    data: {
                        user: mainUser,
                        token
                    }
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    message: "Server Crashed",
                    status: 500,
                    errorObject
                });
            }
        });
    }
    isAuthenticated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            try {
                const userData = jsonwebtoken_1.default.verify(token, _a.secret);
                if (!userData)
                    return (0, responses_1.badRequest)(res, "Invalid token.");
                const findUser = yield User_1.default.find(userData.id);
                if (!findUser)
                    return res.status(200).json({
                        message: "Authorized",
                        status: 402,
                        data: {
                            authorized: false
                        }
                    });
            }
            catch (error) {
                return res.status(401).json({
                    message: "Unauthorized",
                    status: 401,
                    data: {
                        authorized: false
                    }
                });
            }
            return res.status(200).json({
                message: "Authorized",
                status: 200,
                data: {
                    authorized: true
                }
            });
        });
    }
    static user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            try {
                const userData = jsonwebtoken_1.default.verify(token, _a.secret);
                const user = yield db_1.default.user.findUnique({ where: { id: userData === null || userData === void 0 ? void 0 : userData.id }, select: User_1.default.dbSelectors });
                return user;
            }
            catch (error) {
                return null;
            }
        });
    }
    getUserData(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            try {
                const tokenData = jsonwebtoken_1.default.verify(token, _a.secret);
                const user = yield db_1.default.user.findUnique({ where: { id: tokenData === null || tokenData === void 0 ? void 0 : tokenData.id }, include: { faculty: true, year: true } });
                if (!user)
                    return (0, responses_1.unauthorized)(res, "User doesn't exist. Unauthorized");
                const { password } = user, mainUser = __rest(user, ["password"]);
                return (0, responses_1.send)(res, "User data", 200, mainUser);
            }
            catch (error) {
                return (0, responses_1.unauthorized)(res, "User doesn't exist. Unauthorized");
            }
        });
    }
    createAdmin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = schema_1.userSchema.createAdmin.safeParse(req.body);
                const data = body.data;
                if (!body.success) {
                    const errors = (0, helpers_1.extractErrors)(body);
                    return res.status(400).json({
                        errors,
                        message: "Form validation errors.",
                        status: 400
                    });
                }
                if (!data) {
                    return res.status(400).json({
                        message: "Please check there's valid JSON data in the request body.",
                        status: 400
                    });
                }
                const userByEmail = yield User_1.default.findBy(data.email);
                if (userByEmail) {
                    return res.status(409).json({
                        message: "E-mail Already exists.",
                        status: 409
                    });
                }
                const findFaculty = yield Faculty_1.default.find(data.facultyId);
                if (!findFaculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist with provided Id: " + data.facultyId);
                const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
                const { confirmationPassword } = data, restData = __rest(data, ["confirmationPassword"]);
                if (data.passcode !== process.env.PASSCODE) {
                    return (0, responses_1.unauthorized)(res, "Invalid Passcode.");
                }
                const newUser = yield db_1.default.user.create({
                    data: {
                        name: restData.name,
                        email: restData.email,
                        yearId: restData.yearId,
                        facultyId: restData.facultyId,
                        password: hashedPassword,
                        status: true,
                        role: client_1.UserRole.Admin,
                        createdAt: (0, helpers_1.currentDate)(),
                    }
                });
                const { password } = newUser, mainUser = __rest(newUser, ["password"]);
                const token = jsonwebtoken_1.default.sign(mainUser, _a.secret);
                return res.status(201).json({
                    message: "Admin Registered successfully",
                    status: 201,
                    data: {
                        user: mainUser,
                        token
                    }
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    message: "Error",
                    status: 500,
                    errorObject
                });
            }
        });
    }
}
_a = AuthController;
(() => {
    dotenv_1.default.config();
    _a.secret = process.env.APP_USER_SECRET;
})();
exports.default = AuthController;
