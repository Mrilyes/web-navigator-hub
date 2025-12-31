export function rewriteHtml(html: string, baseUrl: string) {
    const base = new URL(baseUrl);

    const toProxy = (u: string) => {
        try {
            const abs = new URL(u, base).toString();
            return `/api/proxy?url=${encodeURIComponent(abs)}`;
        } catch {
            return u;
        }
    };

    html = html.replace(
        /\s(src|href|action)=["']([^"']+)["']/gi,
        (_m: string, attr: string, val: string) => {
            if (/^(#|data:|javascript:|mailto:|tel:)/i.test(val)) return ` ${attr}="${val}"`;
            return ` ${attr}="${toProxy(val)}"`;
        }
    );

    html = html.replace(/\ssrcset=["']([^"']+)["']/gi, (_m: string, srcset: string) => {
        const parts = srcset
            .split(",")
            .map((p: string) => p.trim())
            .filter(Boolean);

        const rewritten = parts
            .map((part: string) => {
                const [u, size] = part.split(/\s+/);
                const pu = toProxy(u);
                return size ? `${pu} ${size}` : pu;
            })
            .join(", ");

        return ` srcset="${rewritten}"`;
    });

    return html;
}
