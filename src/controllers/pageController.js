import db from "../db.js";

const renderPage = (res, view, title, options = {}) => {
  res.render(view, { title, ...options });
};

export const renderHome = (req, res) => {
  renderPage(res, "home", "Home", { isHome: true });
};

export const renderProjects = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT
        p.id,
        p.name,
        p.start_date,
        p.end_date,
        p.description,
        p.image_path,
        COALESCE(
          ARRAY_AGG(t.name ORDER BY t.name) FILTER (WHERE t.name IS NOT NULL),
          '{}'
        ) AS technologies
      FROM projects p
      LEFT JOIN project_technologies pt ON pt.project_id = p.id
      LEFT JOIN technologies t ON t.id = pt.technology_id
      GROUP BY p.id
      ORDER BY p.created_at DESC
      `
    );

    const projects = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      startDate: row.start_date,
      endDate: row.end_date,
      description: row.description,
      image:
        row.image_path ||
        "https://via.placeholder.com/800x400?text=Project+Image",
      technologies: row.technologies || [],
      techList: (row.technologies || []).join(", "),
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
  const { name, startDate, endDate, description, technologies, imagePath } =
    req.body || {};

  const trimmedName = String(name || "").trim();
  const trimmedDescription = String(description || "").trim();
  const techList = Array.isArray(technologies)
    ? technologies
    : typeof technologies === "string" && technologies.length > 0
      ? [technologies]
      : [];

  if (!trimmedName || !startDate || !endDate || techList.length === 0) {
    return res.status(400).json({
      success: false,
      message: "Field wajib belum lengkap.",
    });
  }

  const defaultUserId = Number(process.env.DEFAULT_USER_ID || 0);
  if (!defaultUserId) {
    return res.status(500).json({
      success: false,
      message: "DEFAULT_USER_ID belum diset di .env.",
    });
  }

  const client = await db.connect();
  try {
    await client.query("BEGIN");

    const insertProject = await client.query(
      `
      INSERT INTO projects
        (user_id, name, start_date, end_date, description, image_path)
      VALUES
        ($1, $2, $3, $4, $5, $6)
      RETURNING id
      `,
      [
        defaultUserId,
        trimmedName,
        startDate,
        endDate,
        trimmedDescription || null,
        imagePath || null,
      ]
    );

    const projectId = insertProject.rows[0].id;

    if (techList.length > 0) {
      const techRows = await client.query(
        `
        SELECT id, name
        FROM technologies
        WHERE name = ANY($1)
        `,
        [techList]
      );

      if (techRows.rows.length !== techList.length) {
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
