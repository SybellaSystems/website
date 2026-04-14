"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

const links = [
  { href: "/", label: "Home" },
  { href: "/ogera", label: "Ogera" },
  { href: "/technology", label: "Technology" },
  { href: "/impact", label: "Impact" },
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

  useEffect(() => { setOpen(false); }, [pathname]);

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "nav-blur" : "bg-transparent"}`}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "0 clamp(12px, 4vw, 32px)", height: "clamp(56px, 10vw, 72px)", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
        {/* Wordmark */}
        <Link href="/" style={{ display: "flex", alignItems: "center", gap: "clamp(12px, 2vw, 16px)", textDecoration: "none" }}>
          <div style={{
            width: "clamp(40px, 8vw, 48px)",
            height: "clamp(40px, 8vw, 48px)",
            borderRadius: 12,
            background: "linear-gradient(135deg, rgba(201,168,76,0.1), rgba(59,130,246,0.1))",
            border: "1px solid rgba(201,168,76,0.2)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            position: "relative",
            overflow: "hidden",
            boxShadow: "0 4px 20px rgba(201,168,76,0.15)",
            flexShrink: 0
          }}>
            <img
              src="/LOGO WITH NO BG.png"
              alt="Sybella Systems Logo"
              style={{
                width: "clamp(28px, 6vw, 32px)",
                height: "clamp(28px, 6vw, 32px)",
                objectFit: "contain",
                filter: "brightness(0) invert(1)"
              }}
            />
            <div style={{
              position: "absolute",
              inset: 0,
              background: "linear-gradient(135deg, rgba(201,168,76,0.05), rgba(59,130,246,0.05))",
              borderRadius: 12
            }} />
          </div>
          <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(16px, 3vw, 20px)", letterSpacing: "-0.03em", color: "var(--text-primary)" }}>SYBELLA</span>
        </Link>

        {/* Desktop nav */}
        <nav style={{ display: "flex", alignItems: "center", gap: 4 }} className="hidden md:flex">
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{
              padding: "8px 16px",
              fontFamily: "var(--font-display)",
              fontSize: "clamp(11px, 1.5vw, 13px)",
              fontWeight: 600,
              letterSpacing: "0.06em",
              textTransform: "uppercase",
              color: pathname === l.href ? "var(--blue-bright)" : "var(--text-secondary)",
              transition: "color 0.2s",
              borderRadius: 2,
              textDecoration: "none",
              minHeight: "44px",
              display: "flex",
              alignItems: "center"
            }}
              onMouseEnter={e => { if (pathname !== l.href) (e.target as HTMLElement).style.color = "var(--text-primary)"; }}
              onMouseLeave={e => { if (pathname !== l.href) (e.target as HTMLElement).style.color = "var(--text-secondary)"; }}
            >{l.label}</Link>
          ))}
        </nav>

        <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 12px)" }}>
          <Link href="/impact#contact" className="btn-ghost hidden md:inline-flex" style={{ padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)", fontSize: "clamp(11px, 1.5vw, 12px)" }}>Work With Us</Link>
          <Link href="/ogera#join" className="btn-primary hidden md:inline-flex" style={{ padding: "clamp(8px, 1.5vw, 10px) clamp(16px, 3vw, 20px)", fontSize: "clamp(11px, 1.5vw, 12px)" }}>Join Ogera</Link>
          {/* Mobile menu toggle */}
          <button onClick={() => setOpen(!open)} style={{ display: "flex", flexDirection: "column", gap: 5, padding: 8, background: "none", border: "none", cursor: "pointer", minHeight: "44px", minWidth: "44px", alignItems: "center", justifyContent: "center" }} className="md:hidden">
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--text-primary)", transition: "all 0.3s", transform: open ? "rotate(45deg) translateY(6.5px)" : "none" }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--text-primary)", transition: "all 0.3s", opacity: open ? 0 : 1 }} />
            <span style={{ display: "block", width: 22, height: 1.5, background: "var(--text-primary)", transition: "all 0.3s", transform: open ? "rotate(-45deg) translateY(-6.5px)" : "none" }} />
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      <div style={{ display: open ? "block" : "none", overflow: "hidden", maxHeight: open ? 420 : 0, transition: "max-height 0.4s cubic-bezier(0.16, 1, 0.3, 1)", background: "var(--charcoal)", borderTop: "1px solid var(--border)" }}>
        <div style={{ padding: "clamp(16px, 3vw, 24px)" }}>
          {links.map(l => (
            <Link key={l.href} href={l.href} style={{ display: "block", padding: "clamp(10px, 2vw, 14px) 0", fontFamily: "var(--font-display)", fontSize: "clamp(16px, 3vw, 18px)", fontWeight: 700, color: pathname === l.href ? "var(--blue-bright)" : "var(--text-primary)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>
              {l.label}
            </Link>
          ))}
          <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)", flexDirection: "column", marginTop: "clamp(16px, 3vw, 24px)" }}>
            <Link href="/impact#contact" className="btn-ghost" style={{ width: "100%", justifyContent: "center", fontSize: "clamp(11px, 1.5vw, 12px)", padding: "clamp(10px, 2vw, 12px) 20px" }}>Work With Us</Link>
            <Link href="/ogera#join" className="btn-primary" style={{ width: "100%", justifyContent: "center", fontSize: "clamp(11px, 1.5vw, 12px)", padding: "clamp(10px, 2vw, 12px) 20px" }}>Join Ogera</Link>
          </div>
        </div>
      </div>
    </header>
  );
}