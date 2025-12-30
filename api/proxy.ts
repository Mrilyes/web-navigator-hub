import type { VercelRequest, VercelResponse } from "@vercel/node";
import { isSafeHttpUrl, blockPrivateTargets } from "./_lib/security";
import { buildUpstreamHeaders, copyResponseHeaders } from "./_lib/headers";
import { rewriteHtml } from "./_lib/rewrite-html";
import { rewriteCss } from "./_lib/rewrite-css";
import { readWithLimit } from "./_lib/limits";


export default async function handler(req: VercelRequest, res: VercelResponse) {
    try {
        const rawUrl = String(req.query.url ?? "");
        if (!rawUrl) return res.status(400).json({ error: "Missing url" });

        if (!isSafeHttpUrl(rawUrl)) return res.status(400).json({ error: "Invalid url" });
        if (blockPrivateTargets(rawUrl)) return res.status(400).json({ error: "Blocked target" });

        const upstream = await fetch(rawUrl, {
            method: "GET",
            redirect: "follow",
            headers: buildUpstreamHeaders(req),
        });

        const contentType = upstream.headers.get("content-type") || "application/octet-stream";

        // Read with a size cap (important for public proxy)
        const buf = await readWithLimit(upstream, 8 * 1024 * 1024); // 8MB

        // HTML: rewrite assets to go back through /api/proxy
        if (contentType.includes("text/html")) {
            const html = buf.toString("utf-8");
            const rewritten = rewriteHtml(html, rawUrl);
            res.status(200);
            res.setHeader("content-type", "text/html; charset=utf-8");
            res.setHeader("cache-control", "no-store");
            return res.send(rewritten);
        }

        // CSS: rewrite url(...) to go back through proxy
        if (contentType.includes("text/css")) {
            const css = buf.toString("utf-8");
            const rewritten = rewriteCss(css, rawUrl);
            res.status(200);
            res.setHeader("content-type", contentType);
            res.setHeader("cache-control", "public, max-age=300");
            return res.send(rewritten);
        }

        // Everything else: stream back as-is (images, js, fonts...)
        copyResponseHeaders(upstream.headers, res);
        res.status(upstream.status);
        res.setHeader("cache-control", "public, max-age=300");
        return res.send(buf);
    } catch (err: any) {
        return res.status(500).json({ error: "Proxy error", detail: err?.message ?? String(err) });
    }
}
