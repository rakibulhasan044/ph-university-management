import { z } from 'zod';
import { Days } from './offeredCourse.constant';

const createOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      semesterRegistration: z.string(),
      academicFaculty: z.string(),
      academicDepartment: z.string(),
      course: z.string(),
      faculty: z.string(),
      maxCapacity: z.number(),
      section: z.number(),
      days: z.array(z.enum([...Days] as [string, ...string[]])),
      startTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid Time format, expected "HH:MM" in 24 hours formate',
        },
      ),
      endTime: z.string().refine(
        (time) => {
          const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
          return regex.test(time);
        },
        {
          message: 'Invalid Time format, expected "HH:MM" in 24 hours formate',
        },
      ),
    })
    .refine(
      (body) => {
        const start = new Date(`2001-08-25T${body.startTime}:00`);
        const end = new Date(`2001-08-25T${body.endTime}:00`);
        return end > start;
      },
      {
        message: 'Start time must be before end time',
      },
    ),
});

const updateOfferedCourseValidationSchema = z.object({
  body: z
    .object({
      faculty: z.string().optional(),
      maxCapacity: z.number().optional(),
      days: z.enum([...Days] as [string, ...string[]]).optional(),
      startTime: z
        .string()
        .refine(
          (time) => {
            const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return regex.test(time);
          },
          {
            message:
              'Invalid Time format, expected "HH:MM" in 24 hours formate',
          },
        )
        .optional(),
      endTime: z
        .string()
        .refine(
          (time) => {
            const regex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
            return regex.test(time);
          },
          {
            message:
              'Invalid Time format, expected "HH:MM" in 24 hours formate',
          },
        )
        .optional(),
    })
    .refine(
      (body) => {
        const start = new Date(`2001-08-25T${body.startTime}:00`);
        const end = new Date(`2001-08-25T${body.endTime}:00`);
        return end > start;
      },
      {
        message: 'Start time must be before end time',
      },
    ),
});

export const OfferedCourseValidation = {
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema,
};
