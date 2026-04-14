@import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;500;600;700;800&family=DM+Sans:ital,wght@0,300;0,400;0,500;0,600;1,300&display=swap');
@import "tailwindcss";

:root {
  --black: #080808;
  --charcoal: #111118;
  --surface: #16161f;
  --surface-2: #1e1e2a;
  --border: rgba(255,255,255,0.07);
  --border-bright: rgba(255,255,255,0.14);
  --blue: #3b82f6;
  --blue-bright: #60a5fa;
  --blue-dim: rgba(59,130,246,0.15);
  --emerald: #2dba85;
  --emerald-dim: rgba(45,186,133,0.12);
  --copper: #b87333;
  --magenta: #c2185b;
  --text-primary: #f2f0ea;
  --text-secondary: rgba(242,240,234,0.55);
  --text-tertiary: rgba(242,240,234,0.3);
  --font-display: 'Syne', sans-serif;
  --font-body: 'DM Sans', sans-serif;
  --grain-opacity: 0.035;
}

*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

html { 
  scroll-behavior: smooth; 
  font-size: clamp(14px, 2vw, 16px);
}

body {
  background: var(--black);
  color: var(--text-primary);
  font-family: var(--font-body);
  font-weight: 400;
  line-height: 1.6;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  overflow-x: hidden;
}

/* Grain overlay */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' result='noise'/%3E%3CfeColorMatrix in='noise' type='saturate' values='0'/%3E%3C/filter%3E%3Crect width='512' height='512' fill='%23fff' filter='url(%23noise)'/%3E%3C/svg%3E");
  opacity: var(--grain-opacity);
  pointer-events: none;
  z-index: 9999;
}

/* Scrollbar */
::-webkit-scrollbar { width: 4px; }
::-webkit-scrollbar-track { background: var(--black); }
::-webkit-scrollbar-thumb { background: var(--blue); border-radius: 2px; }

/* Typography */
h1, h2, h3, h4, h5, h6 {
  font-family: var(--font-display);
  letter-spacing: -0.02em;
  line-height: 1.1;
  color: var(--text-primary);
}

/* Selection */
::selection { background: var(--blue-dim); color: var(--blue-bright); }

/* Focus */
*:focus-visible { outline: 2px solid var(--blue); outline-offset: 4px; border-radius: 4px; }

/* Links */
a { color: inherit; text-decoration: none; }

/* Utility classes */
.font-display { font-family: var(--font-display); }
.font-body { font-family: var(--font-body); }

.text-gold { color: var(--blue-bright); }
.text-emerald { color: var(--emerald); }
.text-secondary { color: var(--text-secondary); }
.text-tertiary { color: var(--text-tertiary); }

.bg-surface { background: var(--surface); }
.bg-surface-2 { background: var(--surface-2); }
.bg-gold-dim { background: var(--blue-dim); }
.bg-emerald-dim { background: var(--emerald-dim); }

.border-dim { border: 1px solid var(--border); }
.border-bright { border: 1px solid var(--border-bright); }

/* Animated gradient text */
.gradient-text {
  background: linear-gradient(135deg, var(--blue-bright) 0%, var(--blue) 40%, var(--blue-bright) 80%);
  background-size: 200% auto;
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  animation: shimmer 4s linear infinite;
}

@keyframes shimmer {
  0% { background-position: 0% center; }
  100% { background-position: 200% center; }
}

/* Glow effects */
.glow-gold {
  box-shadow: 0 0 40px rgba(201,168,76,0.2), 0 0 80px rgba(201,168,76,0.08);
}
.glow-emerald {
  box-shadow: 0 0 40px rgba(45,186,133,0.2), 0 0 80px rgba(45,186,133,0.08);
}

/* Fade-in animation */
.fade-up {
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1), transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
}
.fade-up.visible {
  opacity: 1;
  transform: translateY(0);
}

/* Horizontal rule */
.hr-gold {
  height: 1px;
  background: linear-gradient(90deg, transparent, var(--blue), transparent);
  border: none;
  opacity: 0.4;
}

/* Grid pattern */
.grid-pattern {
  background-image:
    linear-gradient(var(--border) 1px, transparent 1px),
    linear-gradient(90deg, var(--border) 1px, transparent 1px);
  background-size: clamp(50px, 10vw, 60px) clamp(50px, 10vw, 60px);
}

/* Button base */
.btn-primary {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: clamp(11px, 2vw, 14px) clamp(20px, 4vw, 28px);
  background: var(--blue);
  color: var(--black);
  font-family: var(--font-display);
  font-weight: 700;
  font-size: clamp(11px, 1.5vw, 14px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 3px;
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  border: none;
  position: relative;
  overflow: hidden;
  min-height: 44px;
}
.btn-primary:hover {
  background: var(--blue-bright);
  transform: translateY(-1px);
  box-shadow: 0 12px 40px rgba(201,168,76,0.35);
}
.btn-primary:active { transform: translateY(0); }

.btn-ghost {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: clamp(10px, 2vw, 13px) clamp(20px, 4vw, 28px);
  background: transparent;
  color: var(--text-primary);
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(11px, 1.5vw, 14px);
  letter-spacing: 0.04em;
  text-transform: uppercase;
  border-radius: 3px;
  border: 1px solid var(--border-bright);
  transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
  cursor: pointer;
  min-height: 44px;
}
.btn-ghost:hover {
  border-color: var(--blue);
  color: var(--blue-bright);
  background: var(--blue-dim);
}

/* Card */
.card {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 4px;
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}
.card:hover {
  border-color: var(--border-bright);
  transform: translateY(-4px);
}

/* Tag/badge */
.tag {
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 4px 12px;
  background: var(--blue-dim);
  color: var(--blue-bright);
  font-family: var(--font-display);
  font-size: clamp(9px, 1.2vw, 11px);
  font-weight: 700;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  border-radius: 2px;
  border: 1px solid rgba(59,130,246,0.25);
}
.tag-emerald {
  background: var(--emerald-dim);
  color: var(--emerald);
  border-color: rgba(45,186,133,0.25);
}

/* Number animation */
@keyframes count-up {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Nav */
.nav-blur {
  backdrop-filter: blur(20px) saturate(180%);
  -webkit-backdrop-filter: blur(20px) saturate(180%);
  background: rgba(8,8,8,0.8);
  border-bottom: 1px solid var(--border);
}

/* Responsive media queries - mobile first approach */
@media (max-width: 480px) {
  html {
    font-size: 14px;
  }
  
  .grid-pattern {
    background-size: 40px 40px;
  }
}

@media (max-width: 768px) {
  .grid-pattern {
    background-size: 50px 50px;
  }
}

@media (min-width: 1024px) {
  html {
    font-size: 16px;
  }
  
  .grid-pattern {
    background-size: 60px 60px;
  }
}