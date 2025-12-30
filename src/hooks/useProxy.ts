import { useMemo, useState } from "react";
import { toProxiedUrl } from "@/lib/api/proxy";

function normalizeInput(input: string) {
  const trimmed = input.trim();
  if (!trimmed) return "";

  // If user types "google.com" => https://google.com
  if (!/^https?:\/\//i.test(trimmed)) return `https://${trimmed}`;
  return trimmed;
}

export function useProxy() {
  const [input, setInput] = useState("");
  const [currentUrl, setCurrentUrl] = useState("");

  const proxiedUrl = useMemo(() => {
    if (!currentUrl) return "";
    return toProxiedUrl(currentUrl);
  }, [currentUrl]);

  function go() {
    const u = normalizeInput(input);
    if (u) setCurrentUrl(u);
  }

  return {
    input,
    setInput,
    currentUrl,
    proxiedUrl,
    go,
  };
}
