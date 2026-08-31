import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black px-3 pb-[max(1.5rem,env(safe-area-inset-bottom))] sm:px-4 md:px-8">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-1 sm:flex-row sm:items-center sm:justify-between sm:px-2">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-500">
          <p>© 2026 Younes Basir</p>
          <Link to="/admin" className="transition-colors hover:text-gray-300">
            Admin
          </Link>
        </div>
        <a
          href="#top"
          className="inline-flex min-h-11 items-center transition-colors hover:text-gray-300"
        >
          Back to top
        </a>
      </div>
    </footer>
  );
}
