export function saveProjects(projects) {
  localStorage.setItem("projects", JSON.stringify(projects));
}

export function loadProjects() {
  const projectsData = localStorage.getItem("projects");
  return projectsData ? JSON.parse(projectsData) : [];
}
