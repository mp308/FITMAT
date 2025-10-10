import { Router } from "express";
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
  listUsers,
  listUserRoles,
  getUserEnrolledClasses,
  deleteUserClassEnrollment,
  updateUserRole,
} from "../controllers/user.controller";

const router = Router();

// Admin user management routes
router.get("/", listUsers);
router.get("/roles", listUserRoles);

// Password change route
router.post("/change-password", changePassword);

// User profile routes
router.get("/:id/classes", getUserEnrolledClasses);
router.delete("/:id/classes/:classId", deleteUserClassEnrollment);
router.patch("/:id/role", updateUserRole);
router.get("/:id", getUserProfile);
router.put("/:id", updateUserProfile);

export default router;
