import { loadProjects, saveProjects } from "./../utils/storage.js";
import { createProjectCard } from "./../components/template-card.js";

export let projects = loadProjects();

// export function renderProjects() {
//   const projectsContainer = document.querySelector("#root");
//   projectsContainer.innerHTML = "";
//   projects.forEach((project) => {
//     projectsContainer.appendChild(createProjectCard(project));
//   });
// }

  //todo rewrite renderProjects use map
export function renderProjects() {
  const projectsContainer = document.querySelector("#root");

  projectsContainer.innerHTML = "";

  const cards = projects.map((project) => createProjectCard(project));

  projectsContainer.append(...cards);
}


  //todo use filter
export function setupDeleteHandlers() {
  const projectsContainer = document.querySelector("#root");

  projectsContainer.addEventListener("click", (e) => {
    if (e.target.classList.contains("btn-delete")) {
      const projectId = e.target.getAttribute("data-id");
      projects = projects.filter((project) => project.id != projectId);
      saveProjects(projects);
      renderProjects();
    }
  });
}

// Initial render and setup
renderProjects();
setupDeleteHandlers();
