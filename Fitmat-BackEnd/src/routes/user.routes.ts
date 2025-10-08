import { Router } from "express";
import { getUserProfile, updateUserProfile, changePassword } from "../controllers/user.controller";

const router = Router();

// User profile routes
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

// Password change route
router.post("/change-password", changePassword);

export default router;