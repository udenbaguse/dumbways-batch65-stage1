import { buildValidator } from "../services/validationService.js";
import { showError, showSuccess } from "../services/alertService.js";

const MESSAGES = {
  success: "<strong>Done!</strong> invoice will be sent via email.",
  failure: "<strong>Failed!</strong> check the red fields.",
};

const validator = buildValidator({
  fields: [
    { selector: "#name", rules: ["required"] },
    { selector: "#email", rules: ["required", "email"] },
    { selector: "#phone", rules: ["required"] },
    { selector: "#subject", rules: ["required"] },
    { selector: "#message", rules: ["required"] },
  ],
});

export class ContactController {
  constructor({ form, alertBox }) {
    this.form = form;
    this.alertBox = alertBox;
  }

  init() {
    if (!this.form || !this.alertBox) return;

    validator.setupRealtime(this.form);
    this.form.addEventListener("submit", (event) => this.handleSubmit(event));
  }

  handleSubmit(event) {
    event.preventDefault();

    if (!validator.validate(this.form)) {
      showError(this.alertBox, MESSAGES.failure);
      return;
    }

    showSuccess(this.alertBox, MESSAGES.success);
  }
}
