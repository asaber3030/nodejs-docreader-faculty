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
const db_1 = __importDefault(require("../../utlis/db"));
const crypto_1 = __importDefault(require("crypto"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const moment_1 = __importDefault(require("moment"));
class Verification {
    static create(userId) {
        return __awaiter(this, void 0, void 0, function* () {
            const number = String(crypto_1.default.randomInt(0, 1000000));
            const hashedCode = yield bcrypt_1.default.hash(number, 10);
            yield db_1.default.userVerificationCode.create({
                data: {
                    userId,
                    plain: number,
                    code: hashedCode,
                    expiresIn: (0, moment_1.default)(moment_1.default.now()).add(30, 'm').toDate()
                }
            });
            return number;
        });
    }
    static verify(userId, code) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield db_1.default.user.findUnique({ where: { id: userId } });
            const hashedCode = yield bcrypt_1.default.hash(code, 10);
            const findCode = yield db_1.default.userVerificationCode.findFirst({
                where: { userId, plain: code }
            });
            if (!findCode)
                return { findCode, hashedCode, user };
            yield db_1.default.user.update({
                where: { id: userId },
                data: { status: true }
            });
            return {};
        });
    }
}
Verification.dbSelectors = { id: true, name: true, status: true, email: true, role: true, facultyId: true, createdAt: true, updatedAt: true };
exports.default = Verification;
