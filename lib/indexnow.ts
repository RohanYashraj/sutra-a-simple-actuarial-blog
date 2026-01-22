/**
 * IndexNow utility to submit URLs to search engines (Bing, Yandex, etc.)
 */

export async function submitUrlsToIndexNow(urls: string[]) {
    const key = process.env.INDEXNOW_KEY;
    const host = 'sutra.rohanyashraj.com';

    if (!key) {
        console.warn("INDEXNOW_KEY is not set. Skipping IndexNow submission.");
        return;
    }

    const payload = {
        host: host,
        key: key,
        keyLocation: `https://${host}/${key}.txt`,
        urlList: urls
    };

    try {
        const response = await fetch('https://api.indexnow.org/indexnow', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8'
            },
            body: JSON.stringify(payload)
        });

        switch (response.status) {
            case 200:
                console.log(`IndexNow: Successfully submitted ${urls.length} URLs.`);
                break;
            case 202:
                console.log(`IndexNow: URLs received. Key validation pending.`);
                break;
            case 400:
                console.error("IndexNow Error: 400 Bad Request (Invalid format)");
                break;
            case 403:
                console.error("IndexNow Error: 403 Forbidden (Invalid key)");
                break;
            case 422:
                console.error("IndexNow Error: 422 Unprocessable Entity (Invalid URLs or schema)");
                break;
            case 429:
                console.error("IndexNow Error: 429 Too Many Requests (Potential spam)");
                break;
            default:
                const errorText = await response.text();
                console.error(`IndexNow Error: ${response.status} ${response.statusText}`, errorText);
        }
    } catch (error) {
        console.error("IndexNow Connection Error:", error);
    }
}
