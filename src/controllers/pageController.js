const renderPage = (res, view, title, options = {}) => {
  res.render(view, { title, ...options });
};

export const renderHome = (req, res) => {
  renderPage(res, "home", "Home", { isHome: true });
};

export const renderProjects = (req, res) => {
  renderPage(res, "my-projects", "My Projects", { isProjects: true });
};

export const renderProjectDetail = (req, res) => {
  renderPage(res, "project-detail", "Project Detail");
};

export const renderContact = (req, res) => {
  renderPage(res, "contact-me", "Contact Me", { isContact: true });
};

export const renderNotFound = (req, res) => {
  res.status(404);
  renderPage(res, "404", "Page Not Found");
};
