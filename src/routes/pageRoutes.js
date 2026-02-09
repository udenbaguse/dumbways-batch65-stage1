import { Router } from "express";
import {
  renderContact,
  renderHome,
  renderNotFound,
  renderProjectDetail,
  renderProjects,
  createProject,
} from "../controllers/pageController.js";

const router = Router();

router.get("/", renderHome);
router.get("/projects", renderProjects);
router.post("/projects", createProject);
router.get("/project-detail/:id", renderProjectDetail);
router.get("/contact", renderContact);

router.use(renderNotFound);

export default router;
