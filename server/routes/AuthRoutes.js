import { Router } from "express";
import { logout, signin, signup } from "../controllers/AuthController.js";
import generalLimiter from "../config/rateLimiter.js";

const authRouter = Router();

authRouter.use(
  generalLimiter(
    5 * 60 * 1000,
    10,
    "Too many login attempts, please try again later."
  )
);

authRouter.post("/signup", signup);
authRouter.post("/login", signin);
authRouter.post("/logout", logout);

export default authRouter;