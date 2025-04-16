import { Router } from "express";
import { runCode } from "../controllers/code";

const router = Router();

router.post("/run", runCode);

export default router;