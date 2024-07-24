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
class SnippetController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.notFound)(res, "No User was found");
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            const searchParam = req.query.search ? req.query.search : '';
            const snippets = yield db_1.default.snippet.findMany({
                where: { userId: user.id, title: { contains: searchParam } },
                orderBy: { [orderBy]: orderType },
                include: { language: true, category: { select: { name: true, keywords: true, icon: true, id: true } } },
                skip,
                take: limit
            });
            return res.status(200).json({
                message: "My Snippets data",
                status: 200,
                data: snippets
            });
        });
    }
    getFavourites(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.notFound)(res, "No User was found");
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            const searchParam = req.query.search ? req.query.search : '';
            const snippets = yield db_1.default.snippet.findMany({
                where: { userId: user.id, favourite: true, title: { contains: searchParam } },
                orderBy: { [orderBy]: orderType },
                include: { language: true, category: { select: { name: true, keywords: true, icon: true, id: true } } },
                skip,
                take: limit
            });
            return res.status(200).json({
                message: "My Snippets data",
                status: 200,
                data: snippets
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const body = req.body;
            const parsedBody = schema_1.snippetSchema.create.safeParse(body);
            if (!parsedBody.success) {
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors.",
                    status: 400
                });
            }
            const findLanguage = yield db_1.default.language.findUnique({ where: { id: parsedBody.data.languageId } });
            const findCategory = yield db_1.default.category.findUnique({ where: { id: parsedBody.data.categoryId } });
            if (!findLanguage)
                return (0, responses_1.notFound)(res, "No language was found.");
            if (!findCategory)
                return (0, responses_1.notFound)(res, "No category was found.");
            const createdSnippet = yield db_1.default.snippet.create({
                data: Object.assign(Object.assign({}, parsedBody.data), { userId: user.id })
            });
            return res.status(400).json({
                message: "Snippet has been created.",
                status: 201,
                data: createdSnippet,
            });
        });
    }
    update(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const snippetId = req.params.snippetId ? +req.params.snippetId : null;
            if (!snippetId)
                return (0, responses_1.notFound)(res, "Snippet doesn't exist.");
            const snippet = yield db_1.default.snippet.findUnique({ where: { id: snippetId } });
            if (!snippet)
                return (0, responses_1.notFound)(res, "Snippet doesn't exist.");
            const body = req.body;
            const parsedBody = schema_1.snippetSchema.update.safeParse(body);
            if (!parsedBody.success) {
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors.",
                    status: 400
                });
            }
            const findLanguage = yield db_1.default.language.findUnique({ where: { id: parsedBody.data.languageId } });
            const findCategory = yield db_1.default.category.findUnique({ where: { id: parsedBody.data.categoryId } });
            if (!findLanguage)
                return (0, responses_1.notFound)(res, "No language was found.");
            if (!findCategory)
                return (0, responses_1.notFound)(res, "No category was found.");
            const updatedSnippet = yield db_1.default.snippet.update({
                where: { id: snippet.id },
                data: Object.assign(Object.assign({}, parsedBody.data), { userId: user.id })
            });
            return res.status(400).json({
                message: "Snippet has been updated.",
                status: 201,
                data: updatedSnippet,
            });
        });
    }
    delete(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const snippetId = req.params.snippetId ? +req.params.snippetId : null;
            if (!snippetId)
                return (0, responses_1.notFound)(res, "Snippet doesn't exist.");
            const snippet = yield db_1.default.snippet.findUnique({ where: { id: snippetId } });
            if (!snippet)
                return res.status(404).json({ message: "Snippet doesn't exist", status: 404 });
            const deletedSnippet = yield db_1.default.snippet.delete({
                where: { id: snippetId }
            });
            return res.status(200).json({
                message: "Snippet has been deleted successfully.",
                status: 200,
                data: deletedSnippet
            });
        });
    }
    getSnippet(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const snippetId = req.params.snippetId ? +req.params.snippetId : null;
            if (!snippetId)
                return (0, responses_1.notFound)(res, "Snippet doesn't exist.");
            const snippet = yield db_1.default.snippet.findUnique({ where: { id: snippetId }, include: { language: true, category: true } });
            if (!snippet)
                return res.status(404).json({ message: "Snippet doesn't exist", status: 404 });
            return res.status(200).json({
                message: "Snippet data.",
                status: 200,
                data: snippet
            });
        });
    }
}
exports.default = SnippetController;
