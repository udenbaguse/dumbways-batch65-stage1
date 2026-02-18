export class ProjectStore {
  constructor() {
    this.projects = [];
  }

  getAll() {
    return [...this.projects];
  }

  add(project) {
    this.projects.push(project);
  }

  remove(index) {
    if (index < 0 || index >= this.projects.length) return;
    this.projects.splice(index, 1);
  }
}
