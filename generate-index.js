// generate-index.js
import fs from "fs";
import path from "path";

const ROOT = process.cwd();

// Excluded paths
const EXCLUDES = [
    ".git",
    ".github",
    ".github/workflows/generate-pages.yml",
    ".github/workflows/static.yml",
    "node_modules",
];

// Recursively walk through directories and generate links
function listFiles(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const items = [];

    for (const entry of entries) {
        const relPath = path.relative(ROOT, path.join(dir, entry.name));

        // Skip excluded paths
        if (EXCLUDES.some(ex => relPath.startsWith(ex))) continue;

        if (entry.isDirectory()) {
            items.push({
                name: entry.name + "/",
                path: relPath + "/index.html",
                type: "dir",
                children: listFiles(path.join(dir, entry.name))
            });
        } else {
            items.push({
                name: entry.name,
                path: relPath,
                type: "file"
            });
        }
    }
    return items;
}

// Generate HTML
function generateHTML(items) {
    let html = `<html><head><title>Directory Listing</title>
  <style>
  body{font-family:Arial;margin:2em;}
  ul{list-style:none;padding-left:1em;}
  a{text-decoration:none;color:#0366d6;}
  </style>
  </head><body><h1>Directory Listing test</h1><ul>`;

    for (const item of items) {
        html += `<li><a href="${item.path}">${item.name}</a>`;
        if (item.children) html += generateHTML(item.children);
        html += `</li>`;
    }

    html += `</ul></body></html>`;
    return html;
}

// Run generator
const files = listFiles(ROOT);
const html = generateHTML(files);
fs.writeFileSync("index.html", html);
console.log("✅ index.html generated successfully!");
