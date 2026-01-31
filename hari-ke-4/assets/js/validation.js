// Utility function to toggle validation classes
const toggleValidClass = (element, isValid) => {
  element.classList.toggle("is-invalid", !isValid);
  element.classList.toggle("is-valid", isValid);
};

// Main validation function that handles containers or arrays of inputs
export function validateForm(containerOrInputs) {
  let isFormValid = true;

  // Accepts either a container (DOM element) or an array of inputs
  const fields = containerOrInputs.querySelectorAll
    ? containerOrInputs.querySelectorAll("input, select, textarea")
    : containerOrInputs;

  fields.forEach((field) => {
    const value = field.value?.trim() ?? "";
    const isRequired = field.hasAttribute("required");
    const isEmail = field.type === "email";

    // Validation logic
    let isValid = true;
    if (isRequired && !value) isValid = false;
    if (isEmail && value && !field.checkValidity()) isValid = false;
    if (field.tagName === "SELECT" && value === "") isValid = false;

    toggleValidClass(field, isValid);
    if (!isValid) isFormValid = false;
  });

  return isFormValid;
}

// Setup realtime validation by clearing errors on input/change
export function setupRealtimeValidation(container) {
  const fields = container.querySelectorAll("input, select, textarea");

  fields.forEach((field) => {
    const clearError = () => field.classList.remove("is-invalid");

    field.addEventListener("input", clearError);
    field.addEventListener("change", clearError);
  });
}
