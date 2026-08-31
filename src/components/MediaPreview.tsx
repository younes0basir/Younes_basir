import { getCloudinaryImageUrl, cloudinaryConfigured } from "../lib/cloudinary.ts";
import CloudinaryImage from "./CloudinaryImage.tsx";
import type { ImageFrame } from "../types/media.ts";

type MediaPreviewProps = {
  publicId: string;
  alt: string;
  className?: string;
  frame?: ImageFrame;
  baseWidth?: number;
  thumbnail?: boolean;
};

export default function MediaPreview({
  publicId,
  alt,
  className,
  frame = "landscape",
  baseWidth = 960,
  thumbnail = false,
}: MediaPreviewProps) {
  if (!publicId) {
    return null;
  }

  if (cloudinaryConfigured) {
    return (
      <CloudinaryImage
        publicId={publicId}
        alt={alt}
        className={className}
        frame={frame}
        baseWidth={baseWidth}
        thumbnail={thumbnail}
      />
    );
  }

  return (
    <img
      src={getCloudinaryImageUrl(publicId, frame, baseWidth)}
      alt={alt}
      className={className}
      loading="lazy"
    />
  );
}
