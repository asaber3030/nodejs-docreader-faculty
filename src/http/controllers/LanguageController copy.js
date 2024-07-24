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
class LanguageController {
    get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const { limit, orderBy, orderType, skip } = (0, helpers_1.createPagination)(req, true);
            if (limit) {
                const languages = yield db_1.default.language.findMany({
                    orderBy: { [orderBy]: orderType },
                    skip,
                    take: limit,
                });
                return res.status(200).json({
                    message: "User languages",
                    status: 200,
                    data: languages
                });
            }
            const languages = yield db_1.default.language.findMany({
                orderBy: { [orderBy]: orderType },
            });
            return res.status(200).json({
                message: "Languages",
                status: 200,
                data: languages
            });
        });
    }
    create(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield UserController_1.default.user(req);
            if (!user)
                return (0, responses_1.unauthorized)(res);
            const body = req.body;
            const parsedBody = schema_1.languageSchema.create.safeParse(body);
            if (!parsedBody.success) {
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                return res.status(400).json({
                    errors,
                    message: "Form validation errors.",
                    status: 400
                });
            }
            const findLanguage = yield db_1.default.language.findFirst({
                where: { name: parsedBody.data.name }
            });
            if (findLanguage)
                return res.status(409).json({
                    message: "Language is already exists.",
                    status: 409,
                });
            if (!user.trusted)
                return (0, responses_1.unauthorized)(res, "You don't have a trusted user badge to create Language. Unauthorized Action");
            const createdLanguage = yield db_1.default.language.create({
                data: Object.assign({}, parsedBody.data)
            });
            return res.status(400).json({
                message: "Language has been created.",
                status: 201,
                data: createdLanguage,
            });
        });
    }
}
exports.default = LanguageController;
