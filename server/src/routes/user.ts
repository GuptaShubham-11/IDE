import { Router } from 'express';
import {
    signUp,
    signIn,
    emailVerification,
    reSendVerificationEmail,
    getCurrentUser
} from '../controllers/user';
import { verifyJWT } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/verify-email', emailVerification);
router.post('/resend-verification-email', reSendVerificationEmail);

// Protected routes
router.use(verifyJWT);
router.get('/current-user', getCurrentUser);

export default router;
