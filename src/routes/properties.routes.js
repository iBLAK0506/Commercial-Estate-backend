import { Router } from "express";
import { requireAuth } from "../middleware/auth.js";
import {
  listProperties,
  getProperty,
  createProperty,
  updateProperty,
  deleteProperty,
} from "../../controllers/properties.controller.js";

const router = Router();

router.get("/", listProperties);
router.get("/:id", getProperty);
router.post("/", requireAuth, createProperty);
router.patch("/:id", requireAuth, updateProperty);
router.delete("/:id", requireAuth, deleteProperty);

export default router;
