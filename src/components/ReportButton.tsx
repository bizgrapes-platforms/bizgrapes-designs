"use client";

import { useState } from "react";

export function ReportButton({
  designId,
  designTitle,
}: {
  designId: string;
  designTitle: string;
}) {
  const [sent, setSent] = useState(false);

  const mailto = `mailto:support@bizgrapes.com?subject=${encodeURIComponent(
    `Reporting design: ${designTitle}`
  )}&body=${encodeURIComponent(
    `Design ID: ${designId}\nReason: \n\n(Tell us what's wrong with this design.)`
  )}`;

  return (
    <a
      href={mailto}
      onClick={() => setSent(true)}
      className="inline-flex items-center gap-1.5 text-sm text-muted hover:text-violet-600 transition-colors"
    >
      <svg
        width="16"
        height="16"
        viewBox="0 0 16 16"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3 2v12M3 2h8l-1.5 2.5L11 7H3"
          stroke="currentColor"
          strokeWidth="1.3"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      {sent ? "Report sent" : "Report this design"}
    </a>
  );
}
