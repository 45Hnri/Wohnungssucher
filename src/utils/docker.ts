export async function isDocker() {
    const dockerEnv = await Bun.file("/.dockerenv").exists();
    return dockerEnv;
}
