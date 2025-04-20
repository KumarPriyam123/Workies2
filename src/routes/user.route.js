import {Router} from "express";
import {registerUser, loginUser, refreshAccessToken, getUserDetails} from "../controller/user.controller.js";
import { verifyJWT } from "../middleware/auth.middleware.js";

const router = Router();

// Auth routes
router.route("/register").post(registerUser);
router.route("/login").post(loginUser);
router.route("/refresh-token").post(refreshAccessToken);

// Protected routes
router.route("/profile").get(verifyJWT, getUserDetails);

export default router;
