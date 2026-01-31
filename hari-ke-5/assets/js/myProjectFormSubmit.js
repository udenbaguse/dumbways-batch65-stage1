import { showAlert } from "./alert.js";
import { validateForm, setupRealtimeValidation } from "./validation.js";
import { saveProjects, loadProjects } from "./storage.js";
import { createProjectCard } from "./templateCard.js";
import { getBase64 } from "./base64.js";
import { generateProjectId } from "./generateId.js";

/* ================= CONSTANTS ================= */
const SELECTORS = {
  projectsContainer: "#root",
  submitBtn: "#submitBtn",
  uploadImage: "#uploadImage",
  alertBox: "#alertBox",
  projectFormContainer: ".row",
  projectName: "#projectName",
  startDate: "#startDate",
  endDate: "#endDate",
  description: "#description",
  techCheckboxes: ".tech-checkbox",
  techFeedback: "#techFeedback",
};

const MESSAGES = {
  success: "<strong>Success!</strong> project successfully added.",
  failure:
    "<strong>Failed!</strong> project name, start date, end date, technologies are required.",
};

/* ================= DATA ================= */
let projects = loadProjects();

/* ================= DOM ================= */
const projectsContainer = document.querySelector(SELECTORS.projectsContainer);
const submitBtn = document.querySelector(SELECTORS.submitBtn);
const uploadImage = document.querySelector(SELECTORS.uploadImage);
const alertBox = document.querySelector(SELECTORS.alertBox);
const projectFormContainer = document.querySelector(
  SELECTORS.projectFormContainer,
);

let selectedImage = "";

/* ================= RENDER ================= */


function renderProjects() {
  projectsContainer.innerHTML = "";
  projects.forEach((project) => {
    projectsContainer.appendChild(createProjectCard(project));
  });
}

renderProjects();

/* ================= VALIDATION ================= */
setupRealtimeValidation(projectFormContainer);




/* ================= IMAGE UPLOAD ================= */
uploadImage.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (!file) return;

  try {
    selectedImage = await getBase64(file); // BASE64 STRING
    uploadImage.classList.remove("is-invalid");
  } catch (err) {
    console.error("Failed to convert image:", err);
  }
});

/* ================= HELPERS ================= */
function getSelectedTechnologies() {
  return [...document.querySelectorAll(SELECTORS.techCheckboxes)]
    .filter((cb) => cb.checked)
    .map((cb) => cb.value);
}

function validateTechnologies(technologies) {
  const techFeedback = document.querySelector(SELECTORS.techFeedback);
  if (!technologies.length) {
    techFeedback.classList.remove("d-none");
    return false;
  }
  techFeedback.classList.add("d-none");
  return true;
}


function createProjectObject() {
  return {
    id: generateProjectId(projects),
    name: document.querySelector(SELECTORS.projectName).value.trim(),
    startDate: document.querySelector(SELECTORS.startDate).value,
    endDate: document.querySelector(SELECTORS.endDate).value,
    description:
      document.querySelector(SELECTORS.description).value.trim() ||
      "Nothing description",
    technologies: getSelectedTechnologies(),
    image: selectedImage || "https://via.placeholder.com/300x200",
  };
}

/* ================= SUBMIT ================= */
submitBtn.addEventListener("click", () => {
  const isValid = validateForm(projectFormContainer);
  const technologies = getSelectedTechnologies();
  const techValid = validateTechnologies(technologies);

  if (!isValid || !techValid) {
    showAlert({
      alertBox,
      type: "danger",
      message: MESSAGES.failure,
    });
    return;
  }

  const newProject = createProjectObject();
  projects.push(newProject);
  saveProjects(projects);
  renderProjects();

  showAlert({
    alertBox,
    type: "success",
    message: MESSAGES.success,
  });

  resetForm();
});

/* ================= RESET ================= */
function resetForm() {
  projectFormContainer.querySelectorAll("input, textarea").forEach((el) => {
    el.value = "";
    el.classList.remove("is-valid", "is-invalid");
  });

  document
    .querySelectorAll(".tech-checkbox")
    .forEach((cb) => (cb.checked = false));

  document.getElementById("techFeedback").classList.add("d-none");

  uploadImage.value = "";
  selectedImage = "";
}
