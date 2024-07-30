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
const Module_1 = __importDefault(require("../models/Module"));
const db_1 = __importDefault(require("../../utlis/db"));
class ModuleController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid yearId");
            const { search, orderBy, orderType } = req.query;
            const modules = yield db_1.default.module.findMany({
                where: {
                    yearId,
                    name: { contains: search }
                },
                include: { _count: { select: { subjects: true } } },
                orderBy: { [orderBy]: orderType }
            });
            return res.status(200).json({
                data: modules,
                message: "Modules data",
                status: 200
            });
        });
    }
    createModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid yearId");
            const parsedBody = schema_1.moduleSchema.create.safeParse(req.body);
            if (!parsedBody.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
            const findModule = yield db_1.default.module.findFirst({
                where: { yearId, name: parsedBody.data.name }
            });
            if (findModule)
                return (0, responses_1.conflict)(res, "Module already exists.");
            const newModule = yield db_1.default.module.create({
                data: Object.assign({ yearId }, parsedBody.data)
            });
            return (0, responses_1.send)(res, "Module has been created", 201, newModule);
        });
    }
    createSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            if (!moduleId)
                return (0, responses_1.notFound)(res, "Invalid moduleId");
            const module = yield db_1.default.module.findUnique({ where: { id: moduleId }, select: { id: true } });
            if (!module)
                return (0, responses_1.notFound)(res, "Module not found.");
            const parsedBody = schema_1.subjectSchema.create.safeParse(req.body);
            if (!parsedBody.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
            const findSubject = yield db_1.default.subject.findFirst({
                where: { moduleId, name: parsedBody.data.name }
            });
            if (findSubject)
                return (0, responses_1.conflict)(res, "Subject already exists.");
            const newSubject = yield db_1.default.subject.create({
                data: Object.assign({ moduleId }, parsedBody.data)
            });
            yield db_1.default.practicalData.create({ data: {
                    title: "Practical Data",
                    subTitle: "Practical Data is for lab.",
                    subjectId: newSubject.id
                }
            });
            yield db_1.default.finalRevisionData.create({ data: {
                    title: "Final Revision Data",
                    subTitle: "Final Data is for Final including final exams and mid-term exams.",
                    subjectId: newSubject.id
                }
            });
            return (0, responses_1.send)(res, "Subject has been created", 201, newSubject);
        });
    }
    getModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid yearId");
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid Module Id");
            const module = yield Module_1.default.find(moduleId);
            if (!module)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            return (0, responses_1.send)(res, "Module", 200, module);
        });
    }
    getModuleSubjects(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid yearId");
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid moduleId");
            const module = yield Module_1.default.find(moduleId);
            if (!module)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            const subjects = yield Module_1.default.moduleSubjects(moduleId);
            return (0, responses_1.send)(res, "Module subjects", 200, subjects);
        });
    }
    updateModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid yearId");
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid moduleId");
            const module = yield Module_1.default.find(moduleId);
            if (!module)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            const parsedBody = schema_1.moduleSchema.update.safeParse(req.body);
            if (!parsedBody.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
            const findModule = yield db_1.default.module.findFirst({
                where: {
                    yearId,
                    name: parsedBody.data.name,
                    AND: [
                        { id: { not: moduleId } }
                    ]
                }
            });
            if (findModule)
                return (0, responses_1.conflict)(res, "Module already exists.");
            const updatedModule = yield db_1.default.module.update({
                where: { id: moduleId },
                data: parsedBody.data
            });
            return (0, responses_1.send)(res, "Module has been updated", 200, updatedModule);
        });
    }
    deleteModule(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid yearId");
            if (!moduleId)
                return (0, responses_1.badRequest)(res, "Invalid moduleId");
            const module = yield Module_1.default.find(moduleId);
            if (!module)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            const deletedModule = yield db_1.default.module.delete({ where: { id: moduleId } });
            return (0, responses_1.send)(res, "Module has been deleted", 200, deletedModule);
        });
    }
}
exports.default = ModuleController;
