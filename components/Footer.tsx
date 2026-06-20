"use client";
import Image from "next/image";
import Link from "next/link";

const cols = [
  { title: "Company", links: [["Home", "/"], ["About", "/impact"], ["Technology", "/technology"], ["Impact", "/impact"]] },
  { title: "Products", links: [["Ogera Platform", "/ogera"], ["For Students", "/ogera#students"], ["For Employers", "/ogera#employers"], ["Join Beta", "/ogera#join"]] },
  { title: "Services", links: [["Custom Software", "/technology"], ["SaaS Development", "/technology"], ["ERP Systems", "/technology"], ["Cloud Solutions", "/technology"]] },
];

export default function Footer() {
  return (
    <footer style={{ background: "var(--charcoal)", borderTop: "1px solid var(--border)" }}>
      <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(60px, 10vw, 80px) clamp(16px, 4vw, 32px) 0" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(250px, 1fr))", gap: "clamp(40px, 8vw, 60px)", paddingBottom: "clamp(40px, 8vw, 60px)", borderBottom: "1px solid var(--border)" }} className="grid-footer">
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 12px)", marginBottom: "clamp(12px, 2vw, 20px)" }}>
              <Image src="/LOGO WITH NO BG.png" alt="Sybella Systems Logo" width={32} height={32} style={{ width: "clamp(24px, 4vw, 32px)", height: "clamp(24px, 4vw, 32px)" }} />
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(14px, 3vw, 18px)", letterSpacing: "-0.03em" }}>SYBELLA</span>
            </div>
            <p>Premium custom ERP systems, SaaS platforms, and digital transformation solutions for Africa&apos;s fastest-growing companies.</p>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue-bright)", marginBottom: "clamp(16px, 3vw, 20px)" }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 12px)" }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontSize: "clamp(12px, 2vw, 14px)", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s", minHeight: "44px", display: "flex", alignItems: "center" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--text-primary)"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--text-secondary)"}>{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "clamp(16px, 3vw, 24px) 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "clamp(12px, 2vw, 16px)" }}>
          <p style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: "var(--text-tertiary)" }}>&copy; {new Date().getFullYear()} Sybella Systems Ltd. Rulindo, Rwanda. All rights reserved.</p>
          <div style={{ display: "flex", gap: "clamp(16px, 3vw, 24px)", flexWrap: "wrap" }}>
            {[["Privacy Policy", "/privacy-policy"], ["Terms", "/terms-service"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: "var(--text-tertiary)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
