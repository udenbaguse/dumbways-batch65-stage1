export function setupDeleteHandlers() {
  const projectsContainer = document.querySelector("#root");
  projectsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const projectId = e.target.getAttribute("data-id");
      projects = projects.filter((project) => project.id != projectId);
      renderProjects();
    }
  });
}
