import { Resend } from '../utils/Resend';
import { ApiError } from '../utils/ApiError';
import { ReactElement } from 'react';

export const sendOtpOnEmail = async (
  title: string,
  email: string,
  emailTemplate: ReactElement
) => {
  console.log(email);

  const { error } = await Resend.emails.send({
    from: 'Coditor <onboarding@resend.dev>',
    to: email,
    subject: title,
    react: emailTemplate,
  });
  console.log(error);

  if (error) throw new ApiError(400, `Email sending failed: ${error.message}`);
};
