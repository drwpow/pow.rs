const OG_IMAGE_RE = /property\s*=\s*"og:image"\s*content\s*=\s*"([^"]+)"/;
const STAR_COUNT_RE = /"stargazerCount":\s*(\d+)/;

export async function fetchGitHubData(
  url: string,
): Promise<{ unfurlImg: string; starCount: string }> {
  const res = await fetch(url, {
    headers: {
      Accept: "*/*",
      "Content-Type": "text/html",
    },
  });
  const body = await res.text();
  if (!res.ok) throw new Error(`${res.status} ${body}`);
  const unfurlImg = body.match(OG_IMAGE_RE)?.[1];
  const starCount = body.match(STAR_COUNT_RE)?.[1];
  if (!unfurlImg) throw new Error(`${url}: Couldn’t find social image`);
  if (!starCount) throw new Error(`${url}: Couldn’t find star count `);
  return {
    unfurlImg,
    starCount: new Intl.NumberFormat("en-us", { notation: "compact" }).format(
      starCount,
    ),
  };
}
