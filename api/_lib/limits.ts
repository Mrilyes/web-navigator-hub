export async function readWithLimit(resp: Response, maxBytes: number) {
    const reader = resp.body?.getReader();
    if (!reader) return Buffer.from(await resp.arrayBuffer());

    const chunks: Uint8Array[] = [];
    let received = 0;

    while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        if (!value) continue;

        received += value.byteLength;
        if (received > maxBytes) throw new Error("Response too large");
        chunks.push(value);
    }

    return Buffer.from(concat(chunks));
}

function concat(chunks: Uint8Array[]) {
    const total = chunks.reduce((s, c) => s + c.length, 0);
    const out = new Uint8Array(total);
    let off = 0;
    for (const c of chunks) {
        out.set(c, off);
        off += c.length;
    }
    return out;
}
