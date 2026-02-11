import fs from "fs";
import path from "path";
import "dotenv/config";
import db from "../src/db/index.js";

const uploadsDir = path.join(process.cwd(), "public", "uploads");

const normalizePath = (value) => {
  if (!value || typeof value !== "string") return "";
  if (!value.startsWith("/uploads/")) return "";
  return value.replace(/^\/+/, "");
};

const isDryRun = process.argv.includes("--dry-run");

const run = async () => {
  if (!fs.existsSync(uploadsDir)) {
    console.log("No uploads directory found.");
    process.exit(0);
  }

  const result = await db.query("SELECT image FROM projects WHERE image IS NOT NULL");
  const used = new Set(
    result.rows
      .map((row) => normalizePath(row.image))
      .filter(Boolean)
  );

  const files = fs.readdirSync(uploadsDir);
  let removed = 0;

  for (const file of files) {
    const rel = path.join("uploads", file).replace(/\\/g, "/");
    if (!used.has(rel)) {
      const fullPath = path.join(uploadsDir, file);
      if (!isDryRun) {
        fs.unlinkSync(fullPath);
      }
      removed += 1;
      if (isDryRun) {
        console.log(`[dry-run] would remove: ${rel}`);
      }
    }
  }

  if (isDryRun) {
    console.log(`Dry-run complete. ${removed} file(s) would be removed.`);
  } else {
    console.log(`Removed ${removed} orphaned file(s).`);
  }
  process.exit(0);
};

run().catch((error) => {
  console.error("Failed to clean uploads:", error);
  process.exit(1);
});
