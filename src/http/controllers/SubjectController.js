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
            const moduleId = (0, helpers_1.parameterExists)(req, res, "moduleId");
            if (!moduleId)
                return (0, responses_1.notFound)(res, "Module doesn't exist.");
            const module = yield db_1.default.module.findUnique({ where: { id: moduleId }, select: { id: true } });
            if (!module)
                return (0, responses_1.notFound)(res, "Module not found.");
            const parsedBody = schema_1.subjectSchema.create.safeParse(req.body);
            if (!parsedBody.success)
                return (0, responses_1.send)(res, "Validation errors", 400, (0, helpers_1.extractErrors)(parsedBody));
            const findSubject = yield db_1.default.moduleSubject.findFirst({
                where: { moduleId, name: parsedBody.data.name }
            });
            if (findSubject)
                return (0, responses_1.conflict)(res, "Subject already exists.");
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
                where: { id: subjectId },
                data: parsedBody.data
            });
            return (0, responses_1.send)(res, "Module has been updated", 200, updatedSubject);
        });
    }
    deleteSubject(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res);
            const deletedSubject = yield db_1.default.moduleSubject.delete({ where: { id: subjectId } });
            return (0, responses_1.send)(res, "Module has been deleted", 200, deletedSubject);
        });
    }
    createLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.subjectLecture.create.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res);
            const newLecture = yield db_1.default.subjectLecture.create({
                data: Object.assign(Object.assign({}, data), { subjectId: findSubject.id }),
            });
            return (0, responses_1.send)(res, "Subject Lecture has been created successfully.", 201, newLecture);
        });
    }
    updateLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.subjectLecture.update.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res, "Subject doesn't exist.");
            const findLecture = yield db_1.default.subjectLecture.findUnique({ where: { id: lectureId }, select: { id: true, subjectId: true } });
            if (!findLecture)
                return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
            const updatedLecture = yield db_1.default.subjectLecture.update({
                where: { id: lectureId },
                data: Object.assign({}, data),
            });
            return (0, responses_1.send)(res, "Subject Lecture has been updated successfully.", 200, updatedLecture);
        });
    }
    createPractical(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.subjectPractical.create.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res);
            const newSubjectPractical = yield db_1.default.subjectPractical.create({
                data: Object.assign(Object.assign({}, data), { subjectId: findSubject.id }),
            });
            return (0, responses_1.send)(res, "Subject Practical Data has been created successfully.", 201, newSubjectPractical);
        });
    }
    updatePractical(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.subjectPractical.update.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const practicalId = (0, helpers_1.parameterExists)(req, res, "practicalId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res, "Subject doesn't exist.");
            const findPractical = yield db_1.default.subjectPractical.findUnique({ where: { id: practicalId }, select: { id: true, subjectId: true } });
            if (!findPractical)
                return (0, responses_1.notFound)(res, "Practical Data doesn't exist.");
            const updatedPractical = yield db_1.default.subjectPractical.update({
                where: { id: practicalId },
                data: Object.assign({}, data),
            });
            return (0, responses_1.send)(res, "Subject Practical Data has been updated successfully.", 200, updatedPractical);
        });
    }
    createFinalRevision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.subjectFinalRevision.create.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res);
            const newFinalRev = yield db_1.default.subjectFinalRevision.create({
                data: Object.assign(Object.assign({}, data), { subjectId: findSubject.id }),
            });
            return (0, responses_1.send)(res, "Subject Final Revision Data has been created successfully.", 201, newFinalRev);
        });
    }
    updateFinalRevision(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = schema_1.subjectFinalRevision.update.safeParse(req.body);
            if (!body.success)
                return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
            const data = body.data;
            const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
            const finalId = (0, helpers_1.parameterExists)(req, res, "finalId");
            const findSubject = yield db_1.default.moduleSubject.findUnique({ where: { id: subjectId }, select: { id: true, moduleId: true } });
            if (!findSubject)
                return (0, responses_1.notFound)(res, "Subject doesn't exist.");
            const findFinalRevision = yield db_1.default.subjectFinalRevision.findUnique({ where: { id: finalId }, select: { id: true, subjectId: true } });
            if (!findFinalRevision)
                return (0, responses_1.notFound)(res, "Final Revision doesn't exist.");
            const updatedFinalRevision = yield db_1.default.subjectFinalRevision.update({
                where: { id: finalId },
                data: Object.assign({}, data),
            });
            return (0, responses_1.send)(res, "Subject Final Revision Data has been updated successfully.", 200, updatedFinalRevision);
        });
    }
}
exports.default = SubjectController;
