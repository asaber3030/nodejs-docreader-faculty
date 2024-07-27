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
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const responses_1 = require("../../utlis/responses");
const helpers_1 = require("../../utlis/helpers");
const schema_1 = require("../../schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../utlis/db"));
const User_1 = __importDefault(require("../models/User"));
const Faculty_1 = __importDefault(require("../models/Faculty"));
class AuthController {
    login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            if (!user.status)
                return (0, responses_1.unauthorized)(res, "Please verify your e-mail before trying to login.");
            const token = jsonwebtoken_1.default.sign(mainUser, AuthController.secret);
            return res.status(200).json({
                message: "Logged in successfully.",
                status: 200,
                data: { token, user: mainUser }
            });
        });
    }
    register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
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
            const newUser = yield db_1.default.user.create({
                data: Object.assign(Object.assign({}, data), { status: true, password: hashedPassword })
            });
            const { password } = newUser, mainUser = __rest(newUser, ["password"]);
            const token = jsonwebtoken_1.default.sign(mainUser, AuthController.secret);
            return res.status(201).json({
                message: "User Registered successfully",
                status: 201,
                data: {
                    user: mainUser,
                    token
                }
            });
        });
    }
    verifyAccount(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const schema = zod_1.z.object({ code: zod_1.z.string(), email: zod_1.z.string().email({ message: "Invalid Email" }) });
            const parsedBody = schema.safeParse(body);
            const errors = (0, helpers_1.extractErrors)(parsedBody);
            const data = parsedBody.data;
            if (!parsedBody.success)
                return res.status(400).json({ message: "Validation errors", errors });
            const user = yield db_1.default.user.findUnique({
                where: { email: data === null || data === void 0 ? void 0 : data.email }
            });
            if (user === null || user === void 0 ? void 0 : user.status)
                return (0, responses_1.send)(res, "User has already verified his account before.", 409);
            if (!user)
                return (0, responses_1.notFound)(res, "User doesn't exist.");
            return res.status(200).json(Object.assign(Object.assign({}, body.data), { user }));
        });
    }
    isAuthenticated(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            try {
                const userData = jsonwebtoken_1.default.verify(token, AuthController.secret);
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
                const userData = jsonwebtoken_1.default.verify(token, AuthController.secret);
                const user = yield db_1.default.user.findUnique({ where: { id: userData === null || userData === void 0 ? void 0 : userData.id } });
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
                const tokenData = jsonwebtoken_1.default.verify(token, AuthController.secret);
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
}
AuthController.secret = process.env.APP_USER_SECRET;
exports.default = AuthController;
