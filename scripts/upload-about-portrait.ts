import { readFileSync } from "node:fs";
import { resolve } from "node:path";
import { config } from "dotenv";

config();

const cloudName = process.env.VITE_CLOUDINARY_CLOUD_NAME;
const uploadPreset = process.env.VITE_CLOUDINARY_UPLOAD_PRESET;
const imagePath = resolve("src/assets/younesbgr.png");

if (!cloudName || !uploadPreset) {
  console.error("Missing VITE_CLOUDINARY_CLOUD_NAME or VITE_CLOUDINARY_UPLOAD_PRESET in .env");
  process.exit(1);
}

const fileBuffer = readFileSync(imagePath);
const blob = new Blob([fileBuffer], { type: "image/png" });

const formData = new FormData();
formData.append("file", blob, "younesbgr.png");
formData.append("upload_preset", uploadPreset);
formData.append("folder", "portfolio/about");
formData.append("public_id", "younes-portrait");

const response = await fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
  method: "POST",
  body: formData,
});

const payload = (await response.json()) as { public_id?: string; error?: { message?: string } };

if (!response.ok) {
  console.error("Upload failed:", payload.error?.message ?? response.statusText);
  process.exit(1);
}

console.log(payload.public_id);
