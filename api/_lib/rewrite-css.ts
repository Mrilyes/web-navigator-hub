export function rewriteCss(css: string, baseUrl: string) {
    const base = new URL(baseUrl);

    const toProxy = (u: string) => {
        const cleaned = u.replace(/^['"]|['"]$/g, "").trim();
        if (/^(data:|#)/i.test(cleaned)) return u;
        try {
            const abs = new URL(cleaned, base).toString();
            return `url("/api/proxy?url=${encodeURIComponent(abs)}")`;
        } catch {
            return `url(${u})`;
        }
    };

    // url(...)
    css = css.replace(/url\(([^)]+)\)/gi, (_m, inner) => toProxy(inner));

    // @import
    css = css.replace(/@import\s+["']([^"']+)["']/gi, (_m, u) => {
        const abs = new URL(u, base).toString();
        return `@import "/api/proxy?url=${encodeURIComponent(abs)}"`;
    });

    return css;
}
