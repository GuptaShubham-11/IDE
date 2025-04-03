import { Router } from "express";
import {
    signUp
} from "../controllers/user";


const router = Router();

router.post("/sign-up", signUp);


export default router;