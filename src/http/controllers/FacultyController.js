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
const responses_1 = require("../../utlis/responses");
const schema_1 = require("../../schema");
const helpers_1 = require("../../utlis/helpers");
const db_1 = __importDefault(require("../../utlis/db"));
const Faculty_1 = __importDefault(require("../models/Faculty"));
const AuthController_1 = __importDefault(require("./AuthController"));
const User_1 = __importDefault(require("../models/User"));
class FacultyController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const { search, orderBy, orderType } = req.query;
                const faculties = yield Faculty_1.default.findAll(search ? search : '', orderBy, orderType);
                return res.status(200).json({
                    data: faculties,
                    message: "Faculties data",
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
    getFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, 'facultyId');
                if (!facultyId)
                    return (0, responses_1.badRequest)(res, "Invalid faculty id");
                const faculty = yield Faculty_1.default.find(facultyId);
                if (!faculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist.");
                return res.status(200).json({
                    data: faculty,
                    message: "Faculty data",
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
    getFacultyYears(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, 'facultyId');
                if (!facultyId)
                    return (0, responses_1.badRequest)(res, "Invalid faculty id");
                const years = yield db_1.default.studyingYear.findMany({ where: { facultyId } });
                return res.status(200).json({
                    data: years,
                    message: `Faculy of ID: ${facultyId} data - Years`,
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
    getYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, 'facultyId');
                const yearId = req.params.yearId ? +req.params.yearId : null;
                if (!facultyId)
                    return (0, responses_1.badRequest)(res, "Invalid faculty id");
                if (!yearId)
                    return (0, responses_1.badRequest)(res, "Invalid year id");
                const year = yield db_1.default.studyingYear.findUnique({ where: { id: yearId } });
                if (!year)
                    return (0, responses_1.notFound)(res, "Year doesn't exist.");
                return res.status(200).json({
                    data: year,
                    message: "Year data",
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
    getYearStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, 'facultyId');
                const yearId = (0, helpers_1.parameterExists)(req, res, 'yearId');
                if (!facultyId)
                    return (0, responses_1.badRequest)(res, "Invalid faculty id");
                if (!yearId)
                    return (0, responses_1.badRequest)(res, "Invalid year id");
                const year = yield db_1.default.studyingYear.findUnique({ where: { id: yearId } });
                if (!year)
                    return (0, responses_1.notFound)(res, "Year doesn't exist.");
                if (year.facultyId !== facultyId)
                    return (0, responses_1.notFound)(res, "Year doesn't belong to given faculty id.");
                const students = yield db_1.default.user.findMany({
                    where: { yearId },
                    select: User_1.default.dbSelectors
                });
                return res.status(200).json({
                    data: students,
                    message: `Students of Year: ${yearId}`,
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
    // Create / Delete / Update => Year for specific facultyId
    createYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot create a year.");
                const body = schema_1.studyingYearSchema.create.safeParse(req.body);
                const facultyId = (0, helpers_1.parameterExists)(req, res, "facultyId");
                if (!body.success)
                    return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const faculty = yield db_1.default.faculty.findUnique({ where: { id: facultyId }, select: { id: true } });
                if (!faculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist.");
                const yearExist = yield db_1.default.studyingYear.findFirst({
                    where: { facultyId, title: data.title }
                });
                if (yearExist)
                    return (0, responses_1.conflict)(res, "Year already exists in this faculty.");
                const newYear = yield db_1.default.studyingYear.create({
                    data: Object.assign({ facultyId: faculty.id, createdAt: (0, helpers_1.currentDate)() }, data),
                });
                return (0, responses_1.send)(res, "Year has been created.", 201, newYear);
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
    updateYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot update a year.");
                const body = schema_1.studyingYearSchema.update.safeParse(req.body);
                const facultyId = (0, helpers_1.parameterExists)(req, res, "facultyId");
                const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
                if (!body.success)
                    return (0, responses_1.send)(res, "Validation errors", 400, null, (0, helpers_1.extractErrors)(body));
                const data = body.data;
                const faculty = yield db_1.default.faculty.findUnique({ where: { id: facultyId }, select: { id: true } });
                if (!faculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist.");
                const yearExist = yield db_1.default.studyingYear.findFirst({
                    where: { facultyId, title: data.title, AND: [{ id: { not: yearId } }] }
                });
                if (yearExist)
                    return (0, responses_1.conflict)(res, "Year already exists in this faculty.");
                const findYear = yield db_1.default.studyingYear.findUnique({
                    where: { id: yearId },
                    select: { id: true }
                });
                if (!findYear)
                    return (0, responses_1.notFound)(res, "Year doesn't exist.");
                const updatedYear = yield db_1.default.studyingYear.update({
                    where: { id: yearId },
                    data: Object.assign({}, data)
                });
                return (0, responses_1.send)(res, "Year has been updated.", 200, updatedYear);
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
    deleteYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, "facultyId");
                const yearId = (0, helpers_1.parameterExists)(req, res, "yearId");
                const faculty = yield db_1.default.faculty.findUnique({ where: { id: facultyId }, select: { id: true } });
                if (!faculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist.");
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot delete a year.");
                const yearExist = yield db_1.default.studyingYear.findFirst({
                    where: { id: yearId }
                });
                if (!yearExist)
                    return (0, responses_1.notFound)(res, "Year doesn't exist.");
                const deletedYear = yield db_1.default.studyingYear.delete({
                    where: { id: yearId }
                });
                return (0, responses_1.send)(res, "Year has been deleted.", 200, deletedYear);
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
    // Create / Delete / Update => Faculty
    createFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const parsedBody = schema_1.facultySchema.create.safeParse(body);
                const data = parsedBody.data;
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                if (!parsedBody)
                    return res.status(400).json({ message: "Validation errors", errors, status: 400 });
                if (!data)
                    return res.status(400).json({ message: "Validation errors", errors, status: 400 });
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot create a faculty.");
                const facultyExists = yield db_1.default.faculty.findFirst({ where: Object.assign({}, data) });
                if (facultyExists)
                    return (0, responses_1.conflict)(res, "Faculty already exists.");
                const faculty = yield db_1.default.faculty.create({
                    data: Object.assign(Object.assign({}, data), { createdAt: (0, helpers_1.currentDate)() })
                });
                return res.status(201).json({
                    data: faculty,
                    message: "Faculty has been created successfully.",
                    status: 201
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
    updateFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, "facultyId");
                const body = req.body;
                const parsedBody = schema_1.facultySchema.update.safeParse(body);
                const data = parsedBody.data;
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                if (!parsedBody)
                    return res.status(400).json({ message: "Validation errors", errors, status: 400 });
                if (!data)
                    return res.status(400).json({ message: "Validation errors", errors, status: 400 });
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot update a faculty.");
                const facultyExists = yield db_1.default.faculty.findFirst({
                    where: Object.assign(Object.assign({}, data), { AND: [
                            { id: { not: facultyId } }
                        ] })
                });
                if (facultyExists)
                    return (0, responses_1.conflict)(res, "Faculty already exists.");
                const faculty = yield db_1.default.faculty.update({ where: { id: facultyId }, data });
                return res.status(200).json({
                    data: faculty,
                    message: "Faculty has been updated successfully.",
                    status: 201
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
    deleteFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const facultyId = (0, helpers_1.parameterExists)(req, res, "facultyId");
                const user = yield AuthController_1.default.user(req, res);
                if (!user || user.role !== client_1.UserRole.Admin)
                    return (0, responses_1.unauthorized)(res, "Unauthorized cannot delete a faculty.");
                const findFaculty = yield db_1.default.faculty.findUnique({ where: { id: facultyId } });
                if (!findFaculty)
                    return (0, responses_1.notFound)(res, "Faculty doesn't exist.");
                const faculty = yield db_1.default.faculty.delete({ where: { id: facultyId } });
                return res.status(201).json({
                    data: faculty,
                    message: "Faculty has been deleted successfully.",
                    status: 201
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
}
exports.default = FacultyController;
