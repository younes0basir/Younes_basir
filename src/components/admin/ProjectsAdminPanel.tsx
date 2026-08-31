import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Loader2, Pencil, Plus, Trash2 } from "lucide-react";
import { useState, type ReactNode } from "react";
import MediaGalleryField from "./MediaGalleryField.tsx";
import MediaPreview from "../MediaPreview.tsx";
import {
  createProject,
  deleteProject,
  listProjectsAdmin,
  updateProject,
  uploadProjectImages,
  type ProjectFormData,
} from "../../lib/cms.ts";
import {
  PROJECT_ICON_OPTIONS,
  projectIconLabel,
  resolveProjectIcon,
} from "../../lib/project-icons.ts";
import { emptyMediaFields, resolveMainImagePublicId } from "../../types/media.ts";
import type { ProjectRecord } from "../../types/project.ts";

const emptyProject = (): ProjectFormData => ({
  title: "",
  number: "",
  category: "",
  description: "",
  icon: "folder-git",
  stack: [],
  items: [],
  href: "",
  sourceHref: "",
  featured: false,
  order: 1,
  ...emptyMediaFields(),
});

function linesToArray(value: string) {
  return value
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function arrayToLines(value: string[]) {
  return value.join("\n");
}

export default function ProjectsAdminPanel() {
  const queryClient = useQueryClient();
  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["admin", "projects"],
    queryFn: listProjectsAdmin,
  });

  const [editing, setEditing] = useState<ProjectRecord | null>(null);
  const [form, setForm] = useState<ProjectFormData>(emptyProject());
  const [stackText, setStackText] = useState("");
  const [itemsText, setItemsText] = useState("");
  const [showForm, setShowForm] = useState(false);

  const resetForm = () => {
    setShowForm(false);
    setEditing(null);
    setForm(emptyProject());
    setStackText("");
    setItemsText("");
  };

  const invalidate = () => {
    queryClient.invalidateQueries({ queryKey: ["admin", "projects"] });
    queryClient.invalidateQueries({ queryKey: ["projects"] });
  };

  const saveMutation = useMutation({
    mutationFn: async () => {
      const payload: ProjectFormData = {
        ...form,
        stack: linesToArray(stackText),
        items: linesToArray(itemsText),
      };

      if (editing) {
        await updateProject(editing.id, payload);
      } else {
        await createProject(payload);
      }
    },
    onSuccess: () => {
      invalidate();
      resetForm();
    },
  });

  const deleteMutation = useMutation({
    mutationFn: deleteProject,
    onSuccess: invalidate,
  });

  const openCreate = () => {
    setEditing(null);
    setForm({ ...emptyProject(), order: projects.length + 1 });
    setStackText("");
    setItemsText("");
    setShowForm(true);
  };

  const openEdit = (project: ProjectRecord) => {
    setEditing(project);
    setForm({
      title: project.title,
      number: project.number,
      category: project.category,
      description: project.description,
      icon: project.icon,
      imagePublicIds: project.imagePublicIds,
      mainImagePublicId: project.mainImagePublicId,
      imageFrame: project.imageFrame,
      stack: project.stack,
      items: project.items,
      href: project.href ?? "",
      sourceHref: project.sourceHref ?? "",
      featured: project.featured,
      order: project.order,
    });
    setStackText(arrayToLines(project.stack));
    setItemsText(arrayToLines(project.items));
    setShowForm(true);
  };

  const updateMedia = (media: Pick<ProjectFormData, "imagePublicIds" | "mainImagePublicId" | "imageFrame">) => {
    setForm((current) => ({ ...current, ...media }));
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h2 className="text-xl text-[#E1E0CC]">Projects</h2>
          <p className="mt-1 text-sm text-gray-500">
            Manage project cards, multiple images, main cover, and display frame.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="bg-primary inline-flex min-h-10 items-center gap-2 rounded-full px-4 text-sm font-medium text-black"
        >
          <Plus className="h-4 w-4" aria-hidden="true" />
          Add project
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
            <Field label="Number">
              <input
                required
                value={form.number}
                onChange={(event) => setForm({ ...form, number: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Category">
              <input
                required
                value={form.category}
                onChange={(event) => setForm({ ...form, category: event.target.value })}
                className={inputClass}
              />
            </Field>
            <div className="md:col-span-2">
              <p className="mb-1.5 text-xs tracking-wide text-gray-500 uppercase">Project icon</p>
              <div className="grid grid-cols-4 gap-2 sm:grid-cols-6" role="radiogroup" aria-label="Project icon">
                {PROJECT_ICON_OPTIONS.map((iconKey) => {
                  const Icon = resolveProjectIcon(iconKey);
                  const selected = form.icon === iconKey;

                  return (
                    <button
                      key={iconKey}
                      type="button"
                      role="radio"
                      aria-checked={selected}
                      aria-label={projectIconLabel(iconKey)}
                      onClick={() => setForm({ ...form, icon: iconKey })}
                      className={`inline-flex min-h-11 flex-col items-center justify-center gap-1 rounded-xl border px-2 py-2 text-[10px] tracking-wide uppercase ${
                        selected
                          ? "border-primary/50 bg-primary/10 text-[#E1E0CC]"
                          : "border-white/10 text-gray-500 hover:border-white/20 hover:text-[#E1E0CC]"
                      }`}
                    >
                      <Icon className="h-4 w-4" aria-hidden="true" />
                      {projectIconLabel(iconKey)}
                    </button>
                  );
                })}
              </div>
            </div>
            <Field label="Live URL">
              <input
                value={form.href ?? ""}
                onChange={(event) => setForm({ ...form, href: event.target.value })}
                className={inputClass}
              />
            </Field>
            <Field label="Source URL">
              <input
                value={form.sourceHref ?? ""}
                onChange={(event) => setForm({ ...form, sourceHref: event.target.value })}
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
            <label className="flex items-center gap-2 self-end text-sm text-gray-300">
              <input
                type="checkbox"
                checked={form.featured}
                onChange={(event) => setForm({ ...form, featured: event.target.checked })}
              />
              Featured project
            </label>
          </div>

          <MediaGalleryField
            label="Project images (Cloudinary)"
            media={form}
            onChange={updateMedia}
            onUpload={uploadProjectImages}
          />

          <Field label="Description">
            <textarea
              required
              rows={3}
              value={form.description}
              onChange={(event) => setForm({ ...form, description: event.target.value })}
              className={inputClass}
            />
          </Field>

          <div className="grid gap-4 md:grid-cols-2">
            <Field label="Tech stack (one per line)">
              <textarea
                required
                rows={5}
                value={stackText}
                onChange={(event) => setStackText(event.target.value)}
                className={inputClass}
              />
            </Field>
            <Field label="Highlights (one per line)">
              <textarea
                required
                rows={5}
                value={itemsText}
                onChange={(event) => setItemsText(event.target.value)}
                className={inputClass}
              />
            </Field>
          </div>

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
              {editing ? "Save changes" : "Create project"}
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
        <p className="text-sm text-gray-500">Loading projects…</p>
      ) : (
        <ul className="space-y-3">
          {projects.map((project) => {
            const mainImage = resolveMainImagePublicId(project);
            const Icon = resolveProjectIcon(project.icon);

            return (
              <li
                key={project.id}
                className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-[#101010] px-4 py-3"
              >
                <div className="flex items-center gap-3">
                  {mainImage ? (
                    <span className="relative">
                      <MediaPreview
                        publicId={mainImage}
                        alt=""
                        className="h-12 w-12 rounded-lg object-cover"
                        frame={project.imageFrame}
                        thumbnail
                      />
                      <span className="text-primary absolute -right-1 -bottom-1 inline-flex h-5 w-5 items-center justify-center rounded-md bg-black">
                        <Icon className="h-3 w-3" aria-hidden="true" />
                      </span>
                    </span>
                  ) : (
                    <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-black">
                      <Icon className="text-primary h-5 w-5" aria-hidden="true" />
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-[#E1E0CC]">
                      {project.number} · {project.title}
                    </p>
                    <p className="text-xs text-gray-500">
                      {project.category}
                      {project.imagePublicIds.length > 1
                        ? ` · ${project.imagePublicIds.length} images`
                        : ""}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => openEdit(project)}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/10 text-gray-300"
                    aria-label={`Edit ${project.title}`}
                  >
                    <Pencil className="h-4 w-4" />
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      if (window.confirm(`Delete "${project.title}"?`)) {
                        deleteMutation.mutate(project.id);
                      }
                    }}
                    className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-red-500/20 text-red-400"
                    aria-label={`Delete ${project.title}`}
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
