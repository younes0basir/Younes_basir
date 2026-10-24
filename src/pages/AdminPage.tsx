import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, Loader2, LogOut } from "lucide-react";
import AdminLoginForm from "../components/admin/AdminLoginForm.tsx";
import GalleryAdminPanel from "../components/admin/GalleryAdminPanel.tsx";
import ProjectsAdminPanel from "../components/admin/ProjectsAdminPanel.tsx";
import { useAdminSession } from "../lib/admin-session.ts";

type AdminTab = "projects" | "gallery";

export default function AdminPage() {
  const { email, isLoading, signIn, signOut } = useAdminSession();
  const [tab, setTab] = useState<AdminTab>("projects");
  const [signingOut, setSigningOut] = useState(false);

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-gray-400">
        <Loader2 className="h-6 w-6 animate-spin" aria-hidden="true" />
      </div>
    );
  }

  if (!email) {
    return (
      <div className="min-h-screen bg-black">
        <div className="px-4 pt-6">
          <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#E1E0CC]">
            <ArrowLeft className="h-4 w-4" aria-hidden="true" />
            Back to portfolio
          </Link>
        </div>
        <AdminLoginForm signIn={signIn} />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black px-4 py-8 md:px-8">
      <div className="mx-auto max-w-5xl">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <Link to="/" className="inline-flex items-center gap-2 text-sm text-gray-400 hover:text-[#E1E0CC]">
              <ArrowLeft className="h-4 w-4" aria-hidden="true" />
              Portfolio
            </Link>
            <h1 className="mt-3 text-2xl text-[#E1E0CC]">Admin space</h1>
            <p className="mt-1 text-sm text-gray-500">Signed in as {email}</p>
          </div>

          <button
            type="button"
            disabled={signingOut}
            onClick={async () => {
              setSigningOut(true);
              try {
                await signOut();
              } finally {
                setSigningOut(false);
              }
            }}
            className="inline-flex min-h-10 items-center gap-2 rounded-full border border-white/10 px-4 text-sm text-gray-300"
          >
            {signingOut ? <Loader2 className="h-4 w-4 animate-spin" /> : <LogOut className="h-4 w-4" />}
            Sign out
          </button>
        </div>

        <div className="mt-8 flex gap-2 border-b border-white/10 pb-3">
          {(["projects", "gallery"] as const).map((value) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              className={`rounded-full px-4 py-2 text-sm capitalize transition-colors ${
                tab === value
                  ? "bg-primary text-black"
                  : "text-gray-400 hover:text-[#E1E0CC]"
              }`}
            >
              {value}
            </button>
          ))}
        </div>

        <div className="mt-8">
          {tab === "projects" ? <ProjectsAdminPanel /> : <GalleryAdminPanel />}
        </div>
      </div>
    </div>
  );
}
