import express from "express"
import { Router } from "express"
import { signup, signin, googleAuth } from "../controllers/auth.js"
import { getCurrentUser } from "../controllers/user.js"
import { middleware } from "../middleware/middleware.js";

const userRouter = Router();

userRouter.post("/signup", signup)
userRouter.post("/signin", signin)
userRouter.post("/google", googleAuth)
userRouter.get("/me", middleware, getCurrentUser)

export default userRouter;