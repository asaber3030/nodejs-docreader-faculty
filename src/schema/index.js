"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.facultySchema = exports.userSchema = exports.categorySchema = void 0;
const zod_1 = require("zod");
exports.categorySchema = {
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        keywords: zod_1.z.string().min(1, { message: "Keywords is required. Separate them with ',' " }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        icon: zod_1.z.string().url({ message: "Icon must be a URL." })
    }),
    create: zod_1.z.object({
        name: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }),
        keywords: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }),
        icon: zod_1.z.string().url({ message: "Icon must be a URL." }).optional()
    })
};
exports.userSchema = {
    login: zod_1.z.object({
        email: zod_1.z.string().email({ message: "Email is required." }),
        password: zod_1.z.string()
    }),
    register: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }),
        email: zod_1.z.string().email({ message: "Invalid Email." }),
        password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }),
        facultyId: zod_1.z.number().gt(0)
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
        email: zod_1.z.string().email({ message: "Invalid Email." }).optional(),
        password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
        facultyId: zod_1.z.number().gt(0).optional()
    })
};
exports.facultySchema = {
    update: zod_1.z.object({
        name: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        city: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional()
    }),
    create: zod_1.z.object({
        name: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" }),
        city: zod_1.z.string().max(255, { message: "Cannot be greater than 255 characters" })
    })
};
