const postImportResult = import.meta.glob('./blog/**/*.{astro,md}', { eager: true });
const posts = Object.values(postImportResult).filter((p) => !!p.frontmatter?.date);
posts.sort((a, b) => new Date(b.frontmatter.date) - new Date(a.frontmatter.date));

function formatDate(date) {
  return new Date(date).toGMTString();
}

export async function get() {
  const site = import.meta.env.SITE.replace(/\/$/, '');
  return {
    body: [
      '<?xml version="1.0" encoding="UTF-8"?><rss version="2.0" xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd" xmlns:content="http://purl.org/rss/1.0/modules/content/"><channel>',
      `<title>Drew Powers</title>`,
      '<description>Personal blog</description>',
      `<link>${site}/blog</link>`,
      '<language>en-us</language>',
      `<lastBuildDate>${formatDate(new Date())}</lastBuildDate>`,
      ...posts.map(
        ({ frontmatter: { title, description, date }, url }) =>
          `<item><title><![CDATA[${title.trim()}]]></title><description><![CDATA[${description.trim()}]]></description><pubDate>${formatDate(
            date
          )}</pubDate><link>${site}${url}</link><guid>${site}${url}</guid></item>`
      ),
      '</channel></rss>',
      '',
    ].join('\n'),
  };
}
