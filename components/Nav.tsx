"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/ogera", label: "Ogera" },
  { href: "/technology", label: "Technology" },
  { href: "/impact", label: "Impact" },
  { href: "/updates", label: "Updates" },
  { href: "/blog", label: "Blog" },
];

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const h = () => setScrolled(window.scrollY > 32);
    window.addEventListener("scroll", h, { passive: true });
    return () => window.removeEventListener("scroll", h);
  }, []);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  // Lock body scroll while the mobile menu is open
  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const closeMenu = () => setOpen(false);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        scrolled ? "nav-blur" : "bg-transparent"
      }`}
    >
      {/* TOP BAR */}
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "0 clamp(12px, 4vw, 32px)",
          height: "clamp(56px, 10vw, 72px)",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        {/* LOGO */}
        <Link
          href="/"
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(12px, 2vw, 16px)",
            textDecoration: "none",
            minWidth: 0,
          }}
        >
          <div
            style={{
              width: "clamp(40px, 8vw, 48px)",
              height: "clamp(40px, 8vw, 48px)",
              borderRadius: 12,
              background:
                "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(59,130,246,0.1))",
              border: "1px solid rgba(201,168,76,0.2)",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              overflow: "hidden",
              boxShadow: "0 4px 20px rgba(201,168,76,0.15)",
              flexShrink: 0,
            }}
          >
            <img
              src="/LOGO WITH NO BG.png"
              alt="Sybella Systems Logo"
              style={{
                width: "clamp(28px, 6vw, 32px)",
                height: "clamp(28px, 6vw, 32px)",
                objectFit: "contain",
                filter: "brightness(0) invert(1)",
              }}
            />
          </div>

          <span
            style={{
              fontFamily: "var(--font-display)",
              fontWeight: 800,
              fontSize: "clamp(16px, 3vw, 20px)",
              letterSpacing: "-0.03em",
              color: "var(--text-primary)",
              whiteSpace: "nowrap",
            }}
          >
            SYBELLA
          </span>
        </Link>

        {/* DESKTOP NAV */}
        <nav
          style={{ alignItems: "center", gap: 4 }}
          className="hidden lg:flex"
        >
          {links.map((l) => (
            <Link
              key={l.href}
              href={l.href}
              style={{
                padding: "8px 16px",
                fontFamily: "var(--font-display)",
                fontSize: "clamp(11px, 1.5vw, 13px)",
                fontWeight: 600,
                letterSpacing: "0.06em",
                textTransform: "uppercase",
                color:
                  pathname === l.href
                    ? "var(--blue-bright)"
                    : "var(--text-secondary)",
                transition: "color 0.2s",
                borderRadius: 2,
                textDecoration: "none",
                minHeight: "44px",
                display: "flex",
                alignItems: "center",
              }}
              onMouseEnter={(e) => {
                if (pathname !== l.href)
                  (e.target as HTMLElement).style.color = "var(--text-primary)";
              }}
              onMouseLeave={(e) => {
                if (pathname !== l.href)
                  (e.target as HTMLElement).style.color =
                    "var(--text-secondary)";
              }}
            >
              {l.label}
            </Link>
          ))}
        </nav>

        {/* RIGHT SIDE: desktop CTAs + mobile toggle */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "clamp(8px, 2vw, 12px)",
            flexShrink: 0,
          }}
        >
          {/* Desktop-only CTA wrapper — display is controlled ONLY here, not on
              the Links themselves, so it can't be overridden by btn-ghost/btn-primary's
              own `display: inline-flex`. This div has no other class to collide with. */}
          <div className="hidden lg:flex items-center gap-3">
            <Link
              href="/impact#contact"
              className="btn-ghost"
              style={{
                padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)",
                fontSize: "clamp(11px, 1.5vw, 12px)",
              }}
            >
              Work With Us
            </Link>

            <Link
              href="/ogera#join"
              className="btn-primary"
              style={{
                padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)",
                fontSize: "clamp(11px, 1.5vw, 12px)",
              }}
            >
              Join Ogera
            </Link>
          </div>

          {/* MOBILE MENU BUTTON */}
          <button
            onClick={() => setOpen(!open)}
            style={{
              flexDirection: "column",
              gap: 5,
              padding: 8,
              background: "none",
              border: "none",
              cursor: "pointer",
              minHeight: "44px",
              minWidth: "44px",
              alignItems: "center",
              justifyContent: "center",
            }}
            className="flex lg:hidden"
            aria-label="Toggle mobile menu"
            aria-expanded={open}
          >
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "var(--text-primary)",
                transition: "all 0.3s",
                transform: open ? "rotate(45deg) translateY(6.5px)" : "none",
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "var(--text-primary)",
                transition: "all 0.3s",
                opacity: open ? 0 : 1,
              }}
            />
            <span
              style={{
                display: "block",
                width: 22,
                height: 1.5,
                background: "var(--text-primary)",
                transition: "all 0.3s",
                transform: open ? "rotate(-45deg) translateY(-6.5px)" : "none",
              }}
            />
          </button>
        </div>
      </div>

      {/* MOBILE MENU */}
      <div
        style={{
          position: "fixed",
          top: "clamp(56px, 10vw, 72px)",
          left: 0,
          right: 0,
          backgroundColor: "var(--charcoal)",
          borderBottom: "1px solid var(--border)",
          maxHeight: open ? "calc(100vh - clamp(56px, 10vw, 72px))" : 0,
          overflowY: "auto",
          overflowX: "hidden",
          transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)",
          zIndex: 40,
        }}
        className="lg:hidden"
        aria-hidden={!open}
      >
        <div style={{ padding: "clamp(8px, 2vw, 12px) clamp(16px, 4vw, 24px) clamp(24px, 4vw, 32px)" }}>
          {/* Nav links */}
          <div>
            {links.map((l, i) => (
              <Link
                key={l.href}
                href={l.href}
                onClick={closeMenu}
                style={{
                  padding: "clamp(14px, 3vw, 18px) 4px",
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(16px, 4vw, 18px)",
                  fontWeight: 700,
                  letterSpacing: "0.01em",
                  color:
                    pathname === l.href
                      ? "var(--blue-bright)"
                      : "var(--text-primary)",
                  textDecoration: "none",
                  minHeight: "44px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  borderBottom:
                    i === links.length - 1 ? "none" : "1px solid var(--border)",
                  transition: "color 0.2s",
                }}
              >
                <span style={{ textTransform: "uppercase" }}>{l.label}</span>
                <span
                  style={{
                    color:
                      pathname === l.href
                        ? "var(--blue-bright)"
                        : "var(--text-secondary)",
                    fontWeight: 400,
                    transition: "color 0.2s, transform 0.2s",
                  }}
                >
                  →
                </span>
              </Link>
            ))}
          </div>

          {/* Mobile CTA buttons — only ever rendered here, inside the open menu */}
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "clamp(10px, 2vw, 12px)",
              marginTop: "clamp(20px, 4vw, 28px)",
              paddingTop: "clamp(20px, 4vw, 24px)",
              borderTop: "1px solid var(--border)",
            }}
          >
            <Link
              href="/impact#contact"
              onClick={closeMenu}
              className="btn-ghost"
              style={{
                padding: "clamp(12px, 2.5vw, 14px) clamp(16px, 3vw, 20px)",
                fontSize: "clamp(12px, 2vw, 13px)",
                width: "100%",
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Work With Us</span>
              <span>→</span>
            </Link>

            <Link
              href="/ogera#join"
              onClick={closeMenu}
              className="btn-primary"
              style={{
                padding: "clamp(12px, 2.5vw, 14px) clamp(16px, 3vw, 20px)",
                fontSize: "clamp(12px, 2vw, 13px)",
                width: "100%",
                justifyContent: "space-between",
                display: "flex",
                alignItems: "center",
              }}
            >
              <span>Join Ogera</span>
              <span>→</span>
            </Link>
          </div>
        </div>
      </div>

      {/* Backdrop behind the mobile menu, tap to close */}
      {open && (
        <div
          onClick={closeMenu}
          className="lg:hidden"
          style={{
            position: "fixed",
            top: "clamp(56px, 10vw, 72px)",
            left: 0,
            right: 0,
            bottom: 0,
            background: "rgba(0,0,0,0.5)",
            zIndex: 30,
          }}
        />
      )}
    </header>
  );
}