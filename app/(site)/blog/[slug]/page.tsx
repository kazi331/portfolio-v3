import BlogDetailsView from '@/components/blog/BlogDetailsView';
import { blogPosts, personalInfo } from '@/lib/data';
import { siteConfig } from '@/lib/seo';
import type { Metadata } from 'next';

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  return blogPosts.map((post) => ({
    slug: post.slug,
  }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  if (!post) {
    return {
      title: 'Article Not Found',
      description: 'The requested engineering article could not be located.',
    };
  }

  const postUrl = `${siteConfig.url}/blog/${post.slug}`;
  const postImage = post.coverImage || siteConfig.ogImage;

  return {
    title: post.title,
    description: post.description,
    authors: [{ name: personalInfo.name, url: siteConfig.url }],
    keywords: post.tags || siteConfig.keywords,
    alternates: {
      canonical: postUrl,
    },
    openGraph: {
      type: 'article',
      locale: 'en_US',
      url: postUrl,
      title: `${post.title} | Engineering Blog`,
      description: post.description,
      siteName: siteConfig.name,
      publishedTime: post.date,
      authors: [personalInfo.name],
      tags: post.tags,
      images: [
        {
          url: postImage,
          width: 1200,
          height: 630,
          alt: post.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: `${post.title} | Engineering Blog`,
      description: post.description,
      creator: siteConfig.twitterHandle,
      site: siteConfig.twitterHandle,
      images: [postImage],
    },
  };
}

export default async function SingleBlogPage({ params }: PageProps) {
  const resolvedParams = await params;
  const post = blogPosts.find((p) => p.slug === resolvedParams.slug);

  const articleJsonLd = post
    ? {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: post.title,
        description: post.description,
        image: post.coverImage || siteConfig.ogImage,
        datePublished: post.date,
        author: {
          '@type': 'Person',
          name: personalInfo.name,
          url: siteConfig.url,
        },
        publisher: {
          '@type': 'Person',
          name: personalInfo.name,
          url: siteConfig.url,
        },
        mainEntityOfPage: {
          '@type': 'WebPage',
          '@id': `${siteConfig.url}/blog/${post.slug}`,
        },
        keywords: post.tags?.join(', '),
      }
    : null;

  return (
    <>
      {articleJsonLd && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(articleJsonLd) }}
        />
      )}
      <BlogDetailsView slug={resolvedParams.slug} basePath="/blog" />
    </>
  );
}
