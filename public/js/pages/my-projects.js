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
const editModalEl = document.getElementById("editProjectModal");
const editProjectId = document.getElementById("editProjectId");
const editProjectName = document.getElementById("editProjectName");
const editStartDate = document.getElementById("editStartDate");
const editEndDate = document.getElementById("editEndDate");
const editDescription = document.getElementById("editDescription");
const editTechCheckboxes = document.querySelectorAll(".edit-tech-checkbox");
const editUploadImage = document.getElementById("editUploadImage");
const saveChangesBtn = document.getElementById("saveChangesBtn");
const rootContainer = document.getElementById("root");
const confirmUpdateModalEl = document.getElementById("confirmUpdateModal");
const confirmYesBtn = document.getElementById("confirmYesBtn");
const confirmNoBtn = document.getElementById("confirmNoBtn");

if (container && submitBtn) {
  setupRealtimeValidation(container);

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

    const payload = {
      name: nameInput?.value || "",
      startDate: startInput?.value || "",
      endDate: endInput?.value || "",
      description: descriptionInput?.value || "",
      technologies: selectedTechs,
      imagePath: imageInput?.value || "",
    };

    try {
      submitBtn.disabled = true;
      const response = await fetch("/projects", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
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
  let pendingUpdate = null;

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
      if (editProjectName) editProjectName.value = target.dataset.name || "";
      if (editStartDate) editStartDate.value = target.dataset.start || "";
      if (editEndDate) editEndDate.value = target.dataset.end || "";
      if (editDescription) editDescription.value = target.dataset.description || "";

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
      if (!window.confirm("Hapus project ini?")) return;

      (async () => {
        try {
          const response = await fetch(`/projects/${projectId}`, {
            method: "DELETE",
          });
          const result = await response.json();
          if (!response.ok || !result.success) {
            throw new Error(result.message || "Failed to delete project.");
          }
          window.location.reload();
        } catch (error) {
          showAlert({
            alertBox,
            type: "danger",
            message: `<strong>Failed!</strong> ${error.message}`,
          });
        }
      })();
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
        imagePath: editUploadImage?.value || "",
      };

      if (confirmUpdateModal) confirmUpdateModal.show();
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
        const response = await fetch(`/projects/${projectId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });

        const result = await response.json();

        if (!response.ok || !result.success) {
          throw new Error(result.message || "Failed to update project.");
        }

        confirmUpdateModal.hide();
        editModal.hide();
        setTimeout(() => {
          window.location.reload();
        }, 400);
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
}

