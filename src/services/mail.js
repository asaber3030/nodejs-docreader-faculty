"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const nodemailer_1 = __importDefault(require("nodemailer"));
const mail = nodemailer_1.default.createTransport({
    host: 'sandbox.smtp.mailtrap.io',
    port: 587,
    secure: false,
    auth: {
        user: 'e0a08ee4c206dc',
        pass: '47209292824906',
    }
});
exports.default = mail;
