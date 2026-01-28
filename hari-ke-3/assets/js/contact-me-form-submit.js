const form = document.getElementById("formNama");
const alertBox = document.getElementById("alertBox");

// get all input, select, textarea elements
const inputs = form.querySelectorAll("input, select, textarea");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  let formValid = true;

  //* Loop through each input to check for emptiness
  inputs.forEach((input) => {
    // Logic: If empty (trim) OR (specifically for email) not valid in format
    if (
      input.value.trim() === "" ||
      (input.type === "email" && !input.checkValidity())
    ) {
      input.classList.add("is-invalid"); // Red border
      formValid = false;
    } else {
      input.classList.remove("is-invalid"); // Remove red if already filled
      input.classList.add("is-valid"); // Optional: Green if correct
    }
  });

  //* Display Alert according to validation result
  alertBox.classList.remove("d-none", "alert-success", "alert-danger");

  if (formValid) {
    alertBox.classList.add("alert-success");
    alertBox.innerHTML =
      "<strong>Berhasil!</strong> Pesan Anda telah terkirim.";
    //// form.reset(); // Activate if you want the form empty again after success
  } else {
    alertBox.classList.add("alert-danger");
    alertBox.innerHTML =
      "<strong>Gagal!</strong> Periksa kembali kolom yang bertanda merah.";
  }

  // Scroll to alert
  alertBox.scrollIntoView({ behavior: "smooth", block: "center" });

  // Hide alert after 4 seconds
  setTimeout(() => {
    alertBox.classList.add("d-none");
  }, 4000);
});

// Additional Feature: Automatically remove red border when user starts typing again
inputs.forEach((input) => {
  input.addEventListener("input", () => {
    if (input.value.trim() !== "") {
      input.classList.remove("is-invalid");
    }
  });
});
