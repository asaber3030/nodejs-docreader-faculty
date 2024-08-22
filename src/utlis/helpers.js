"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.parameterExists = exports.generateId = exports.createPagination = exports.extractToken = exports.extractErrors = exports.showAppURLCMD = exports.currentDate = void 0;
const constants_1 = require("./constants");
const moment_1 = __importDefault(require("moment"));
function currentDate() {
    return new Date((0, moment_1.default)().add(3, 'hour').format());
}
exports.currentDate = currentDate;
function showAppURLCMD(port) {
    console.log(`Server running at PORT: http://localhost:${port}`);
}
exports.showAppURLCMD = showAppURLCMD;
function extractErrors(errors) {
    var _a;
    return (_a = errors.error) === null || _a === void 0 ? void 0 : _a.flatten().fieldErrors;
}
exports.extractErrors = extractErrors;
function extractToken(authorizationHeader) {
    if (authorizationHeader) {
        const splitted = authorizationHeader.split(' ');
        if (splitted[1])
            return splitted[1];
    }
    return '';
}
exports.extractToken = extractToken;
function createPagination(req, skipLimit = false) {
    var _a, _b;
    const page = req.query.page ? +req.query.page : 1;
    const limit = req.query.limit ? +req.query.limit : (skipLimit ? null : constants_1.TAKE_LIMIT);
    const orderBy = (_a = req.query.orderBy) !== null && _a !== void 0 ? _a : 'id';
    const orderType = (_b = req.query.orderType) !== null && _b !== void 0 ? _b : 'desc';
    let skip = 0;
    if (limit) {
        skip = (page - 1) * (skipLimit ? 0 : limit);
    }
    return {
        orderBy: orderBy,
        orderType: orderType,
        skip,
        limit,
        page
    };
}
exports.createPagination = createPagination;
function generateId(min = 999, max = 9999) {
    min = Math.ceil(min);
    max = Math.floor(max);
    const num1 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num2 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num3 = Math.floor(Math.random() * (max - min + 1)) + min;
    const num4 = Math.floor(Math.random() * (max - min + 1)) + min;
    // Return: 0000-0000-0000-0000
    return num1.toString().padStart(4, "0") + '-' + num2.toString().padStart(4, "0") + '-' + num3.toString().padStart(4, "0") + '-' + num4.toString().padStart(4, "0");
}
exports.generateId = generateId;
function parameterExists(request, response, incomingParam) {
    const param = request.params[incomingParam] ? +request.params[incomingParam] : null;
    if (!param)
        return undefined;
    return param;
}
exports.parameterExists = parameterExists;
