import bcrypt from "bcryptjs";
import db from "../db/index.js";

const renderAuthPage = (res, view, title, options = {}) => {
  res.render(view, { title, ...options });
};

export const renderLogin = (req, res) => {
  renderAuthPage(res, "login", "Login", { isAuth: true });
};

export const renderRegister = (req, res) => {
  renderAuthPage(res, "register", "Register", { isAuth: true });
};

export const registerUser = async (req, res) => {
  const { fullName, username, email, password } = req.body || {};

  const trimmedFullName = String(fullName || "").trim();
  const trimmedUsername = String(username || "").trim();
  const trimmedEmail = String(email || "").trim();
  const trimmedPassword = String(password || "").trim();

  if (!trimmedFullName || !trimmedUsername || !trimmedEmail || !trimmedPassword) {
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Semua field wajib diisi.",
    });
  }

  try {
    const existing = await db.query(
      `
      SELECT id
      FROM users
      WHERE username = $1 OR email = $2
      LIMIT 1
      `,
      [trimmedUsername, trimmedEmail]
    );

    if (existing.rows.length > 0) {
      return renderAuthPage(res, "register", "Register", {
        isAuth: true,
        error: "Username atau email sudah digunakan.",
      });
    }

    const passwordHash = await bcrypt.hash(trimmedPassword, 10);

    const result = await db.query(
      `
      INSERT INTO users (full_name, username, email, password_hash, role, created_at)
      VALUES ($1, $2, $3, $4, $5, NOW())
      RETURNING id, full_name, username, email, role
      `,
      [trimmedFullName, trimmedUsername, trimmedEmail, passwordHash, "user"]
    );

    const user = result.rows[0];
    req.session.user = {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return res.redirect("/projects");
  } catch (error) {
    console.error("Failed to register:", error);
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Gagal membuat akun. Coba lagi nanti.",
    });
  }
};

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body || {};
  const trimmedIdentifier = String(identifier || "").trim();
  const trimmedPassword = String(password || "").trim();

  if (!trimmedIdentifier || !trimmedPassword) {
    return renderAuthPage(res, "login", "Login", {
      isAuth: true,
      error: "Username/email dan password wajib diisi.",
    });
  }

  try {
    const result = await db.query(
      `
      SELECT id, full_name, username, email, password_hash, role
      FROM users
      WHERE username = $1 OR email = $1
      LIMIT 1
      `,
      [trimmedIdentifier]
    );

    if (result.rows.length === 0) {
      return renderAuthPage(res, "login", "Login", {
        isAuth: true,
        error: "Akun tidak ditemukan.",
      });
    }

    const user = result.rows[0];
    const passwordMatch = await bcrypt.compare(
      trimmedPassword,
      user.password_hash
    );

    if (!passwordMatch) {
      return renderAuthPage(res, "login", "Login", {
        isAuth: true,
        error: "Password salah.",
      });
    }

    req.session.user = {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
    };

    return res.redirect("/projects");
  } catch (error) {
    console.error("Failed to login:", error);
    return renderAuthPage(res, "login", "Login", {
      isAuth: true,
      error: "Gagal login. Coba lagi nanti.",
    });
  }
};

export const logoutUser = (req, res) => {
  req.session.destroy(() => {
    res.redirect("/");
  });
};
