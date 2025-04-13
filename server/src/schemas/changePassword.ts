import { z } from 'zod';

export const changePasswordValidation = z.object({
    email: z.string().email('Invalid email address'),
    newPassword: z
        .string()
        .min(8, 'Password must be at least 8 characters')
        .max(12, 'Password must be at most 12 characters')
});