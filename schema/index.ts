import { DataType } from "@prisma/client"
import { z } from "zod"

export const categorySchema = {
  update: z.object({
    name: z.string().min(1, { message: "Name is required" }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    keywords: z.string().min(1, { message: "Keywords is required. Separate them with ',' " }).max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    icon: z.string().url({ message: "Icon must be a URL." })
  }),

  create: z.object({
    name: z.string().max(255, { message: "Cannot be greater than 255 characters" }),
    keywords: z.string().max(255, { message: "Cannot be greater than 255 characters" }),
    icon: z.string().url({ message: "Icon must be a URL." }).optional()
  })
}

export const userSchema = {
  
  login: z.object({
    email: z.string().email({ message: "Email is required." }),
    password: z.string()
  }),

  register: z.object({
    name: z.string().min(1, { message: "Name cannot be less than 1 characters." }),
    email: z.string().email({ message: "Invalid Email." }),
    password: z.string().min(8, { message: "Password cannot be less than 8 characters." }),
    facultyId: z.number().gt(0),
    yearId: z.number().gt(0),
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name cannot be less than 1 characters." }).optional(),
    email: z.string().email({ message: "Invalid Email." }).optional(),
    password: z.string().min(8, { message: "Password cannot be less than 8 characters." }).optional(),
    facultyId: z.number().gt(0).optional()
  })

}

export const facultySchema = {
  
  update: z.object({
    name: z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional(),
    city: z.string().max(255, { message: "Cannot be greater than 255 characters" }).optional()
  }),

  create: z.object({
    name: z.string().max(255, { message: "Cannot be greater than 255 characters" }),
    city: z.string().max(255, { message: "Cannot be greater than 255 characters" })
  })

}

export const moduleSchema = {
  create: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    icon: z.string()
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    icon: z.any().optional()
  })
}

export const subjectSchema = {
  create: z.object({
    name: z.string().min(1, { message: "Name is required" }),
    icon: z.string()
  }),

  update: z.object({
    name: z.string().min(1, { message: "Name is required" }).optional(),
    icon: z.any().optional()
  })
}

export const subjectLecture = {
  create: z.object({
    categoryId: z.number(),
    title: z.string().min(1, { message: "Title must be at least 1 character." }),
    description: z.string().min(1, { message: "Title must be at least 1 character." }),
    url: z.string().url(),
    type: z.enum([DataType.Data, DataType.PDF, DataType.Record, DataType.Video], { message: "Invalid data typer" }),
  }),

  update: z.object({
    categoryId: z.number().optional(),
    title: z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
    description: z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
    url: z.string().url().optional(),
    type: z.enum([DataType.Data, DataType.PDF, DataType.Record, DataType.Video], { message: "Invalid data typer" }).optional(),
  })
}

export const subjectPractical = {
  create: z.object({
    categoryId: z.number(),
    title: z.string().min(1, { message: "Title must be at least 1 character." }),
    description: z.string().min(1, { message: "Title must be at least 1 character." }),
    url: z.string().url(),
    type: z.enum([DataType.Data, DataType.PDF, DataType.Record, DataType.Video], { message: "Invalid data typer" }),
  }),

  update: z.object({
    categoryId: z.number().optional(),
    title: z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
    description: z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
    url: z.string().url().optional(),
    type: z.enum([DataType.Data, DataType.PDF, DataType.Record, DataType.Video], { message: "Invalid data typer" }).optional(),
  })
}

export const subjectFinalRevision = {
  create: z.object({
    categoryId: z.number(),
    title: z.string().min(1, { message: "Title must be at least 1 character." }),
    description: z.string().min(1, { message: "Title must be at least 1 character." }),
    url: z.string().url(),
    type: z.enum([DataType.Data, DataType.PDF, DataType.Record, DataType.Video], { message: "Invalid data typer" }),
  }),

  update: z.object({
    categoryId: z.number().optional(),
    title: z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
    description: z.string().min(1, { message: "Title must be at least 1 character." }).optional(),
    url: z.string().url().optional(),
    type: z.enum([DataType.Data, DataType.PDF, DataType.Record, DataType.Video], { message: "Invalid data typer" }).optional(),
  })
}