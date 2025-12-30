export function isSafeHttpUrl(input: string) {
    try {
        const u = new URL(input);
        return u.protocol === "http:" || u.protocol === "https:";
    } catch {
        return false;
    }
}

// MVP SSRF protection: block localhost + private networks by hostname patterns.
// (We keep it simple; later we can add DNS resolution checks.)
export function blockPrivateTargets(input: string) {
    try {
        const u = new URL(input);
        const h = u.hostname.toLowerCase();

        if (h === "localhost" || h === "0.0.0.0") return true;
        if (h.endsWith(".local")) return true;
        if (/^127\./.test(h)) return true;
        if (/^10\./.test(h)) return true;
        if (/^192\.168\./.test(h)) return true;
        if (/^172\.(1[6-9]|2\d|3[0-1])\./.test(h)) return true;

        return false;
    } catch {
        return true;
    }
}
