import { CategoryType, DataType, LectureType } from "@prisma/client";
import { z } from "zod";

export const categorySchema = {
  update: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .max(255, { message: "Cannot be greater than 255 characters" })
      .optional(),
    keywords: z
      .string()
      .trim()
      .min(1, { message: "Keywords is required. Separate them with ',' " })
      .max(255, { message: "Cannot be greater than 255 characters" })
      .optional(),
    icon: z.string().url({ message: "Icon must be a URL." }).optional(),
  }),

  create: z.object({
    name: z
      .string()
      .trim()
      .max(255, { message: "Cannot be greater than 255 characters" }),
    keywords: z
      .string()
      .max(255, { message: "Cannot be greater than 255 characters" }),
    icon: z.string().url({ message: "Icon must be a URL." }).optional(),
  }),
};

export const userSchema = {
  login: z.object({
    email: z.string().trim().email({ message: "Email is required." }),
    password: z.string(),
  }),

  register: z
    .object({
      name: z
        .string()
        .trim()
        .min(1, { message: "Name cannot be less than 1 characters." }),
      email: z.string().trim().email({ message: "Invalid Email." }),
      password: z
        .string()
        .min(8, { message: "Password cannot be less than 8 characters." }),
      confirmationPassword: z
        .string()
        .min(8, { message: "Password cannot be less than 8 characters." }),
      facultyId: z.number().gt(0),
      yearId: z.number().gt(0),
    })
    .superRefine(({ confirmationPassword, password }, ctx) => {
      if (confirmationPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmationPassword"],
        });
      }
    }),

  createAdmin: z
    .object({
      passcode: z.string().min(1, { message: "Passcode Cannot be empty" }),
      name: z
        .string()
        .trim()
        .min(1, { message: "Name cannot be less than 1 characters." }),
      email: z.string().trim().email({ message: "Invalid Email." }),
      password: z
        .string()
        .min(8, { message: "Password cannot be less than 8 characters." }),
      confirmationPassword: z
        .string()
        .min(8, { message: "Password cannot be less than 8 characters." }),
      facultyId: z.number().gt(0),
      yearId: z.number().gt(0),
    })
    .superRefine(({ confirmationPassword, password }, ctx) => {
      if (confirmationPassword !== password) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmationPassword"],
        });
      }
    }),

  update: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name cannot be less than 1 characters." })
      .optional(),
    facultyId: z
      .number()
      .gt(0, { message: "facultyId cannot be zero." })
      .optional(),
    yearId: z.number().gt(0, { message: "yearId cannot be zero." }).optional(),
  }),

  changePassword: z
    .object({
      currentPassword: z
        .string()
        .min(1, { message: "Current password is required." }),
      newPassword: z
        .string()
        .min(8, { message: "New password cannot be less than 8 characters." }),
      confirmationPassword: z.string().min(8, {
        message: "Confirmation Password cannot be less than 8 characters.",
      }),
    })
    .superRefine(({ confirmationPassword, newPassword }, ctx) => {
      if (confirmationPassword !== newPassword) {
        ctx.addIssue({
          code: "custom",
          message: "The passwords did not match",
          path: ["confirmationPassword"],
        });
      }
    }),

  registerDevice: z.object({
    token: z.string(),
  }),
};

export const facultySchema = {
  update: z.object({
    name: z
      .string()
      .trim()
      .min(1, { message: "Name is required" })
      .min(1, { message: "Title is required" })
      .max(255, { message: "Cannot be greater than 255 characters" })
      .optional(),
    city: z
      .string()
      .min(1, { message: "City is required" })
      .min(1, { message: "Title is required" })
      .max(255, { message: "Cannot be greater than 255 characters" })
      .optional(),
  }),

  create: z.object({
    name: z
      .string()
      .min(1, { message: "Name is required" })
      .min(1, { message: "Title is required" })
      .max(255, { message: "Cannot be greater than 255 characters" }),
    city: z
      .string()
      .min(1, { message: "City is required" })
      .min(1, { message: "Title is required" })
      .max(255, { message: "Cannot be greater than 255 characters" }),
  }),
};

export const studyingYearSchema = {
  update: z.object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(255, { message: "Cannot be greater than 255 characters" })
      .optional(),
  }),

  create: z.object({
    title: z
      .string()
      .min(1, { message: "Title is required" })
      .max(255, { message: "Cannot be greater than 255 characters" }),
  }),
};

export const moduleSchema = {
  create: z.object({
    yearId: z.number(),
    name: z.string().min(1, { message: "Name is required" }),
    icon: z.string(),
    semesterName: z
      .number()
      .min(0, { message: "Semester cannot be less than 1" }),
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    icon: z.any().optional(),
    semesterName: z
      .number()
      .min(0, { message: "Semester cannot be less than 1" })
      .optional(),
  }),
};

export const subjectSchema = {
  create: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    icon: z.string(),
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    icon: z.any().optional(),
    moduleId: z.number().optional(),
  }),
};

export const subjectLecture = {
  create: z.object({
    title: z
      .string()
      .min(1, { message: "Title must be at least 1 character." }),
    subTitle: z
      .string()
      .min(1, { message: "Sub title must be at least 1 character." })
      .optional(),
    date: z.coerce.date({ message: "Please provide a date" }),
    type: z.enum(
      [LectureType.Normal, LectureType.Practical, LectureType.FinalRevision],
      {
        message:
          "Only support this types: 'Normal', 'Practical', 'FinalRevision'",
      }
    ),
    subjectId: z.number(),
  }),

  update: z.object({
    title: z
      .string()
      .min(1, { message: "Title must be at least 1 character." })
      .optional(),
    subTitle: z
      .string()
      .min(1, { message: "Sub title must be at least 1 character." })
      .optional(),
    date: z.coerce.date({ message: "Please provide a date" }).optional(),
    type: z
      .enum(
        [LectureType.Normal, LectureType.Practical, LectureType.FinalRevision],
        {
          message:
            "Only support this types: 'Normal', 'Practical', 'FinalRevision'",
        }
      )
      .optional(),
    subjectId: z.number().optional(),
  }),
};

export const linkSchema = {
  create: z.object({
    title: z
      .string()
      .min(1, { message: "Title cannot be less than 1 characters." }),
    subTitle: z
      .string()
      .min(1, { message: "Sub Title cannot be less than 1 characters." })
      .optional(),
    url: z.string().url(),
    category: z.enum(
      [CategoryType.College, CategoryType.Data, CategoryType.Summary],
      { message: "Invalid category choose from: College, Data, Summary" }
    ),
    type: z.enum(
      [DataType.PDF, DataType.Record, DataType.Video, DataType.Data],
      { message: "Invalid category choose from: PDF, Video, Record, Data" }
    ),
  }),

  update: z.object({
    title: z
      .string()
      .min(1, { message: "Title cannot be less than 1 characters." })
      .optional(),
    subTitle: z
      .string()
      .min(1, { message: "Sub Title cannot be less than 1 characters." })
      .optional(),
    url: z.string().url().optional(),
    category: z
      .enum([CategoryType.College, CategoryType.Data, CategoryType.Summary], {
        message: "Invalid category choose from: College, Data, Summary",
      })
      .optional(),
    type: z
      .enum([DataType.PDF, DataType.Record, DataType.Video, DataType.Data], {
        message: "Invalid category choose from: PDF, Video, Record, Data",
      })
      .optional(),
    lectureId: z.number().optional(),
  }),
};

export const notificationSchema = {
  notify: z.object({
    links: z.array(z.number()),
  }),
  ignore: z.object({
    links: z.array(z.number()),
  }),
};
