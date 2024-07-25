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
exports.checkIsAuthenticated = checkIsAuthenticated;
const responses_1 = require("../utlis/responses");
const helpers_1 = require("../utlis/helpers");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const AuthController_1 = __importDefault(require("../http/controllers/AuthController"));
const User_1 = __importDefault(require("../http/models/User"));
function checkIsAuthenticated(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const token = (0, helpers_1.extractToken)(req.headers.authorization);
        if (!token)
            return (0, responses_1.unauthorized)(res);
        try {
            const verifiedToken = jsonwebtoken_1.default.verify(token, AuthController_1.default.secret);
            const findUser = yield User_1.default.find(verifiedToken.id);
            if (!findUser)
                return (0, responses_1.unauthorized)(res);
            next();
        }
        catch (err) {
            return (0, responses_1.unauthorized)(res, (err === null || err === void 0 ? void 0 : err.message) ? "Invalid JWT" : "Unauthorized");
        }
    });
}
