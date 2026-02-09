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

