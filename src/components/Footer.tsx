import { Link } from "react-router-dom";

export default function Footer() {
  return (
    <footer className="bg-black px-4 pb-6 md:px-8">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-2 text-xs text-gray-500">
        <div className="flex items-center gap-4">
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
