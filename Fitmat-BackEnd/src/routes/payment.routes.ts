import { Router } from "express";
import multer from "multer";
import {
  uploadPaymentProof,
  listPaymentProofs,
  getPaymentProofImage,
  listAllPaymentProofs,
} from "../controllers/payment.controller";

const router = Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
});

router.post("/", upload.single("paymentImage"), uploadPaymentProof);
router.get("/", listPaymentProofs);
router.get("/all", listAllPaymentProofs);
router.get("/:paymentId/image", getPaymentProofImage);

export default router;
