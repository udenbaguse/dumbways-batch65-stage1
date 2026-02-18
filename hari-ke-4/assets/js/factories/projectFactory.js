const DEFAULT_IMAGE = "https://via.placeholder.com/300x200";
const DEFAULT_DESCRIPTION = "Nothing description";

export function createProject(rawProject) {
  return {
    name: rawProject.name.trim(),
    startDate: rawProject.startDate,
    endDate: rawProject.endDate,
    description: rawProject.description.trim() || DEFAULT_DESCRIPTION,
    technologies: rawProject.technologies ?? [],
    image: rawProject.image || DEFAULT_IMAGE,
  };
}
