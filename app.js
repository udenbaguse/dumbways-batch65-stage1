import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const port = 3000;

// View engine (Handlebars with layouts)
app.engine(
  "hbs",
  engine({
    extname: "hbs",
    defaultLayout: "main",
    layoutsDir: path.join(__dirname, "src/views/layouts"),
    partialsDir: path.join(__dirname, "src/views/partials"),
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.static(path.join(__dirname, "public")));

// Routes
app.get("/", (req, res) => {
  res.render("home", { title: "Home" });
});

app.get("/projects", (req, res) => {
  res.render("projects", { title: "Projects" });
});

app.get("/project-detail", (req, res) => {
  res.render("project-detail", { title: "Project Detail" });
});

app.get("/contact", (req, res) => {
  res.render("contact", { title: "Contact" });
});

// 404 handler
app.use((req, res) => {
  res.status(404).render("404", { title: "Page Not Found" });
});

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
