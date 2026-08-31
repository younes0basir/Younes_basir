import { AdvancedImage, placeholder } from "@cloudinary/react";
import {
  buildCloudinaryImage,
  buildCloudinaryThumbnail,
  cloudinaryConfigured,
} from "../lib/cloudinary.ts";
import type { ImageFrame } from "../types/media.ts";

type CloudinaryImageProps = {
  publicId: string;
  alt: string;
  className?: string;
  frame?: ImageFrame;
  baseWidth?: number;
  thumbnail?: boolean;
};

export default function CloudinaryImage({
  publicId,
  alt,
  className,
  frame = "landscape",
  baseWidth = 960,
  thumbnail = false,
}: CloudinaryImageProps) {
  if (!publicId || !cloudinaryConfigured) {
    return null;
  }

  const cldImg = thumbnail
    ? buildCloudinaryThumbnail(publicId)
    : buildCloudinaryImage(publicId, frame, baseWidth);

  return (
    <AdvancedImage
      cldImg={cldImg}
      alt={alt}
      className={className}
      plugins={[placeholder({ mode: "blur" })]}
    />
  );
}
