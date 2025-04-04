import { z } from 'zod';

const signInValidation = z.object({
  email: z.string().email('Invalid email format'),
  password: z
    .string()
    .min(8, 'Password must be at least 8 characters')
    .max(12, 'Password must be at most 12 characters'),
});

export default signInValidation;
