"use client";
import Link from "next/link";
import { useState, useRef } from "react";
import { useI18n } from "../contexts/I18nContext";
import ThemeToggle from "./ThemeToggle";
import Image from "next/image";

export default function Header() {
  const { locale, setLocale, t } = useI18n();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);

  // ✅ Use ReturnType<typeof setTimeout> for cross-environment compatibility
  const closeTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);

  const navigationItems = [
    { key: "nav.home", href: "/" },
    { key: "nav.about", href: "/about" },
    { key: "nav.projects", href: "/projects" },
    { key: "nav.updates", href: "/updates" },
    { key: "nav.blog", href: "/blog" },
    { key: "nav.contact", href: "/contact" },
  ];

  const languages = [
    { code: "en", label: "English" },
    { code: "fr", label: "Français" },
    { code: "sw", label: "Kiswahili" },
    { code: "rw", label: "Kinyarwanda" },
  ];

  return (
    <header className="py-4 bg-dark-blue shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <Link
            href="/"
            className="flex items-center gap-3 focus:outline-none focus:ring-0"
          >
            <Image
              src="/logo.png"
              alt="Sybella Systems Logo"
              width={50}
              height={50}
              priority
              className="brightness-125 contrast-125"
            />
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 relative">
            {navigationItems.map((item) => (
              <Link
                key={item.key}
                href={item.href}
                className="text-white hover:text-yellow transition-colors text-sm xl:text-base focus:outline-none focus:ring-0"
              >
                {t(item.key)}
              </Link>
            ))}

            {/* ✅ Language Dropdown */}
            <div
              className="relative"
              onMouseEnter={() => {
                if (closeTimeout.current) clearTimeout(closeTimeout.current);
                setIsLangOpen(true);
              }}
              onMouseLeave={() => {
                closeTimeout.current = setTimeout(
                  () => setIsLangOpen(false),
                  150
                );
              }}
            >
              <button
                className="bg-transparent text-white border border-white/30 rounded px-3 py-1 text-sm flex items-center gap-1 focus:outline-none focus:ring-0"
                onClick={(e) => {
                  e.stopPropagation(); // prevent accidental closures
                  setIsLangOpen(!isLangOpen);
                }}
              >
                {languages.find((l) => l.code === locale)?.label || "Language"}
                <svg
                  className={`w-4 h-4 transition-transform ${
                    isLangOpen ? "rotate-180" : ""
                  }`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </button>

              {isLangOpen && (
                <div className="absolute mt-2 bg-dark-blue border border-white/20 rounded shadow-lg w-40 z-[9999]">
                  {languages.map((lang) => (
                    <button
                      key={lang.code}
                      onClick={() => {
                        setLocale(lang.code as any);
                        setIsLangOpen(false);
                      }}
                      className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow hover:text-dark-blue ${
                        locale === lang.code ? "font-semibold bg-white/10" : ""
                      }`}
                    >
                      {lang.label}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <ThemeToggle />
          </nav>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden text-white p-2 focus:outline-none focus:ring-0"
            aria-label="Toggle mobile menu"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              {isMobileMenuOpen ? (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              ) : (
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-dark-blue px-4 pt-2 pb-4 space-y-2">
          {navigationItems.map((item) => (
            <Link
              key={item.key}
              href={item.href}
              className="block text-white hover:text-yellow transition-colors text-sm focus:outline-none focus:ring-0"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              {t(item.key)}
            </Link>
          ))}

          <div className="border-t border-white/20 my-2"></div>

          <div className="space-y-2">
            {languages.map((lang) => (
              <button
                key={lang.code}
                onClick={() => {
                  setLocale(lang.code as any);
                  setIsMobileMenuOpen(false);
                }}
                className={`block w-full text-left px-4 py-2 text-sm text-white hover:bg-yellow hover:text-dark-blue ${
                  locale === lang.code ? "font-semibold bg-white/10" : ""
                }`}
              >
                {lang.label}
              </button>
            ))}
          </div>

          <ThemeToggle />
        </div>
      )}
    </header>
  );
}
