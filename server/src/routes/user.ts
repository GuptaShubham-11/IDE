import { Router } from 'express';
import {
    signUp,
    signIn,
    signOut,
    emailVerification,
    reSendVerificationEmail,
    getCurrentUser,
    refreshAccessToken
} from '../controllers/user';
import { verifyJWT } from '../middlewares/auth';

const router = Router();

// Public routes
router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/verify-email', emailVerification);
router.post('/resend-verification-email', reSendVerificationEmail);
router.post('/refresh-access-token', refreshAccessToken);


// Protected routes
router.use(verifyJWT);

router.get('/current-user', getCurrentUser);
router.post('/sign-out', signOut);

export default router;
