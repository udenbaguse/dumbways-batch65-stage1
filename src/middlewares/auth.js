export const requireAuth = (req, res, next) => {
  if (req.session?.user) {
    return next();
  }

  if (req.method === "GET") {
    return res.redirect("/login");
  }

  return res.status(401).json({
    success: false,
    message: "Harus login untuk mengakses fitur ini.",
  });
};

export const redirectIfAuthenticated = (req, res, next) => {
  if (req.session?.user) {
    return res.redirect("/projects");
  }
  return next();
};
