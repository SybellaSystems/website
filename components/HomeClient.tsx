"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Projects from '../components/Projects'
import Journey from '../components/Journey'



function useIntersection(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const obs = new IntersectionObserver(entries =>
      entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

/* Stat card */
function Stat({ n, label, suffix = "" }: { n: string; label: string; suffix?: string }) {
  return (
    <div style={{ padding: "clamp(20px, 4vw, 28px) clamp(16px, 4vw, 24px)", borderLeft: "1px solid var(--border)" }}>
      <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 5vw, 40px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--blue-bright)", lineHeight: 1 }}>
        {n}<span style={{ fontSize: "clamp(16px, 3vw, 24px)", color: "var(--blue)", opacity: 0.8 }}>{suffix}</span>
      </div>
      <div style={{ fontSize: "clamp(11px, 2vw, 13px)", color: "var(--text-secondary)", marginTop: 8, fontWeight: 500 }}>{label}</div>
    </div>
  );
}

/* Service card */
function ServiceCard({ icon, title, desc, accent }: { icon: string; title: string; desc: string; accent: string }) {
  return (
    <div className="card" style={{ padding: "clamp(24px, 5vw, 36px)", cursor: "default" }}>
      <div style={{ width: 44, height: 44, borderRadius: 3, background: accent + "15", border: `1px solid ${accent}30`, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16 }}>
        <span style={{ fontSize: 20 }}>{icon}</span>
      </div>
      <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 3vw, 18px)", fontWeight: 700, marginBottom: 12, letterSpacing: "-0.02em" }}>{title}</h3>
      <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "var(--text-secondary)", lineHeight: 1.8 }}>{desc}</p>
    </div>
  );
}

export default function HomeClient() {
  const heroRef = useRef<HTMLDivElement>(null);
  const aboutRef = useRef<HTMLDivElement>(null);
  const servicesRef = useRef<HTMLDivElement>(null);
  const ogeraRef = useRef<HTMLDivElement>(null);
  const trustRef = useRef<HTMLDivElement>(null);

  useIntersection(aboutRef as React.RefObject<HTMLElement>);
  useIntersection(servicesRef as React.RefObject<HTMLElement>);
  useIntersection(ogeraRef as React.RefObject<HTMLElement>);
  useIntersection(trustRef as React.RefObject<HTMLElement>);

  return (
    <div>
      {/* ── HERO ── */}
      <section ref={heroRef} style={{ minHeight: "100vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", paddingTop: "clamp(60px, 10vw, 72px)", paddingBottom: 0 }}>
        {/* Background grid */}
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.7 }} />
        {/* Background globe pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/globe.svg')", backgroundRepeat: "repeat", backgroundSize: "120px 120px", opacity: 0.15, pointerEvents: "none" }} />
        {/* Background gradient blob */}
        <div style={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: "clamp(400px, 80vw, 800px)", height: "clamp(400px, 80vw, 800px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(201,168,76,0.1) 0%, transparent 70%)", pointerEvents: "none" }} />
        <div style={{ position: "absolute", bottom: 0, right: 0, width: "clamp(300px, 60vw, 600px)", height: "clamp(300px, 60vw, 600px)", borderRadius: "50%", background: "radial-gradient(circle, rgba(45,186,133,0.08) 0%, transparent 70%)", pointerEvents: "none" }} />

        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "clamp(40px, 8vw, 80px) clamp(16px, 5vw, 32px)", width: "100%", display: "grid", gridTemplateColumns: "1fr", gap: "clamp(40px, 8vw, 60px)" }} className="hero-grid">
          {/* Left */}
          <div>
            <div className="tag" style={{ marginBottom: "clamp(20px, 4vw, 28px)" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--blue)", display: "inline-block" }} />
              Rulindo, Rwanda · Est. 2025
            </div>
            <h1 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(36px, 8vw, 76px)", 
              fontWeight: 800, 
              letterSpacing: "-0.04em", 
              lineHeight: 1.0, 
              marginBottom: "clamp(20px, 4vw, 28px)" 
            }}>
              Premium Software <br />
              Development<br />
              <span className="gradient-text">Solutions for Africa</span>
            </h1>
            <p style={{ fontSize: "clamp(14px, 2.5vw, 18px)", color: "var(--text-secondary)", lineHeight: 1.8, maxWidth: 520, marginBottom: "clamp(32px, 6vw, 44px)" }}>
              Sybella Systems is a leading software development company in Africa, specializing in SaaS platforms, custom ERP systems, and the Ogera student employment platform. We build digital solutions that power Africa's most ambitious companies.
            </p>
            <div style={{ display: "flex", gap: "clamp(12px, 3vw, 16px)", flexWrap: "wrap", marginBottom: "clamp(40px, 8vw, 60px)" }}>
              <Link href="/technology" className="btn-primary">Explore Our Work</Link>
              <Link href="/ogera" className="btn-ghost">Discover Ogera</Link>
            </div>

            {/* Stats row */}
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", borderTop: "1px solid var(--border)", paddingTop: "clamp(40px, 8vw, 60px)" }}>
              <Stat n="6" suffix="+" label="Service Verticals" />
              <Stat n="∞" label="Scalable Architecture" />
              <Stat n="1" suffix="st" label="African SaaS Vision" />
            </div>
          </div>
        </div>
      </section>

      {/* ── VISION ── */}
      <section 
        ref={aboutRef} 
        style={{ 
          padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", 
          borderTop: "1px solid var(--border)", 
          background: "var(--charcoal)", 
          position: "relative", 
          overflow: "hidden" 
        }}
      >
        {/* Background patterns */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/window.svg')", backgroundRepeat: "repeat", backgroundSize: "150px 150px", opacity: 0.02, pointerEvents: "none" }} />
        <div style={{ position: "absolute", top: 0, left: "50%", transform: "translateX(-50%)", width: "80%", height: 1, background: "linear-gradient(90deg, transparent, var(--gold), transparent)", opacity: 0.3 }} />

        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          
          <div style={{ 
            display: "grid", 
            gridTemplateColumns: "1fr 1fr", 
            gap: "clamp(40px, 8vw, 80px)", 
            alignItems: "center" 
          }} className="vision-grid">

            {/* Left - Text */}
            <div className="fade-up">
              <div className="tag" style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>Vision</div>
              <h2 style={{ 
                fontFamily: "var(--font-display)", 
                fontSize: "clamp(28px, 6vw, 56px)", 
                fontWeight: 800, 
                letterSpacing: "-0.03em", 
                lineHeight: 1.1, 
                marginBottom: "clamp(16px, 3vw, 24px)" 
              }}>
                We don't follow trends.<br />
                <span style={{ color: "var(--text-secondary)", fontStyle: "italic", fontWeight: 400 }}>We engineer the systems that create them.</span>
              </h2>
              <p style={{ fontSize: "clamp(14px, 2.5vw, 17px)", color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: "clamp(20px, 4vw, 28px)" }}>
                Africa has 1.4 billion people and the world's fastest-growing youth population. Our software development company in Africa is building the digital infrastructure for that future — custom, precise, and uncompromising in excellence. Every system we build is engineered to handle complexity, scale beyond expectations, and serve as the foundation for lasting success.
              </p>
            </div>

            {/* Right - Developer Image */}
            <div className="fade-up" style={{ 
              position: "relative", 
              display: "flex", 
              justifyContent: "center",
              alignItems: "center"
            }}>
              <div style={{ position: "relative", width: "100%", maxWidth: "500px", height: "clamp(400px, 70vw, 600px)", borderRadius: "clamp(16px, 4vw, 28px)", overflow: "hidden" }}>
                <Image 
                  src="/developer-reviewing-code.png"
                  alt="Software development company in Africa — Sybella Systems engineer reviewing custom ERP and SaaS code"
                  fill
                  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 90vw, 500px"
                  style={{ 
                    objectFit: "cover",
                    filter: "drop-shadow(0 40px 90px rgba(0,0,0,0.35))"
                  }}
                  priority
                  quality={85}
                />
              </div>
            </div>

          </div>

          {/* Values grid */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr", gap: 2, marginTop: "clamp(60px, 12vw, 100px)" }} className="values-grid">
            {[
              { n: "01", title: "Precision Engineering", text: "Every line of code is intentional. Our software development company builds systems that handle edge cases, scale under load, and last decades." },
              { n: "02", title: "African Context First", text: "Our SaaS and ERP solutions understand local infrastructure, regulations, payment systems, and real user behavior across the continent." },
              { n: "03", title: "Global Standard", text: "We hold our software engineering to the same standards as the world's top companies — because Africa's builders deserve nothing less." },
            ].map(v => (
              <div key={v.n} className="fade-up" style={{ padding: "clamp(32px, 6vw, 48px) clamp(24px, 6vw, 40px)", background: "var(--surface)", borderRight: "1px solid var(--border)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(9px, 1.5vw, 11px)", fontWeight: 700, color: "var(--blue)", letterSpacing: "0.2em", marginBottom: "clamp(16px, 3vw, 20px)" }}>{v.n}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(18px, 4vw, 22px)", fontWeight: 700, marginBottom: "clamp(12px, 2vw, 16px)", letterSpacing: "-0.02em" }}>{v.title}</h3>
                <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "var(--text-secondary)", lineHeight: 1.85 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SERVICES ── */}
      <section ref={servicesRef} style={{ padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", position: "relative", overflow: "hidden", marginBottom: 0 }}>
        {/* Background file pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/file.svg')", backgroundRepeat: "repeat", backgroundSize: "100px 100px", opacity: 0.12, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: "clamp(40px, 8vw, 64px)", flexWrap: "wrap", gap: "clamp(16px, 4vw, 24px)" }}>
            <div className="fade-up">
              <div className="tag" style={{ marginBottom: "clamp(16px, 2vw, 20px)" }}>Services</div>
              <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
                Software Development Services<br />
                <span style={{ color: "var(--text-secondary)", fontWeight: 600, fontSize: "clamp(18px, 4vw, 32px)" }}>Custom SaaS & ERP Solutions</span>
              </h2>
            </div>
            <Link href="/technology" className="btn-ghost fade-up" style={{ fontSize: "clamp(11px, 2vw, 12px)" }}>View All Capabilities →</Link>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(clamp(250px, 100%, 320px), 1fr))", gap: 2 }}>
            {[
              { icon: "⬡", title: "SyCore™ ERP", desc: "Enterprise resource planning systems built for African operational complexity — inventory, HR, finance, compliance in one precision-built platform.", accent: "#c9a84c" },
              { icon: "◻", title: "SyWeb™", desc: "High-performance web platforms engineered for conversion, speed, and scale. From landing pages to complex enterprise portals.", accent: "#2dba85" },
              { icon: "◈", title: "SyMobile™", desc: "iOS and Android applications that work across Africa's diverse network conditions and device ecosystems.", accent: "#b87333" },
              { icon: "▲", title: "SyCloud™", desc: "Cloud architecture, DevOps pipelines, and infrastructure management. Built for uptime and optimized for cost at scale.", accent: "#3b82f6" },
              { icon: "◎", title: "SyCommerce™", desc: "E-commerce solutions with African payment integrations — MTN, Airtel, M-Pesa, local gateways, and international rails.", accent: "#2dba85" },
              { icon: "⬡", title: "SyIntel™ AI & Data Analytics", desc: "Premium AI and machine learning intelligence layers that transform business data into actionable strategy. Build competitive advantage with predictive analytics and AI-driven insights.", accent: "#c9a84c" },
            ].map(s => (
              <div key={s.title} className="fade-up">
                <ServiceCard {...s} />
              </div>
            ))}
          </div>
        </div>
      </section>
       
       {/* Project section data fectched from the backend API */}
      {/* <div><Projects /></div> */}

      {/* ── OGERA HIGHLIGHT ── */}
      <section 
        ref={ogeraRef}
        style={{ 
          padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", 
          borderTop: "1px solid var(--border)", 
          background: "linear-gradient(135deg, rgba(45,186,133,0.06) 0%, transparent 100%)",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/globe.svg')", backgroundRepeat: "repeat", backgroundSize: "120px 120px", opacity: 0.08, pointerEvents: "none" }} />
        
        <div style={{ maxWidth: 800, margin: "0 auto", textAlign: "center", position: "relative" }}>
          <div className="fade-up">
            <div className="tag tag-emerald" style={{ marginBottom: "clamp(16px, 3vw, 24px)", display: "inline-flex" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block" }} />
              Student Employment Platform
            </div>
            <h2 style={{ 
              fontFamily: "var(--font-display)", 
              fontSize: "clamp(28px, 5vw, 48px)", 
              fontWeight: 800, 
              letterSpacing: "-0.03em", 
              lineHeight: 1.1, 
              marginBottom: "clamp(16px, 3vw, 24px)" 
            }}>
              Ogera: Online Jobs for Africa's Students
            </h2>
            <p style={{ 
              fontSize: "clamp(14px, 2.5vw, 17px)", 
              color: "var(--text-secondary)", 
              lineHeight: 1.85, 
              marginBottom: "clamp(20px, 4vw, 32px)",
              maxWidth: 700
            }}>
              Part of our commitment to Africa's digital future, Ogera connects university students across the continent with verified online job opportunities, internships, and remote work. Students earn income, build experience, and employers find vetted, motivated talent. Our student employment platform is transforming how young professionals in Africa access career opportunities.
            </p>
            <Link href="/ogera" className="btn-primary" style={{ background: "var(--emerald)" }}>
              Explore Ogera Student Jobs →
            </Link>
          </div>
        </div>
      </section>
      
      {/* ── TRUST INDICATORS ── */}
      <section ref={trustRef} style={{ padding: "clamp(60px, 10vw, 80px) clamp(16px, 5vw, 32px)", borderTop: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        {/* Background window pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/window.svg')", backgroundRepeat: "repeat", backgroundSize: "160px 160px", opacity: 0.02, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fade-up" style={{ textAlign: "center", marginBottom: "clamp(40px, 8vw, 64px)" }}>
            <div className="tag" style={{ marginBottom: "clamp(16px, 2vw, 20px)" }}>Credibility</div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em" }}>Built to Last. Trusted to Scale.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 2, marginBottom: "clamp(40px, 8vw, 80px)" }} className="stats-grid">
            {[
              { n: "RWF 10M", label: "Authorized Capital" },
              { n: "6", label: "Service Verticals" },
              { n: "14 Jun", label: "Ogera Beta Launch" },
              { n: "∞", label: "Scalability Target" },
            ].map(s => (
              <div key={s.label} className="fade-up" style={{ padding: "clamp(28px, 5vw, 40px) clamp(20px, 4vw, 32px)", background: "var(--surface)", border: "1px solid var(--border)", textAlign: "center" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(24px, 5vw, 36px)", fontWeight: 800, letterSpacing: "-0.04em", color: "var(--blue-bright)", marginBottom: 8 }}>{s.n}</div>
                <div style={{ fontSize: "clamp(11px, 2vw, 13px)", color: "var(--text-secondary)", fontWeight: 500 }}>{s.label}</div>
              </div>
            ))}
          </div>

       {/* milestones Journey data fetched from backend API*/}
      {/* <div><Journey /></div> */}

          {/* CTA block */}
          <div className="fade-up cta-grid" style={{ display: "grid", gridTemplateColumns: "1fr", gap: 2 }}>
            <div style={{ padding: "clamp(40px, 8vw, 60px) clamp(24px, 6vw, 56px)", background: "var(--surface)", border: "1px solid var(--border)" }}>
              <div className="tag" style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>For Businesses</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "clamp(12px, 2vw, 16px)" }}>Partner with a leading software development company in Africa</h3>
              <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "var(--text-secondary)", marginBottom: "clamp(20px, 4vw, 32px)", lineHeight: 1.8 }}>Engineer the exact SaaS platform, ERP system, or digital solution your organization needs to scale across Africa and beyond.</p>
              <Link href="/impact#contact" className="btn-primary">Work With Us →</Link>
            </div>
            <div style={{ padding: "clamp(40px, 8vw, 60px) clamp(24px, 6vw, 56px)", background: "linear-gradient(135deg, rgba(45,186,133,0.08) 0%, var(--surface) 60%)", border: "1px solid rgba(45,186,133,0.2)" }}>
              <div className="tag tag-emerald" style={{ marginBottom: "clamp(16px, 3vw, 24px)" }}>For Students & Employers</div>
              <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 700, letterSpacing: "-0.03em", marginBottom: "clamp(12px, 2vw, 16px)" }}>Africa's talent deserves Africa's opportunity.</h3>
              <p style={{ fontSize: "clamp(13px, 2vw, 14px)", color: "var(--text-secondary)", marginBottom: "clamp(20px, 4vw, 32px)", lineHeight: 1.8 }}>Join Ogera's early access platform for student online jobs and be part of the revolution in African talent and employment.</p>
              <Link href="/ogera#join" className="btn-primary" style={{ background: "var(--emerald)" }}>Join Ogera →</Link>
            </div>
          </div>
        </div>
      </section>

      <style>{`
        /* Fade-up animation */
        .fade-up {
          opacity: 0;
          transform: translateY(30px);
          transition: opacity 0.6s ease-out, transform 0.6s ease-out;
          will-change: opacity, transform;
        }

        .fade-up.visible {
          opacity: 1;
          transform: translateY(0);
        }

        /* Responsive grid layouts */
        @media (max-width: 1024px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
          .vision-grid { grid-template-columns: 1fr !important; gap: 60px !important; }
        }

        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .vision-grid { grid-template-columns: 1fr !important; gap: 40px !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2, 1fr) !important; }
          .cta-grid { grid-template-columns: 1fr !important; }
        }

        @media (max-width: 480px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .vision-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
          .values-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: 1fr !important; }
          .cta-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
