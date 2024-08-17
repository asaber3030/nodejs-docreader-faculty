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
class LectureController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                return (0, responses_1.send)(res, `lectureId [${lectureId}] - Data`, 200, lecture);
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
    updateLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot update a lecture.");
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const body = schema_1.subjectLecture.update.safeParse(req.body);
                if (!body.success)
                    return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                if (body.data.subjectId) {
                    const subject = yield db_1.default.subject.findUnique({ where: { id: body.data.subjectId } });
                    if (!subject)
                        return (0, responses_1.notFound)(res, "Subject id doesn't exist.");
                }
                const updatedLecture = yield db_1.default.lectureData.update({
                    where: { id: lectureId },
                    data: Object.assign(Object.assign({}, data), { subjectId: data.subjectId ? data.subjectId : lecture.subjectId, subTitle: (_a = data.subTitle) !== null && _a !== void 0 ? _a : '' })
                });
                return (0, responses_1.send)(res, "Lecture has been updated", 200, updatedLecture);
            }
            catch (errorObject) {
                console.log(errorObject);
                return res.status(500).json({
                    errorObject,
                    message: "Error - Something Went Wrong.",
                    status: 500
                });
            }
        });
    }
    deleteLecture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot delete a lecture.");
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const deletedLecture = yield db_1.default.lectureData.delete({
                    where: { id: lectureId }
                });
                return (0, responses_1.send)(res, "Lecture has been deleted", 200, deletedLecture);
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
    getLinks(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const links = yield db_1.default.lectureLinks.findMany({
                    where: { lectureId: lecture.id }
                });
                return (0, responses_1.send)(res, `lectureId [${lectureId}] - Links`, 200, links);
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
    getLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
                if (!linkId)
                    return (0, responses_1.badRequest)(res, "Invalid linkId");
                const link = yield db_1.default.lectureLinks.findUnique({ where: { id: linkId } });
                if (!link)
                    return (0, responses_1.notFound)(res, "Link not found.");
                return (0, responses_1.send)(res, "Link Data", 200, link);
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
    createLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a;
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot create a link.");
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const body = schema_1.linkSchema.create.safeParse(req.body);
                if (!body.success)
                    return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const createdLink = yield db_1.default.lectureLinks.create({
                    data: Object.assign(Object.assign({}, data), { subTitle: (_a = data.subTitle) !== null && _a !== void 0 ? _a : '', lectureId: lecture.id, createdAt: (0, helpers_1.currentDate)() })
                });
                return (0, responses_1.send)(res, "Lecture Link has been created", 201, createdLink);
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
    updateLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot update a link.");
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                if (!linkId)
                    return (0, responses_1.badRequest)(res, "Invalid linkId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                const link = yield db_1.default.lectureLinks.findUnique({ where: { id: linkId } });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                if (!link)
                    return (0, responses_1.notFound)(res, "Link doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const body = schema_1.linkSchema.update.safeParse(req.body);
                if (!body.success)
                    return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const createdLink = yield db_1.default.lectureLinks.update({
                    where: { id: link.id },
                    data: Object.assign({}, data)
                });
                return (0, responses_1.send)(res, "Link has been updated", 200, createdLink);
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
    deleteLink(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot delete a link.");
                const lectureId = (0, helpers_1.parameterExists)(req, res, "lectureId");
                const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
                if (!lectureId)
                    return (0, responses_1.badRequest)(res, "Invalid lectureId");
                if (!linkId)
                    return (0, responses_1.badRequest)(res, "Invalid linkId");
                const lecture = yield db_1.default.lectureData.findUnique({
                    where: { id: lectureId },
                    include: { subject: true }
                });
                const link = yield db_1.default.lectureLinks.findUnique({ where: { id: linkId } });
                if (!lecture)
                    return (0, responses_1.notFound)(res, "Lecture doesn't exist.");
                if (!link)
                    return (0, responses_1.notFound)(res, "Link doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: lecture === null || lecture === void 0 ? void 0 : lecture.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const deletedLink = yield db_1.default.lectureLinks.delete({
                    where: { id: link.id }
                });
                return (0, responses_1.send)(res, "Link has been deleted", 200, deletedLink);
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
exports.default = LectureController;
