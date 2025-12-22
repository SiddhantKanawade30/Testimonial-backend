
import { signup, signin, googleAuth } from "../controllers/auth.js"
import { Router } from "express"
import { authLimiter } from "../middleware/authLimiter.js";

const authRouter = Router();

authRouter.post("/signup", authLimiter, signup)
authRouter.post("/signin", authLimiter, signin)
authRouter.post("/google", authLimiter, googleAuth)

export default authRouter;