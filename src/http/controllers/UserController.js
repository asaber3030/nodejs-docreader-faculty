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
const responses_1 = require("../../utlis/responses");
const schema_1 = require("../../schema");
const bcrypt_1 = __importDefault(require("bcrypt"));
const db_1 = __importDefault(require("../../utlis/db"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = __importDefault(require("../models/User"));
const AuthController_1 = __importDefault(require("./AuthController"));
class UserController {
    static user(req) {
        return __awaiter(this, void 0, void 0, function* () {
            const token = (0, helpers_1.extractToken)(req.headers.authorization);
            if (!token)
                return null;
            try {
                const verifiedToken = jsonwebtoken_1.default.verify(token, AuthController_1.default.secret);
                if (!verifiedToken)
                    return null;
                const realUser = yield User_1.default.find(verifiedToken.id);
                return realUser;
            }
            catch (error) {
                return null;
            }
        });
    }
    getUser(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.notFound)(res, "No User was found");
            return res.status(200).json({
                data: user,
                status: 200
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.userSchema.update.safeParse(req.body);
            const data = body.data;
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const userData = yield db_1.default.user.findUnique({ where: { id: user.id } });
            if (!userData)
                return (0, responses_1.notFound)(res, "User doesn't exist.");
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(body));
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
                            { id: { not: user.id } }
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
            const updatedUser = yield db_1.default.user.update({
                where: { id: user.id },
                data: {
                    name: data.name,
                    email: data.email
                }
            });
            const { password } = updatedUser, mainUser = __rest(updatedUser, ["password"]);
            return res.status(200).json({
                message: "User has been updated successfully.",
                status: 200,
                data: mainUser
            });
        });
    }
    updateFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.userSchema.updateFaculty.safeParse(req.body);
            const tokenData = yield UserController.user(req);
            if (!tokenData)
                return (0, responses_1.unauthorized)(res);
            const user = yield db_1.default.user.findUnique({ where: { id: tokenData.id } });
            if (!user)
                return (0, responses_1.notFound)(res, "User doesn't exist.");
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const faculty = yield db_1.default.faculty.findUnique({
                where: { id: data.facultyId }
            });
            const studyingYear = yield db_1.default.studyingYear.findUnique({
                where: { id: data.yearId }
            });
            if (!faculty)
                return (0, responses_1.notFound)(res, "Faculty doesn't exist.");
            if (!studyingYear)
                return (0, responses_1.notFound)(res, "Studying year doesn't exist.");
            if (faculty.id !== studyingYear.facultyId)
                return (0, responses_1.notFound)(res, "Failed. Year id doesn't belongs to the given faculty!");
            const updatedUser = yield db_1.default.user.update({
                where: { id: user.id },
                data: {
                    facultyId: data.facultyId,
                    yearId: data.yearId
                }
            });
            const { password } = updatedUser, mainUser = __rest(updatedUser, ["password"]);
            return res.status(200).json({
                message: "User has been updated successfully.",
                status: 200,
                data: mainUser
            });
        });
    }
    changePassword(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.userSchema.changePassword.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const user = yield AuthController_1.default.user(req, res);
            const userFull = yield db_1.default.user.findUnique({ where: { id: user === null || user === void 0 ? void 0 : user.id }, select: { id: true, password: true } });
            if (!user || !userFull)
                return (0, responses_1.unauthorized)(res);
            const comparePasswords = yield bcrypt_1.default.compare(data.currentPassword, userFull === null || userFull === void 0 ? void 0 : userFull.password);
            if (!comparePasswords)
                return (0, responses_1.unauthorized)(res, "Invalid password for current user.");
            const newPassword = yield bcrypt_1.default.hash(data.newPassword, 10);
            const updatedUser = yield db_1.default.user.update({
                where: { id: user.id },
                data: {
                    password: newPassword
                },
                select: { id: true }
            });
            return res.status(200).json({
                message: "Password has been updated successfully.",
                status: 200,
            });
        });
    }
}
exports.default = UserController;
