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
const schema_1 = require("../../schema");
const responses_1 = require("../../utlis/responses");
const helpers_1 = require("../../utlis/helpers");
const db_1 = __importDefault(require("../../utlis/db"));
const AuthController_1 = __importDefault(require("./AuthController"));
class SubjectController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = req.params.moduleId ? +req.params.moduleId : null;
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid Year Id");
            const findModule = yield db_1.default.module.findUnique({ where: { id: moduleId } });
            if (!findModule)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            const user = yield AuthController_1.default.user(req, res);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            if (findModule.yearId !== (user === null || user === void 0 ? void 0 : user.yearId)) {
                return (0, responses_1.unauthorized)(res);
            }
            const { search, orderBy, orderType } = req.query;
            const subjects = yield db_1.default.moduleSubject.findMany({
                where: {
                    moduleId,
                    name: { contains: search }
                },
                orderBy: { [orderBy]: orderType }
            });
            return res.status(200).json({
                data: subjects,
                message: "Module Subjects data",
                status: 200
            });
        });
    }
    createSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = req.params.moduleId ? +req.params.moduleId : null;
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid Year Id");
            const parsedBody = schema_1.subjectSchema.create.safeParse(req.body);
            if (!parsedBody.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
            const findSubject = yield db_1.default.moduleSubject.findFirst({
                where: { moduleId, name: parsedBody.data.name }
            });
            if (findSubject)
                return (0, responses_1.conflict)(res, "Module already exists.");
            const newSubject = yield db_1.default.moduleSubject.create({
                data: Object.assign({ moduleId }, parsedBody.data)
            });
            return (0, responses_1.send)(res, "Subject has been created", 201, newSubject);
        });
    }
    getSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const subject = yield db_1.default.moduleSubject.findUnique({
                where: { id: subjectId }
            });
            if (!subject)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            return (0, responses_1.send)(res, "Subject data", 200, subject);
        });
    }
    getSubjectLectures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const lectures = yield db_1.default.dataCategory.findMany({
                include: {
                    subjectLectures: { where: { subjectId } }
                }
            });
            return (0, responses_1.send)(res, "Module subjects", 200, lectures);
        });
    }
    getSubjectFinalRevisions(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const finalRevisions = yield db_1.default.dataCategory.findMany({
                include: {
                    subjectFinalRevisions: { where: { subjectId } }
                }
            });
            return (0, responses_1.send)(res, "Module subjects", 200, finalRevisions);
        });
    }
    getSubjectPractical(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const practical = yield db_1.default.dataCategory.findMany({
                include: {
                    subjectPractical: { where: { subjectId } }
                }
            });
            return (0, responses_1.send)(res, "Module subjects", 200, practical);
        });
    }
    updateSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const parsedBody = schema_1.subjectSchema.update.safeParse(req.body);
            if (!parsedBody.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
            const findSubject = yield db_1.default.moduleSubject.findFirst({
                where: {
                    moduleId,
                    name: parsedBody.data.name,
                    AND: [
                        { id: { not: moduleId } }
                    ]
                }
            });
            if (findSubject)
                return (0, responses_1.conflict)(res, "Subject already exists.");
            const updatedSubject = yield db_1.default.moduleSubject.update({
                where: { id: moduleId },
                data: parsedBody.data
            });
            return (0, responses_1.send)(res, "Module has been updated", 200, updatedSubject);
        });
    }
    deleteModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = req.params.yearId ? +req.params.yearId : null;
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid Year Id");
            const moduleId = req.params.moduleId ? +req.params.moduleId : null;
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid Module Id");
            const deletedModule = yield db_1.default.module.delete({ where: { id: moduleId } });
            return (0, responses_1.send)(res, "Module has been deleted", 200, deletedModule);
        });
    }
}
exports.default = SubjectController;
