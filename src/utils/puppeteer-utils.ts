import type { HTTPRequest } from "puppeteer";
import type { HTTPResponse, Page } from "puppeteer";

export function mockNavigator() {
    Object.defineProperty(navigator, "webdriver", { get: () => false });
    Object.defineProperty(navigator, "languages", {
        get: () => ["en-US", "en"],
    });
    Object.defineProperty(navigator, "plugins", { get: () => [1, 2, 3] });
}

export async function disguisePage(page: Page) {
    // important against robot detection
    await page.evaluateOnNewDocument(mockNavigator);
    await page.setUserAgent(
        "Mozilla/5.0 (X11; Linux x86_64; rv:140.0) Gecko/20100101 Firefox/140.0",
    );
}

export function isExcessRequest(req: HTTPRequest) {
    return (
        req.url().endsWith(".png") ||
        req.url().endsWith(".jpg") ||
        req.url().endsWith(".webp") ||
        req.url().endsWith("telemetry") ||
        req.url().endsWith("report") ||
        req.url().startsWith("tracking.")
    );
}

export async function handlePageResponses<T>({
    page,
    onResponse,
    url,
}: {
    page: Page;
    onResponse: (res: HTTPResponse, controller: AbortController) => Promise<T>;
    url: string;
}): Promise<T[]> {
    await disguisePage(page);

    const controller = new AbortController();

    const data = [] as Awaited<ReturnType<typeof onResponse>>[];

    await page.setRequestInterception(true);
    page.on("request", (req) => {
        if (req.isInterceptResolutionHandled()) return;
        if (isExcessRequest(req)) req.abort();
        else req.continue();
    });
    page.on("response", async (response) => {
        const result = await onResponse(response, controller);
        if (result) data.push(result);
    });

    await page.goto(url);

    try {
        await page.waitForNetworkIdle({
            signal: controller.signal,
            idleTime: 1000,
        });
    } catch (e) {}

    return data;
}
