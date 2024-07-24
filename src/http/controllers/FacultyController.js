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
const Faculty_1 = __importDefault(require("../models/Faculty"));
const responses_1 = require("../../utlis/responses");
const db_1 = __importDefault(require("../../utlis/db"));
const schema_1 = require("../../schema");
const helpers_1 = require("../../utlis/helpers");
class FacultyController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { search, orderBy, orderType } = req.query;
            const faculties = yield Faculty_1.default.findAll(search ? search : '', orderBy, orderType);
            return res.status(200).json({
                data: faculties,
                message: "Faculties data",
                status: 200
            });
        });
    }
    getFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const facultyId = req.params.facultyId ? +req.params.facultyId : null;
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
        });
    }
    getFacultyYears(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const facultyId = req.params.facultyId ? +req.params.facultyId : null;
            if (!facultyId)
                return (0, responses_1.badRequest)(res, "Invalid faculty id");
            try {
                const years = yield db_1.default.studyingYear.findMany({
                    where: { facultyId }
                });
                return res.status(200).json({
                    data: years,
                    message: `Faculy of ID: ${facultyId} data - Years`,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.notFound)(res, "Error - Faculty Doesn't exist.");
            }
        });
    }
    getYear(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const facultyId = req.params.facultyId ? +req.params.facultyId : null;
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
        });
    }
    getYearStudents(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const facultyId = req.params.facultyId ? +req.params.facultyId : null;
            const yearId = req.params.yearId ? +req.params.yearId : null;
            if (!facultyId)
                return (0, responses_1.badRequest)(res, "Invalid faculty id");
            if (!yearId)
                return (0, responses_1.badRequest)(res, "Invalid year id");
            const year = yield db_1.default.studyingYear.findUnique({ where: { id: yearId } });
            if (!year)
                return (0, responses_1.notFound)(res, "Year doesn't exist.");
            const students = yield db_1.default.user.findMany({
                where: { yearId }
            });
            return res.status(200).json({
                data: students,
                message: `Students of Year: ${yearId}`,
                status: 200
            });
        });
    }
    updateFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const facultyId = req.params.facultyId ? +req.params.facultyId : null;
            if (!facultyId)
                return (0, responses_1.badRequest)(res, "Invalid faculty id");
            const body = req.body;
            const parsedBody = schema_1.facultySchema.update.safeParse(body);
            const data = parsedBody.data;
            const errors = (0, helpers_1.extractErrors)(parsedBody);
            if (!parsedBody)
                return res.status(400).json({ message: "Validation errors", errors, status: 400 });
            if (!data)
                return res.status(400).json({ message: "Validation errors", errors, status: 400 });
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
        });
    }
    createFaculty(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const body = req.body;
            const parsedBody = schema_1.facultySchema.create.safeParse(body);
            const data = parsedBody.data;
            const errors = (0, helpers_1.extractErrors)(parsedBody);
            if (!parsedBody)
                return res.status(400).json({ message: "Validation errors", errors, status: 400 });
            if (!data)
                return res.status(400).json({ message: "Validation errors", errors, status: 400 });
            const facultyExists = yield db_1.default.faculty.findFirst({ where: Object.assign({}, data) });
            if (facultyExists)
                return (0, responses_1.conflict)(res, "Faculty already exists.");
            const faculty = yield db_1.default.faculty.create({ data });
            return res.status(201).json({
                data: faculty,
                message: "Faculty has been created successfully.",
                status: 201
            });
        });
    }
}
exports.default = FacultyController;
