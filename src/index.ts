/**
 * Welcome to Cloudflare Workers! This is your first worker.
 *
 * - Run `wrangler dev src/index.ts` in your terminal to start a development server
 * - Open a browser tab at http://localhost:8787/ to see your worker in action
 * - Run `wrangler publish src/index.ts --name my-worker` to publish your worker
 *
 * Learn more at https://developers.cloudflare.com/workers/
 */

export interface Env {
  // Example binding to KV. Learn more at https://developers.cloudflare.com/workers/runtime-apis/kv/
  // MY_KV_NAMESPACE: KVNamespace;
  //
  // Example binding to Durable Object. Learn more at https://developers.cloudflare.com/workers/runtime-apis/durable-objects/
  // MY_DURABLE_OBJECT: DurableObjectNamespace;
  //
  // Example binding to R2. Learn more at https://developers.cloudflare.com/workers/runtime-apis/r2/
  // MY_BUCKET: R2Bucket;
  //
  // Example binding to a Service. Learn more at https://developers.cloudflare.com/workers/runtime-apis/service-bindings/
  // MY_SERVICE: Fetcher;
}

const WEBSITE_HOSTS = {
  1: "reverse-proxy-project-1.pages.dev",
  2: "reverse-proxy-remix-project-2.pages.dev",
};
export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const newRequest = getNewRequest(request);

    const data = await fetch(newRequest.url, newRequest);

    return data;
  },
};

function isWebsite1(url: URL) {
  return url.pathname.startsWith("/1/");
}

function getNewRequest(request: Request) {
  const requestUrl = new URL(request.url);

  const newUrl = new URL(request.url);

  newUrl.host = isWebsite1(requestUrl) ? WEBSITE_HOSTS[1] : WEBSITE_HOSTS[2];

  const newHeaders = new Headers(request.headers);

  newHeaders.set("x-original-url", request.url);

  return new Request(
    newUrl.toString(),
    new Request(request, { headers: newHeaders })
  );
}
