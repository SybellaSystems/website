"use client";
import { useEffect, useRef } from "react";
import Link from "next/link";

function useIntersection(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.12 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

export default function TechnologyClient() {
  const capabilitiesRef = useRef<HTMLDivElement>(null);
  const stackRef = useRef<HTMLDivElement>(null);
  const deliveryRef = useRef<HTMLDivElement>(null);

  useIntersection(capabilitiesRef as React.RefObject<HTMLElement>);
  useIntersection(stackRef as React.RefObject<HTMLElement>);
  useIntersection(deliveryRef as React.RefObject<HTMLElement>);

  return (
    <div>
      <section
        style={{
          minHeight: "clamp(620px, 88vh, 860px)",
          position: "relative",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          paddingTop: "clamp(120px, 15vw, 170px)",
          paddingBottom: "clamp(60px, 8vw, 96px)",
        }}
      >
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.45 }} />
        <div
          style={{
            position: "absolute",
            top: "-12%",
            right: "-10%",
            width: "min(860px, 86vw)",
            height: "min(860px, 86vw)",
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(37,99,235,0.20) 0%, transparent 66%)",
            filter: "blur(40px)",
            pointerEvents: "none",
          }}
        />
        <div
          style={{
            maxWidth: 1280,
            margin: "0 auto",
            width: "100%",
            padding: "0 clamp(16px, 5vw, 32px)",
            position: "relative",
            zIndex: 1,
          }}
        >
          <div className="tag" style={{ marginBottom: "clamp(16px, 2vw, 22px)" }}>
            Technology Services
          </div>
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px, 5.4vw, 66px)",
              fontWeight: 800,
              letterSpacing: "-0.04em",
              lineHeight: 1.05,
              maxWidth: 860,
              marginBottom: "clamp(18px, 2.8vw, 28px)",
              color: "var(--ink-strong)",
            }}
          >
            Engineering digital products that scale with your business.
          </h1>
          <p
            style={{
              fontSize: "clamp(15px, 2vw, 18px)",
              color: "var(--ink-muted)",
              lineHeight: 1.75,
              maxWidth: 660,
              marginBottom: "clamp(24px, 3.6vw, 36px)",
            }}
          >
            From core architecture to production operations, we design and build software systems with enterprise-grade quality, measurable delivery, and long-term reliability.
          </p>
          <div style={{ display: "flex", gap: "clamp(10px, 1.8vw, 14px)", flexWrap: "wrap" }}>
            <Link href="/impact#contact" className="btn-primary" style={{ borderRadius: 9999 }}>
              Start a Technology Project
            </Link>
            <Link href="/impact" className="btn-ghost" style={{ borderRadius: 9999 }}>
              View Our Delivery Model
            </Link>
          </div>
        </div>
      </section>

      <section ref={capabilitiesRef} style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 32px)", background: "var(--bg-page)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fade-up" style={{ textAlign: "center", marginBottom: "clamp(36px, 5.5vw, 54px)" }}>
            <div className="tag" style={{ marginBottom: 14 }}>
              Core Capabilities
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4.4vw, 46px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Full-stack delivery for<br />
              <span className="gradient-text">mission-critical products.</span>
            </h2>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))", gap: "clamp(12px, 2vw, 20px)" }}>
            {[
              {
                title: "Custom ERP Platforms",
                desc: "Integrated systems for operations, finance, HR, and reporting with role-based controls and scalable architecture.",
              },
              {
                title: "SaaS Product Engineering",
                desc: "Product development from MVP to enterprise scale with resilient APIs, secure multi-tenant foundations, and analytics.",
              },
              {
                title: "Web & Mobile Experiences",
                desc: "High-performance user-facing products with responsive UX, accessibility standards, and conversion-focused interfaces.",
              },
              {
                title: "Cloud & DevOps Enablement",
                desc: "CI/CD, observability, release automation, and infrastructure hardening for predictable deployments and uptime.",
              },
            ].map(item => (
              <div key={item.title} className="fade-up card" style={{ padding: "clamp(22px, 3vw, 30px)", borderRadius: 12 }}>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(17px, 2vw, 21px)", fontWeight: 800, letterSpacing: "-0.02em", color: "var(--ink-strong)", marginBottom: 10 }}>
                  {item.title}
                </h3>
                <p style={{ fontSize: "clamp(12px, 1.5vw, 14px)", color: "var(--ink-muted)", lineHeight: 1.72 }}>{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={stackRef} style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 32px)", background: "var(--bg-soft)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fade-up" style={{ textAlign: "center", marginBottom: "clamp(34px, 5vw, 48px)" }}>
            <div className="tag" style={{ marginBottom: 14 }}>
              Delivery Stack
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(26px, 4vw, 42px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>
              Structured execution across<br />
              <span className="gradient-text">product, engineering, and operations.</span>
            </h2>
          </div>

          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))", gap: "clamp(10px, 1.6vw, 14px)", marginBottom: "clamp(18px, 2.8vw, 24px)" }}>
            {[
              { value: "Architecture", label: "System design blueprints" },
              { value: "QA Gates", label: "Release confidence checkpoints" },
              { value: "CI/CD", label: "Deployment automation pipeline" },
              { value: "Monitoring", label: "Post-launch reliability controls" },
            ].map(metric => (
              <div key={metric.label} style={{ border: "1px solid var(--border)", borderRadius: 12, background: "var(--surface)", padding: "clamp(14px, 2.2vw, 20px)" }}>
                <div style={{ fontFamily: "var(--font-display)", fontSize: "clamp(16px, 2.2vw, 22px)", fontWeight: 800, color: "var(--accent)", letterSpacing: "-0.02em" }}>{metric.value}</div>
                <p style={{ marginTop: 6, fontSize: "clamp(11px, 1.4vw, 13px)", color: "var(--ink-muted)", lineHeight: 1.55 }}>{metric.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section ref={deliveryRef} style={{ padding: "clamp(60px, 10vw, 100px) clamp(16px, 5vw, 32px)", background: "var(--bg-page)" }}>
        <div style={{ maxWidth: 1040, margin: "0 auto", textAlign: "center" }}>
          <div className="fade-up tag" style={{ marginBottom: 14 }}>
            Engagement
          </div>
          <h2 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 4.4vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 14 }}>
            Need a partner for your next build?
          </h2>
          <p className="fade-up" style={{ fontSize: "clamp(14px, 1.8vw, 16px)", color: "var(--ink-muted)", lineHeight: 1.75, maxWidth: 640, margin: "0 auto 24px" }}>
            We can support scoped projects, dedicated product teams, or advisory-led execution based on your growth stage and operating model.
          </p>
          <div className="fade-up" style={{ display: "flex", justifyContent: "center", gap: 12, flexWrap: "wrap" }}>
            <Link href="/impact#contact" className="btn-primary" style={{ borderRadius: 9999 }}>
              Book a Technical Consultation
            </Link>
            <a href="mailto:contact@sybellasystems.co.rw" className="btn-ghost" style={{ borderRadius: 9999 }}>
              contact@sybellasystems.co.rw
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}