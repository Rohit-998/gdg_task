import { Router } from "express";
import { signin, signup } from "../controllers/AuthController.js";
import generalLimiter from "../config/rateLimiter.js";

const authRouter = Router();

authRouter.use(
  generalLimiter(
    5 * 60 * 1000, 
    5, 
    "Too many login attempts, please try again later."
  )
);

authRouter.post("/signup", signup);
authRouter.post("/login", signin);
export default authRouter;
