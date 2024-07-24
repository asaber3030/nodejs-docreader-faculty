"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const LanguageController_1 = __importDefault(require("../http/controllers/LanguageController"));
const languageRouter = (0, express_1.Router)();
const controller = new LanguageController_1.default();
languageRouter.get('/languages', controller.get);
languageRouter.get('/languages/:languageId/snippets', controller.getSnippets);
languageRouter.post('/languages/create', controller.create);
exports.default = languageRouter;
