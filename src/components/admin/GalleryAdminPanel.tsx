import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import MediaGalleryField from "./MediaGalleryField.tsx";
import MediaPreview from "../MediaPreview.tsx";
import {
  GALLERY_EVENT_TYPES,
  galleryEventLabel,
} from "../../lib/appwrite-config.ts";
import {
  createGalleryItem,
  deleteGalleryItem,
  listGalleryAdmin,
  updateGalleryItem,
  uploadGalleryImages,
} from "../../lib/cms.ts";
import { emptyMediaFields, resolveMainImagePublicId } from "../../types/media.ts";
import type { GalleryFormData, GalleryRecord } from "../../types/gallery.ts";

const emptyGalleryItem = (): GalleryFormData => ({
  title: "",
  description: "",
  eventType: "hackathon",
  date: new Date().toISOString().slice(0, 10),
  location: "",
  order: 1,
  ...emptyMediaFields(),
});

export default function GalleryAdminPanel() {
  const queryClient = useQueryClient();
  const { data: items = [], isLoading } = useQuery({
    queryKey: ["admin", "gallery"],
    queryFn: listGalleryAdmin,
  });

  const [editing, setEditing] = useState<GalleryRecord | null>(null);
  const [form, setForm] = useState<GalleryFormData>(emptyGalleryItem());
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyGalleryItem());
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "gallery"] });
    queryClient.invalidateQueries({ queryKey: ["gallery"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      if (editing) {
        await updateGalleryItem(editing.id, form);
      } else {
        await createGalleryItem(form);
      }
    },
    onSuccess: () => {
      invalidate();
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteGalleryItem,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyGalleryItem(), order: items.length + 1 });
    setShowForm(true);
  };

  const openEdit = (item: GalleryRecord) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description,
      eventType: item.eventType,
      date: item.date,
      location: item.location,
      imagePublicIds: item.imagePublicIds,
      mainImagePublicId: item.mainImagePublicId,
      imageFrame: item.imageFrame,
      order: item.order,
    });
    setShowForm(true);
  };

  const updateMedia = (media: Pick<GalleryFormData, "imagePublicIds" | "mainImagePublicId" | "imageFrame">) => {
    setForm((current) => ({ ...current, ...media }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl text-[#E1E0CC]">Gallery</h2>
          <p className="mt-1 text-sm text-gray-500">
            Upload multiple photos per event, pick a main image, and set the display frame.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-black"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add entry
        </button>
      </div>

      {showForm ? (
        <form
          onSubmit={(event) => {
            event.preventDefault();
            saveMutation.mutate();
          }}
          className="space-y-4 rounded-2xl border border-white/10 bg-[#101010] p-5"
        >
          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Title">
              <input
                required
                value={form.title}
                onChange={(event) => setForm({ ...form, title: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Event type">
              <select
                value={form.eventType}
                onChange={(event) =>
                  setForm({
                    ...form,
                    eventType: event.target.value as GalleryFormData["eventType"],
                  })
                }
                className={inputClass}
              >
                {GALLERY_EVENT_TYPES.map((type) => (
                  <option key={type} value={type}>
                    {galleryEventLabel(type)}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="Date">
              <input
                type="date"
                required
                value={form.date}
                onChange={(event) => setForm({ ...form, date: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Location">
              <input
                required
                value={form.location}
                onChange={(event) => setForm({ ...form, location: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Sort order">
              <input
                type="number"
                required
                value={form.order}
                onChange={(event) => setForm({ ...form, order: Number(event.target.value) })}
                className={inputClass}
              />
            </Field>
          </div>

          <MediaGalleryField
            label="Event photos (Cloudinary)"
            media={form}
            onChange={updateMedia}
            onUpload={uploadGalleryImages}
          />

          <Field label="Description">
            <textarea
              required
              rows={4}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className={inputClass}
            />
          </Field>

          {saveMutation.error ? (
            <p className="text-sm text-red-400">{saveMutation.error.message}</p>
          ) : null}

          <div className="flex flex-wrap gap-3">
            <button
              type="submit"
              disabled={saveMutation.isPending}
              className="bg-primary inline-flex min-h-10 items-center gap-2 rounded-full px-5 text-sm font-medium text-black disabled:opacity-60"
            >
              {saveMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : null}
              {editing ? "Save changes" : "Create entry"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="inline-flex min-h-10 items-center rounded-full border border-white/10 px-5 text-sm text-gray-300"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : null}

      {isLoading ? (
        <p className="text-sm text-gray-500">Loading gallery…</p>
      ) : items.length === 0 ? (
        <p className="rounded-xl border border-dashed border-white/10 px-4 py-8 text-center text-sm text-gray-500">
          No gallery entries yet.
        </p>
      ) : (
        <ul className="space-y-3">
          {items.map((item) => {
            const mainImage = resolveMainImagePublicId(item);

            return (
              <li
                key={item.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#101010] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {mainImage ? (
                    <MediaPreview
                      publicId={mainImage}
                      alt=""
                      className="h-12 w-12 rounded-lg object-cover"
                      frame={item.imageFrame}
                      thumbnail
                    />
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black text-xs text-gray-500">
                      No img
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#E1E0CC]">{item.title}</p>
                    <p className="text-xs text-gray-500">
                      {galleryEventLabel(item.eventType)} · {item.location}
                      {item.imagePublicIds.length > 1 ? ` · ${item.imagePublicIds.length} images` : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(item)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300"
                    aria-label={`Edit ${item.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${item.title}"?`)) {
                        deleteMutation.mutate(item.id);
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 text-red-400"
                    aria-label={`Delete ${item.title}`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}

const inputClass =
  "w-full rounded-xl border border-white/10 bg-black px-3 py-2.5 text-sm text-[#E1E0CC] outline-none focus:border-primary/40";

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1.5 block text-xs tracking-wide text-gray-500 uppercase">{label}</span>
      {children}
    </label>
  );
}
