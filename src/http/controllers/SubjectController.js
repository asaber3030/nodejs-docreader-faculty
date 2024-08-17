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
const client_1 = require("@prisma/client");
const schema_1 = require("../../schema");
const responses_1 = require("../../utlis/responses");
const helpers_1 = require("../../utlis/helpers");
const db_1 = __importDefault(require("../../utlis/db"));
const AuthController_1 = __importDefault(require("./AuthController"));
class SubjectController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: findSubject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const subject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                return res.status(200).json({
                    data: subject,
                    message: `subjectId [${subjectId}] - Data`,
                    status: 200
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    getLectures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: findSubject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const lectures = yield db_1.default.lectureData.findMany({ where: { subjectId } });
                return res.status(200).json({
                    data: lectures,
                    message: `subjectId [${subjectId}] - Lectures Data`,
                    status: 200
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    getPractical(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: findSubject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const practicalData = yield db_1.default.subject.findUnique({
                    where: { id: subjectId },
                    select: { id: true, practical: true }
                });
                return res.status(200).json({
                    data: practicalData === null || practicalData === void 0 ? void 0 : practicalData.practical,
                    message: `subjectId [${subjectId}] - practicalData Data`,
                    status: 200
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    getFinalRevision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: findSubject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const finalRevisionData = yield db_1.default.subject.findUnique({
                    where: { id: subjectId },
                    select: { id: true, finalRevision: true }
                });
                return res.status(200).json({
                    data: finalRevisionData === null || finalRevisionData === void 0 ? void 0 : finalRevisionData.finalRevision,
                    message: `subjectId [${subjectId}] - Final Revision Data Data`,
                    status: 200
                });
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    updateSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized - Admin Role Required.");
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const subject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!subject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: subject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const parsedBody = schema_1.subjectSchema.update.safeParse(req.body);
                if (!parsedBody.success)
                    return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
                const findSubject = yield db_1.default.subject.findFirst({
                    where: {
                        name: parsedBody.data.name,
                        AND: [{ id: { not: subjectId } }]
                    }
                });
                if (findSubject)
                    return (0, responses_1.conflict)(res, "Subject already exists.");
                const updatedSubject = yield db_1.default.subject.update({
                    where: { id: subjectId },
                    data: parsedBody.data
                });
                return (0, responses_1.send)(res, "Subject has been updated", 200, updatedSubject);
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    deleteSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if ((user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized - Admin Role Required.");
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const subject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!subject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: subject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const deletedSubject = yield db_1.default.subject.delete({ where: { id: subjectId } });
                return (0, responses_1.send)(res, "Subject has been deleted", 200, deletedSubject);
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    createLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const body = schema_1.subjectLecture.create.safeParse(req.body);
                if (!body.success)
                    return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const user = yield AuthController_1.default.user(req, res);
                if (!user || (user === null || user === void 0 ? void 0 : user.role) !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized - Admin Role Required.");
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const subject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!subject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const findModule = yield db_1.default.module.findUnique({ where: { id: subject.moduleId } });
                if ((findModule === null || findModule === void 0 ? void 0 : findModule.yearId) !== (user === null || user === void 0 ? void 0 : user.yearId))
                    return (0, responses_1.unauthorized)(res);
                const newLecture = yield db_1.default.lectureData.create({
                    data: Object.assign(Object.assign({}, data), { subjectId, subTitle: (_a = data.subTitle) !== null && _a !== void 0 ? _a : '', createdAt: (0, helpers_1.currentDate)() })
                });
                return (0, responses_1.send)(res, "Lecture has been created.", 201, newLecture);
            }
            catch (errorObject) {
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
}
exports.default = SubjectController;
