import { Router } from "express";
import { getUserDetails } from "../controllers/UserController.js";
import { verifyToken } from "../middleware/verifyToken.js";


const userRouter = Router();

userRouter.get("/user", verifyToken, getUserDetails);
export default userRouter;