// get project ID from URL
const urlParams = new URLSearchParams(window.location.search);
const projectId = parseInt(urlParams.get("id"));

// get project from local storage
let projects = [];

// find project by ID
const project = projects.find((p) => p.id === projectId);

// handle case if project not found
if (!project) {
  document.getElementById("projectTitle").textContent = "Project Not Found";
  throw new Error("Project not found!");
}

// format date function
function formatDate(dateStr) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-GB", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

// calculate duration function
function calculateDuration(start, end) {
  const s = new Date(start);
  const e = new Date(end);
  const diff = e - s;
  const day = diff / (1000 * 60 * 60 * 24);
  return `${day} days`;
}

// to html elements
document.getElementById("projectTitle").textContent = project.name;
document.getElementById("projectImage").src = project.image;
document.getElementById("projectDate").textContent = `${formatDate(
  project.startDate,
)} - ${formatDate(project.endDate)}`;
document.getElementById("projectDuration").textContent = calculateDuration(
  project.startDate,
  project.endDate,
);
document.getElementById("projectDescription").textContent = project.description;

// render arr technologies
document.getElementById("techList").innerHTML = project.technologies
  .map((t) => `<span class="badge bg-primary-subtle me-2">${t}</span>`)
  .join("");
