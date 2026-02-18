import { ContactController } from "./controller/contactController.js";

const form = document.getElementById("formNama");
const alertBox = document.getElementById("alertBox");

const controller = new ContactController({ form, alertBox });
controller.init();
