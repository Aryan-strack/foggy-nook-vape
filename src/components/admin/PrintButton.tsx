"use client";

import { Printer } from "lucide-react";

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="flex items-center gap-2 bg-black text-white px-5 py-2.5 rounded-full text-sm hover:bg-gray-800 transition-colors"
    >
      <Printer size={15} /> Print
    </button>
  );
}
