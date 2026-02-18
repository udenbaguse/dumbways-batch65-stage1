import { showAlert } from "../alert.js";

export function showSuccess(alertBox, message, duration = 4000) {
  showAlert({
    alertBox,
    type: "success",
    message,
    duration,
  });
}

export function showError(alertBox, message, duration = 4000) {
  showAlert({
    alertBox,
    type: "danger",
    message,
    duration,
  });
}
