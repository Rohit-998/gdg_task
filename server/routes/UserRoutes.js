import { Router } from "express";
import { dashboard, getUserDetails } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";


const userRouter = Router();

userRouter.get("/user", verifyToken, getUserDetails);
userRouter.get("/dashboard", verifyToken, dashboard);
export default userRouter;