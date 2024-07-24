"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.conflict = exports.badRequest = exports.notFound = exports.unauthorized = exports.send = void 0;
function send(res, message = "", status = 200) {
    return res.status(status).json({
        message,
        status: status
    });
}
exports.send = send;
function unauthorized(res, message = "Unauthorized.") {
    return res.status(401).json({
        message,
        status: 401
    });
}
exports.unauthorized = unauthorized;
function notFound(res, message = "Error 404 - Not Found.") {
    return res.status(404).json({
        message,
        status: 404
    });
}
exports.notFound = notFound;
function badRequest(res, message = "Something went wrong.") {
    return res.status(500).json({
        message,
        status: 500
    });
}
exports.badRequest = badRequest;
function conflict(res, message = "Something went wrong.") {
    return res.status(409).json({
        message,
        status: 409
    });
}
exports.conflict = conflict;
