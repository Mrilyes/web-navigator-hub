export async function readWithLimit(resp: Response, maxBytes: number) {
    const ab = await resp.arrayBuffer();
    if (ab.byteLength > maxBytes) throw new Error("Response too large");
    return Buffer.from(ab);
}
