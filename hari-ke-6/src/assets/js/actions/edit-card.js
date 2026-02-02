import { showAlert } from "./../utils/alert.js";
import { saveProjects } from "./../utils/storage.js";
import { projects, renderProjects } from "./delete-card.js";
import { getBase64 } from "./../utils/base64.js";

// Modal elements
const editModal = new bootstrap.Modal(
  document.getElementById("editProjectModal"),
);
const editProjectName = document.getElementById("editProjectName");
const editStartDate = document.getElementById("editStartDate");
const editEndDate = document.getElementById("editEndDate");
const editDescription = document.getElementById("editDescription");
const editUploadImage = document.getElementById("editUploadImage");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const alertBox = document.getElementById("alertBox");

let currentProjectId = null;
let selectedImage = "";

// Handle edit button click
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("btn-edit")) {
    const id = e.target.getAttribute("data-id");
    const project = projects.find((p) => p.id == id);
    if (project) {
      currentProjectId = id;
      populateModal(project);
      editModal.show();
    }
  }
});

// Populate modal with project data
function populateModal(project) {
  editProjectName.value = project.name;
  editStartDate.value = project.startDate;
  editEndDate.value = project.endDate;
  editDescription.value = project.description;
  selectedImage = project.image;

  // Handle technologies checkboxes
  document.querySelectorAll(".edit-tech-checkbox").forEach((cb) => {
    cb.checked = project.technologies.includes(cb.value);
  });

  // Reset file input
  editUploadImage.value = "";
}

// Handle image upload
editUploadImage.addEventListener("change", async (e) => {
  const file = e.target.files[0];
  if (file) {
    try {
      selectedImage = await getBase64(file);
    } catch (err) {
      console.error("Failed to convert image:", err);
    }
  }
});

// Handle save changes
saveChangesBtn.addEventListener("click", () => {
  const projectIndex = projects.findIndex((p) => p.id == currentProjectId);
  if (projectIndex !== -1) {
    projects[projectIndex] = {
      ...projects[projectIndex],
      name: editProjectName.value.trim(),
      startDate: editStartDate.value,
      endDate: editEndDate.value,
      description: editDescription.value.trim() || "Nothing description",
      technologies: getSelectedEditTechnologies(),
      image: selectedImage || projects[projectIndex].image,
    };

    saveProjects(projects);
    renderProjects();
    editModal.hide();

    showAlert({
      alertBox,
      type: "success",
      message: "<strong>Success!</strong> Project updated successfully.",
    });
  }
});

// Get selected technologies from modal
function getSelectedEditTechnologies() {
  return [...document.querySelectorAll(".edit-tech-checkbox:checked")].map(
    (cb) => cb.value,
  );
}
