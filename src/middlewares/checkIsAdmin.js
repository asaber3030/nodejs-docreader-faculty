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
exports.checkIsAdmin = void 0;
const responses_1 = require("../utlis/responses");
const AdminController_1 = __importDefault(require("../http/controllers/AdminController"));
function checkIsAdmin(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const isAdmin = yield AdminController_1.default.isAdmin(req);
        if (!isAdmin) {
            return (0, responses_1.unauthorized)(res);
        }
        next();
    });
}
exports.checkIsAdmin = checkIsAdmin;
