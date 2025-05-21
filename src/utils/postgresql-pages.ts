import fs from 'fs';
import { glob } from 'glob';
import matter from 'gray-matter';
import { POSTGRESQL_DIR_PATH } from '../constants/content';
import getExcerpt from './get-excerpt';

const getPostSlugs = async (pathname: string): Promise<string[]> => {
  const files = await glob.sync(`${pathname}/**/*.md`, {
    ignore: [
      '**/RELEASE_NOTES_TEMPLATE.md',
      '**/README.md',
      '**/unused/**',
      '**/shared-content/**',
      '**/GUIDE_TEMPLATE.md',
    ],
  });
  return files.map((file) => file.replace(pathname, '').replace('.md', ''));
};

interface PostData {
  data: any;
  content: string;
  excerpt: string;
}

const getPostBySlug = (slug: string, pathname: string): PostData | null => {
  try {
    const source = fs.readFileSync(`${process.cwd()}/${pathname}/${slug}.md`, 'utf-8');
    const { data, content } = matter(source);
    const excerpt = getExcerpt(content, 200);

    return { data, content, excerpt };
  } catch (e) {
    return null;
  }
};

interface PostgresTutorial {
  slug: string;
  title: string;
  subtitle: string;
  isDraft: boolean;
  content: string;
  redirectFrom: string[];
}

const getAllPostgresTutorials = async (): Promise<PostgresTutorial[]> => {
  const slugs = await getPostSlugs(POSTGRESQL_DIR_PATH);
  return slugs
    .map((slug) => {
      const data = getPostBySlug(slug, POSTGRESQL_DIR_PATH);
      if (!data) return null;

      const slugWithoutFirstSlash = slug.slice(1);
      const { title, subtitle, isDraft, redirectFrom } = data.data;
      const { content } = data;
      return { slug: slugWithoutFirstSlash, title, subtitle, isDraft, content, redirectFrom };
    })
    .filter((item) => process.env.NEXT_PUBLIC_VERCEL_ENV !== 'production' || !item?.isDraft);
};

interface NavigationLinks {
  previousLink: string;
  nextLink: string;
}

const getNavigationLinks = (slug: string): NavigationLinks | null => {
  const post = getPostBySlug(slug, POSTGRESQL_DIR_PATH);
  if (!post) return null;

  const { previousLink, nextLink } = post.data;

  return {
    previousLink,
    nextLink,
  };
};

export {
  getPostSlugs,
  getPostBySlug,
  getNavigationLinks,
  getAllPostgresTutorials,
  POSTGRESQL_DIR_PATH,
};
