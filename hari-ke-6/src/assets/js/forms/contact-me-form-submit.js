import { showAlert } from "./../utils/alert.js";
import {
  validateForm,
  setupRealtimeValidation,
} from "./../utils/validation.js";

const form = document.getElementById("formNama");
const alertBox = document.getElementById("alertBox");

// Setup realtime validation
setupRealtimeValidation(form);

form.addEventListener("submit", (e) => {
  e.preventDefault();

  const formValid = validateForm(form);

  if (formValid) {
    showAlert({
      alertBox,
      type: "success",
      message: "<strong>Done!</strong> invoice will be sent via email.",
    });

    // form.reset();
  } else {
    showAlert({
      alertBox,
      type: "danger",
      message: "<strong>Failed!</strong> check the red fields.",
    });
  }
});
