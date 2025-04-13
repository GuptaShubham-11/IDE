import { Resend as ResendEmail } from "resend";

if (!process.env.RESEND_SECRET) {
    throw new Error('RESEND_API_KEY is not defined in environment variables.');
}

export const Resend = new ResendEmail(process.env.RESEND_SECRET);