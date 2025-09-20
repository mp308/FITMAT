import { Router } from "express";
import {
  createReview,
  listReviews,
  getReviewSummary,
  getTrainerReviews,
} from "../controllers/review.controller";

const router = Router();

router.get("/summary", getReviewSummary);
router.get("/trainer/:trainerId", getTrainerReviews);
router.get("/", listReviews);
router.post("/", createReview);

export default router;
