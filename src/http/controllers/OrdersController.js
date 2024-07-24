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
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const db_1 = __importDefault(require("../../utlis/db"));
class OrdersController {
    static get(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const { skip, limit, orderBy, orderType } = (0, helpers_1.createPagination)(req);
            const orders = yield Order_1.default.all(skip, limit, orderBy, orderType);
            return res.status(200).json({
                status: 200,
                data: orders
            });
        });
    }
    static getOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id ? +req.params.id : null;
            if (!orderId) {
                return (0, responses_1.notFound)(res);
            }
            const order = yield Order_1.default.find(orderId);
            if (!order) {
                return (0, responses_1.notFound)(res, `This order with id ${orderId} wasn't found.`);
            }
            return res.status(200).json({
                data: order
            });
        });
    }
    static getOrderItems(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = req.params.id ? +req.params.id : null;
            if (!orderId) {
                return (0, responses_1.notFound)(res);
            }
            const order = yield Order_1.default.find(orderId);
            const items = yield Order_1.default.findItems(orderId);
            if (!order) {
                return (0, responses_1.notFound)(res, `This order with id ${orderId} wasn't found.`);
            }
            return res.status(200).json({
                data: items,
                status: 200
            });
        });
    }
    static getOrderOwner(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const order = yield db_1.default.order.findUnique({
                    where: { id: +req.params.id }
                });
                if (!order)
                    return (0, responses_1.notFound)(res, "This order doesn't exists.");
                const user = yield User_1.default.find(order.userId);
                return res.status(200).json({
                    data: user,
                    status: 200
                });
            }
            catch (err) {
                return (0, responses_1.badRequest)(res, "Invalid order ID.");
            }
        });
    }
    static updateOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = +req.params.id;
            try {
                const order = yield Order_1.default.find(orderId);
                const body = req.body;
                if (!order)
                    return (0, responses_1.notFound)(res, "This order doesn't exist.");
                const parsedData = schema_1.orderSchemas.update.safeParse(body);
                const errors = (0, helpers_1.extractErrors)(parsedData);
                if (!parsedData.success)
                    return res.status(402).json({ status: 401, errors });
                const updatedOrder = yield Order_1.default.update(order.id, parsedData.data);
                return res.status(200).json({
                    data: updatedOrder,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Order ID.");
            }
        });
    }
    static deleteOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            const orderId = +req.params.id;
            try {
                const order = yield Order_1.default.find(orderId);
                if (!order)
                    return (0, responses_1.notFound)(res, "This order doesn't exist.");
                const deletedOrder = yield Order_1.default.delete(order.id);
                return res.status(200).json({
                    data: deletedOrder,
                    status: 200
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Invalid Order ID.");
            }
        });
    }
    static createOrder(req, res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const parsedData = schema_1.orderSchemas.create.safeParse(req.body);
                const errors = (0, helpers_1.extractErrors)(parsedData);
                if (!parsedData.success)
                    return res.status(402).json({ status: 401, errors });
                let generetedCode = (0, helpers_1.generateOrderId)();
                const findOrder = yield db_1.default.order.findUnique({ where: { code: generetedCode }, select: { id: true } });
                const data = parsedData.data;
                const coupon = yield db_1.default.coupon.findUnique({ where: { id: data.couponId } });
                const user = yield db_1.default.user.findUnique({ where: { id: data.userId } });
                if (!coupon)
                    return (0, responses_1.notFound)(res, "Coupon with provided id doesn't exist.");
                if (!user)
                    return (0, responses_1.notFound)(res, "User with provided id doesn't exist.");
                if (!coupon.active)
                    return res.status(401).json({ message: "This coupon is currently inactive." });
                if (coupon.usages === 0)
                    return res.status(401).json({ message: "This coupon usages times is currently '0'. cannot use it anymore." });
                yield db_1.default.coupon.update({
                    where: { id: coupon.id },
                    data: { usages: coupon.usages === 0 ? coupon.usages : coupon.usages - 1 }
                });
                while (findOrder) {
                    generetedCode = (0, helpers_1.generateOrderId)();
                }
                const createdOrder = yield db_1.default.order.create({
                    data: {
                        status: data.status,
                        subTotal: data.subTotal,
                        total: data.total,
                        discountValue: data.discountValue,
                        deliveryTaxes: data.deliveryTaxes,
                        userId: data.userId,
                        couponId: data.couponId,
                        deliverIn: data.deliverIn,
                        code: generetedCode,
                    }
                });
                try {
                    data.items.forEach((item) => __awaiter(this, void 0, void 0, function* () {
                        const newItem = yield db_1.default.orderItem.create({
                            data: Object.assign(Object.assign({}, item), { orderId: createdOrder.id })
                        });
                    }));
                }
                catch (_a) {
                    return (0, responses_1.notFound)(res, "Please check productId, and orderId.");
                }
                return res.status(201).json({
                    data: createdOrder,
                    status: 201
                });
            }
            catch (error) {
                return (0, responses_1.badRequest)(res, "Something went wrong.");
            }
        });
    }
}
exports.default = OrdersController;
