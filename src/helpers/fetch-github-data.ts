const OG_IMAGE_RE = /property\s*=\s*"og:image"\s*content\s*=\s*"([^"]+)"/;
const STAR_COUNT_RE = /id\s*=\s*"repo-stars-counter-star"[^>]+>([^<]+)</;

export async function fetchGitHubData(url: string): Promise<{ unfurlImg: string; starCount: string }> {
  const res = await fetch(url, {
    headers: {
      Accept: '*/*',
      'Content-Type': 'text/html',
    },
  });
  const body = await res.text();
  const unfurlImg = body.match(OG_IMAGE_RE);
  const starCount = body.match(STAR_COUNT_RE);
  if (!unfurlImg || !unfurlImg[1]) throw new Error(`${url}: Couldn’t find social image`);
  if (!starCount || !starCount[1]) throw new Error(`${url}: Couldn’t find star count `);
  return {
    unfurlImg: unfurlImg[1],
    starCount: starCount[1],
  };
}
