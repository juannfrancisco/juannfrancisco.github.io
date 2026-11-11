import rss from '@astrojs/rss';
import type { APIContext } from 'astro';
import { getCollection } from 'astro:content';
import { profile } from '../data/profile';
import { sortAndFilterPosts } from '../utils/blog';

export async function GET(context: APIContext) {
  const posts = sortAndFilterPosts(await getCollection('blog'));
  return rss({
    title: `${profile.name} — Blog`,
    description: 'Notas técnicas sobre arquitectura cloud, sistemas distribuidos y equipos de software.',
    site: context.site!,
    items: posts.map((post) => ({
      title: post.data.title,
      pubDate: post.data.pubDate,
      description: post.data.description,
      link: `/blog/${post.id}/`,
      categories: post.data.tags,
    })),
    customData: `<language>es-cl</language>`,
  });
}
