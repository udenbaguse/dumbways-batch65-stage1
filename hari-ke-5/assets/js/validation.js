// Utility function to toggle validation classes
const toggleValidClass = (element, isValid) => {
  element.classList.toggle("is-invalid", !isValid);
  element.classList.toggle("is-valid", isValid);
};

// Main validation function that handles containers or arrays of inputs
export function validateForm(containerOrInputs) {
  let isFormValid = true;

  const inputs = containerOrInputs.querySelectorAll
    ? containerOrInputs.querySelectorAll("input, select, textarea")
    : containerOrInputs;

  inputs.forEach((input) => {
    const value = input.value?.trim() ?? "";
    const isRequired = input.hasAttribute("required");
    const isEmail = input.type === "email";

    let isValid = true;

    if (isRequired && !value) isValid = false;
    if (isEmail && value && !input.checkValidity()) isValid = false;
    if (input.tagName === "SELECT" && value === "") isValid = false;

    toggleValidClass(input, isValid);

    if (!isValid) isFormValid = false;
  });

  return isFormValid;
}




// export function validateForm(containerOrInputs) {
//   let isFormValid = true;

//   // Accepts either a container (DOM element) or an array of inputs
//   const inputs = containerOrInputs.querySelectorAll
//     ? containerOrInputs.querySelectorAll("input, select, textarea")
//     : containerOrInputs;

//   inputs.forEach((input) => {
//     const value = input.value?.trim() ?? "";
//     const isRequired = input.hasAttribute("required");
//     const isEmail = input.type === "email";

//     // Validation logic
//     let isValid = true;
//     if (isRequired && !value) isValid = false;
//     if (isEmail && value && !field.checkValidity()) isValid = false;
//     if (input.tagName === "SELECT" && value === "") isValid = false;

//     toggleValidClass(field, isValid);
//     if (!isValid) isFormValid = false;
//   });

//   return isFormValid;
// }

// Setup realtime validation by clearing errors on input/change
export function setupRealtimeValidation(container) {
  const fields = container.querySelectorAll("input, select, textarea");

  fields.forEach((field) => {
    const clearError = () => field.classList.remove("is-invalid");

    field.addEventListener("input", clearError);
    field.addEventListener("change", clearError);
  });
}
