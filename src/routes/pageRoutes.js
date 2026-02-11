import { Router } from "express";
import {
  renderContact,
  renderHome,
  renderNotFound,
  renderProjectDetail,
  renderProjects,
  createProject,
  updateProject,
  deleteProject,
} from "../controllers/pageController.js";
import { requireAuth } from "../middlewares/auth.js";
import upload from "../middlewares/upload.js";

const router = Router();

router.get("/", renderHome);
router.get("/projects", requireAuth, renderProjects);
router.post("/projects", requireAuth, upload.single("image"), createProject);
router.put("/projects/:id", requireAuth, upload.single("image"), updateProject);
router.delete("/projects/:id", requireAuth, deleteProject);
router.get("/project-detail/:id", requireAuth, renderProjectDetail);
router.get("/contact", renderContact);

router.use(renderNotFound);

export default router;
