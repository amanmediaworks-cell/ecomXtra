import test from 'node:test'
import assert from 'node:assert/strict'
import {
  getCanonicalUrl,
  getRouteMetadata,
  getStructuredData,
  normalizeRoutePath,
  renderSeoHead,
} from './seoMetadata.js'
import { getBlogImageForCategory, normalizeBlogImageUrl } from './blogImageUtils.js'

test('canonical URLs use the preferred origin and normalized route path', () => {
  assert.equal(getCanonicalUrl('/'), 'https://ecomxtra.in/')
  assert.equal(getCanonicalUrl('/blog/post-name/'), 'https://ecomxtra.in/blog/post-name')
  assert.equal(getCanonicalUrl('/blogs'), 'https://ecomxtra.in/blog')
  assert.equal(getCanonicalUrl('/service/'), 'https://ecomxtra.in/services')
  assert.equal(normalizeRoutePath('/blog//post-name///'), '/blog/post-name')
})

test('article metadata and structured data use the real article title, date, and URL', () => {
  const blog = {
    is_published: true,
    slug: 'real-article-slug',
    title: 'A Real Article Title',
    excerpt: 'This is the article excerpt used for social and search descriptions.',
    published_at: '2026-10-20T12:00:00.000Z',
    updated_at: '2026-10-22T12:00:00.000Z',
    author: 'Author Name',
    authorRole: 'Editor',
    coverImage: 'https://images.unsplash.com/photo-example',
  }
  const path = '/blog/real-article-slug'
  const metadata = getRouteMetadata(path, blog)
  const [organization, article, breadcrumb] = getStructuredData(path, blog)

  assert.equal(metadata.title, blog.title)
  assert.equal(metadata.description, blog.excerpt)
  assert.equal(metadata.canonicalUrl, 'https://ecomxtra.in/blog/real-article-slug')
  assert.equal(article.mainEntityOfPage['@id'], metadata.canonicalUrl)
  assert.equal(article.url, metadata.canonicalUrl)
  assert.equal(article.datePublished, blog.published_at)
  assert.equal(article.dateModified, blog.updated_at)
  assert.equal(article.author.name, blog.author)
  assert.equal(breadcrumb.itemListElement[2].item, metadata.canonicalUrl)
  assert.equal(organization.name, 'EcomXtra')
  assert.match(renderSeoHead(path, blog), /<link rel="canonical" href="https:\/\/ecomxtra\.in\/blog\/real-article-slug"/)
})

test('unknown routes are noindex and do not receive a canonical URL', () => {
  const metadata = getRouteMetadata('/not-a-route')
  assert.equal(metadata.robots, 'noindex,follow')
  assert.equal(metadata.canonicalUrl, null)
})

test('blog images always resolve to stable HTTPS Unsplash or Pexels URLs', () => {
  const fallback = getBlogImageForCategory('Marketplace SEO')
  assert.match(fallback.url, /^https:\/\/images\.unsplash\.com\//)
  assert.equal(normalizeBlogImageUrl('blob:https://ecomxtra.in/temp', 'Marketplace SEO'), fallback.url)
  assert.equal(normalizeBlogImageUrl('https://cdn.pixabay.com/photo.jpg', 'Marketplace SEO'), fallback.url)
  assert.equal(
    normalizeBlogImageUrl('https://images.pexels.com/photos/1/photo.jpg', 'Marketplace SEO'),
    'https://images.pexels.com/photos/1/photo.jpg',
  )
})
