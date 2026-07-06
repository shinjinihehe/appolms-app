"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const savedUrl = localStorage.getItem("app_base_url");
    if (!savedUrl) {
      router.push("/server-url");
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
