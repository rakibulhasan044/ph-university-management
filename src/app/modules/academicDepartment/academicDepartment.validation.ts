import { z } from "zod";

const createAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Academic department must be string !!",
            required_error: 'Department name is missing !!'
        },),
        academicFaculty: z.string({
            invalid_type_error: 'Academic department must be string',
            required_error: 'Faculty is missing !!'
        })
    }),

})

const updateAcademicDepartmentValidationSchema = z.object({
    body: z.object({
        name: z.string({
            invalid_type_error: "Academic department must be string !!",
            required_error: 'Department name is missing !!'
        }).optional(),
        academicFaculty: z.string({
            invalid_type_error: 'Academic department must be string',
            required_error: 'Faculty is missing !!'
        }).optional()
    }),

})

export const AcademicDepartmentValidation = {
    createAcademicDepartmentValidationSchema,
    updateAcademicDepartmentValidationSchema
}
