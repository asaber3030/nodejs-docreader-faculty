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
class User {
    static findAll(search = '', orderBy = 'id', orderType = 'desc') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.default.user.findMany({
                    where: {
                        OR: [
                            { name: { contains: search } },
                            { email: { contains: search } }
                        ]
                    },
                    select: User.dbSelectors,
                    orderBy: {
                        [orderBy]: orderType
                    }
                });
            }
            catch (error) {
                return [];
            }
        });
    }
    static find(id, select = null) {
        return __awaiter(this, void 0, void 0, function* () {
            return yield db_1.default.user.findUnique({
                where: { id },
                select: select ? select : User.dbSelectors
            });
        });
    }
    static findBy(value, by = 'email') {
        return __awaiter(this, void 0, void 0, function* () {
            switch (by) {
                case 'email':
                    return yield db_1.default.user.findUnique({ where: { email: value } });
                default:
                    return yield db_1.default.user.findUnique({ where: { email: value } });
            }
        });
    }
    static paginate(search = '', skip = 0, take = 10, orderBy = 'id', orderType = 'desc') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.default.user.findMany({
                    where: {
                        OR: [
                            { name: { contains: search } },
                            { email: { contains: search } }
                        ]
                    },
                    select: User.dbSelectors,
                    skip,
                    take,
                    orderBy: {
                        [orderBy]: orderType
                    }
                });
            }
            catch (error) {
                return [];
            }
        });
    }
}
User.dbSelectors = { id: true, name: true, status: true, email: true, role: true, facultyId: true, createdAt: true, updatedAt: true };
exports.default = User;
