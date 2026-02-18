"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft } from "lucide-react";
import Link from "next/link";

export default function SettingsBackButton({ link }: { link?: string }) {
  const router = useRouter();

  return (
    <Link
      href={link || "/app/settings"}
      className="md:hidden flex items-center gap-2 text-primary hover:text-primary/80 transition-colors mb-4"
    >
      <ChevronLeft className="w-5 h-5" />
      <span className="text-sm font-medium">Back</span>
    </Link>
  );
}
