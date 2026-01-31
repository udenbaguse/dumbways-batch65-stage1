// projects.js
import { showAlert } from "./alert.js";
import { validateForm, setupRealtimeValidation } from "./validation.js";

// Constants for selectors and messages
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

let projects = [];

// DOM Elements
const projectsContainer = document.querySelector(SELECTORS.projectsContainer);
const submitBtn = document.querySelector(SELECTORS.submitBtn);
const uploadImage = document.querySelector(SELECTORS.uploadImage);
const alertBox = document.querySelector(SELECTORS.alertBox);
const projectFormContainer = document.querySelector(
  SELECTORS.projectFormContainer,
);

let selectedImage = "";

/* ================= RENDER ================= */
function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "col-12 col-md-4 mb-4";

  const startDate = new Date(project.startDate).toLocaleDateString("id-ID");
  const endDate = new Date(project.endDate).toLocaleDateString("id-ID");

  card.innerHTML = `
      <div class="card bg-dark border-light">
        <img src="${project.image}" class="card-img-top" style="height:200px; object-fit:cover;">
        <div class="card-body text-light">
            <h5 class="card-title">${project.name}</h5>
    
            <p class="card-text small text-muted">
                ${new Date(project.startDate).toLocaleDateString("id-ID")} -
                ${new Date(project.endDate).toLocaleDateString("id-ID")}
            </p>
    
            <p class="card-text">${project.description}</p>
    
            <p class="card-text small">
                Technologies: ${project.technologies.join(" ")}
            </p>
    
            <a href="#" class="btn btn-secondary btn-sm">Edit</a>
            <a href="#" class="btn btn-danger btn-sm">Delete</a>
        </div>
      </div>
    `;

  return card;
}

function renderProjects() {
  projectsContainer.innerHTML = "";
  projects.forEach((project) => {
    const card = createProjectCard(project);
    projectsContainer.appendChild(card);
  });
}
renderProjects();

/* ================= REALTIME VALIDATION ================= */
setupRealtimeValidation(projectFormContainer);

/* ================= IMAGE UPLOAD ================= */
uploadImage.addEventListener("change", (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedImage = URL.createObjectURL(file);
    uploadImage.classList.remove("is-invalid");
  }
});

/* ================= SUBMIT ================= */
function getSelectedTechnologies() {
  const techCheckboxes = document.querySelectorAll(SELECTORS.techCheckboxes);
  return [...techCheckboxes].filter((cb) => cb.checked).map((cb) => cb.value);
}

function validateTechnologies(technologies) {
  const techFeedback = document.querySelector(SELECTORS.techFeedback);
  if (!technologies.length) {
    techFeedback.classList.remove("d-none");
    return false;
  } else {
    techFeedback.classList.add("d-none");
    return true;
  }
}

function createProjectObject() {
  return {  
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
