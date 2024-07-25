"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.send = send;
exports.unauthorized = unauthorized;
exports.notFound = notFound;
exports.badRequest = badRequest;
exports.conflict = conflict;
function send(res, message = "", status = 200, data, errors) {
    return res.status(status).json({
        message,
        status: status,
        errors,
        data
    });
}
function unauthorized(res, message = "Unauthorized.") {
    return res.status(401).json({
        message,
        status: 401
    });
}
function notFound(res, message = "Error 404 - Not Found.") {
    return res.status(404).json({
        message,
        status: 404
    });
}
function badRequest(res, message = "Something went wrong.") {
    return res.status(400).json({
        message,
        status: 400
    });
}
function conflict(res, message = "Something went wrong.") {
    return res.status(409).json({
        message,
        status: 409
    });
}
