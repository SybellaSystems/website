"use client";

import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export default function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard) {
        await navigator.clipboard.writeText(url);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      }
    } catch (err) {
      console.error("Failed to copy link", err);
    }
  };

  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const links = [
    {
      label: "WhatsApp",
      href: "https://wa.me/?text=" + encodedTitle + "%20" + encodedUrl,
    },
    {
      label: "Facebook",
      href: "https://www.facebook.com/sharer/sharer.php?u=" + encodedUrl,
    },
    {
      label: "X",
      href:
        "https://twitter.com/intent/tweet?text=" +
        encodedTitle +
        "&url=" +
        encodedUrl,
    },
    {
      label: "LinkedIn",
      href:
        "https://www.linkedin.com/sharing/share-offsite/?url=" + encodedUrl,
    },
  ];

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className="text-xs text-secondary mr-1">Share:</span>
      <button
        type="button"
        onClick={handleCopy}
        className="px-3 py-1.5 text-xs font-medium rounded-full border border-dim text-secondary hover:text-[var(--blue-bright)] hover:border-[var(--blue-bright)] transition-colors"
      >
        {copied ? "Link copied!" : "Copy link"}
      </button>
      {links.map((link) => (
        <a
          key={link.label}
          href={link.href}
          target="_blank"
          rel="noopener noreferrer"
          className="px-3 py-1.5 text-xs font-medium rounded-full bg-[var(--blue-dim)] text-[var(--blue-bright)] border border-[rgba(59,130,246,0.25)] hover:bg-[rgba(59,130,246,0.25)] transition-colors"
        >
          {link.label}
        </a>
      ))}
    </div>
  );
}