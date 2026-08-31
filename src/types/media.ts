export const IMAGE_FRAMES = ["landscape", "square", "wide", "portrait", "original"] as const;

export type ImageFrame = (typeof IMAGE_FRAMES)[number];

export type MediaFields = {
  imagePublicIds: string[];
  mainImagePublicId: string;
  imageFrame: ImageFrame;
};

export function imageFrameLabel(frame: ImageFrame): string {
  switch (frame) {
    case "landscape":
      return "Landscape (4:3)";
    case "square":
      return "Square (1:1)";
    case "wide":
      return "Wide (16:9)";
    case "portrait":
      return "Portrait (3:4)";
    case "original":
      return "Original ratio";
    default: {
      const exhaustive: never = frame;
      return exhaustive;
    }
  }
}

export function emptyMediaFields(): MediaFields {
  return {
    imagePublicIds: [],
    mainImagePublicId: "",
    imageFrame: "landscape",
  };
}

export function normalizeMediaFields(source: {
  imagePublicIds?: string[];
  mainImagePublicId?: string;
  imageFrame?: string;
  imagePublicId?: string;
  imageFileId?: string;
}): MediaFields {
  const legacyId = source.imagePublicId || source.imageFileId || "";
  const imagePublicIds =
    source.imagePublicIds && source.imagePublicIds.length > 0
      ? source.imagePublicIds.filter(Boolean)
      : legacyId
        ? [legacyId]
        : [];

  const mainCandidate = source.mainImagePublicId || legacyId;
  const mainImagePublicId = imagePublicIds.includes(mainCandidate)
    ? mainCandidate
    : imagePublicIds[0] ?? "";

  const frameCandidate = source.imageFrame;
  const imageFrame = IMAGE_FRAMES.includes(frameCandidate as ImageFrame)
    ? (frameCandidate as ImageFrame)
    : "landscape";

  return {
    imagePublicIds,
    mainImagePublicId,
    imageFrame,
  };
}

export function resolveMainImagePublicId(media: MediaFields): string {
  if (
    media.mainImagePublicId &&
    media.imagePublicIds.includes(media.mainImagePublicId)
  ) {
    return media.mainImagePublicId;
  }

  return media.imagePublicIds[0] ?? "";
}

export function hasMediaImages(media: MediaFields): boolean {
  return media.imagePublicIds.length > 0;
}

export function setMainImage(media: MediaFields, publicId: string): MediaFields {
  if (!media.imagePublicIds.includes(publicId)) {
    return media;
  }

  return { ...media, mainImagePublicId: publicId };
}

export function removeImage(media: MediaFields, publicId: string): MediaFields {
  const imagePublicIds = media.imagePublicIds.filter((id) => id !== publicId);
  const mainImagePublicId = imagePublicIds.includes(media.mainImagePublicId)
    ? media.mainImagePublicId
    : imagePublicIds[0] ?? "";

  return { ...media, imagePublicIds, mainImagePublicId };
}

export function appendImages(media: MediaFields, publicIds: string[]): MediaFields {
  const merged = [...media.imagePublicIds];
  for (const publicId of publicIds) {
    if (!merged.includes(publicId)) {
      merged.push(publicId);
    }
  }

  return {
    ...media,
    imagePublicIds: merged,
    mainImagePublicId: media.mainImagePublicId || merged[0] || "",
  };
}

export function frameAspectClass(frame: ImageFrame): string {
  switch (frame) {
    case "landscape":
      return "aspect-[4/3]";
    case "square":
      return "aspect-square";
    case "wide":
      return "aspect-video";
    case "portrait":
      return "aspect-[3/4]";
    case "original":
      return "aspect-[16/10]";
    default: {
      const exhaustive: never = frame;
      return exhaustive;
    }
  }
}

export function responsiveFrameClass(frame: ImageFrame): string {
  switch (frame) {
    case "landscape":
      return "aspect-[16/10] max-h-[50svh] sm:aspect-[4/3] sm:max-h-[56svh] lg:max-h-none";
    case "square":
      return "aspect-[4/3] max-h-[50svh] sm:aspect-square sm:max-h-[56svh] sm:max-w-[28rem] lg:max-h-[32rem]";
    case "wide":
      return "aspect-[16/10] max-h-[46svh] sm:aspect-video sm:max-h-[56svh] lg:max-h-none";
    case "portrait":
      return "aspect-[4/5] max-h-[58svh] w-full max-w-[18rem] sm:aspect-[3/4] sm:max-w-[22rem] lg:max-w-[24rem] lg:max-h-[34rem]";
    case "original":
      return "aspect-[16/10] max-h-[50svh] sm:aspect-[16/9] sm:max-h-[56svh] lg:max-h-[30rem]";
    default: {
      const exhaustive: never = frame;
      return exhaustive;
    }
  }
}

export function frameObjectClass(frame: ImageFrame): string {
  switch (frame) {
    case "original":
      return "object-contain object-center";
    case "landscape":
    case "wide":
    case "square":
    case "portrait":
      return "object-cover object-top";
    default: {
      const exhaustive: never = frame;
      return exhaustive;
    }
  }
}
