import { z } from "zod";

const AcademicFacultyValidationSchema = z.object({
    name: z.string({
        invalid_type_error: " Academic faculty name must be string"
    })
})

export const AcademicFacultyValidation = {
    AcademicFacultyValidationSchema
}