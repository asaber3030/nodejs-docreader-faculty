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
const db_1 = __importDefault(require("../../utlis/db"));
const Product_1 = __importDefault(require("../models/Product"));
class ProductsController {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const searchParam = req.query.search ? req.query.search : '';
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            try {
                const products = yield Product_1.default.all(searchParam, skip, limit, orderBy, orderType);
                return res.status(200).json({
                    status: 200,
                    data: products
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid search parameters.");
            }
        });
    }
    static getProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id ? +req.params.id : null;
            if (!productId)
                return (0, responses_1.notFound)(res);
            const product = yield Product_1.default.find(productId);
            if (!product) {
                return (0, responses_1.notFound)(res, `This product with id ${productId} wasn't found.`);
            }
            return res.status(200).json({
                data: product,
                status: 200
            });
        });
    }
    static getProductPictures(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id ? +req.params.id : null;
            if (!productId)
                return (0, responses_1.notFound)(res);
            const product = yield db_1.default.product.findUnique({
                where: { id: productId },
                select: { id: true, pictures: true }
            });
            if (!product)
                return (0, responses_1.notFound)(res, "No product was found.");
            return res.status(200).json({
                data: product.pictures,
                status: 200
            });
        });
    }
    static getProductBrand(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id ? +req.params.id : null;
            if (!productId)
                return (0, responses_1.notFound)(res);
            const product = yield db_1.default.product.findUnique({
                where: { id: productId },
                select: { id: true, brandId: true }
            });
            if (!product)
                return (0, responses_1.notFound)(res, "No product was found.");
            const brand = yield db_1.default.brand.findUnique({ where: { id: product.brandId } });
            return res.status(200).json({
                data: brand,
                status: 200
            });
        });
    }
    static getProductCategory(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = req.params.id ? +req.params.id : null;
            if (!productId)
                return (0, responses_1.notFound)(res);
            const product = yield db_1.default.product.findUnique({
                where: { id: productId },
                select: { id: true, categoryId: true }
            });
            if (!product)
                return (0, responses_1.notFound)(res, "No product was found.");
            const category = yield db_1.default.category.findUnique({ where: { id: product.categoryId } });
            return res.status(200).json({
                data: category,
                status: 200
            });
        });
    }
    static updateProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = +req.params.id;
            try {
                const product = yield Product_1.default.find(productId);
                const body = req.body;
                if (!product)
                    return (0, responses_1.notFound)(res, "This product doesn't exist.");
                const parsedBody = schema_1.productSchemas.update.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                if (!parsedBody.success)
                    return res.status(402).json({ status: 401, errors });
                const updatedProduct = yield Product_1.default.update(product.id, parsedBody.data);
                return res.status(200).json({
                    data: updatedProduct,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong. Check brandId, categoryId or productId");
            }
        });
    }
    static deleteProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const productId = +req.params.id;
            try {
                const product = yield Product_1.default.find(productId);
                if (!product)
                    return (0, responses_1.notFound)(res, "This product doesn't exist.");
                const deleteProduct = yield Product_1.default.delete(product.id);
                return res.status(200).json({
                    data: deleteProduct,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Product ID.");
            }
        });
    }
    static createProduct(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const parsedBody = schema_1.productSchemas.create.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                const data = parsedBody.data;
                if (!parsedBody.success)
                    return res.status(402).json({ status: 401, errors });
                if (!data)
                    return (0, responses_1.badRequest)(res);
                const brand = yield db_1.default.brand.findUnique({ where: { id: data.brandId } });
                const category = yield db_1.default.category.findUnique({ where: { id: data.categoryId } });
                if (!brand)
                    return (0, responses_1.notFound)(res, "Brand with provided id doesn't exist");
                if (!category)
                    return (0, responses_1.notFound)(res, "Category with provided id doesn't exist");
                const createdProduct = yield Product_1.default.create(data);
                return res.status(201).json({
                    data: createdProduct,
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, error);
            }
        });
    }
    static createProductPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const parsedBody = schema_1.productPictureSchema.create.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                const data = parsedBody.data;
                const productId = +req.params.id;
                if (!parsedBody.success)
                    return res.status(402).json({ status: 401, errors });
                if (!data || !productId)
                    return (0, responses_1.badRequest)(res);
                const product = yield Product_1.default.find(productId);
                if (!product)
                    return (0, responses_1.notFound)(res, "This product doesn't exist.");
                const createdPicture = yield db_1.default.productPicture.create({
                    data: {
                        productId: product.id,
                        url: data.url
                    }
                });
                return res.status(201).json({
                    data: createdPicture,
                    message: "Product picture hass been added",
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
    static updateProductPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedBody = schema_1.productPictureSchema.create.safeParse(req.body);
                const errors = (0, helpers_1.extractErrors)(parsedBody);
                const data = parsedBody.data;
                const productId = +req.params.id;
                const pictureId = +req.params.pictureId;
                if (!parsedBody.success)
                    return res.status(402).json({ status: 401, errors });
                if (!data || !productId || !pictureId)
                    return (0, responses_1.badRequest)(res);
                const product = yield Product_1.default.find(productId);
                const picture = yield db_1.default.productPicture.findUnique({ where: { id: pictureId } });
                if (!product)
                    return (0, responses_1.notFound)(res, "This product doesn't exist.");
                if (!picture || product.id !== picture.productId)
                    return (0, responses_1.notFound)(res, "This picture doesn't exist.");
                const updatedPicture = yield db_1.default.productPicture.update({
                    where: { id: picture.id },
                    data: {
                        productId: product.id,
                        url: data.url
                    }
                });
                return res.status(200).json({
                    data: updatedPicture,
                    message: "Product picture hass been updated",
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
    static deleteProductPicture(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const productId = +req.params.id;
                const pictureId = +req.params.pictureId;
                if (!productId || !pictureId)
                    return (0, responses_1.badRequest)(res);
                const product = yield Product_1.default.find(productId);
                const picture = yield db_1.default.productPicture.findUnique({ where: { id: pictureId } });
                if (!product)
                    return (0, responses_1.notFound)(res, "This product doesn't exist.");
                if (!picture || product.id !== picture.productId)
                    return (0, responses_1.notFound)(res, "This picture doesn't exist.");
                const deletedPicture = yield db_1.default.productPicture.delete({
                    where: { id: picture.id }
                });
                return res.status(200).json({
                    data: deletedPicture,
                    message: "Product picture hass been deleted.",
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
}
exports.default = ProductsController;
