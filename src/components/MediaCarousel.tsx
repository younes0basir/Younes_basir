import { useState, type MouseEvent } from "react";
import MediaPreview from "./MediaPreview.tsx";
import {
  frameAspectClass,
  frameObjectClass,
  resolveMainImagePublicId,
  type MediaFields,
} from "../types/media.ts";

type MediaCarouselProps = {
  media: MediaFields;
  alt: string;
  className?: string;
  imageClassName?: string;
  featured?: boolean;
  showThumbnails?: boolean;
  cover?: boolean;
};

export default function MediaCarousel({
  media,
  alt,
  className = "",
  imageClassName = "h-full w-full object-cover",
  featured = false,
  showThumbnails = true,
  cover = false,
}: MediaCarouselProps) {
  const images = media.imagePublicIds;
  const initialIndex = Math.max(
    0,
    images.indexOf(resolveMainImagePublicId(media)),
  );
  const [activeIndex, setActiveIndex] = useState(initialIndex);

  if (images.length === 0) {
    return null;
  }

  const safeIndex = activeIndex >= 0 && activeIndex < images.length ? activeIndex : 0;
  const activeId = images[safeIndex];
  const frame = media.imageFrame;
  const aspectClass = frameAspectClass(frame);

  const goPrev = () => {
    setActiveIndex((index) => (index - 1 + images.length) % images.length);
  };

  const goNext = () => {
    setActiveIndex((index) => (index + 1) % images.length);
  };

  const stopFlip = (event: MouseEvent) => {
    event.stopPropagation();
  };

  return (
    <div className={className} onClick={stopFlip}>
      <div
        className={`media-frame relative overflow-hidden ${cover ? "absolute inset-0 is-cover" : `${aspectClass} ${frame === "original" ? "is-contain" : "is-cover"}`}`}
      >
        <MediaPreview
          publicId={activeId}
          alt={alt}
          className={`${imageClassName} ${cover ? "object-cover object-top" : frameObjectClass(frame)} transition-transform duration-500 ease-out group-hover:scale-105`}
          frame={cover ? "wide" : frame}
          baseWidth={featured ? 1200 : 960}
        />

        {images.length > 1 ? (
          <>
            <button
              type="button"
              onClick={(event) => {
                stopFlip(event);
                goPrev();
              }}
              className="absolute top-1/2 left-2 inline-flex min-h-8 -translate-y-1/2 items-center rounded-full bg-black/60 px-2.5 text-[11px] text-[#E1E0CC] opacity-0 transition-opacity group-hover:opacity-100"
            >
              Prev
            </button>
            <button
              type="button"
              onClick={(event) => {
                stopFlip(event);
                goNext();
              }}
              className="absolute top-1/2 right-2 inline-flex min-h-8 -translate-y-1/2 items-center rounded-full bg-black/60 px-2.5 text-[11px] text-[#E1E0CC] opacity-0 transition-opacity group-hover:opacity-100"
            >
              Next
            </button>
            <span className="absolute top-3 right-3 rounded-full bg-black/70 px-2 py-0.5 text-[10px] tracking-wide text-[#E1E0CC] uppercase">
              {safeIndex + 1}/{images.length}
            </span>
          </>
        ) : null}
      </div>

      {showThumbnails && images.length > 1 ? (
        <div className="mt-2 flex gap-1.5 overflow-x-auto pb-1">
          {images.map((publicId, index) => (
            <button
              key={publicId}
              type="button"
              onClick={(event) => {
                stopFlip(event);
                setActiveIndex(index);
              }}
              className={`relative shrink-0 overflow-hidden rounded-md border ${
                index === safeIndex ? "border-primary" : "border-white/10"
              }`}
              aria-label={`Show image ${index + 1}`}
            >
              <MediaPreview
                publicId={publicId}
                alt=""
                className="h-10 w-14 object-cover"
                frame="square"
                thumbnail
              />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
