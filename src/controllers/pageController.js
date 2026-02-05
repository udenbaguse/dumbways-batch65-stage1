const renderPage = (res, view, title) => {
  res.render(view, { title });
};

export const renderHome = (req, res) => {
  renderPage(res, "home", "Home");
};

export const renderProjects = (req, res) => {
  renderPage(res, "my-projects", "My Projects");
};

export const renderProjectDetail = (req, res) => {
  renderPage(res, "my-project-details", "Project Detail");
};

export const renderContact = (req, res) => {
  renderPage(res, "contact-me", "Contact Me");
};

export const renderNotFound = (req, res) => {
  res.status(404);
  renderPage(res, "404", "Page Not Found");
};
