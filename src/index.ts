import useReflare from "reflare";

export interface Env {
  // MAGIC_REVERSE_PROXY: KVNamespace;
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
  magic: "magic.app",
  epyc: "www.epyc.in",
};

export default {
  async fetch(
    request: Request,
    env: Env,
    ctx: ExecutionContext
  ): Promise<Response> {
    const reflare = await useReflare({
      provider: "static",
      routeList: [
        {
          path: "/product/broadcast",
          upstream: { domain: WEBSITE_HOSTS["magic"] },
        },
        {
          path: "/*",
          upstream: {
            domain: WEBSITE_HOSTS["epyc"],
          },
        },
      ],
    });

    return reflare.handle(request);
  },
};
