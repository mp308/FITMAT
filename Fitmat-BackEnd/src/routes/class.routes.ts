import { Router } from "express";
import {
  createClass,
  listClasses,
  enrollInClass,
  listClassEnrollments,
  listTrainerClasses,
} from "../controllers/class.controller";

const router = Router();

router.get("/", listClasses);
router.post("/", createClass);
router.get("/trainer/:trainerId", listTrainerClasses);
router.post("/:classId/enroll", enrollInClass);
router.get("/:classId/enrollments", listClassEnrollments);

export default router;
