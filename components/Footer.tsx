"use client";
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
          {/* Brand */}
          <div>
            <div style={{ display: "flex", alignItems: "center", gap: "clamp(8px, 2vw, 12px)", marginBottom: "clamp(12px, 2vw, 20px)" }}>
              <svg width="clamp(24px, 4vw, 32px)" height="clamp(24px, 4vw, 32px)" viewBox="0 0 32 32" fill="none">
                <rect width="32" height="32" rx="2" fill="#c9a84c" />
                <path d="M10 22C10 19.8 11.6 18.4 14 18.1L21 17C22.2 16.8 23 15.9 23 14.7C23 13.2 21.8 12 20 12H12" stroke="#080808" strokeWidth="2.2" strokeLinecap="round" />
                <path d="M22 10C22 12.2 20.4 13.6 18 13.9L11 15C9.8 15.2 9 16.1 9 17.3C9 18.8 10.2 20 12 20H20" stroke="#080808" strokeWidth="2.2" strokeLinecap="round" />
              </svg>
              <span style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: "clamp(14px, 3vw, 18px)", letterSpacing: "-0.03em" }}>SYBELLA</span>
            </div>
            <p style={{ color: "var(--text-secondary)", fontSize: "clamp(12px, 2vw, 14px)", lineHeight: 1.8, maxWidth: 280, marginBottom: "clamp(20px, 4vw, 28px)" }}>
              Engineering Africa's digital future. Premium software systems for the continent's most ambitious builders.
            </p>
            <div style={{ display: "flex", gap: "clamp(8px, 2vw, 12px)" }}>
              {["LI", "TW", "GH"].map(s => (
                <div key={s} style={{ width: "clamp(32px, 5vw, 36px)", height: "clamp(32px, 5vw, 36px)", border: "1px solid var(--border-bright)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "clamp(10px, 2vw, 12px)", color: "var(--text-secondary)", transition: "all 0.2s", cursor: "pointer", minHeight: "44px", minWidth: "44px" }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--blue)"; (e.currentTarget as HTMLDivElement).style.color = "var(--blue-bright)"; }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.borderColor = "var(--border-bright)"; (e.currentTarget as HTMLDivElement).style.color = "var(--text-secondary)"; }}
                >{s}</div>
              ))}
            </div>
          </div>
          {cols.map(col => (
            <div key={col.title}>
              <p style={{ fontFamily: "var(--font-display)", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase", color: "var(--blue-bright)", marginBottom: "clamp(16px, 3vw, 20px)" }}>{col.title}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "clamp(8px, 1.5vw, 12px)" }}>
                {col.links.map(([label, href]) => (
                  <Link key={label} href={href} style={{ fontSize: "clamp(12px, 2vw, 14px)", color: "var(--text-secondary)", textDecoration: "none", transition: "color 0.2s", minHeight: "44px", display: "flex", alignItems: "center" }}
                    onMouseEnter={e => (e.target as HTMLElement).style.color = "var(--text-primary)"}
                    onMouseLeave={e => (e.target as HTMLElement).style.color = "var(--text-secondary)"}
                  >{label}</Link>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ padding: "clamp(16px, 3vw, 24px) 0", display: "flex", justifyContent: "space-between", alignItems: "center", flexWrap: "wrap", gap: "clamp(12px, 2vw, 16px)" }}>
          <p style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: "var(--text-tertiary)" }}>© 2025 Sybella Systems Ltd. Kigali, Rwanda. All rights reserved.</p>
          <div style={{ display: "flex", gap: "clamp(16px, 3vw, 24px)", flexWrap: "wrap" }}>
            {[["Privacy Policy", "/privacy"], ["Terms", "/terms"]].map(([l, h]) => (
              <Link key={l} href={h} style={{ fontSize: "clamp(11px, 1.5vw, 13px)", color: "var(--text-tertiary)", textDecoration: "none", minHeight: "44px", display: "flex", alignItems: "center" }}>{l}</Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}