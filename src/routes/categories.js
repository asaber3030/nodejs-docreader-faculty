"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const CategoryController_1 = __importDefault(require("../http/controllers/CategoryController"));
const categoryRouter = (0, express_1.Router)();
const controller = new CategoryController_1.default();
categoryRouter.get('/categories', controller.get);
categoryRouter.get('/categories/:categoryId/snippets', controller.getSnippets);
categoryRouter.post('/categories/create', controller.create);
exports.default = categoryRouter;
