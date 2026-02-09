// Entry point for /projects page\r\n
import { showAlert } from "../utils/alert.mjs";
import { validateForm, setupRealtimeValidation } from "../utils/validation.mjs";

const container = document.getElementById("projectForm");
const alertBox = document.getElementById("projectAlertBox");
const submitBtn = document.getElementById("submitBtn");
const techCheckboxes = document.querySelectorAll(".tech-checkbox");
const techFeedback = document.getElementById("techFeedback");

if (container && submitBtn) {
  setupRealtimeValidation(container);

  submitBtn.addEventListener("click", () => {
    const formValid = validateForm(container);
    const techSelected = Array.from(techCheckboxes).some((cb) => cb.checked);

    if (techFeedback) {
      techFeedback.classList.toggle("d-none", techSelected);
    }

    if (formValid && techSelected) {
      showAlert({
        alertBox,
        type: "success",
        message: "<strong>Done!</strong> project saved successfully.",
      });
    } else {
      showAlert({
        alertBox,
        type: "danger",
        message: "<strong>Failed!</strong> check the red fields.",
      });
    }
  });
}

