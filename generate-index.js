// generate-index.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();
const OUTPUT = path.join(ROOT, "index.html");
const DATA_FILE = "directory.json";

const EXCLUDES = [
  ".git",
  ".github",
  "node_modules",
  "css",
  "js",
  "generate-index.js"
];

// Recursively read files
function readDirRecursive(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  return entries
    .filter(e => !EXCLUDES.includes(e.name))
    .map(e => ({
      name: e.name,
      path: path.relative(ROOT, path.join(dir, e.name)),
      isDir: e.isDirectory(),
      children: e.isDirectory() ? readDirRecursive(path.join(dir, e.name)) : [],
    }));
}

const data = readDirRecursive(ROOT);

// Write JSON file
fs.writeFileSync(DATA_FILE, JSON.stringify(data, null, 2));

// Write HTML file that loads React and your JS app
const html = `
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Directory Listing</title>
  <link rel="stylesheet" href="css/style.css">
</head>
<body>
  <div id="root">Loading...</div>
  <script type="module" src="js/react-app.js"></script>
</body>
</html>
`;

fs.writeFileSync(OUTPUT, html);
console.log("✅ Generated index.html and directory.json");
