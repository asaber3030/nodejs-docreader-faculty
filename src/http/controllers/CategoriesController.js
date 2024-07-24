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
const helpers_1 = require("../../utlis/helpers");
const responses_1 = require("../../utlis/responses");
const schema_1 = require("../../schema");
const db_1 = __importDefault(require("../../utlis/db"));
const Category_1 = __importDefault(require("../models/Category"));
class CategoriesController {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            try {
                const categories = yield Category_1.default.all(skip, limit, orderBy, orderType);
                return res.status(200).json({
                    status: 200,
                    data: categories
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid search parameters.");
            }
        });
    }
    static getCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = req.params.id ? +req.params.id : null;
            if (!categoryId)
                return (0, responses_1.notFound)(res);
            const category = yield Category_1.default.find(categoryId);
            if (!category) {
                return (0, responses_1.notFound)(res, `This category with id ${categoryId} wasn't found.`);
            }
            return res.status(200).json({
                data: category,
                status: 200
            });
        });
    }
    static getCategoryProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = req.params.id ? +req.params.id : null;
            const searchParam = req.query.search ? req.query.search : '';
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            if (!categoryId)
                return (0, responses_1.notFound)(res);
            const category = yield Category_1.default.find(categoryId);
            if (!category) {
                return (0, responses_1.notFound)(res, `This Category with id ${categoryId} wasn't found.`);
            }
            const products = yield db_1.default.product.findMany({
                where: {
                    AND: [
                        { categoryId },
                        { name: { contains: searchParam } }
                    ],
                    OR: [
                        { categoryId },
                        { description: { contains: searchParam } }
                    ],
                },
                skip,
                take: limit,
                orderBy: {
                    [orderBy]: orderType
                }
            });
            return res.status(200).json({
                data: products,
                status: 200
            });
        });
    }
    static updateCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = +req.params.id;
            try {
                const category = yield Category_1.default.find(categoryId);
                const body = req.body;
                if (!category)
                    return (0, responses_1.notFound)(res, "This category doesn't exist.");
                const parsedValidations = schema_1.categorySchemas.update.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedValidations);
                if (!parsedValidations.success)
                    return res.status(402).json({ status: 401, errors });
                const updatedCategory = yield Category_1.default.update(category.id, parsedValidations.data);
                return res.status(200).json({
                    data: updatedCategory,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Category ID.");
            }
        });
    }
    static deleteCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const categoryId = +req.params.id;
            try {
                const category = yield Category_1.default.find(categoryId);
                if (!category)
                    return (0, responses_1.notFound)(res, "This category doesn't exist.");
                const deletedCategory = yield Category_1.default.delete(category.id);
                return res.status(200).json({
                    data: deletedCategory,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Category ID.");
            }
        });
    }
    static createCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const parsedValidations = schema_1.categorySchemas.create.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedValidations);
                if (!parsedValidations.success)
                    return res.status(402).json({ status: 401, errors });
                const data = parsedValidations.data;
                const findCategory = yield db_1.default.category.findFirst({
                    where: { name: data.name }
                });
                if (findCategory)
                    return res.status(409).json({ message: "This category already exists.", status: 409 });
                const created = yield Category_1.default.create(data);
                return res.status(201).json({
                    data: created,
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
}
exports.default = CategoriesController;
