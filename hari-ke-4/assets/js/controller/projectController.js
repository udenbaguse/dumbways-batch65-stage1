import { buildValidator } from "../services/validationService.js";
import { showError, showSuccess } from "../services/alertService.js";
import { createProject } from "../factories/projectFactory.js";
import { renderProjectList } from "../view/projectView.js";

const MESSAGES = {
  success: "<strong>Success!</strong> project successfully added.",
  failure:
    "<strong>Failed!</strong> project name, start date, end date, technologies are required.",
  deleted: "<strong>Success!</strong> project deleted.",
};

const validator = buildValidator({
  fields: [
    { selector: "#projectName", rules: ["required"] },
    { selector: "#startDate", rules: ["required"] },
    {
      selector: "#endDate",
      rules: [
        "required",
        { name: "dateOnOrAfter", options: { compareSelector: "#startDate" } },
      ],
    },
  ],
  groups: [
    {
      selector: ".tech-checkbox",
      rules: [{ name: "minChecked", options: { min: 1 } }],
      feedbackSelector: "#techFeedback",
    },
  ],
});

export class ProjectController {
  constructor({ root, store }) {
    this.root = root;
    this.store = store;
    this.selectedImage = "";

    this.alertBox = root.querySelector("#alertBox");
    this.projectsContainer = root.querySelector("#root");
    this.submitBtn = root.querySelector("#submitBtn");
    this.uploadImage = root.querySelector("#uploadImage");
    this.techFeedback = root.querySelector("#techFeedback");
  }

  init() {
    if (!this.submitBtn || !this.projectsContainer) return;

    this.techFeedback?.classList.add("d-none");
    validator.setupRealtime(this.root);
    this.render();

    this.uploadImage?.addEventListener("change", (event) => {
      this.handleImageChange(event);
    });
    this.submitBtn.addEventListener("click", () => this.handleSubmit());
    this.projectsContainer.addEventListener("click", (event) =>
      this.handleProjectAction(event),
    );
  }

  render() {
    renderProjectList(this.projectsContainer, this.store.getAll());
  }

  handleImageChange(event) {
    const file = event.target.files?.[0];
    this.selectedImage = file ? URL.createObjectURL(file) : "";
  }

  collectTechnologies() {
    return [...this.root.querySelectorAll(".tech-checkbox")]
      .filter((checkbox) => checkbox.checked)
      .map((checkbox) => checkbox.value);
  }

  collectFormData() {
    return {
      name: this.root.querySelector("#projectName")?.value ?? "",
      startDate: this.root.querySelector("#startDate")?.value ?? "",
      endDate: this.root.querySelector("#endDate")?.value ?? "",
      description: this.root.querySelector("#description")?.value ?? "",
      technologies: this.collectTechnologies(),
      image: this.selectedImage,
    };
  }

  handleSubmit() {
    if (!validator.validate(this.root)) {
      showError(this.alertBox, MESSAGES.failure);
      return;
    }

    this.store.add(createProject(this.collectFormData()));
    this.render();
    this.resetForm();
    showSuccess(this.alertBox, MESSAGES.success);
  }

  handleProjectAction(event) {
    const actionTrigger = event.target.closest("[data-action]");
    if (!actionTrigger) return;

    const action = actionTrigger.dataset.action;
    const index = Number(actionTrigger.dataset.index);
    if (action !== "delete" || Number.isNaN(index)) return;

    this.store.remove(index);
    this.render();
    showSuccess(this.alertBox, MESSAGES.deleted);
  }

  resetForm() {
    this.root.querySelectorAll("input, textarea").forEach((element) => {
      if (element.type === "checkbox") {
        element.checked = false;
      } else {
        element.value = "";
      }
      element.classList.remove("is-valid", "is-invalid");
    });

    this.techFeedback?.classList.add("d-none");
    if (this.uploadImage) this.uploadImage.value = "";
    this.selectedImage = "";
  }
}
