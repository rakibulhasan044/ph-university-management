import { z } from "zod";

const PreRequisiteCoursesValidationSchema = z.object({
    course: z.string(),
    isDeleted: z.boolean().optional()
})

const createCourseValidationSchema = z.object({
    body: z.object({
        title: z.string(),
        prefix: z.string(),
        code: z.number(),
        credits: z.number(),
        preRequisiteCorses: z.array(PreRequisiteCoursesValidationSchema).optional(),
        isDeleted: z.boolean().optional()
    })
})

const updatePreRequisiteCoursesValidationSchema = z.object({
    course: z.string().optional(),
    isDeleted: z.boolean().optional()
})

const updateCourseValidationSchema = z.object({
    body: z.object({
        title: z.string().optional(),
        prefix: z.string().optional(),
        code: z.number().optional(),
        credits: z.number().optional(),
        preRequisiteCorses: z.array(updatePreRequisiteCoursesValidationSchema).optional(),
        isDeleted: z.boolean().optional()
    })
})

export const CourseValidation = {
    createCourseValidationSchema,
    updateCourseValidationSchema
}