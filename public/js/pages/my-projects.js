// Entry point for /projects page\r\n
import { showAlert } from "../utils/alert.mjs";
import { validateForm, setupRealtimeValidation } from "../utils/validation.mjs";

const container = document.getElementById("projectForm");
const alertBox = document.getElementById("projectAlertBox");
const submitBtn = document.getElementById("submitBtn");
const techCheckboxes = document.querySelectorAll(".tech-checkbox");
const techFeedback = document.getElementById("techFeedback");
const nameInput = document.getElementById("projectName");
const startInput = document.getElementById("startDate");
const endInput = document.getElementById("endDate");
const descriptionInput = document.getElementById("description");
const imageInput = document.getElementById("uploadImage");
const imagePreview = document.getElementById("imagePreview");
const editModalEl = document.getElementById("editProjectModal");
const editProjectId = document.getElementById("editProjectId");
const editProjectName = document.getElementById("editProjectName");
const editStartDate = document.getElementById("editStartDate");
const editEndDate = document.getElementById("editEndDate");
const editDescription = document.getElementById("editDescription");
const editTechCheckboxes = document.querySelectorAll(".edit-tech-checkbox");
const editUploadImage = document.getElementById("editUploadImage");
const editImagePreview = document.getElementById("editImagePreview");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const rootContainer = document.getElementById("root");
const confirmUpdateModalEl = document.getElementById("confirmUpdateModal");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");
const confirmDeleteModalEl = document.getElementById("confirmDeleteModal");
const confirmDeleteYesBtn = document.getElementById("confirmDeleteYesBtn");
const confirmDeleteNoBtn = document.getElementById("confirmDeleteNoBtn");

if (container && submitBtn) {
  setupRealtimeValidation(container);

  if (imageInput && imagePreview) {
    imageInput.addEventListener("change", () => {
      const file = imageInput.files?.[0];
      if (!file) {
        imagePreview.src = "";
        imagePreview.classList.add("d-none");
        return;
      }
      imagePreview.src = URL.createObjectURL(file);
      imagePreview.classList.remove("d-none");
    });
  }

  submitBtn.addEventListener("click", async () => {
    const formValid = validateForm(container);
    const techSelected = Array.from(techCheckboxes).some((cb) => cb.checked);

    if (techFeedback) {
      techFeedback.classList.toggle("d-none", techSelected);
    }

    if (!formValid || !techSelected) {
      showAlert({
        alertBox,
        type: "danger",
        message: "<strong>Failed!</strong> check the red fields.",
      });
      return;
    }

    const selectedTechs = Array.from(techCheckboxes)
      .filter((cb) => cb.checked)
      .map((cb) => cb.value);

    const formData = new FormData();
    formData.append("name", nameInput?.value || "");
    formData.append("startDate", startInput?.value || "");
    formData.append("endDate", endInput?.value || "");
    formData.append("description", descriptionInput?.value || "");
    selectedTechs.forEach((tech) => formData.append("technologies", tech));
    const file = imageInput?.files?.[0];
    if (file) formData.append("image", file);

    try {
      submitBtn.disabled = true;
      const response = await fetch("/projects", {
        method: "POST",
        body: formData,
      });

      const result = await response.json();

      if (!response.ok || !result.success) {
        throw new Error(result.message || "Failed to save project.");
      }

      showAlert({
        alertBox,
        type: "success",
        message: "<strong>Done!</strong> project saved successfully.",
      });

      setTimeout(() => {
        window.location.reload();
      }, 800);
    } catch (error) {
      showAlert({
        alertBox,
        type: "danger",
        message: `<strong>Failed!</strong> ${error.message}`,
      });
    } finally {
      submitBtn.disabled = false;
    }
  });
}

if (editModalEl && rootContainer) {
  const editModal = new bootstrap.Modal(editModalEl);
  const confirmUpdateModal = confirmUpdateModalEl
    ? new bootstrap.Modal(confirmUpdateModalEl)
    : null;
  const confirmDeleteModal = confirmDeleteModalEl
    ? new bootstrap.Modal(confirmDeleteModalEl)
    : null;
  let pendingUpdate = null;
  let pendingDeleteId = null;

  rootContainer.addEventListener("click", (event) => {
    const target = event.target;
    if (!(target instanceof HTMLElement)) return;
    if (target.classList.contains("btn-edit")) {
      const techCsv = target.dataset.tech || "";
      const techSet = new Set(
        techCsv
          .split(",")
          .map((item) => item.trim().toLowerCase())
          .filter(Boolean)
      );

      if (editProjectId) editProjectId.value = target.dataset.id || "";
      if (editUploadImage) editUploadImage.value = "";
      if (editProjectName) editProjectName.value = target.dataset.name || "";
      if (editStartDate) editStartDate.value = target.dataset.start || "";
      if (editEndDate) editEndDate.value = target.dataset.end || "";
      if (editDescription) editDescription.value = target.dataset.description || "";
      const existingImage = target.dataset.image || "";
      if (editImagePreview) {
        if (existingImage) {
          editImagePreview.src = existingImage;
          editImagePreview.classList.remove("d-none");
        } else {
          editImagePreview.src = "";
          editImagePreview.classList.add("d-none");
        }
      }

      editTechCheckboxes.forEach((checkbox) => {
        const value = String(checkbox.value || "").toLowerCase();
        checkbox.checked = techSet.has(value);
      });

      editModal.show();
      return;
    }

    if (target.classList.contains("btn-delete")) {
      const projectId = target.dataset.id;
      if (!projectId) return;

      pendingDeleteId = projectId;
      if (confirmDeleteModal) confirmDeleteModal.show();
    }
  });

  if (saveChangesBtn) {
    saveChangesBtn.addEventListener("click", () => {
      const projectId = editProjectId?.value;
      if (!projectId) return;

      const selectedTechs = Array.from(editTechCheckboxes)
        .filter((cb) => cb.checked)
        .map((cb) => cb.value);

      pendingUpdate = {
        projectId,
        name: editProjectName?.value || "",
        startDate: editStartDate?.value || "",
        endDate: editEndDate?.value || "",
        description: editDescription?.value || "",
        technologies: selectedTechs,
        existingImage: document
          .querySelector(`.btn-edit[data-id="${projectId}"]`)
          ?.dataset.image || "",
        imageFile: editUploadImage?.files?.[0] || null,
      };

      if (confirmUpdateModal) confirmUpdateModal.show();
    });
  }

  if (editUploadImage && editImagePreview) {
    editUploadImage.addEventListener("change", () => {
      const file = editUploadImage.files?.[0];
      if (!file) return;
      editImagePreview.src = URL.createObjectURL(file);
      editImagePreview.classList.remove("d-none");
    });
  }

  if (confirmNoBtn && confirmUpdateModal) {
    confirmNoBtn.addEventListener("click", () => {
      confirmUpdateModal.hide();
      pendingUpdate = null;
    });
  }

  if (confirmYesBtn && confirmUpdateModal) {
    confirmYesBtn.addEventListener("click", async () => {
      if (!pendingUpdate) return;
      const { projectId, ...payload } = pendingUpdate;

      try {
        confirmYesBtn.disabled = true;
        const formData = new FormData();
        formData.append("name", payload.name || "");
        formData.append("startDate", payload.startDate || "");
        formData.append("endDate", payload.endDate || "");
        formData.append("description", payload.description || "");
        (payload.technologies || []).forEach((tech) =>
          formData.append("technologies", tech)
        );
        if (payload.existingImage) {
          formData.append("existingImage", payload.existingImage);
        }
        if (payload.imageFile) {
          formData.append("image", payload.imageFile);
        }
        const response = await fetch(`/projects/${projectId}`, {
          method: "PUT",
          body: formData,
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update project.");
        }

        confirmUpdateModal.hide();
        editModal.hide();
        showAlert({
          alertBox,
          type: "success",
          message: "<strong>Done!</strong> project updated successfully.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (error) {
        showAlert({
          alertBox,
          type: "danger",
          message: `<strong>Failed!</strong> ${error.message}`,
        });
      } finally {
        confirmYesBtn.disabled = false;
      }
    });
  }

  if (confirmDeleteNoBtn && confirmDeleteModal) {
    confirmDeleteNoBtn.addEventListener("click", () => {
      confirmDeleteModal.hide();
      pendingDeleteId = null;
    });
  }

  if (confirmDeleteYesBtn && confirmDeleteModal) {
    confirmDeleteYesBtn.addEventListener("click", async () => {
      if (!pendingDeleteId) return;
      const projectId = pendingDeleteId;
      try {
        confirmDeleteYesBtn.disabled = true;
        const response = await fetch(`/projects/${projectId}`, {
          method: "DELETE",
        });
        const result = await response.json();
        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to delete project.");
        }
        confirmDeleteModal.hide();
        showAlert({
          alertBox,
          type: "success",
          message: "<strong>Done!</strong> project deleted successfully.",
        });
        setTimeout(() => {
          window.location.reload();
        }, 800);
      } catch (error) {
        showAlert({
          alertBox,
          type: "danger",
          message: `<strong>Failed!</strong> ${error.message}`,
        });
      } finally {
        confirmDeleteYesBtn.disabled = false;
        pendingDeleteId = null;
      }
    });
  }
}

