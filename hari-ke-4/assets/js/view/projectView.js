function createProjectCard(project, index) {
  const card = document.createElement("div");
  card.className = "col-12 col-md-4 mb-4";

  card.innerHTML = `
    <div class="card bg-dark border-light">
      <img src="${project.image}" class="card-img-top" style="height:200px; object-fit:cover;" alt="${project.name}">
      <div class="card-body text-light">
        <h5 class="card-title">${project.name}</h5>

        <p class="card-text small text-muted">
          ${new Date(project.startDate).toLocaleDateString("id-ID")} -
          ${new Date(project.endDate).toLocaleDateString("id-ID")}
        </p>

        <p class="card-text">${project.description}</p>

        <p class="card-text small">
          Technologies: ${project.technologies.join(" ")}
        </p>

        <button type="button" class="btn btn-secondary btn-sm" disabled>Edit</button>
        <button type="button" class="btn btn-danger btn-sm" data-action="delete" data-index="${index}">Delete</button>
      </div>
    </div>
  `;

  return card;
}

export function renderProjectList(container, projects) {
  container.innerHTML = "";
  projects.forEach((project, index) => {
    container.appendChild(createProjectCard(project, index));
  });
}
