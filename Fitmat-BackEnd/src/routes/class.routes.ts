import { Router } from "express";
import {
  createClass,
  listClasses,
  listUpcomingClasses,
  getClassById,
  enrollInClass,
  listClassEnrollments,
  listTrainerClasses,
} from "../controllers/class.controller";

const router = Router();

router.get("/", listClasses);
router.get("/listclassupcoming", listUpcomingClasses);
router.get("/trainer/:trainerId", listTrainerClasses);
router.get("/:classId", getClassById);
router.post("/", createClass);
router.post("/:classId/enroll", enrollInClass);
router.get("/:classId/enrollments", listClassEnrollments);

export default router;
