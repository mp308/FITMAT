import { Router } from "express";
import { createCategory, listCategories } from "../controllers/classCategory.controller";

const router = Router();

router.get("/", listCategories);
router.post("/", createCategory);

export default router;
