export function generateProjectId(projects) {
  if (!projects.length) return 1;
  const maxId = Math.max(...projects.map((p) => Number(p.id) || 0));
  return maxId + 1;
}
