import { z } from 'zod';

const signUpValidation = z.object({
  name: z
    .string()
    .min(3, 'Name must be at least 3 characters')
    .max(15, 'Name must be at most 15 characters'),
  email: z
    .string()
    .regex(
      /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
      'Invalid email format'
    )
    .email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/(?=.*[a-z])/, 'At least one lowercase letter')
    .regex(/(?=.*[A-Z])/, 'At least one uppercase letter')
    .regex(/(?=.*\d)/, 'At least one number')
    .regex(/(?=.*[@$!%*?&])/, 'At least one special character')
    .regex(/^\S*$/, 'No whitespace allowed')
    .max(12, 'Password must be at most 12 characters'),
});

export default signUpValidation;
