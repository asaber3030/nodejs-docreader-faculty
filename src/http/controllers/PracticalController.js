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
const client_1 = require("@prisma/client");
class PracticalController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const practicalData = yield db_1.default.practicalData.findUnique({
                    where: { subjectId },
                    include: { subject: true }
                });
                if (!practicalData)
                    return (0, responses_1.notFound)(res, "Practical Data doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: practicalData === null || practicalData === void 0 ? void 0 : practicalData.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                return (0, responses_1.send)(res, `subjectId [${subjectId}] - Data`, 200, practicalData);
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
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const practicalData = yield db_1.default.practicalData.findUnique({
                    where: { subjectId },
                    include: { subject: true }
                });
                if (!practicalData)
                    return (0, responses_1.notFound)(res, "Practical Data doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: practicalData === null || practicalData === void 0 ? void 0 : practicalData.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const links = yield db_1.default.practicalLinks.findMany({
                    where: { practicalId: practicalData.id }
                });
                return (0, responses_1.send)(res, `subjectId [${subjectId}] - Pracitcal Data Links`, 200, links);
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
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot create a link.");
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                const practicalData = yield db_1.default.practicalData.findUnique({
                    where: { subjectId },
                    include: { subject: true }
                });
                if (!practicalData)
                    return (0, responses_1.notFound)(res, "Practical Data doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: practicalData === null || practicalData === void 0 ? void 0 : practicalData.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const body = schema_1.linkSchema.create.safeParse(req.body);
                if (!body.success)
                    return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const createdLink = yield db_1.default.practicalLinks.create({
                    data: Object.assign(Object.assign({}, data), { createdAt: (0, helpers_1.currentDate)(), practicalId: practicalData.id })
                });
                return (0, responses_1.send)(res, "Practical Link has been created", 201, createdLink);
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
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                if (!linkId)
                    return (0, responses_1.badRequest)(res, "Invalid linkId");
                const practicalData = yield db_1.default.practicalData.findUnique({
                    where: { subjectId },
                    include: { subject: true }
                });
                if (!practicalData)
                    return (0, responses_1.notFound)(res, "Practical Data doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: practicalData === null || practicalData === void 0 ? void 0 : practicalData.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const link = yield db_1.default.practicalLinks.findUnique({ where: { id: linkId } });
                if (!link)
                    return (0, responses_1.notFound)(res, "Link doesn't exist.");
                const body = schema_1.linkSchema.update.safeParse(req.body);
                if (!body.success)
                    return (0, responses_1.validationErrors)(res, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const updatedLink = yield db_1.default.practicalLinks.update({
                    where: { id: link.id },
                    data
                });
                return (0, responses_1.send)(res, "Link has been updated", 200, updatedLink);
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
                const subjectId = (0, helpers_1.parameterExists)(req, res, "subjectId");
                const linkId = (0, helpers_1.parameterExists)(req, res, "linkId");
                const findSubject = yield db_1.default.subject.findUnique({ where: { id: subjectId } });
                if (!findSubject)
                    return (0, responses_1.notFound)(res, "Subject doesn't exist.");
                if (!subjectId)
                    return (0, responses_1.badRequest)(res, "Invalid subjectId");
                if (!linkId)
                    return (0, responses_1.badRequest)(res, "Invalid linkId");
                const practicalData = yield db_1.default.practicalData.findUnique({
                    where: { subjectId },
                    include: { subject: true }
                });
                if (!practicalData)
                    return (0, responses_1.notFound)(res, "Practical Data doesn't exist.");
                const module = yield db_1.default.module.findUnique({ where: { id: practicalData === null || practicalData === void 0 ? void 0 : practicalData.subject.moduleId } });
                if ((user === null || user === void 0 ? void 0 : user.yearId) !== (module === null || module === void 0 ? void 0 : module.yearId))
                    return (0, responses_1.unauthorized)(res, "Unauthorized");
                const link = yield db_1.default.practicalLinks.findUnique({ where: { id: linkId } });
                if (!link)
                    return (0, responses_1.notFound)(res, "Link doesn't exist.");
                const deletedLink = yield db_1.default.practicalLinks.delete({ where: { id: link.id } });
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
exports.default = PracticalController;
