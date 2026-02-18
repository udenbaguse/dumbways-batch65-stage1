import { ProjectStore } from "./model/projectStore.js";
import { ProjectController } from "./controller/projectController.js";

const root = document;
const store = new ProjectStore();

const controller = new ProjectController({ root, store });
controller.init();
