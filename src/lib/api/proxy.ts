export async function fetchViaProxy(url: string): Promise<Response> {
  const proxied = `/api/proxy?url=${encodeURIComponent(url)}`;
  return fetch(proxied, { method: "GET" });
}

export function toProxiedUrl(url: string) {
  return `/api/proxy?url=${encodeURIComponent(url)}`;
}
