"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.linkSchema = exports.subjectFinalRevision = exports.subjectPractical = exports.subjectLecture = exports.subjectSchema = exports.moduleSchema = exports.studyingYearSchema = exports.facultySchema = exports.userSchema = exports.categorySchema = void 0;
const client_1 = require("@prisma/client");
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
        confirmationPassword: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }),
        facultyId: zod_1.z.number().gt(0),
        yearId: zod_1.z.number().gt(0),
    }).superRefine(({ confirmationPassword, password }, ctx) => {
        if (confirmationPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ['confirmationPassword']
            });
        }
    }),
    createAdmin: zod_1.z.object({
        passcode: zod_1.z.string().min(1, { message: "Passcode Cannot be empty" }),
        name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }),
        email: zod_1.z.string().email({ message: "Invalid Email." }),
        password: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }),
        confirmationPassword: zod_1.z.string().min(8, { message: "Password cannot be less than 8 characters." }),
        facultyId: zod_1.z.number().gt(0),
        yearId: zod_1.z.number().gt(0),
    }).superRefine(({ confirmationPassword, password }, ctx) => {
        if (confirmationPassword !== password) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ['confirmationPassword']
            });
        }
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
        facultyId: zod_1.z.number().gt(0, { message: "facultyId cannot be zero." }),
        yearId: zod_1.z.number().gt(0, { message: "yearId cannot be zero." }),
    }),
    changePassword: zod_1.z.object({
        currentPassword: zod_1.z.string().min(1, { message: "Current password is required." }),
        newPassword: zod_1.z.string().min(8, { message: "New password cannot be less than 8 characters." }),
        confirmationPassword: zod_1.z.string().min(8, { message: "Confirmation Password cannot be less than 8 characters." }),
    }).superRefine(({ confirmationPassword, newPassword }, ctx) => {
        if (confirmationPassword !== newPassword) {
            ctx.addIssue({
                code: "custom",
                message: "The passwords did not match",
                path: ['confirmationPassword']
            });
        }
    }),
};
exports.facultySchema = {
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).min(1, { message: "Title is required" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
        city: zod_1.z.string().min(1, { message: "City is required" }).min(1, { message: "Title is required" }).max(255, { message: "Cannot be greater than 255 characters" }).optional()
    }),
    create: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).min(1, { message: "Title is required" }).max(255, { message: "Cannot be greater than 255 characters" }),
        city: zod_1.z.string().min(1, { message: "City is required" }).min(1, { message: "Title is required" }).max(255, { message: "Cannot be greater than 255 characters" })
    })
};
exports.studyingYearSchema = {
    update: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title is required" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    }),
    create: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title is required" }).max(255, { message: "Cannot be greater than 255 characters" }),
    })
};
exports.moduleSchema = {
    create: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        icon: zod_1.z.string()
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).optional(),
        icon: zod_1.z.any().optional()
    })
};
exports.subjectSchema = {
    create: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }),
        icon: zod_1.z.string()
    }),
    update: zod_1.z.object({
        name: zod_1.z.string().min(1, { message: "Name is required" }).optional(),
        icon: zod_1.z.any().optional()
    })
};
exports.subjectLecture = {
    create: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }),
        subTitle: zod_1.z.string().min(1, { message: "Sub title must be at least 1 character." }),
    }),
    update: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
        subTitle: zod_1.z.string().min(1, { message: "Sub title must be at least 1 character." }).optional(),
    })
};
exports.subjectPractical = {
    create: zod_1.z.object({
        categoryId: zod_1.z.number(),
        title: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }),
        description: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }),
        url: zod_1.z.string().url(),
        type: zod_1.z.enum([client_1.DataType.Data, client_1.DataType.PDF, client_1.DataType.Record, client_1.DataType.Video], { message: "Invalid data typer" }),
    }),
    update: zod_1.z.object({
        categoryId: zod_1.z.number().optional(),
        title: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
        description: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
        url: zod_1.z.string().url().optional(),
        type: zod_1.z.enum([client_1.DataType.Data, client_1.DataType.PDF, client_1.DataType.Record, client_1.DataType.Video], { message: "Invalid data typer" }).optional(),
    })
};
exports.subjectFinalRevision = {
    create: zod_1.z.object({
        categoryId: zod_1.z.number(),
        title: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }),
        description: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }),
        url: zod_1.z.string().url(),
        type: zod_1.z.enum([client_1.DataType.Data, client_1.DataType.PDF, client_1.DataType.Record, client_1.DataType.Video], { message: "Invalid data typer" }),
    }),
    update: zod_1.z.object({
        categoryId: zod_1.z.number().optional(),
        title: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
        description: zod_1.z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
        url: zod_1.z.string().url().optional(),
        type: zod_1.z.enum([client_1.DataType.Data, client_1.DataType.PDF, client_1.DataType.Record, client_1.DataType.Video], { message: "Invalid data typer" }).optional(),
    })
};
exports.linkSchema = {
    create: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title cannot be less than 1 characters." }),
        subTitle: zod_1.z.string().min(1, { message: "Sub Title cannot be less than 1 characters." }),
        url: zod_1.z.string().url(),
        category: zod_1.z.enum([client_1.CategoryType.College, client_1.CategoryType.Data, client_1.CategoryType.Summary], { message: "Invalid category choose from: College, Data, Summary" }),
        type: zod_1.z.enum([client_1.DataType.PDF, client_1.DataType.Record, client_1.DataType.Video, client_1.DataType.Data], { message: "Invalid category choose from: PDF, Video, Record, Data" })
    }),
    update: zod_1.z.object({
        title: zod_1.z.string().min(1, { message: "Title cannot be less than 1 characters." }).optional(),
        subTitle: zod_1.z.string().min(1, { message: "Sub Title cannot be less than 1 characters." }).optional(),
        url: zod_1.z.string().url().optional(),
        category: zod_1.z.enum([client_1.CategoryType.College, client_1.CategoryType.Data, client_1.CategoryType.Summary], { message: "Invalid category choose from: College, Data, Summary" }).optional(),
        type: zod_1.z.enum([client_1.DataType.PDF, client_1.DataType.Record, client_1.DataType.Video, client_1.DataType.Data], { message: "Invalid category choose from: PDF, Video, Record, Data" }).optional()
    })
};
