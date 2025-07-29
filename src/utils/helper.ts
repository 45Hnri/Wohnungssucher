export function assertEnv(env: string) {
    const value = process.env[env];
    if (value === undefined)
        throw new Error(`Missing environment variable "${env}"`);
    return value as string;
}
