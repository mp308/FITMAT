import { Router } from "express";
import { listUsers, listRoles, updateUserRole } from "../controllers/user.controller";

const router = Router();

router.get("/", listUsers);
router.get("/roles", listRoles);
router.patch("/:userId/role", updateUserRole);

export default router;
