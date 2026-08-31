import { Loader2, Star, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import MediaPreview from "../MediaPreview.tsx";
import {
  IMAGE_FRAMES,
  appendImages,
  imageFrameLabel,
  removeImage,
  setMainImage,
  type ImageFrame,
  type MediaFields,
} from "../../types/media.ts";

type MediaGalleryFieldProps = {
  label?: string;
  media: MediaFields;
  onChange: (media: MediaFields) => void;
  onUpload: (files: File[]) => Promise<string[]>;
};

export default function MediaGalleryField({
  label = "Images",
  media,
  onChange,
  onUpload,
}: MediaGalleryFieldProps) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [pendingPreviews, setPendingPreviews] = useState<string[]>([]);

  const handleFiles = async (fileList: FileList | null) => {
    if (!fileList || fileList.length === 0) {
      return;
    }

    const files = Array.from(fileList);
    setPendingPreviews(files.map((file) => URL.createObjectURL(file)));
    setUploading(true);
    setError(null);

    try {
      const uploadedIds = await onUpload(files);
      onChange(appendImages(media, uploadedIds));
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Upload failed.");
    } finally {
      setUploading(false);
      setPendingPreviews([]);
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-white/10 bg-black/40 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <Field label={label}>
          <input
            type="file"
            accept="image/jpeg,image/png,image/webp"
            multiple
            disabled={uploading}
            onChange={(event) => {
              void handleFiles(event.target.files);
              event.target.value = "";
            }}
            className="block w-full text-sm text-gray-400 file:mr-3 file:rounded-full file:border-0 file:bg-primary file:px-4 file:py-2 file:text-sm file:font-medium file:text-black disabled:opacity-60"
          />
        </Field>

        <Field label="Display frame">
          <select
            value={media.imageFrame}
            onChange={(event) =>
              onChange({ ...media, imageFrame: event.target.value as ImageFrame })
            }
            className={inputClass}
          >
            {IMAGE_FRAMES.map((frame) => (
              <option key={frame} value={frame}>
                {imageFrameLabel(frame)}
              </option>
            ))}
          </select>
        </Field>
      </div>

      {uploading ? (
        <p className="inline-flex items-center gap-2 text-sm text-gray-400">
          <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" />
          Uploading to Cloudinary…
        </p>
      ) : null}

      {error ? <p className="text-sm text-red-400">{error}</p> : null}

      {pendingPreviews.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {pendingPreviews.map((preview) => (
            <img
              key={preview}
              src={preview}
              alt="Uploading preview"
              className="h-16 w-16 rounded-lg object-cover opacity-70"
            />
          ))}
        </div>
      ) : null}

      {media.imagePublicIds.length > 0 ? (
        <ul className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4">
          {media.imagePublicIds.map((publicId) => {
            const isMain = publicId === media.mainImagePublicId;

            return (
              <li
                key={publicId}
                className={`overflow-hidden rounded-xl border ${
                  isMain ? "border-primary" : "border-white/10"
                }`}
              >
                <MediaPreview
                  publicId={publicId}
                  alt=""
                  className="aspect-[4/3] w-full object-cover"
                  frame={media.imageFrame}
                  thumbnail
                />
                <div className="flex items-center justify-between gap-2 px-2 py-2">
                  <button
                    type="button"
                    onClick={() => onChange(setMainImage(media, publicId))}
                    className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[10px] tracking-wide uppercase ${
                      isMain
                        ? "bg-primary text-black"
                        : "border border-white/10 text-gray-400"
                    }`}
                  >
                    <Star className="h-3 w-3" aria-hidden="true" />
                    {isMain ? "Main" : "Set main"}
                  </button>
                  <button
                    type="button"
                    onClick={() => onChange(removeImage(media, publicId))}
                    className="inline-flex h-7 w-7 items-center justify-center rounded-full border border-red-500/20 text-red-400"
                    aria-label="Remove image"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      ) : (
        <p className="text-sm text-gray-500">No images yet. Upload one or more photos.</p>
      )}
    </div>
  );
}

const inputClass =
  "w-full min-w-[12rem] rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-[#E1E0CC] outline-none focus:border-primary/40";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs tracking-wide text-gray-500 uppercase">{label}</span>
      {children}
    </label>
  );
}
