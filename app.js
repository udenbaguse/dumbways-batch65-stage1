import "dotenv/config";
import express from "express";
import path from "path";
import session from "express-session";
import { engine } from "express-handlebars";
import pageRoutes from "./src/routes/pageRoutes.js";
import authRoutes from "./src/routes/authRoutes.js";

const __dirname = import.meta.dirname

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
const isProduction = process.env.NODE_ENV === "production";
app.use(
  session({
    name: "session_id",
    secret: process.env.SESSION_SECRET || "change-this-secret",
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true,
      sameSite: "lax",
      secure: isProduction,
      maxAge: 1000 * 60 * 60 * 24,
    },
  })
);
app.use((req, res, next) => {
  res.locals.user = req.session?.user || null;
  res.locals.flash = req.session?.flash || null;
  if (req.session?.flash) {
    delete req.session.flash;
  }
  next();
});
app.use(express.static(path.join(__dirname, "public")));
app.use("/", authRoutes);
app.use("/", pageRoutes);

app.listen(port, () => {
  console.log(`Server running on http://localhost:${port}`);
});
