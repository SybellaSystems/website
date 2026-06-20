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

export default function OgeraClient() {
  const s1 = useRef<HTMLDivElement>(null),
    s2 = useRef<HTMLDivElement>(null),
    s3 = useRef<HTMLDivElement>(null),
    s4 = useRef<HTMLDivElement>(null);
  useIntersection(s1 as React.RefObject<HTMLElement>);
  useIntersection(s2 as React.RefObject<HTMLElement>);
  useIntersection(s3 as React.RefObject<HTMLElement>);
  useIntersection(s4 as React.RefObject<HTMLElement>);
  const [form, setForm] = useState({ name: "", email: "", role: "business", company: "" });
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handle = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
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
          role: form.role,
          message: `New Ogera Registration\n\nRole: ${form.role}\nCompany: ${form.company}`,
        }),
      });

      if (response.ok) {
        setSent(true);
        setForm({ name: "", email: "", role: "business", company: "" });
      } else {
        setError("Failed to submit. Please try again.");
      }
    } catch (err) {
      setError("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ paddingTop: 72 }}>
      {/* Hero */}
      <section style={{ minHeight: "88vh", display: "flex", alignItems: "center", position: "relative", overflow: "hidden", borderBottom: "1px solid var(--border)" }}>
        {/* Background globe pattern */}
        <div style={{ position: "absolute", inset: 0, backgroundImage: "url('/globe.svg')", backgroundRepeat: "repeat", backgroundSize: "120px 120px", opacity: 0.15, pointerEvents: "none" }} />
        <div className="grid-pattern" style={{ position: "absolute", inset: 0, opacity: 0.6 }} />
        <div style={{ position: "absolute", top: 0, left: 0, right: 0, height: 600, background: "radial-gradient(ellipse 80% 60% at 60% 30%, rgba(45,186,133,0.08) 0%, transparent 70%)" }} />
        <div style={{ maxWidth: 1280, margin: "0 auto", padding: "80px 32px", position: "relative" }}>
          <div className="tag tag-emerald" style={{ marginBottom: 28 }}>
            <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block" }} />
            Africa's #1 Student Employment Platform
          </div>
          <h1 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(48px, 7vw, 96px)", fontWeight: 800, letterSpacing: "-0.05em", lineHeight: 0.95, marginBottom: 32, maxWidth: 900 }}>
            Africa's premier<br />Student Job & Internship <br />
            <span style={{ color: "var(--emerald)" }}>Platform.</span>
          </h1>
          <p style={{ fontSize: "clamp(17px, 1.5vw, 20px)", color: "var(--text-secondary)", maxWidth: 560, lineHeight: 1.75, marginBottom: 48 }}>
            Ogera doesn't just connect students to jobs. It builds careers. A complete platform for Africa's brightest young professionals to earn, grow, and be recognized.
          </p>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <a href="https://ogera.sybellasystems.co.rw" className="btn-primary" style={{ background: "var(--emerald)" }}>
              Join the platform ↗
            </a>
            <a href="#how" className="btn-ghost">
              How It Works
            </a>
          </div>
        </div>
      </section>

      {/* How It Works — Students */}
      <section id="how" ref={s1} style={{ padding: "80px 32px", background: "var(--charcoal)" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto" }}>
          <div className="fade-up" style={{ marginBottom: 72 }}>
            <div className="tag tag-emerald" style={{ marginBottom: 20 }}>
              For Students
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 52px)", fontWeight: 800, letterSpacing: "-0.04em", lineHeight: 1.1 }}>
              Your career starts here.<br />
              <span style={{ color: "var(--text-secondary)", fontWeight: 400, fontStyle: "italic" }}>Not after graduation.</span>
            </h2>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 2 }} className="three-grid">
            {[
              { n: "01", icon: "◎", title: "Build Your Profile", text: "Create a verified professional identity — skills, projects, academic achievements, and references all in one place.", accent: "#2dba85" },
              { n: "02", icon: "⬡", title: "Get Matched", text: "Ogera's matching engine surfaces opportunities aligned with your major, availability, location, and career goals.", accent: "#c9a84c" },
              { n: "03", icon: "▲", title: "Earn & Grow", text: "Work part-time, freelance, or intern. Build a track record. Every opportunity builds your verified employment history.", accent: "#b87333" },
            ].map(s => (
              <div key={s.n} className="fade-up card" style={{ padding: "44px 36px" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 32 }}>
                  <div style={{ width: 48, height: 48, background: s.accent + "15", border: `1px solid ${s.accent}30`, borderRadius: 3, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 20, color: s.accent }}>{s.icon}</div>
                  <span style={{ fontFamily: "var(--font-display)", fontSize: 11, fontWeight: 700, color: "var(--text-tertiary)", letterSpacing: "0.2em" }}>{s.n}</span>
                </div>
                <h3 style={{ fontFamily: "var(--font-display)", fontSize: 20, fontWeight: 700, marginBottom: 14, letterSpacing: "-0.02em" }}>{s.title}</h3>
                <p style={{ fontSize: 14, color: "var(--text-secondary)", lineHeight: 1.85 }}>{s.text}</p>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 72, padding: "40px 32px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, textAlign: "center" }}>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", marginBottom: 20 }}>Are you a student ready to start earning?</p>
            <a href="https://ogera.sybellasystems.co.rw" className="btn-primary" style={{ background: "var(--emerald)", display: "inline-flex", justifyContent: "center", padding: "12px 32px" }}>
              Access Ogera Platform ↗
            </a>
          </div>
        </div>
      </section>

      {/* For Employers */}
      <section id="employers" ref={s2} style={{ padding: "120px 32px" }}>
        <div style={{ maxWidth: 1280, margin: "0 auto", display: "grid", gridTemplateColumns: "1fr 1fr", gap: 80, alignItems: "center" }} className="hero-grid">
          <div className="fade-up">
            <div className="tag" style={{ marginBottom: 24 }}>
              For Employers
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(28px, 3.5vw, 48px)", fontWeight: 800, letterSpacing: "-0.03em", lineHeight: 1.1, marginBottom: 24 }}>
              Africa's talent pool,<br />
              <span style={{ color: "var(--blue-bright)" }}>curated for you.</span>
            </h2>
            <p style={{ fontSize: 15, color: "var(--text-secondary)", lineHeight: 1.85, marginBottom: 36 }}>Stop sifting through unqualified applications. Ogera surfaces pre-verified, motivated university students who are ready to contribute from day one.</p>
            <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
              {[
                ["Verified Profiles", "Every student profile is verified against university enrollment and academic standing."],
                ["AI Matching", "Our algorithm filters by skills, location, availability, GPA, and project experience."],
                ["Performance Tracking", "Rate, review, and build lasting relationships with top talent."],
                ["Compliance Ready", "Contracts, NDAs, and payment processing handled through the platform."],
              ].map(([title, desc]) => (
                <div key={title} style={{ display: "flex", gap: 16 }}>
                  <div style={{ width: 4, height: "100%", minHeight: 40, background: "var(--blue)", borderRadius: 2, flexShrink: 0 }} />
                  <div>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 15, marginBottom: 4 }}>{title}</div>
                    <div style={{ fontSize: 13, color: "var(--text-secondary)", lineHeight: 1.7 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="fade-up">
            <div style={{ background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 4, padding: 32 }}>
              <div style={{ fontFamily: "var(--font-display)", fontSize: 11, color: "var(--blue)", letterSpacing: "0.15em", textTransform: "uppercase", fontWeight: 700, marginBottom: 20 }}>Platform Preview</div>
              {[
                { name: "Amara J.", role: "Business Admin · Year 3", match: "98%", skills: ["Excel", "Data Analysis", "French"] },
                { name: "Kwame A.", role: "Computer Science · Year 4", match: "96%", skills: ["React", "Python", "APIs"] },
                { name: "Chisom E.", role: "Marketing · Year 2", match: "94%", skills: ["Content", "SEO", "Design"] },
              ].map((p, i) => (
                <div key={p.name} style={{ display: "flex", alignItems: "center", gap: 16, padding: "16px 0", borderBottom: i < 2 ? "1px solid var(--border)" : "none" }}>
                  <div style={{ width: 40, height: 40, borderRadius: "50%", background: ["var(--blue-dim)", "var(--emerald-dim)", "rgba(184,115,51,0.15)"][i], display: "flex", alignItems: "center", justifyContent: "center", fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14, color: ["var(--blue-bright)", "var(--emerald)", "var(--copper)"][i] }}>
                    {p.name[0]}
                    {p.name.split(" ")[1][0]}
                  </div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontFamily: "var(--font-display)", fontWeight: 700, fontSize: 14 }}>{p.name}</div>
                    <div style={{ fontSize: 11, color: "var(--text-tertiary)", marginBottom: 6 }}>{p.role}</div>
                    <div style={{ display: "flex", gap: 6, flexWrap: "wrap" }}>
                      {p.skills.map(s => (
                        <span key={s} style={{ fontSize: 10, padding: "2px 8px", background: "var(--surface-2)", border: "1px solid var(--border)", borderRadius: 2, color: "var(--text-secondary)", fontFamily: "var(--font-display)", fontWeight: 600, letterSpacing: "0.05em" }}>
                          {s}
                        </span>
                      ))}
                    </div>
                  </div>
                  <div style={{ fontFamily: "var(--font-display)", fontWeight: 800, fontSize: 16, color: "var(--emerald)" }}>{p.match}</div>
                </div>
              ))}
              <div style={{ marginTop: 20, padding: "14px 20px", background: "var(--blue-dim)", border: "1px solid rgba(59,130,246,0.2)", borderRadius: 3, textAlign: "center" }}>
                <span style={{ fontFamily: "var(--font-display)", fontSize: 13, fontWeight: 700, color: "var(--blue-bright)" }}>+ 8,000 more profiles on launch</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Beta Signup */}
      <section id="join" ref={s3} style={{ padding: "120px 32px", background: "var(--charcoal)", borderTop: "1px solid var(--border)" }}>
        <div style={{ maxWidth: 640, margin: "0 auto", textAlign: "center" }}>
          <div className="fade-up">
            <div className="tag tag-emerald" style={{ marginBottom: 28, display: "inline-flex" }}>
              <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--emerald)", display: "inline-block", animation: "pulse 2s infinite" }} />
              Early Access Open
            </div>
            <h2 style={{ fontFamily: "var(--font-display)", fontSize: "clamp(32px, 4vw, 56px)", fontWeight: 800, letterSpacing: "-0.04em", marginBottom: 20 }}>Partnership Inquiries</h2>
            <p style={{ fontSize: 16, color: "var(--text-secondary)", lineHeight: 1.8, marginBottom: 28 }}>For university partnerships, enterprise integrations, or institutional access inquiries.</p>
          </div>

          {/* Quick Links */}
          <div className="fade-up" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, marginBottom: 48 }}>
            <a href="https://ogera.sybellasystems.co.rw" className="btn-primary" style={{ background: "var(--emerald)", padding: "16px 24px", textDecoration: "none", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
              For Students & Employers ↗
            </a>
            <button onClick={() => document.getElementById("contact-form")?.scrollIntoView({ behavior: "smooth" })} className="btn-ghost" style={{ padding: "16px 24px", cursor: "pointer" }}>
              Contact Us ↓
            </button>
          </div>

          {/* Contact Form */}
          <div id="contact-form" style={{ marginTop: 48 }}>
            {sent ? (
              <div className="fade-up" style={{ padding: 48, background: "var(--emerald-dim)", border: "1px solid rgba(45,186,133,0.3)", borderRadius: 4 }}>
                <div style={{ fontSize: 40, marginBottom: 16 }}>◎</div>
                <div style={{ fontFamily: "var(--font-display)", fontSize: 22, fontWeight: 700, color: "var(--emerald)", marginBottom: 8 }}>Message received.</div>
                <div style={{ fontSize: 14, color: "var(--text-secondary)", marginBottom: 24 }}>We'll be in touch within 24-48 hours.</div>
                <button onClick={() => setSent(false)} style={{ padding: "10px 20px", background: "var(--emerald)", color: "#fff", border: "none", borderRadius: 2, cursor: "pointer", fontSize: 13, fontWeight: 600 }}>
                  Send another message
                </button>
              </div>
            ) : (
              <form onSubmit={submit} className="fade-up" style={{ display: "flex", flexDirection: "column", gap: 16 }}>
                {[
                  { name: "name", placeholder: "Full name", type: "text" },
                  { name: "email", placeholder: "Email address", type: "email" },
                  { name: "company", placeholder: "University / Organization name", type: "text" },
                ].map(f => (
                  <input
                    key={f.name}
                    type={f.type}
                    name={f.name}
                    required
                    placeholder={f.placeholder}
                    value={form[f.name as keyof typeof form]}
                    onChange={handle}
                    style={{ padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text-primary)", fontSize: 15, fontFamily: "var(--font-body)", transition: "border-color 0.2s", outline: "none" }}
                    onFocus={e => (e.target.style.borderColor = "var(--emerald)")}
                    onBlur={e => (e.target.style.borderColor = "var(--border)")}
                  />
                ))}
                <select name="role" value={form.role} onChange={handle} style={{ padding: "16px 20px", background: "var(--surface)", border: "1px solid var(--border)", borderRadius: 3, color: "var(--text-primary)", fontSize: 15, fontFamily: "var(--font-body)", outline: "none" }}>
                  <option value="business">Business / Enterprise</option>
                  <option value="university">University Partner</option>
                  <option value="media">Media / Press</option>
                  <option value="other">Other</option>
                </select>
                {error && <div style={{ fontSize: 13, color: "#ff6b6b", padding: "12px 16px", background: "rgba(255,107,107,0.1)", borderRadius: 2 }}>{error}</div>}
                <button type="submit" className="btn-primary" style={{ background: "var(--emerald)", justifyContent: "center", padding: "18px 32px", fontSize: 14 }} disabled={loading}>
                  {loading ? "Sending..." : "Send Inquiry →"}
                </button>
                <p style={{ fontSize: 12, color: "var(--text-tertiary)" }}>We respond within 48 hours</p>
              </form>
            )}
          </div>
        </div>
      </section>

      <style>{`
        @media (max-width: 768px) {
          .three-grid { grid-template-columns: 1fr !important; }
          .hero-grid { grid-template-columns: 1fr !important; gap: 48px !important; }
        }
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
      `}</style>
    </div>
  );
}
