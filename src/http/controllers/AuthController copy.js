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
const bcrypt_1 = __importDefault(require("bcrypt"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const db_1 = __importDefault(require("../../utlis/db"));
const User_1 = __importDefault(require("../models/User"));
class AuthController {
    static login(req, res) {
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
            if (!data) {
                return res.status(400).json({
                    message: "Something went wrong while submitting data."
                });
            }
            const user = yield User_1.default.findBy(data.email);
            if (!user) {
                return res.status(404).json({
                    message: "No user was found."
                });
            }
            const comparePasswords = yield bcrypt_1.default.compare(data.password, user.password);
            if (!comparePasswords) {
                return res.status(400).json({
                    message: "Invalid email or password."
                });
            }
            const { password } = user, mainUser = __rest(user, ["password"]);
            const token = jsonwebtoken_1.default.sign(mainUser, AuthController.secret);
            return res.status(200).json({
                message: "Logged in successfully.",
                status: 200,
                data: { token }
            });
        });
    }
    static register(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.userSchema.create.safeParse(req.body);
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
            const userByPhone = yield db_1.default.user.findUnique({ where: { phone: data.phone } });
            const userByUsername = yield db_1.default.user.findUnique({ where: { username: data.username } });
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
            if (userByUsername) {
                return res.status(409).json({
                    message: "Username Already exists.",
                    status: 409
                });
            }
            const hashedPassword = yield bcrypt_1.default.hash(data.password, 10);
            const newUser = yield db_1.default.user.create({
                data: Object.assign(Object.assign({}, data), { password: hashedPassword })
            });
            const { password } = newUser, mainUser = __rest(newUser, ["password"]);
            const secert = process.env.APP_USER_SECRET;
            const token = jsonwebtoken_1.default.sign(mainUser, secert);
            return res.status(201).json({
                message: "User Registered successfully.",
                status: 201,
                data: {
                    user: mainUser,
                    token
                }
            });
        });
    }
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, skip, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            const searchParam = req.query.search ? req.query.search : '';
            const users = yield User_1.default.all(searchParam, skip, limit, orderBy, orderType);
            return res.status(200).json({
                data: users,
                status: 200,
                message: "Users Data"
            });
        });
    }
    static addresses(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId ? +req.params.userId : null;
            if (!userId)
                return res.status(500).json({ message: "Invalid User ID", status: 500 });
            const userData = yield db_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
            const addresses = yield User_1.default.addresses(userId);
            return res.status(200).json({
                data: addresses,
                status: 200,
                message: `User [${userId}] Addresses`
            });
        });
    }
    static orders(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            const userId = req.params.userId ? +req.params.userId : null;
            if (!userId)
                return res.status(500).json({ message: "Invalid User ID", status: 500 });
            const userData = yield db_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
            const orders = yield User_1.default.orders(userId, skip, limit, orderBy, orderType);
            return res.status(200).json({
                data: orders,
                status: 200,
                message: `User [${userId}] Orders`
            });
        });
    }
    static user(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId ? +req.params.userId : null;
            if (!userId)
                return res.status(500).json({ message: "Invalid User ID", status: 500 });
            const userData = yield db_1.default.user.findUnique({
                where: { id: userId },
                select: User_1.default.selectors
            });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
            return res.status(200).json({
                data: userData,
                status: 200,
                message: `User Details [${userId}]`
            });
        });
    }
    static getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId ? +req.params.userId : null;
            const orderId = req.params.orderId ? +req.params.orderId : null;
            if (!userId)
                return res.status(500).json({ message: "Invalid User ID", status: 500 });
            if (!orderId)
                return res.status(500).json({ message: "Invalid Order ID", status: 500 });
            const order = yield db_1.default.order.findUnique({
                where: { id: orderId },
                include: {
                    items: { include: { product: true } },
                    coupon: true,
                }
            });
            const userData = yield db_1.default.user.findUnique({
                where: { id: userId },
            });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
            if (!order || (order.userId !== userData.id))
                return res.status(404).json({ message: "Order doesn't exist", status: 404 });
            return res.status(200).json({
                data: order,
                status: 200,
                message: `Order Details [${orderId}]`
            });
        });
    }
    static update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.userSchema.update.safeParse(req.body);
            const data = body.data;
            const userId = req.params.userId ? +req.params.userId : null;
            if (!userId)
                return res.status(500).json({ message: "Invalid User ID", status: 500 });
            const userData = yield db_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
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
            if (data.email) {
                const userByEmail = yield db_1.default.user.findUnique({
                    where: {
                        email: data.email,
                        AND: [
                            { id: { not: userId } }
                        ]
                    }
                });
                if (userByEmail) {
                    return res.status(409).json({
                        message: "E-mail Already exists.",
                        status: 409
                    });
                }
            }
            if (data.phone) {
                const userByPhone = yield db_1.default.user.findFirst({
                    where: {
                        phone: data.phone,
                        AND: [
                            { id: { not: userId } }
                        ]
                    }
                });
                if (userByPhone) {
                    return res.status(409).json({
                        message: "Phone Number Already exists.",
                        status: 409
                    });
                }
            }
            if (data.username) {
                const userByUsername = yield db_1.default.user.findFirst({
                    where: {
                        username: data.username,
                        AND: [
                            { id: { not: userId } }
                        ]
                    }
                });
                if (userByUsername) {
                    return res.status(409).json({
                        message: "Username Already exists.",
                        status: 409
                    });
                }
            }
            let pass = userData.password;
            if (data.password) {
                pass = yield bcrypt_1.default.hash(data.password, 10);
            }
            const updatedUser = yield db_1.default.user.update({
                where: { id: userId },
                data: {
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    phone: data.phone,
                    password: pass
                }
            });
            const { password } = updatedUser, mainUser = __rest(updatedUser, ["password"]);
            return res.status(201).json({
                message: "User has been updated successfully.",
                status: 201,
                data: mainUser
            });
        });
    }
    static delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const userId = req.params.userId ? +req.params.userId : null;
            if (!userId)
                return res.status(500).json({ message: "Invalid User ID", status: 500 });
            const userData = yield db_1.default.user.findUnique({
                where: { id: userId }
            });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
            const deletedUser = yield db_1.default.user.delete({
                where: {
                    id: userId
                }
            });
            const { password } = deletedUser, mainUser = __rest(deletedUser, ["password"]);
            return res.status(201).json({
                message: "User has been deleted successfully.",
                status: 201,
                data: mainUser
            });
        });
    }
}
AuthController.secret = process.env.APP_USER_SECRET;
exports.default = AuthController;
