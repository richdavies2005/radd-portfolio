"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X, ArrowUpRight } from "lucide-react";

const LINKS = [
  { href: "/", label: "Home", exact: true },
  { href: "/work", label: "Design" },
  { href: "/photography", label: "Photography" },
  { href: "/about", label: "About" },
  { href: "/contact", label: "Contact" },
];

function isActive(pathname: string, link: (typeof LINKS)[number]): boolean {
  return link.exact ? pathname === link.href : pathname.startsWith(link.href);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

  // Close the menu on navigation and on Escape.
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  // Lock body scroll while the menu is open.
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  // Solid backdrop once content scrolls under the fixed header.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed inset-x-0 top-0 z-nav">
      <nav
        className={`mx-auto flex max-w-container items-center justify-between px-3 py-2 transition-colors duration-300 md:px-6 ${
          scrolled ? "bg-canvas/85 backdrop-blur-md" : "bg-transparent"
        }`}
      >
        <Link
          href="/"
          className="font-display text-2xl font-bold tracking-tight text-ink transition-colors hover:text-flame-text"
        >
          RADD
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-6 font-label text-xs uppercase tracking-wider md:flex">
          {LINKS.map((link) => {
            const active = isActive(pathname, link);
            return (
              <li key={link.href}>
                <Link
                  href={link.href}
                  aria-current={active ? "page" : undefined}
                  className={`relative py-0.5 transition-colors hover:text-flame-text ${
                    active ? "text-flame-text" : "text-ink-muted"
                  }`}
                >
                  {link.label}
                </Link>
              </li>
            );
          })}
        </ul>

        {/* Mobile burger */}
        <button
          type="button"
          onClick={() => setOpen(true)}
          aria-label="Open menu"
          aria-expanded={open}
          className="flex h-6 w-6 items-center justify-center text-ink transition-colors hover:text-flame-text md:hidden"
        >
          <Menu className="h-6 w-6" aria-hidden />
        </button>
      </nav>

      {/* Full-screen mobile menu */}
      {open && (
        <div className="fixed inset-0 z-modal flex min-h-dvh flex-col bg-canvas md:hidden">
          <div className="flex items-center justify-between px-3 py-2">
            <Link
              href="/"
              onClick={() => setOpen(false)}
              className="font-display text-2xl font-bold tracking-tight text-ink"
            >
              RADD
            </Link>
            <button
              type="button"
              onClick={() => setOpen(false)}
              aria-label="Close menu"
              className="flex h-6 w-6 items-center justify-center text-ink transition-colors hover:text-flame-text"
            >
              <X className="h-6 w-6" aria-hidden />
            </button>
          </div>

          <nav className="flex flex-1 flex-col justify-center px-3 pb-10" aria-label="Site pages">
            <ul className="flex flex-col">
              {LINKS.map((link, i) => {
                const active = isActive(pathname, link);
                return (
                  <li
                    key={link.href}
                    className="menu-item border-b border-ink-muted/15 last:border-b-0"
                    style={{ animationDelay: `${i * 60}ms` }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setOpen(false)}
                      aria-current={active ? "page" : undefined}
                      className="group flex items-baseline gap-3 py-3"
                    >
                      <span className="font-label text-xs text-ink-muted">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span
                        className={`font-display text-4xl font-bold leading-none tracking-tight transition-colors group-hover:text-flame-text sm:text-5xl ${
                          active ? "text-flame-text" : "text-ink"
                        }`}
                      >
                        {link.label}
                      </span>
                    </Link>
                  </li>
                );
              })}
            </ul>

            <a
              href="mailto:radd.designstudio@gmail.com"
              className="menu-item mt-8 inline-flex items-center gap-2 font-label text-xs uppercase tracking-wider text-flame-text"
              style={{ animationDelay: `${LINKS.length * 60}ms` }}
            >
              radd.designstudio@gmail.com
              <ArrowUpRight className="h-4 w-4" aria-hidden />
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
