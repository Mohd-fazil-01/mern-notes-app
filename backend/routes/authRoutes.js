import express from "express";
// <-- loginUser bhi import kar liya
import { registerUser, loginUser } from "../controllers/authController.js"; 

const authRouter = express.Router();

authRouter.post("/signup", registerUser);
// <-- Login route add kar diya
authRouter.post("/login", loginUser); 

export default authRouter;