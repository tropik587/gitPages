// generate-index.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Files and directories to exclude
const EXCLUDES = [
  ".git",
  ".github",
  ".github/workflows/generate-pages.yml",
  ".github/workflows/static.yml",
  "node_modules",
  "css/style.css"
];

function listFiles(dir) {
  return fs.readdirSync(dir, { withFileTypes: true })
    .filter(entry => !EXCLUDES.some(ex => path.relative(ROOT, path.join(dir, entry.name)).startsWith(ex)))
    .map(entry => ({
      name: entry.name,
      fullPath: path.join(dir, entry.name),
      relPath: path.relative(ROOT, path.join(dir, entry.name)),
      isDir: entry.isDirectory()
    }));
}

function generateHTML(items, relativePath = "") {
  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Directory Listing - ${relativePath || "/"}</title>
      <link rel="stylesheet" href="${relativePath ? "../".repeat(relativePath.split("/").length) : ""}css/style.css" />
    </head>
    <body>
      <h1>Directory Listing: /${relativePath || ""}</h1>
      <div class="container">
        ${relativePath ? `<div class="item"><div class="icon">⬅️</div><a href="../">Back</a></div>` : ""}
        ${items.map(item => `
          <div class="item">
            <div class="icon">${item.isDir ? "📁" : "📄"}</div>
            <a href="${item.isDir ? item.name + "/index.html" : item.name}">${item.name}</a>
          </div>
        `).join("\n")}
      </div>
    </body>
  </html>`;
}

function generateIndexes(currentDir = ROOT, relativePath = "") {
  const entries = listFiles(currentDir);
  const html = generateHTML(entries, relativePath);
  const outputPath = path.join(currentDir, "index.html");
  fs.writeFileSync(outputPath, html);
  console.log("✅ Generated:", outputPath);

  // Recurse into subdirectories
  for (const entry of entries) {
    if (entry.isDir) {
      generateIndexes(entry.fullPath, path.relative(ROOT, entry.fullPath));
    }
  }
}

// Ensure CSS directory exists
if (!fs.existsSync(path.join(ROOT, "css"))) {
  fs.mkdirSync(path.join(ROOT, "css"));
}

// Run generator
generateIndexes();
console.log("🎉 All index.html files generated successfully!");
