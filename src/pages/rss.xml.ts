import type { APIContext } from 'astro'
import rss from '@astrojs/rss'
import { getCollection } from 'astro:content'

export const GET = async (context: APIContext) => {
  const entries = await getCollection('posts')
  const items = entries
    .filter((entry) => entry.slug.split('/')[0] !== 'nsfw')
    .map((entry) => ({
      title: entry.data.title,
      link: entry.slug,
      pubDate: entry.data.publishDate,
    }))

  return rss({
    title: '通算n度目のブログ',
    description: '@gamoutatsumi のブログ',
    site: context.url.toString(),
    items,
    stylesheet: '/rss.xsl',
  })
}
