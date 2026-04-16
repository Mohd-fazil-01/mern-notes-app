import express from "express";
// <-- loginUser bhi import kar liya
import { registerUser, loginUser, logoutUser, getUserData } from "../controllers/authController.js"; 
import { protect } from "../middleware/authMiddleware.js";

const authRouter = express.Router();

authRouter.post("/signup", registerUser);
// <-- Login route add kar diya
authRouter.post("/login", loginUser); 
authRouter.get("/getuserdata", protect, getUserData);
authRouter.post("/logout", logoutUser);

export default authRouter;