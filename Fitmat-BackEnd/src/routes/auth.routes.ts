import { Router } from "express";
import { login, register, requestPasswordReset, resetPassword, logout } from "../controllers/auth.controller";
import { changePassword } from "../controllers/user.controller";

const router = Router();

router.post("/register", register);
router.post("/login", login);
router.post("/logout", logout);
router.post("/request-password-reset", requestPasswordReset);
router.post("/reset-password", resetPassword);
router.post("/change-password", changePassword);

export default router;
