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
const helpers_1 = require("../../utlis/helpers");
const schema_1 = require("../../schema");
const responses_1 = require("../../utlis/responses");
const db_1 = __importDefault(require("../../utlis/db"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const Admin_1 = __importDefault(require("../models/Admin"));
class AdminController {
    static login(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.adminSchema.login.safeParse(req.body);
            const data = body.data;
            if (!body.success) {
                const errors = (0, helpers_1.extractErrors)(body);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors."
                });
            }
            if (!data) {
                return res.status(400).json({
                    message: "Something went wrong while submitting data.",
                    status: 400
                });
            }
            const user = yield Admin_1.default.findBy(data.email);
            if (!user) {
                return res.status(404).json({
                    message: "No user was found.",
                    status: 404
                });
            }
            const comparePasswords = yield bcrypt_1.default.compare(data.password, user.password);
            if (!comparePasswords) {
                return res.status(400).json({
                    message: "Invalid email or password."
                });
            }
            const { password } = user, mainUser = __rest(user, ["password"]);
            const secert = process.env.APP_SECRET;
            const token = jsonwebtoken_1.default.sign(mainUser, secert);
            return res.status(200).json({
                message: "Logged in successfully.",
                status: 200,
                data: { token }
            });
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.adminSchema.create.safeParse(req.body);
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
            const userByEmail = yield Admin_1.default.findBy(data.email);
            const userByPhone = yield db_1.default.admin.findFirst({ where: { phone: data.phone } });
            if (userByEmail) {
                return res.status(409).json({
                    message: "E-mail Already exists.",
                    status: 409
                });
            }
            if (userByPhone) {
                return res.status(409).json({
                    message: "Phone Number Already exists.",
                    status: 409
                });
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const newUser = yield db_1.default.admin.create({
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: hashedPassword
                }
            });
            const { password } = newUser, mainUser = __rest(newUser, ["password"]);
            const secert = process.env.APP_SECRET;
            const token = jsonwebtoken_1.default.sign(mainUser, secert);
            return res.status(201).json({
                message: "Admin Registered successfully.",
                status: 201,
                data: {
                    user: mainUser,
                    token
                }
            });
        });
    }
    static authorize(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            const adminToken = jsonwebtoken_1.default.verify(token, AdminController.secret);
            const admin = yield db_1.default.admin.findUnique({
                where: { id: adminToken.id },
                select: Admin_1.default.selectors
            });
            if (!admin) {
                return res.status(401).json({
                    message: "Unauthorized admin.",
                    authorized: false
                });
            }
            return res.status(200).json({
                message: "Authorized.",
                authorized: true,
                data: admin
            });
        });
    }
    static isAdmin(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            if (!token)
                return false;
            try {
                const adminToken = jsonwebtoken_1.default.verify(token, AdminController.secret);
                const admin = yield db_1.default.admin.findUnique({
                    where: { id: adminToken.id },
                    select: Admin_1.default.selectors
                });
                if (!admin) {
                    return false;
                }
                return true;
            }
            catch (error) {
                return false;
            }
        });
    }
    static admin(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            if (!token) {
                return (0, responses_1.unauthorized)(res);
            }
            const tokenAdmin = jsonwebtoken_1.default.verify(token, AdminController.secret);
            try {
                const admin = yield db_1.default.admin.findUnique({
                    where: { id: tokenAdmin.id },
                    select: Admin_1.default.selectors
                });
                if (admin) {
                    return res.status(200).json({ status: 200, data: admin });
                }
                return res.status(400).json({
                    status: 404,
                    message: "Invalid Admin, Or Expired Token. This admin might be removed from database."
                });
            }
            catch (_a) {
                return res.status(400).json({
                    status: 404,
                    message: "Invalid Admin, Or Expired Token. This admin might be removed from database."
                });
            }
        });
    }
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            const searchParam = req.query.search ? req.query.search : '';
            const admins = yield Admin_1.default.all(searchParam, skip, limit, orderBy, orderType);
            return res.status(200).json({
                data: admins,
                status: 200,
                message: "Admins Data"
            });
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.adminSchema.update.safeParse(req.body);
            const data = body.data;
            const adminId = req.params.adminId ? +req.params.adminId : null;
            if (!adminId)
                return res.status(500).json({ message: "Invalid Admin ID", status: 500 });
            const adminData = yield db_1.default.admin.findUnique({
                where: { id: adminId }
            });
            if (!adminData)
                return res.status(404).json({ message: "Admin doesn't exist", status: 404 });
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
            const userByEmail = yield db_1.default.admin.findUnique({
                where: {
                    email: data.email,
                    AND: [
                        { id: { not: adminId } }
                    ]
                }
            });
            const userByPhone = yield db_1.default.admin.findFirst({
                where: {
                    phone: data.phone,
                    AND: [
                        { id: { not: adminId } }
                    ]
                }
            });
            if (userByEmail) {
                return res.status(409).json({
                    message: "E-mail Already exists.",
                    status: 409
                });
            }
            if (userByPhone) {
                return res.status(409).json({
                    message: "Phone Number Already exists.",
                    status: 409
                });
            }
            let pass = adminData.password;
            if (data.password) {
                pass = yield bcrypt_1.default.hash(data.password, 10);
            }
            const updatedUser = yield db_1.default.admin.update({
                where: {
                    id: adminId
                },
                data: {
                    name: data.name,
                    email: data.email,
                    phone: data.phone,
                    password: pass
                }
            });
            const { password } = updatedUser, mainUser = __rest(updatedUser, ["password"]);
            return res.status(201).json({
                message: "Admin has been updated successfully.",
                status: 201,
                data: mainUser
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const adminId = req.params.adminId ? +req.params.adminId : null;
            if (!adminId)
                return res.status(500).json({ message: "Invalid Admin ID", status: 500 });
            const adminData = yield db_1.default.admin.findUnique({
                where: { id: adminId }
            });
            if (!adminData)
                return res.status(404).json({ message: "Admin doesn't exist", status: 404 });
            const deletedUser = yield db_1.default.admin.delete({
                where: {
                    id: adminId
                }
            });
            const { password } = deletedUser, mainUser = __rest(deletedUser, ["password"]);
            return res.status(201).json({
                message: "Admin has been deleted successfully.",
                status: 201,
                data: mainUser
            });
        });
    }
}
AdminController.secret = process.env.APP_SECRET;
exports.default = AdminController;
