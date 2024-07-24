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
class Faculty {
    static findAll(search = '', orderBy = 'id', orderType = 'desc') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.default.faculty.findMany({
                    where: {
                        OR: [
                            { name: { contains: search } }
                        ]
                    },
                    select: Faculty.dbSelectors,
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
            return yield db_1.default.faculty.findUnique({
                where: { id },
                select: select ? select : Faculty.dbSelectors
            });
        });
    }
    static paginate(search = '', skip = 0, take = 10, orderBy = 'id', orderType = 'desc') {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                return yield db_1.default.faculty.findMany({
                    where: {
                        OR: [
                            { name: { contains: search } }
                        ]
                    },
                    select: Faculty.dbSelectors,
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
Faculty.dbSelectors = { id: true, name: true, city: true, createdAt: true, updatedAt: true };
exports.default = Faculty;
