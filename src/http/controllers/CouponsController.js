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
const Coupon_1 = __importDefault(require("../models/Coupon"));
const db_1 = __importDefault(require("../../utlis/db"));
class CouponsController {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            try {
                const brands = yield Coupon_1.default.all(skip, limit, orderBy, orderType);
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
    static getCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const couponId = req.params.id ? +req.params.id : null;
            if (!couponId)
                return (0, responses_1.notFound)(res);
            const coupon = yield Coupon_1.default.find(couponId);
            if (!coupon) {
                return (0, responses_1.notFound)(res, `This coupon with id ${couponId} wasn't found.`);
            }
            return res.status(200).json({
                data: coupon,
                status: 200
            });
        });
    }
    static updateCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const couponId = +req.params.id;
            try {
                const coupon = yield Coupon_1.default.find(couponId);
                const body = req.body;
                if (!coupon)
                    return (0, responses_1.notFound)(res, "This coupon doesn't exist.");
                const parsedValidations = schema_1.couponSchemas.update.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedValidations);
                if (!parsedValidations.success)
                    return res.status(402).json({ status: 401, errors });
                const updatedCoupon = yield Coupon_1.default.update(coupon.id, parsedValidations.data);
                return res.status(200).json({
                    data: updatedCoupon,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Coupon ID.");
            }
        });
    }
    static deleteCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const couponId = +req.params.id;
            try {
                const coupon = yield Coupon_1.default.find(couponId);
                if (!coupon)
                    return (0, responses_1.notFound)(res, "This brand doesn't exist.");
                const deletedCoupon = yield Coupon_1.default.delete(coupon.id);
                return res.status(200).json({
                    data: deletedCoupon,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Coupon ID.");
            }
        });
    }
    static createCoupon(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const body = req.body;
                const parsedValidations = schema_1.couponSchemas.create.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedValidations);
                if (!parsedValidations.success)
                    return res.status(402).json({ status: 401, errors });
                const data = parsedValidations.data;
                const findCoupon = yield db_1.default.coupon.findFirst({
                    where: { coupon: data.coupon }
                });
                if (findCoupon)
                    return res.status(409).json({ message: "This coupon already exists.", status: 409 });
                const createdCoupon = yield Coupon_1.default.create(data);
                return res.status(201).json({
                    data: createdCoupon,
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
}
exports.default = CouponsController;
