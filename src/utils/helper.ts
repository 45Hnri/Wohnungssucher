export function assertEnv(env: string) {
    const value = process.env[env];
    if (value === undefined)
        throw new Error(`Missing environment variable "${env}"`);
    return value as string;
}

export function getTextNodes(parent: ParentNode) {
    const texts: string[] = [];
    function getChildText(node: Node) {
        console.log(node.TEXT_NODE);
        if (node.nodeType === Node.TEXT_NODE) {
            const text = node.textContent?.trim();
            if (text) texts.push(text);
        } else {
            node.childNodes.forEach(getChildText);
        }
    }
    getChildText(parent);
    return texts;
}
