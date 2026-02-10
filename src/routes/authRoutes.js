import { Router } from "express";
import {
  loginUser,
  logoutUser,
  registerUser,
  renderLogin,
  renderRegister,
} from "../controllers/authController.js";
import { redirectIfAuthenticated } from "../middlewares/auth.js";

const router = Router();

router.get("/login", redirectIfAuthenticated, renderLogin);
router.post("/login", redirectIfAuthenticated, loginUser);
router.get("/register", redirectIfAuthenticated, renderRegister);
router.post("/register", redirectIfAuthenticated, registerUser);
router.get("/logout", logoutUser);

export default router;
