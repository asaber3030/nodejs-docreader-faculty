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
class LanguageController {
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
            const userData = yield db_1.default.user.findUnique({
                where: { id: user.id }
            });
            if (!userData)
                return (0, responses_1.notFound)(res, "User doesn't exist.");
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
            if (data.username) {
                const userByUsername = yield db_1.default.user.findFirst({
                    where: {
                        username: data.username,
                        AND: [
                            { id: { not: user.id } }
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
                where: { id: user.id },
                data: {
                    name: data.name,
                    email: data.email,
                    username: data.username,
                    jobTitle: data.jobTitle,
                    password: pass
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
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const userData = yield db_1.default.user.findUnique({ where: { id: user.id } });
            if (!userData)
                return res.status(404).json({ message: "User doesn't exist", status: 404 });
            const deletedUser = yield db_1.default.user.delete({
                where: {
                    id: user.id
                }
            });
            const { password } = deletedUser, mainUser = __rest(deletedUser, ["password"]);
            return res.status(200).json({
                message: "User has been deleted successfully.",
                status: 200,
                data: mainUser
            });
        });
    }
    getSkills(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const { limit, orderBy, orderType, skip } = (0, helpers_1.createPagination)(req, true);
            if (limit) {
                const skills = yield db_1.default.userSkill.findMany({
                    where: { userId: user.id },
                    orderBy: { [orderBy]: orderType },
                    skip,
                    take: limit,
                });
                return res.status(200).json({
                    message: "User skills",
                    status: 200,
                    data: skills
                });
            }
            const skills = yield db_1.default.userSkill.findMany({
                where: { userId: user.id },
                orderBy: { [orderBy]: orderType },
            });
            return res.status(200).json({
                message: "User skills",
                status: 200,
                data: skills
            });
        });
    }
    createSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const body = req.body;
            const parsedBody = schema_1.skillSchema.create.safeParse(body);
            if (!parsedBody.success) {
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors.",
                    status: 400
                });
            }
            const findSkill = yield db_1.default.userSkill.findFirst({
                where: { name: parsedBody.data.name, userId: user.id }
            });
            if (findSkill)
                return res.status(409).json({
                    message: "Skill is already exists.",
                    status: 409,
                });
            const createdSkill = yield db_1.default.userSkill.create({
                data: Object.assign(Object.assign({}, parsedBody.data), { userId: user.id })
            });
            return res.status(400).json({
                message: "Skill has been created.",
                status: 201,
                data: createdSkill,
            });
        });
    }
    updateSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const skillId = req.params.skillId ? +req.params.skillId : null;
            if (!skillId)
                return (0, responses_1.notFound)(res, "Skill ID doesn't exist!");
            const skill = yield db_1.default.userSkill.findUnique({ where: { id: skillId } });
            if (!skill)
                return (0, responses_1.notFound)(res, "Skill ID doesn't exist!");
            if (skill.userId !== user.id)
                return (0, responses_1.unauthorized)(res, "Unauthorized Action.");
            const body = req.body;
            const parsedBody = schema_1.skillSchema.update.safeParse(body);
            if (!parsedBody.success) {
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors.",
                    status: 400
                });
            }
            const findSkill = yield db_1.default.userSkill.findFirst({
                where: { name: parsedBody.data.name, userId: user.id, id: { not: skillId } }
            });
            if (findSkill)
                return res.status(409).json({
                    message: "Skill is already exists.",
                    status: 409,
                });
            const updatedSkill = yield db_1.default.userSkill.update({
                where: { id: skill.id },
                data: { name: parsedBody.data.name }
            });
            return res.status(200).json({
                message: "Skill has been updated successfully.",
                status: 200,
                data: updatedSkill
            });
        });
    }
    deleteSkill(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const skillId = req.params.skillId ? +req.params.skillId : null;
            if (!skillId)
                return (0, responses_1.notFound)(res, "Skill ID doesn't exist!");
            const skill = yield db_1.default.userSkill.findUnique({ where: { id: skillId } });
            if (!skill)
                return (0, responses_1.notFound)(res, "Skill ID doesn't exist!");
            if (skill.userId !== user.id)
                return (0, responses_1.unauthorized)(res, "Unauthorized Action.");
            const deletedSkill = yield db_1.default.userSkill.delete({
                where: { id: skill.id, userId: user.id },
            });
            return res.status(200).json({
                message: "Skill has been deleted successfully.",
                status: 200,
                data: deletedSkill
            });
        });
    }
}
exports.default = LanguageController;
