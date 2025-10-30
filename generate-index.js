// generate-index.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Files/folders to exclude
const EXCLUDES = [
  ".git",
  ".github",
  ".github/workflows/generate-pages.yml",
  ".github/workflows/static.yml",
  "node_modules",
  "css/style.css", // don’t list the style file itself
];

// Recursively list files and directories
function listFiles(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  const items = [];

  for (const entry of entries) {
    const relPath = path.relative(ROOT, path.join(dir, entry.name));

    // Skip excluded paths
    if (EXCLUDES.some(ex => relPath.startsWith(ex))) continue;

    items.push({
      name: entry.name,
      path: relPath + (entry.isDirectory() ? "/" : ""),
      type: entry.isDirectory() ? "dir" : "file",
    });
  }

  return items;
}

// Generate HTML referencing external CSS
function generateHTML(items) {
  return `
  <html>
    <head>
      <meta charset="UTF-8" />
      <title>Directory Listing</title>
      <link rel="stylesheet" href="css/style.css" />
    </head>
    <body>
      <h1>Directory Listing</h1>
      <div class="container">
        ${items
          .map(
            item => `
            <div class="item">
              <div class="icon">${item.type === "dir" ? "📁" : "📄"}</div>
              <a href="${item.path}">${item.name}</a>
            </div>`
          )
          .join("\n")}
      </div>
    </body>
  </html>`;
}

// Run the generator
const items = listFiles(ROOT);
const html = generateHTML(items);

// Ensure css directory exists if not already
if (!fs.existsSync(path.join(ROOT, "css"))) {
  fs.mkdirSync(path.join(ROOT, "css"));
}

fs.writeFileSync("index.html", html);
console.log("✅ index.html generated successfully!");
