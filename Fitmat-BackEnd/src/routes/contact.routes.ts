import { Router } from "express";
import { submitContact, listContacts } from "../controllers/contact.controller";

const router = Router();

router.get("/", listContacts);
router.post("/", submitContact);

export default router;
