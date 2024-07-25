"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.showAppURLCMD = showAppURLCMD;
exports.extractErrors = extractErrors;
exports.extractToken = extractToken;
exports.createPagination = createPagination;
exports.generateId = generateId;
exports.parameterExists = parameterExists;
const constants_1 = require("./constants");
function showAppURLCMD(port) {
    console.log(`Server running at PORT: http://localhost:${port}`);
}
function extractErrors(errors) {
    var _a;
    return (_a = errors.error) === null || _a === void 0 ? void 0 : _a.flatten().fieldErrors;
}
function extractToken(authorizationHeader) {
    if (authorizationHeader) {
        const splitted = authorizationHeader.split(' ');
        if (splitted[1])
            return splitted[1];
    }
    return '';
}
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
function parameterExists(request, response, incomingParam, message) {
    const param = request.params[incomingParam] ? +request.params[incomingParam] : null;
    if (!param)
        return;
    return param;
}
