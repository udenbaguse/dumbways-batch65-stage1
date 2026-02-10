import bcrypt from "bcryptjs";
import db from "../db/index.js";

const renderAuthPage = (res, view, title, options = {}) => {
  res.render(view, { title, ...options });
};

const normalizeText = (value) => String(value || "").trim();

const isValidEmail = (value) =>
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);

const isValidUsername = (value) =>
  /^[a-zA-Z0-9_]{3,30}$/.test(value);

export const renderLogin = (req, res) => {
  renderAuthPage(res, "login", "Login", { isAuth: true });
};

export const renderRegister = (req, res) => {
  renderAuthPage(res, "register", "Register", { isAuth: true });
};

export const registerUser = async (req, res) => {
  const { fullName, username, email, password } = req.body || {};

  const trimmedFullName = normalizeText(fullName);
  const trimmedUsername = normalizeText(username);
  const trimmedEmail = normalizeText(email);
  const trimmedPassword = normalizeText(password);

  if (!trimmedFullName || !trimmedUsername || !trimmedEmail || !trimmedPassword) {
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Semua field wajib diisi.",
      values: { fullName: trimmedFullName, username: trimmedUsername, email: trimmedEmail },
    });
  }

  if (!isValidUsername(trimmedUsername)) {
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Username harus 3-30 karakter dan hanya boleh huruf/angka/underscore.",
      values: { fullName: trimmedFullName, username: trimmedUsername, email: trimmedEmail },
    });
  }

  if (!isValidEmail(trimmedEmail)) {
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Format email tidak valid.",
      values: { fullName: trimmedFullName, username: trimmedUsername, email: trimmedEmail },
    });
  }

  if (trimmedPassword.length < 6) {
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Password minimal 6 karakter.",
      values: { fullName: trimmedFullName, username: trimmedUsername, email: trimmedEmail },
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
        values: { fullName: trimmedFullName, username: trimmedUsername, email: trimmedEmail },
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
    req.session.flash = {
      type: "success",
      message: "Registrasi berhasil. Selamat datang!",
    };

    return res.redirect("/projects");
  } catch (error) {
    console.error("Failed to register:", error);
    return renderAuthPage(res, "register", "Register", {
      isAuth: true,
      error: "Gagal membuat akun. Coba lagi nanti.",
      values: { fullName: trimmedFullName, username: trimmedUsername, email: trimmedEmail },
    });
  }
};

export const loginUser = async (req, res) => {
  const { identifier, password } = req.body || {};
  const trimmedIdentifier = normalizeText(identifier);
  const trimmedPassword = normalizeText(password);

  if (!trimmedIdentifier || !trimmedPassword) {
    return renderAuthPage(res, "login", "Login", {
      isAuth: true,
      error: "Username/email dan password wajib diisi.",
      values: { identifier: trimmedIdentifier },
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
        values: { identifier: trimmedIdentifier },
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
        values: { identifier: trimmedIdentifier },
      });
    }

    req.session.user = {
      id: user.id,
      fullName: user.full_name,
      username: user.username,
      email: user.email,
      role: user.role,
    };
    req.session.flash = {
      type: "success",
      message: "Login berhasil. Selamat datang kembali!",
    };

    return res.redirect("/projects");
  } catch (error) {
    console.error("Failed to login:", error);
    return renderAuthPage(res, "login", "Login", {
      isAuth: true,
      error: "Gagal login. Coba lagi nanti.",
      values: { identifier: trimmedIdentifier },
    });
  }
};

export const logoutUser = (req, res) => {
  if (req.session) {
    req.session.user = null;
    req.session.flash = {
      type: "success",
      message: "Berhasil logout.",
    };
  }
  res.redirect("/");
};
