export function renderProjects() {
  const projectsContainer = document.querySelector("#root");
  projectsContainer.innerHTML = "";
  const cards = projects.map((project) => createProjectCard(project));
  projectsContainer.append(...cards);
}
