import { Router } from 'express';
import {
    signUp,
    signIn,
    emailVerification,
    reSendVerificationEmail
} from '../controllers/user';

const router = Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/verify-email', emailVerification);
router.post('/resend-verification-email', reSendVerificationEmail);

export default router;
