export const seenListPath = ".seen.log";
export async function getSeenList(): Promise<string[]> {
    const seen = Bun.file(seenListPath);

    if (await seen.exists()) {
        const ids = (await seen.text()).split("\n").filter((id) => id);
        return ids;
    } else {
        await Bun.write(seenListPath, "");
        return [];
    }
}

export async function appendSeenList(ids: string[]) {
    const seen = await getSeenList();
    await Bun.write(
        seenListPath,
        Array.from(new Set([...seen, ...ids])).join("\n"),
    );
}
