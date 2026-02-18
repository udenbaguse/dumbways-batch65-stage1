import fs from "fs";
import path from "path";
import db from "../db/index.js";

const renderPage = (res, view, title, options = {}) => {
  res.render(view, { title, ...options });
};

const removeUploadIfExists = (imagePath) => {
  if (!imagePath || typeof imagePath !== "string") return;
  if (!imagePath.startsWith("/uploads/")) return;
  const relativePath = imagePath.replace(/^\/+/, "");
  const fullPath = path.join(process.cwd(), "public", relativePath);
  if (fs.existsSync(fullPath)) {
    fs.unlinkSync(fullPath);
  }
};

export const renderHome = (req, res) => {
  renderPage(res, "home", "Home", { isHome: true });
};

export const renderProjects = async (req, res) => {
  const sessionUserId = Number(req.session?.user?.id || 0);
  if (!sessionUserId) {
    return res.redirect("/login");
  }
  try {
    const result = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.start_date,
        p.end_date,
        p.description,
        p.image,
        COALESCE(
          ARRAY_AGG(t.icon_html ORDER BY t.name) FILTER (WHERE t.icon_html IS NOT NULL),
          '{}'
        ) AS technologies
      FROM projects p
      LEFT JOIN project_technologies pt ON pt.project_id = p.id
      LEFT JOIN technologies t ON t.id = pt.technology_id
      WHERE p.user_id = $1
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `,
      [sessionUserId]
    );

    const projects = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      startDate: row.start_date,
      endDate: row.end_date,
      description: row.description,
      image:
        row.image || "https://via.placeholder.com/800x400?text=Project+Image",
      technologies: row.technologies || [],
      techIcons: row.technologies || [],
      techIconsCsv: (row.technologies || []).join(","),
      startDateISO: row.start_date
        ? new Date(row.start_date).toISOString().slice(0, 10)
        : "",
      endDateISO: row.end_date
        ? new Date(row.end_date).toISOString().slice(0, 10)
        : "",
      startDateFormatted: row.start_date
        ? new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(row.start_date))
        : "",
      endDateFormatted: row.end_date
        ? new Intl.DateTimeFormat("id-ID", {
            day: "2-digit",
            month: "long",
            year: "numeric",
          }).format(new Date(row.end_date))
        : "",
    }));

    renderPage(res, "my-projects", "My Projects", {
      isProjects: true,
      projects,
    });
  } catch (error) {
    console.error("Failed to load projects:", error);
    renderPage(res, "my-projects", "My Projects", {
      isProjects: true,
      projects: [],
      dbError: true,
    });
  }
};

export const createProject = async (req, res) => {
  const { name, startDate, endDate, description, technologies } = req.body || {};
  const imagePath = req.file ? `/uploads/${req.file.filename}` : null;

  const trimmedName = String(name || "").trim();
  const trimmedDescription = String(description || "").trim();
  const techList = Array.isArray(technologies)
    ? technologies
    : typeof technologies === "string" && technologies.length > 0
      ? [technologies]
      : [];
  const normalizedTechList = techList
    .map((tech) => String(tech || "").trim())
    .filter(Boolean);

  if (!trimmedName || !startDate || !endDate || normalizedTechList.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Field wajib belum lengkap.",
    });
  }

  const sessionUserId = Number(req.session?.user?.id || 0);
  if (!sessionUserId) {
    return res.status(500).json({
      success: false,
      message: "User belum login.",
    });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const insertProject = await client.query(
      `
      INSERT INTO projects
        (user_id, name, start_date, end_date, description, image, created_at, updated_at)
      VALUES
        ($1, $2, $3, $4, $5, $6, NOW(), NOW())
      RETURNING id
      `,
      [
        sessionUserId,
        trimmedName,
        startDate,
        endDate,
        trimmedDescription || null,
        imagePath,
      ]
    );

    const projectId = insertProject.rows[0].id;

    if (normalizedTechList.length > 0) {
      const techRows = await client.query(
        `
        SELECT id, name
        FROM technologies
        WHERE icon_html = ANY($1)
        `,
        [normalizedTechList]
      );

      if (techRows.rows.length !== normalizedTechList.length) {
        throw new Error("Beberapa teknologi tidak ditemukan di database.");
      }

      const values = techRows.rows
        .map((row, index) => `($1, $${index + 2})`)
        .join(", ");

      await client.query(
        `
        INSERT INTO project_technologies (project_id, technology_id)
        VALUES ${values}
        `,
        [projectId, ...techRows.rows.map((row) => row.id)]
      );
    }

    await client.query("COMMIT");
    return res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to create project:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menyimpan project.",
    });
  } finally {
    client.release();
  }
};

export const updateProject = async (req, res) => {
  const projectId = Number(req.params.id || 0);
  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "ID project tidak valid.",
    });
  }
  const sessionUserId = Number(req.session?.user?.id || 0);
  if (!sessionUserId) {
    return res.status(401).json({
      success: false,
      message: "User belum login.",
    });
  }

  const { name, startDate, endDate, description, technologies, existingImage } =
    req.body || {};
  const imagePath = req.file
    ? `/uploads/${req.file.filename}`
    : existingImage || null;

  const trimmedName = String(name || "").trim();
  const trimmedDescription = String(description || "").trim();
  const techList = Array.isArray(technologies)
    ? technologies
    : typeof technologies === "string" && technologies.length > 0
      ? [technologies]
      : [];
  const normalizedTechList = techList
    .map((tech) => String(tech || "").trim())
    .filter(Boolean);

  if (!trimmedName || !startDate || !endDate || normalizedTechList.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Field wajib belum lengkap.",
    });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const updateResult = await client.query(
      `
      UPDATE projects
      SET name = $1,
          start_date = $2,
          end_date = $3,
          description = $4,
          image = $5,
          updated_at = NOW()
      WHERE id = $6 AND user_id = $7
      `,
      [
        trimmedName,
        startDate,
        endDate,
        trimmedDescription || null,
        imagePath || null,
        projectId,
        sessionUserId,
      ]
    );

    if (updateResult.rowCount === 0) {
      throw new Error("Project tidak ditemukan atau bukan milikmu.");
    }

    if (req.file && existingImage) {
      removeUploadIfExists(existingImage);
    }

    await client.query(
      `
      DELETE FROM project_technologies
      WHERE project_id = $1
      `,
      [projectId]
    );

    const techRows = await client.query(
      `
      SELECT id, name
      FROM technologies
      WHERE icon_html = ANY($1)
      `,
      [normalizedTechList]
    );

    if (techRows.rows.length !== normalizedTechList.length) {
      throw new Error("Beberapa teknologi tidak ditemukan di database.");
    }

    const values = techRows.rows
      .map((row, index) => `($1, $${index + 2})`)
      .join(", ");

    await client.query(
      `
      INSERT INTO project_technologies (project_id, technology_id)
      VALUES ${values}
      `,
      [projectId, ...techRows.rows.map((row) => row.id)]
    );

    await client.query("COMMIT");
    return res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to update project:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal update project.",
    });
  } finally {
    client.release();
  }
};

export const deleteProject = async (req, res) => {
  const projectId = Number(req.params.id || 0);
  if (!projectId) {
    return res.status(400).json({
      success: false,
      message: "ID project tidak valid.",
    });
  }
  const sessionUserId = Number(req.session?.user?.id || 0);
  if (!sessionUserId) {
    return res.status(401).json({
      success: false,
      message: "User belum login.",
    });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const ownership = await client.query(
      `
      SELECT id
      FROM projects
      WHERE id = $1 AND user_id = $2
      `,
      [projectId, sessionUserId]
    );

    if (ownership.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Project tidak ditemukan.",
      });
    }

    await client.query(
      `
      DELETE FROM project_technologies
      WHERE project_id = $1
      `,
      [projectId]
    );

    const result = await client.query(
      `
      DELETE FROM projects
      WHERE id = $1 AND user_id = $2
      `,
      [projectId, sessionUserId]
    );

    await client.query("COMMIT");

    if (result.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "Project tidak ditemukan.",
      });
    }

    return res.json({ success: true });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Failed to delete project:", error);
    return res.status(500).json({
      success: false,
      message: "Gagal menghapus project.",
    });
  } finally {
    client.release();
  }
};

export const renderProjectDetail = async (req, res) => {
  const projectId = Number(req.params.id || 0);
  if (!projectId) {
    res.status(400);
    return renderPage(res, "project-detail", "Project Detail", {
      project: null,
      dbError: true,
    });
  }
  const sessionUserId = Number(req.session?.user?.id || 0);
  if (!sessionUserId) {
    return res.redirect("/login");
  }

  try {
    const result = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.start_date,
        p.end_date,
        p.description,
        p.image,
        COALESCE(
          ARRAY_AGG(t.icon_html ORDER BY t.name) FILTER (WHERE t.icon_html IS NOT NULL),
          '{}'
        ) AS technologies
      FROM projects p
      LEFT JOIN project_technologies pt ON pt.project_id = p.id
      LEFT JOIN technologies t ON t.id = pt.technology_id
      WHERE p.id = $1 AND p.user_id = $2
      GROUP BY p.id
      `,
      [projectId, sessionUserId]
    );

    if (result.rows.length === 0) {
      res.status(404);
      return renderPage(res, "project-detail", "Project Detail", {
        project: null,
        notFound: true,
      });
    }

    const row = result.rows[0];
    const project = {
      id: row.id,
      name: row.name,
      startDate: row.start_date,
      endDate: row.end_date,
      description: row.description,
      image: row.image || "https://via.placeholder.com/800x400?text=Project+Image",
      technologies: row.technologies || [],
    };

    return renderPage(res, "project-detail", "Project Detail", { project });
  } catch (error) {
    console.error("Failed to load project detail:", error);
    res.status(500);
    return renderPage(res, "project-detail", "Project Detail", {
      project: null,
      dbError: true,
    });
  }
};

export const renderContact = (req, res) => {
  renderPage(res, "contact-me", "Contact Me", { isContact: true });
};

export const renderNotFound = (req, res) => {
  res.status(404);
  renderPage(res, "404", "Page Not Found");
};
