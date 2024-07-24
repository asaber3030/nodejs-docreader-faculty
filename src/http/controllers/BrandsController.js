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
const helpers_1 = require("../../utlis/helpers");
const responses_1 = require("../../utlis/responses");
const schema_1 = require("../../schema");
const Brand_1 = __importDefault(require("../models/Brand"));
const db_1 = __importDefault(require("../../utlis/db"));
class BrandsController {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            try {
                const brands = yield Brand_1.default.all(skip, limit, orderBy, orderType);
                return res.status(200).json({
                    status: 200,
                    data: brands
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid search parameters.");
            }
        });
    }
    static getBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const brandId = req.params.id ? +req.params.id : null;
            if (!brandId)
                return (0, responses_1.notFound)(res);
            const brand = yield Brand_1.default.find(brandId);
            if (!brand) {
                return (0, responses_1.notFound)(res, `This brand with id ${brandId} wasn't found.`);
            }
            return res.status(200).json({
                data: brand,
                status: 200
            });
        });
    }
    static getBrandProducts(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const brandId = req.params.id ? +req.params.id : null;
            if (!brandId)
                return (0, responses_1.notFound)(res);
            const brand = yield Brand_1.default.find(brandId);
            const products = yield Brand_1.default.products(brandId);
            if (!brand) {
                return (0, responses_1.notFound)(res, `This brand with id ${brandId} wasn't found.`);
            }
            return res.status(200).json({
                data: products,
                status: 200
            });
        });
    }
    static updateBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const brandId = +req.params.id;
            try {
                const brand = yield Brand_1.default.find(brandId);
                const body = req.body;
                if (!brand)
                    return (0, responses_1.notFound)(res, "This brand doesn't exist.");
                const parsedValidations = schema_1.brandSchemas.update.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedValidations);
                if (!parsedValidations.success)
                    return res.status(402).json({ status: 401, errors });
                const updatedBrand = yield Brand_1.default.update(brand.id, parsedValidations.data);
                return res.status(200).json({
                    data: updatedBrand,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Brand ID.");
            }
        });
    }
    static deleteBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const brandId = +req.params.id;
            try {
                const brand = yield Brand_1.default.find(brandId);
                if (!brand)
                    return (0, responses_1.notFound)(res, "This brand doesn't exist.");
                const deletedBrand = yield Brand_1.default.delete(brand.id);
                return res.status(200).json({
                    data: deletedBrand,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Brand ID.");
            }
        });
    }
    static createBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const parsedValidations = schema_1.brandSchemas.create.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedValidations);
                if (!parsedValidations.success)
                    return res.status(402).json({ status: 401, errors });
                const data = parsedValidations.data;
                const findBrand = yield db_1.default.brand.findFirst({
                    where: { name: data.name }
                });
                if (findBrand)
                    return res.status(409).json({ message: "This brand already exists.", status: 409 });
                const createdBrand = yield Brand_1.default.create(data);
                return res.status(201).json({
                    data: createdBrand,
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
}
exports.default = BrandsController;
