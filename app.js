import "dotenv/config";
import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { engine } from "express-handlebars";
import pageRoutes from "./src/routes/pageRoutes.js";

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
    helpers: {
      formatDate(value) {
        if (!value) return "";
        const date = value instanceof Date ? value : new Date(value);
        if (Number.isNaN(date.getTime())) return "";
        return new Intl.DateTimeFormat("id-ID", {
          day: "2-digit",
          month: "long",
          year: "numeric",
        }).format(date);
      },
      join(list, separator = ", ") {
        if (!Array.isArray(list)) return "";
        return list.join(separator);
      },
      calculateDate(start, end) {
        if (!start || !end) return "";
        const startDate = start instanceof Date ? start : new Date(start);
        const endDate = end instanceof Date ? end : new Date(end);
        if (Number.isNaN(startDate.getTime()) || Number.isNaN(endDate.getTime())) {
          return "";
        }
        const diffMs = Math.abs(endDate - startDate);
        const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1;
        return `${diffDays} day${diffDays > 1 ? "s" : ""}`;
      },
    },
  })
);
app.set("view engine", "hbs");
app.set("views", path.join(__dirname, "src/views"));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.use("/", pageRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
