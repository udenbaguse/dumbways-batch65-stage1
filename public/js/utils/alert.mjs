export function showAlert({
  alertBox,
  type = "success",
  message = "",
  duration = 4000,
}) {

  alertBox.classList.remove(
    "d-none",
    "alert-success",
    "alert-danger",
  );
  
  alertBox.classList.add(`alert-${type}`);
  alertBox.innerHTML = message;

  alertBox.scrollIntoView({ behavior: "smooth", block: "center" });

  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, duration);
}

