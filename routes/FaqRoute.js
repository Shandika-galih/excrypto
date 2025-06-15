import express from "express";
import {
  getFaqs,
  getFaq,
  postFaq,
  patchFaq,
  deleteFaqById,
} from "../controllers/FaqController.js";
import { admin } from "../middleware/AuthUser.js";

const router = express.Router();

router.get("/faqs", getFaqs);
router.get("/faqs/:uuid", getFaq);
router.post("/faqs", admin, postFaq);
router.patch("/faqs/:uuid", admin, patchFaq);
router.delete("/faqs/:uuid", admin, deleteFaqById);

export default router;
