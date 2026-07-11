import Link from "next/link";
import { ArrowUpRight } from "lucide-react";

const FOOTER_LINKS = [
  { href: "/work", label: "Design" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

export function Footer() {
  return (
    <footer className="border-t border-ink-muted/20">
      {/* Big CTA block — the footer earns its size as the site's closing beat. */}
      <div className="px-3 py-12 md:px-6 md:py-20">
        <p className="font-label text-xs uppercase tracking-wider text-ink-muted">
          Next step
        </p>
        <Link href="/contact" className="group mt-2 block w-fit" data-cursor-view="Contact">
          <span className="flex flex-wrap items-baseline gap-x-4 font-display text-4xl font-bold leading-[0.95] tracking-tight text-ink transition-colors group-hover:text-flame-text md:text-7xl">
            Have a project in mind?
            <ArrowUpRight
              aria-hidden
              className="h-4 w-4 shrink-0 self-center transition-transform group-hover:translate-x-1 group-hover:-translate-y-1 md:h-12 md:w-12"
            />
          </span>
        </Link>
      </div>

      <div className="flex flex-col gap-3 border-t border-ink-muted/15 px-3 py-4 md:flex-row md:items-center md:justify-between md:px-6">
        <p className="font-label text-xs uppercase tracking-wider text-ink-muted">
          &copy; {new Date().getFullYear()} Richard Davies — RADD
        </p>
        <ul className="flex flex-wrap items-center gap-4 font-label text-xs uppercase tracking-wider">
          {FOOTER_LINKS.map((link) => (
            <li key={link.href}>
              <Link
                href={link.href}
                className="text-ink-muted transition-colors hover:text-flame-text"
              >
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </footer>
  );
}
