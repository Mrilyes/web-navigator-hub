import type { VercelRequest, VercelResponse } from "@vercel/node";

export function buildUpstreamHeaders(req: VercelRequest) {
    // Don’t forward user cookies to random sites
    return {
        "user-agent":
            req.headers["user-agent"]?.toString() ??
            "Mozilla/5.0 (ProxyHub; +https://example.com)",
        "accept": req.headers["accept"]?.toString() ?? "*/*",
        "accept-language": req.headers["accept-language"]?.toString() ?? "en-US,en;q=0.9",
    };
}

export function copyResponseHeaders(src: Headers, res: VercelResponse) {
    // Copy only “safe” headers
    const allow = new Set([
        "content-type",
        "content-length",
        "last-modified",
        "etag",
    ]);

    src.forEach((v, k) => {
        if (allow.has(k.toLowerCase())) res.setHeader(k, v);
    });
}
