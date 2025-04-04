#!/usr/bin/env node

import { mkdirSync, existsSync, writeFileSync, readFileSync } from "fs";
import { join, dirname } from "path";
import { fileURLToPath } from "url";

// Support ESM __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const args = process.argv.slice(2);

// Handle `visuals add visual`
if (args[0] === "add" && args[1] === "visual") {
  const destDir = join(process.cwd(), "src", "components", "ui");
  const targetFile = join(destDir, "Visual.tsx");
  const templateFile = join(__dirname, "templates", "Visual.tsx");

  // Create folder path if it doesn't exist
  if (!existsSync(destDir)) {
    mkdirSync(destDir, { recursive: true });
    console.log(`📁 Created folder: ${destDir}`);
  }

  // Prevent overwrite
  if (existsSync(targetFile)) {
    console.error("❌ Visual.tsx already exists at src/components/ui/");
    process.exit(1);
  }

  const content = readFileSync(templateFile, "utf-8");
  writeFileSync(targetFile, content);
  console.log("✅ Visual.tsx has been created at src/components/ui/");
} else {
  console.log("Usage: npx visuals add visual");
}
