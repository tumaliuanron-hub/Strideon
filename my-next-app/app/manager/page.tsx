"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ManagerIndexPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace("/manager/dashboard");
  }, [router]);

  return (
    <div className="min-h-screen bg-[#111316] flex items-center justify-center text-white text-xs">
      Loading Department Manager Portal...
    </div>
  );
}
