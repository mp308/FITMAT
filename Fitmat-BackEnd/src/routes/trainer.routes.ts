import { Router } from "express";
import { listTrainers } from "../controllers/trainer.controller";

const router = Router();

router.get("/", listTrainers);

export default router;
