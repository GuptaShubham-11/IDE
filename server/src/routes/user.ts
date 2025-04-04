import { Router } from 'express';
import { signUp, signIn, emailVerification } from '../controllers/user';

const router = Router();

router.post('/sign-up', signUp);
router.post('/sign-in', signIn);
router.post('/verify-email', emailVerification);

export default router;
