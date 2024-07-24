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
const UserController_1 = __importDefault(require("./UserController"));
class CategoryController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, orderBy, orderType, skip } = (0, helpers_1.createPagination)(req, true);
            const searchParam = req.query.search ? req.query.search : '';
            if (limit) {
                const categories = yield db_1.default.category.findMany({
                    orderBy: { [orderBy]: orderType },
                    where: {
                        OR: [
                            { name: { contains: searchParam } },
                            { keywords: { contains: searchParam } },
                        ]
                    },
                    skip,
                    take: limit,
                });
                return res.status(200).json({
                    message: "Categories",
                    status: 200,
                    data: categories
                });
            }
            const categories = yield db_1.default.category.findMany({
                orderBy: { [orderBy]: orderType },
                where: {
                    OR: [
                        { name: { contains: searchParam } },
                        { keywords: { contains: searchParam } },
                    ]
                },
            });
            return res.status(200).json({
                message: "categories",
                status: 200,
                data: categories
            });
        });
    }
    getSnippets(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { limit, orderBy, orderType, skip } = (0, helpers_1.createPagination)(req);
            const searchParam = req.query.search ? req.query.search : '';
            const categoryId = req.params.categoryId ? +req.params.categoryId : null;
            if (!categoryId)
                return (0, responses_1.notFound)(res, "No Category was found.");
            const categorySnippets = yield db_1.default.category.findUnique({
                where: { id: categoryId },
                include: {
                    snippets: {
                        orderBy: { [orderBy]: orderType },
                        take: limit,
                        skip,
                        include: { language: true, category: true },
                        where: {
                            title: { contains: searchParam },
                        }
                    }
                }
            });
            if (!categorySnippets)
                return (0, responses_1.notFound)(res, "No Category was found.");
            const snippets = categorySnippets === null || categorySnippets === void 0 ? void 0 : categorySnippets.snippets;
            return res.status(200).json({
                message: `Snippets of category '${categorySnippets.name}'`,
                status: 200,
                data: snippets
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            const body = req.body;
            const parsedBody = schema_1.categorySchema.create.safeParse(body);
            if (!parsedBody.success) {
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors.",
                    status: 400
                });
            }
            const findCategory = yield db_1.default.category.findFirst({
                where: { name: parsedBody.data.name }
            });
            if (findCategory)
                return res.status(409).json({
                    message: "Category already exists.",
                    status: 409,
                });
            if (!(user === null || user === void 0 ? void 0 : user.trusted))
                return (0, responses_1.unauthorized)(res, "You don't have a trusted user badge to create category. Unauthorized Action");
            const createdCategory = yield db_1.default.category.create({
                data: parsedBody.data
            });
            return res.status(400).json({
                message: "Category has been created.",
                status: 201,
                data: createdCategory,
            });
        });
    }
}
exports.default = CategoryController;
