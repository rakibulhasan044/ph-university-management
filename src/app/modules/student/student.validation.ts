import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string().nonempty()
    .trim()
    .max(20, { message: 'First name cannot be more than 20 characters' })
    .refine(
      (value) => value.charAt(0).toUpperCase() + value.slice(1) === value,
      { message: 'First name is not in the correct format' }
    ),
  middleName: z.string().trim().optional(),
  lastName: z
    .string().nonempty()
    .refine((value) => /^[A-Za-z]+$/.test(value), { message: 'Last name is not valid' }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string({ required_error: 'Father name is required' }).nonempty(),
  fatherOccupation: z.string().nonempty(),
  fatherContactNo: z.string().nonempty(),
  motherName: z.string().nonempty(),
  motherOccupation: z.string().nonempty(),
  motherContactNo: z.string().nonempty(),
});

const localGuardianValidationSchema = z.object({
  name: z.string().optional(),
  occupation: z.string().optional(),
  contactNo: z.string().optional(),
  address: z.string().optional(),
});

const studentValidationSchema = z.object({
  id: z.string().nonempty({message: "ID must"}),
  name: userNameValidationSchema,
  gender: z.enum(['male', 'female'], { invalid_type_error: 'Gender must be male or female' }),
  dateOfBirth: z.string().optional(),
  email: z
    .string()
    .email({ message: 'Invalid email address' })
    .nonempty({ message: 'Email is required' }),
  contactNo: z.string().nonempty({ message: 'Contact number is required' }),
  emergencyContactNo: z.string().nonempty({ message: 'Emergency contact number is required' }),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-'])
    .optional(),
  presentAddress: z.string().nonempty({ message: 'Present address is required' }),
  permanentAddress: z.string().nonempty({ message: 'Permanent address is required' }),
  guardian: guardianValidationSchema,
  localGuardian: localGuardianValidationSchema,
  profileImage: z.string().optional(),
  isDeleted: z.boolean().default(false),
});

export default studentValidationSchema;
