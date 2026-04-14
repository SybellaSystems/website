"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

function useIntersection(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)), { threshold: 0.1 });
    ref.current?.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

function CodeBlock({ lines }: { lines: string[] }) {
  return (
    <div style={{ background: "#0a0a12", border: "1px solid var(--border)", borderRadius: 3, overflow: "hidden", fontFamily: "monospace" }}>
      <div style={{ padding: "10px 16px", borderBottom: "1px solid var(--border)", display: "flex", gap: 8, alignItems: "center" }}>
        {["#f87171","#fbbf24","#34d399"].map(c => <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.7 }} />)}
        <span style={{ fontSize: 11, color: "var(--text-tertiary)", marginLeft: 8 }}>sybella-architecture.ts</span>
      </div>
      <div style={{ padding: "20px 20px" }}>
        {lines.map((l, i) => (
          <div key={i} style={{ fontSize: 13, lineHeight: 1.9, color: l.startsWith("//") ? "#4a9965" : l.startsWith("import") ? "#569cd6" : l.includes(":") && !l.includes("//") ? "var(--text-primary)" : l.includes("'") ? "#ce9178" : "var(--text-secondary)" }}>{l || " "}</div>
        ))}
      </div>
    </div>
  );
}

export default function TechPage() {
  const s1 = useRef<HTMLDivElement>(null), s2 = useRef<HTMLDivElement>(null), s3 = useRef<HTMLDivElement>(null);
  useIntersection(s1 as React.RefObject<HTMLElement>);
  useIntersection(s2 as React.RefObject<HTMLElement>);
  useIntersection(s3 as React.RefObject<HTMLElement>);

  const services = [
    { code: "SyCore™", name: "Enterprise ERP", desc: "Full-scale ERP systems covering finance, HR, inventory, procurement, and reporting — designed for African operational complexity.", features: ["Multi-entity support", "Local compliance built-in", "Real-time dashboards", "Mobile-first access"] },
    { code: "SyWeb™", name: "Web Platforms", desc: "High-performance web applications from marketing sites to complex enterprise portals. Built for Core Web Vitals.", features: ["Next.js / React", "Edge-optimized CDN", "CMS integrations", "Conversion-focused UI"] },
    { code: "SyMobile™", name: "Mobile Apps", desc: "iOS and Android applications that perform under Africa's variable network conditions and across device ecosystems.", features: ["Offline-first design", "Low-bandwidth optimization", "React Native / Swift", "Cross-platform parity"] },
    { code: "SyCloud™", name: "Cloud & DevOps", desc: "Infrastructure architecture, containerization, CI/CD pipelines, and ongoing managed services for uptime and scale.", features: ["AWS / GCP / Azure", "Docker + Kubernetes", "Zero-downtime deploys", "24/7 monitoring"] },
    { code: "SyCommerce™", name: "E-Commerce", desc: "E-commerce systems integrated with Africa's payment ecosystem — MTN, Airtel, M-Pesa, Flutterwave, and global gateways.", features: ["African payment rails", "Inventory sync", "Multi-currency", "Fraud protection"] },
    { code: "SyIntel™", name: "AI & Data", desc: "Intelligent data layers, predictive analytics, and AI integrations that turn your operational data into strategic decisions.", features: ["ML model integration", "Business intelligence", "Automated reporting", "Custom AI agents"] },
  ];

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Hero */}
      <section style={{ padding: "80px 32px 60px", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        {/* Background file pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/file.svg')", backgroundRepeat: "repeat", backgroundSize: "130px 130px", opacity: 0.12, pointerEvents: "none" }} />
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 0, right: 0, width: 700, height: 500, background: "radial-gradient(ellipse at right top, rgba(201,168,76,0.06) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div className="tag" style={{ marginBottom: 28 }}>Technology & Innovation</div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 6vw, 84px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 32, maxWidth: 800 }}>
            Engineered<br />for<br /><span className="gradient-text">Precision.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 540, lineHeight: 1.8, marginBottom: 48 }}>
            We don't just write code. We architect systems that endure — built on modern foundations, optimized for African realities, and scaled for global ambition.
          </p>
          <div style={{ display: "flex", gap: 16 }}>
            <Link href="/impact#contact" className="btn-primary">Start a Project</Link>
            <a href="#stack" className="btn-ghost">Our Stack</a>
          </div>
        </div>
      </section>

      {/* Architecture visual */}
      <section ref={s1} style={{ padding: "80px 32px", background: "var(--charcoal)", position: "relative", overflow: "hidden" }}>
        {/* Background globe pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/globe.svg')", backgroundRepeat: "repeat", backgroundSize: "150px 150px", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 72, alignItems: "start" }} className="hero-grid">
          <div>
            <div className="fade-up tag" style={{ marginBottom: 24 }}>Architecture</div>
            <h2 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 28 }}>Systems that scale.<br /><span style={{ color: "var(--blue-bright)" }}>Not just software.</span></h2>
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 2 }}>
              {[
                { title: "Scalability", desc: "Every system we build is architected to handle 10x the initial load — microservices, caching layers, and horizontal scaling baked in from day one.", color: "#c9a84c" },
                { title: "Security", desc: "OWASP-compliant, encrypted at rest and in transit, role-based access control, audit trails, and penetration-tested before delivery.", color: "#2dba85" },
                { title: "Performance", desc: "Sub-second load times, database query optimization, CDN integration, and ongoing performance monitoring as standard.", color: "#b87333" },
              ].map(p => (
                <div key={p.title} className="fade-up" style={{ padding: "28px 28px", background: "var(--surface)", borderLeft: `3px solid ${p.color}`, display: "flex", gap: 20 }}>
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 16, marginBottom: 8, color: p.color }}>{p.title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.8 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up">
            <CodeBlock lines={[
              "// Sybella Systems — Core Architecture",
              "import { SyCore, SyCloud, SyIntel } from '@sybella/stack';",
              "",
              "const config: SybellaConfig = {",
              "  platform: 'enterprise',",
              "  region: 'africa',",
              "  scaling: 'auto-horizontal',",
              "  security: {",
              "    encryption: 'AES-256',",
              "    auth: 'OAuth2 + MFA',",
              "    compliance: ['GDPR', 'Rwanda-ICT'],",
              "  },",
              "  performance: {",
              "    cdn: 'edge-optimized',",
              "    cache: 'multi-layer',",
              "    target: '<200ms p95',",
              "  },",
              "  ai: SyIntel.configure({",
              "    matching: true,",
              "    analytics: 'real-time',",
              "  }),",
              "};",
              "",
              "export default SyCore.init(config);",
            ]} />
            
            {/* Development Environment Showcase */}
            <div style={{ marginTop: 32, position: "relative" }}>
              <div style={{ 
                background: "var(--surface)", 
                border: "1px solid var(--border)", 
                borderRadius: 4, 
                overflow: "hidden",
                position: "relative"
              }}>
                <div style={{ 
                  padding: "16px 20px", 
                  background: "var(--surface-2)", 
                  borderBottom: "1px solid var(--border)",
                  display: "flex",
                  alignItems: "center",
                  gap: 12
                }}>
                  <div style={{ display: "flex", gap: 6 }}>
                    {["#f87171","#fbbf24","#34d399"].map(c => 
                      <div key={c} style={{ width: 10, height: 10, borderRadius: "50%", background: c, opacity: 0.8 }} />
                    )}
                  </div>
                  <span style={{ fontSize: 12, color: "var(--text-secondary)", fontFamily: "monospace" }}>
                    development-environment.tsx
                  </span>
                </div>
                <div style={{ position: "relative", height: 300, overflow: "hidden" }}>
                  <Image 
                    src="/desktop-window-codes.jpg" 
                    alt="Sybella Systems Development Environment" 
                    fill
                    style={{ 
                      objectFit: "cover"
                    }}
                    quality={85}
                    sizes="(max-width: 1280px) 50vw, 640px"
                  />
                </div>
              </div>
              <p style={{ 
                fontSize: 12, 
                color: "var(--text-tertiary)", 
                textAlign: "center", 
                marginTop: 12,
                fontStyle: "italic"
              }}>
                Our development environment — precision engineering in action
              </p>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, marginTop: 2 }}>
              {[["99.9%", "Uptime SLA"], ["< 200ms", "p95 Response"], ["SOC 2", "Compliance Ready"], ["256-bit", "Encryption"]].map(([v, l]) => (
                <div key={l} style={{ padding: "20px 24px", background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center" }}>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 20, color: "var(--blue-bright)" }}>{v}</div>
                  <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginTop: 4, fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.08em" }}>{l}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Services grid */}
      <section id="stack" ref={s2} style={{ padding: "80px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fade-up" style={{ marginBottom: 64 }}>
            <div className="tag" style={{ marginBottom: 20 }}>Service Verticals</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>Six Capabilities.<br />One Partner.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }} className="three-grid">
            {services.map((s, i) => (
              <div key={s.code} className="fade-up card" style={{ padding: "36px" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, color: "var(--blue)", letterSpacing: "0.15em", textTransform: "uppercase", marginBottom: 12 }}>{s.code}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 14 }}>{s.name}</h3>
                <p style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 24 }}>{s.desc}</p>
                <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
                  {s.features.map(f => (
                    <div key={f} style={{ display: "flex", gap: 10, alignItems: "center" }}>
                      <div style={{ width: 4, height: 4, borderRadius: "50%", background: "var(--blue)", flexShrink: 0 }} />
                      <span style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 500 }}>{f}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section ref={s3} style={{ padding: "100px 32px", background: "var(--charcoal)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center" }} className="fade-up">
          <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20 }}>
            Have a system to build?
          </h2>
          <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 44, maxWidth: 480, margin: "0 auto 44px" }}>
            Tell us what you're building. We'll tell you how to make it last.
          </p>
          <Link href="/impact#contact" className="btn-primary" style={{ fontSize: 15, padding: "18px 40px" }}>Start a Conversation →</Link>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .three-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
