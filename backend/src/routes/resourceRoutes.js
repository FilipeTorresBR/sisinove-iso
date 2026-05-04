import { Router } from "express";
// IMPORTANTE: Importe o middleware de upload que você criou
import { upload } from "../middleware/multer.js";
import {
  listResource,
  createResource,
  updateResource,
  deleteResource,
  getResourceMeta,
  listResourcesMetadata,
  getResourceReport,
  getAuditReport,
} from "../controllers/resourceController.js";

const router = Router();

router.get("/meta/all", listResourcesMetadata);
router.get("/meta/:resource", getResourceMeta);
router.get("/report/:resource", getResourceReport);
router.get("/audits/:id/report", getAuditReport);
router.get("/:resource", listResource);

router.post("/:resource", upload.single("attachments"), createResource);
router.put("/:resource/:id", upload.single("attachments"), updateResource);

router.delete("/:resource/:id", deleteResource);

export default router;
