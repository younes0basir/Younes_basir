import { Cloudinary } from "@cloudinary/url-gen";
import { format, quality } from "@cloudinary/url-gen/actions/delivery";
import { fill, scale } from "@cloudinary/url-gen/actions/resize";
import { autoGravity, compass } from "@cloudinary/url-gen/qualifiers/gravity";
import type { ImageFrame } from "../types/media.ts";

export const CLOUDINARY_FOLDERS = {
  about: "portfolio/about",
  gallery: "portfolio/gallery",
  projects: "portfolio/projects",
} as const;

export type CloudinaryFolder = (typeof CLOUDINARY_FOLDERS)[keyof typeof CLOUDINARY_FOLDERS];

export const cloudinaryCloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME ?? "";
export const cloudinaryUploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET ?? "";

export const cloudinaryConfigured = Boolean(cloudinaryCloudName);

// Warn in production if Cloudinary env is missing — Vite inlines VITE_* at build time,
// so a Vercel deploy without these vars will silently break uploads/images.
if (!cloudinaryConfigured && !import.meta.env.DEV) {
  console.warn(
    "[cloudinary] VITE_CLOUDINARY_CLOUD_NAME missing — images/uploads disabled. Add it in Vercel → Settings → Environment Variables and redeploy.",
  );
}
if (!cloudinaryUploadPreset && !import.meta.env.DEV && cloudinaryConfigured) {
  console.warn(
    "[cloudinary] VITE_CLOUDINARY_UPLOAD_PRESET missing — uploads will fail. Create an UNSIGNED preset in Cloudinary Console and add it to Vercel env.",
  );
}

export const cld = new Cloudinary({
  cloud: {
    cloudName: cloudinaryCloudName || "placeholder",
  },
});

type FrameSize = {
  width: number;
  height: number;
};

function frameGravity(frame: ImageFrame) {
  switch (frame) {
    case "landscape":
    case "wide":
      return compass("north");
    case "square":
    case "portrait":
      return autoGravity();
    case "original":
      return compass("center");
    default: {
      const exhaustive: never = frame;
      return exhaustive;
    }
  }
}

function frameSize(frame: ImageFrame, baseWidth = 960): FrameSize {
  switch (frame) {
    case "landscape":
      return { width: baseWidth, height: Math.round(baseWidth * 0.75) };
    case "square":
      return { width: baseWidth, height: baseWidth };
    case "wide":
      return { width: baseWidth, height: Math.round(baseWidth * 0.5625) };
    case "portrait":
      return { width: Math.round(baseWidth * 0.75), height: baseWidth };
    case "original":
      return { width: baseWidth, height: baseWidth };
    default: {
      const exhaustive: never = frame;
      return exhaustive;
    }
  }
}

export function buildCloudinaryImage(
  publicId: string,
  frame: ImageFrame = "landscape",
  baseWidth = 960,
) {
  const image = cld.image(publicId).delivery(format("auto")).delivery(quality("auto"));

  if (frame === "original") {
    return image.resize(scale().width(baseWidth));
  }

  const { width, height } = frameSize(frame, baseWidth);
  return image.resize(fill().width(width).height(height).gravity(frameGravity(frame)));
}

export function buildCloudinaryThumbnail(publicId: string) {
  return cld
    .image(publicId)
    .resize(scale().width(120))
    .delivery(format("auto"))
    .delivery(quality("auto"));
}

export function getCloudinaryImageUrl(
  publicId: string,
  frame: ImageFrame = "landscape",
  baseWidth = 960,
): string {
  if (!publicId || !cloudinaryConfigured) {
    return "";
  }

  if (publicId.startsWith("http://") || publicId.startsWith("https://")) {
    return publicId;
  }

  return buildCloudinaryImage(publicId, frame, baseWidth).toURL();
}

export async function uploadToCloudinary(
  file: File,
  folder: CloudinaryFolder,
): Promise<string> {
  if (!cloudinaryConfigured) {
    throw new Error("Cloudinary is not configured. Set VITE_CLOUDINARY_CLOUD_NAME in .env.");
  }

  if (!cloudinaryUploadPreset) {
    throw new Error(
      "Missing VITE_CLOUDINARY_UPLOAD_PRESET. Create an unsigned upload preset in Cloudinary Console.",
    );
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", cloudinaryUploadPreset);
  formData.append("folder", folder);

  const response = await fetch(
    `https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`,
    {
      method: "POST",
      body: formData,
    },
  );

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || "Cloudinary upload failed.");
  }

  const payload = (await response.json()) as { public_id: string };
  return payload.public_id;
}

export async function uploadManyToCloudinary(files: File[], folder: CloudinaryFolder) {
  const uploads = await Promise.all(files.map((file) => uploadToCloudinary(file, folder)));
  return uploads;
}

export function uploadGalleryImages(files: File[]) {
  return uploadManyToCloudinary(files, CLOUDINARY_FOLDERS.gallery);
}

export function uploadProjectImages(files: File[]) {
  return uploadManyToCloudinary(files, CLOUDINARY_FOLDERS.projects);
}

export function uploadGalleryImage(file: File) {
  return uploadToCloudinary(file, CLOUDINARY_FOLDERS.gallery);
}

export function uploadProjectImage(file: File) {
  return uploadToCloudinary(file, CLOUDINARY_FOLDERS.projects);
}
