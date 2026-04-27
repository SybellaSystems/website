"use client";
import { useEffect, useRef, useState } from "react";

function useIntersection(ref: React.RefObject<HTMLElement | null>) {
  useEffect(() => {
    const obs = new IntersectionObserver(
      entries => entries.forEach(e => e.target.classList.toggle("visible", e.isIntersecting)),
      { threshold: 0.1 }
    );
    ref.current?.querySelectorAll(".fade-up").forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, [ref]);
}

export default function ImpactClient() {
  const s1 = useRef<HTMLDivElement>(null),
    s2 = useRef<HTMLDivElement>(null),
    s3 = useRef<HTMLDivElement>(null),
    s4 = useRef<HTMLDivElement>(null);
  useIntersection(s1 as React.RefObject<HTMLElement>);
  useIntersection(s2 as React.RefObject<HTMLElement>);
  useIntersection(s3 as React.RefObject<HTMLElement>);
  useIntersection(s4 as React.RefObject<HTMLElement>);
  const [form, setForm] = useState({ name: "", email: "", company: "", message: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const submit = async (ev: React.FormEvent) => {
    ev.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await fetch("/api/send-email", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          company: form.company,
          message: form.message,
        }),
      });

      if (response.ok) {
        setSent(true);
        setForm({ name: "", email: "", company: "", message: "" });
      } else {
        setError("Failed to send message. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const inputStyle = {
    padding: "16px 20px",
    background: "var(--surface)",
    border: "1px solid var(--border)",
    borderRadius: 3,
    color: "var(--text-primary)",
    fontSize: 15,
    fontFamily: "var(--font-body)",
    width: "100%",
    transition: "border-color 0.2s",
    outline: "none",
  };

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Hero */}
      <section style={{ padding: "100px 32px 80px", borderBottom: "1px solid var(--border)", position: "relative", overflow: "hidden" }}>
        {/* Background globe pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/globe.svg')", backgroundRepeat: "repeat", backgroundSize: "140px 140px", opacity: 0.15, pointerEvents: "none" }} />
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div style={{ position: "absolute", bottom: 0, left: 0, width: 600, height: 500, background: "radial-gradient(ellipse at left bottom, rgba(45,186,133,0.06) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", position: "relative" }}>
          <div className="tag tag-emerald" style={{ marginBottom: 28 }}>
            Impact & Story
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(44px, 6vw, 84px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 0.95, marginBottom: 32, maxWidth: 760 }}>
            Africa Has<br />
            the Talent.<br />
            <span style={{ color: "var(--emerald)" }}>We Build</span>
            <br />
            <span style={{ color: "var(--blue-bright)" }}>the Systems.</span>
          </h1>
          <p style={{ fontSize: 18, color: "var(--text-secondary)", maxWidth: 520, lineHeight: 1.8 }}>Sybella Systems is an African software company built for Africa's most ambitious founders. We engineer custom ERP systems, SaaS platforms, and digital solutions that empower enterprise companies across the continent. Founded in Rwanda, trusted across 5+ African markets.</p>
        </div>
      </section>

      {/* Story */}
      <section ref={s1} style={{ padding: "100px 32px", background: "var(--charcoal)", position: "relative", overflow: "hidden" }}>
        {/* Background window pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/window.svg')", backgroundRepeat: "repeat", backgroundSize: "160px 160px", opacity: 0.02, pointerEvents: "none" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="hero-grid">
            <div>
              <div className="fade-up tag" style={{ marginBottom: 24 }}>
                Our Story
              </div>
              <h2 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3vw, 44px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 28 }}>
                Founded in Rulindo.<br />
                <span style={{ color: "var(--blue-bright)" }}>Built for a continent.</span>
              </h2>
              <p className="fade-up" style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: 24 }}>
                Sybella Systems was incorporated in Rwanda in 2025 with a dual-founder structure designed for long-term governance and bold vision. From day one, we committed to a simple standard: every product we ship must be globally competitive.
              </p>
              <p className="fade-up" style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.9, marginBottom: 40 }}>
                Our flagship product, Ogera, is the embodiment of that vision — a platform that puts Africa's university graduates into meaningful employment, and gives forward-thinking employers access to a continent of talent that has, until now, been largely invisible to them.
              </p>
              <div className="fade-up" style={{ display: "flex", gap: 32 }}>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--blue-bright)" }}>2025</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Founded</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--blue-bright)" }}>Rulindo</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Headquarters</div>
                </div>
                <div>
                  <div style={{ fontFamily: "var(--font-display)", fontSize: 32, fontWeight: 800, color: "var(--blue-bright)" }}>Africa</div>
                  <div style={{ fontSize: 12, color: "var(--text-tertiary)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.1em" }}>Market</div>
                </div>
              </div>
            </div>
            {/* Milestones */}
            <div>
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                {[
                  { number: "2", label: "Co-founders", icon: "◎" },
                  { number: "6", label: "Service Verticals", icon: "◈" },
                  { number: "1", label: "Flagship Product", icon: "⬡" },
                  { number: "5", label: "Markets Target", icon: "▲" },
                ].map(m => (
                  <div key={m.label} className="fade-up card" style={{ padding: 32, textAlign: "center" }}>
                    <div style={{ fontSize: 24, marginBottom: 12, color: "var(--blue)" }}>{m.icon}</div>
                    <div style={{ fontFamily: "var(--font-display)", fontSize: 36, fontWeight: 800, color: "var(--blue-bright)", marginBottom: 8 }}>{m.number}</div>
                    <div style={{ fontSize: 12, color: "var(--text-secondary)", fontWeight: 600 }}>{m.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Mission / Values */}
      <section ref={s2} style={{ padding: "100px 32px", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fade-up" style={{ maxWidth: 640, marginBottom: 72 }}>
            <div className="tag" style={{ marginBottom: 20 }}>
              Mission & Values
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1 }}>What we stand for.</h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: 2 }} className="two-grid">
            {[
              { title: "Excellence Over Speed", text: "We would rather take one more week and ship something extraordinary than rush and deliver the ordinary. Africa's businesses deserve systems built to last 10 years, not 10 months.", icon: "◈" },
              { title: "African Context First", text: "We build for the realities of the continent: variable connectivity, diverse payment systems, multilingual users, and regulatory environments that differ country to country.", icon: "◉" },
              { title: "Transparent Partnership", text: "We are your technology partner, not a vendor. You understand our architecture, own your data, and have full visibility into every decision we make on your behalf.", icon: "⬡" },
              { title: "Long-Term Thinking", text: "We measure success in decades. The companies we build with today should still be running on Sybella infrastructure in 2040 — and it should still feel modern.", icon: "▲" },
            ].map(v => (
              <div key={v.title} className="fade-up card" style={{ padding: "44px 40px" }}>
                <div style={{ fontSize: 28, marginBottom: 24, color: "var(--blue)" }}>{v.icon}</div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, letterSpacing: "-0.02em", marginBottom: 14 }}>{v.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{v.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" ref={s3} style={{ padding: "100px 32px", background: "var(--charcoal)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "start" }} className="hero-grid">
          <div>
            <div className="fade-up tag" style={{ marginBottom: 28 }}>
              Work With Us
            </div>
            <h2 className="fade-up" style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.0, marginBottom: 24 }}>
              Let's build<br />
              something<br />
              <span className="gradient-text">exceptional.</span>
            </h2>
            <p className="fade-up" style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 44 }}>
              Whether you need an ERP system, a SaaS platform, or a mobile application — start with a conversation. No sales pitch. Just an honest discussion about what you're building and how we can help.
            </p>
            <div className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                { icon: "◎", label: "General Inquiries", value: "contact@sybellasystems.co.rw" },
                { icon: "◈", label: "Location", value: "Rulindo, Rwanda" },
                { icon: "⬡", label: "Founded", value: "2025 · Private Limited Company" },
              ].map(c => (
                <div key={c.label} style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
                  <div style={{ width: 36, height: 36, background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 2, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, color: "var(--blue)", flexShrink: 0 }}>{c.icon}</div>
                  <div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", fontFamily: "var(--font-display)", fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", marginBottom: 4 }}>{c.label}</div>
                    <div style={{ fontSize: 14, color: "var(--text-secondary)" }}>{c.value}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up">
            {sent ? (
              <div style={{ padding: 60, background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.25)", borderRadius: 4, textAlign: "center" }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>◎</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--blue-bright)", marginBottom: 8 }}>Message received.</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>We'll respond within 24-48 hours.</div>
                <button onClick={() => setSent(false)} style={{ padding: "10px 20px", background: "var(--blue)", color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  {[{ name: "name", placeholder: "Your name" }, { name: "company", placeholder: "Company / Organization" }].map(f => (
                    <input
                      key={f.name}
                      name={f.name}
                      required
                      placeholder={f.placeholder}
                      value={form[f.name as keyof typeof form]}
                      onChange={handle}
                      style={inputStyle}
                      onFocus={e => (e.target.style.borderColor = "var(--blue)")}
                      onBlur={e => (e.target.style.borderColor = "var(--border)")}
                    />
                  ))}
                </div>
                <input name="email" type="email" required placeholder="Email address" value={form.email} onChange={handle} style={inputStyle} onFocus={e => (e.target.style.borderColor = "var(--gold)")} onBlur={e => (e.target.style.borderColor = "var(--border)")} />
                <textarea
                  name="message"
                  required
                  placeholder="Describe what you're building and how we can help..."
                  rows={6}
                  value={form.message}
                  onChange={handle}
                  style={{ ...inputStyle, resize: "vertical" }}
                  onFocus={e => (e.target.style.borderColor = "var(--gold)")}
                  onBlur={e => (e.target.style.borderColor = "var(--border)")}
                />
                {error && <div style={{ fontSize: 13, color: "var(--red)", padding: "12px 16px", background: "rgba(239,68,68,0.1)", borderRadius: 2 }}>{error}</div>}
                <button type="submit" className="btn-primary" style={{ justifyContent: "center", padding: "18px 32px", fontSize: 14 }} disabled={loading}>
                  {loading ? "Sending..." : "Send Message →"}
                </button>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)", textAlign: "center" }}>Sent to contact@sybellasystems.co.rw · We respond within 48 hours</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
          .two-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
}
