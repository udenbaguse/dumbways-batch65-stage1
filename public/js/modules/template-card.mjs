export function createProjectCard(project) {
  const card = document.createElement("div");
  card.className = "col-12 col-md-4 mb-4";

  card.innerHTML = `
  <div class="card bg-dark border-light h-100" data-id="${project.id}">
  <img
    src="${project.image}"
    class="card-img-top"
    style="height: 200px; object-fit: cover;"
    alt="Gambar Proyek"

  />
  <div class="card-body text-light d-flex flex-column">
    <h3 class="card-title">${project.name}</h3>
    <p class="card-text small text-muted">
      ${new Date(project.startDate).toLocaleDateString("id-ID")} -
      ${new Date(project.endDate).toLocaleDateString("id-ID")}
    </p>

    <p class="card-text" style="height: 80px; overflow-y: auto;">
      ${project.description}
    </p>

    <p class="card-text small flex-shrink-0">
      Technologies: ${project.technologies.join(" ")}
    </p>

    <div class="mt-auto">
      <a
        href="/project-detail/${project.id}"
        class="btn btn-primary btn-sm w-100 mb-2"
      >
        Detail
      </a>
      <div class="d-flex gap-2">
        <button
          class="btn btn-secondary btn-sm btn-edit w-50"
          data-id="${project.id}"
        >
          Edit
        </button>
        <button
          class="btn btn-danger btn-sm btn-delete w-50"
          data-id="${project.id}"
        >
          Delete
        </button>
      </div>
    </div>
  </div>
</div>
  `;

  return card;
}
