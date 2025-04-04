import { z } from 'zod';

const emailVerificationValidation = z.object({
  email: z.string().email('Invalid email address'),
  verificationCode: z
    .string()
    .length(6, 'Verification code must be 6 characters long'),
});

export default emailVerificationValidation;
