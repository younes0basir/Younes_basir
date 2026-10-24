import { useState, type FormEvent } from "react";
import { Loader2 } from "lucide-react";

type AdminLoginFormProps = {
  signIn: (email: string, password: string) => Promise<void>;
};

export default function AdminLoginForm({ signIn }: AdminLoginFormProps) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (event: FormEvent) => {
    event.preventDefault();
    setError(null);
    setSubmitting(true);

    try {
      await signIn(email, password);
    } catch (caught) {
      setError(caught instanceof Error ? caught.message : "Sign in failed");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-md flex-col justify-center px-4 py-16">
      <p className="text-primary text-xs tracking-[0.2em] uppercase">Admin</p>
      <h1 className="mt-3 text-3xl text-[#E1E0CC]">Portfolio CMS</h1>
      <p className="mt-2 text-sm text-gray-400">
        Sign in to manage projects and gallery entries.
      </p>

      <form onSubmit={handleSubmit} className="mt-8 space-y-4">
        <label className="block">
          <span className="mb-1.5 block text-xs tracking-wide text-gray-500 uppercase">Email</span>
          <input
            type="email"
            required
            autoComplete="username"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-[#E1E0CC] outline-none focus:border-primary/40"
          />
        </label>

        <label className="block">
          <span className="mb-1.5 block text-xs tracking-wide text-gray-500 uppercase">
            Password
          </span>
          <input
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded-xl border border-white/10 bg-[#101010] px-4 py-3 text-sm text-[#E1E0CC] outline-none focus:border-primary/40"
          />
        </label>

        {error ? <p className="text-sm text-red-400">{error}</p> : null}

        <button
          type="submit"
          disabled={submitting}
          className="bg-primary inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full text-sm font-medium text-black disabled:opacity-60"
        >
          {submitting ? <Loader2 className="h-4 w-4 animate-spin" aria-hidden="true" /> : null}
          Sign in
        </button>
      </form>
    </div>
  );
}
