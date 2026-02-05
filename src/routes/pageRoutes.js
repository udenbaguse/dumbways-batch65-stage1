import { Router } from "express";
import {
  renderContact,
  renderHome,
  renderNotFound,
  renderProjectDetail,
  renderProjects,
} from "../controllers/pageController.js";

const router = Router();

router.get("/", renderHome);
router.get("/projects", renderProjects);
router.get("/project-detail", renderProjectDetail);
router.get("/contact", renderContact);

router.use(renderNotFound);

export default router;
