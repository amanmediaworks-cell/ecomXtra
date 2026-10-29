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
import { marketplaceServiceDefaults, mergeMarketplaceServiceRows } from './marketplaceServiceContent.js'
import { siteContentDefaults } from './siteContentDefaults.js'

test('canonical URLs use the preferred origin and normalized route path', () => {
  assert.equal(getCanonicalUrl('/'), 'https://ecomxtra.in/')
  assert.equal(getCanonicalUrl('/blog/post-name/'), 'https://ecomxtra.in/blog/post-name')
  assert.equal(getCanonicalUrl('/blogs'), 'https://ecomxtra.in/blog')
  assert.equal(getCanonicalUrl('/service/'), 'https://ecomxtra.in/services')
  assert.equal(normalizeRoutePath('/blog//post-name///'), '/blog/post-name')
})

test('homepage metadata targets ecommerce account management searches', () => {
  const metadata = getRouteMetadata('/')
  assert.equal(metadata.title, 'Ecommerce Account Management | EcomXtra')
  const seoDefaults = siteContentDefaults.find(section => section.content_key === 'seo')
  assert.equal(seoDefaults.content.title, metadata.title)
  assert.match(metadata.description, /Amazon, Flipkart, Meesho/)
  assert.match(metadata.description, /listings, catalogues, returns, claims/)
  assert.match(renderSeoHead('/'), /<meta name="description" content="EcomXtra manages Amazon, Flipkart, Meesho/)
  const hero = siteContentDefaults.find(section => section.content_key === 'hero')
  assert.match(hero.content.subheading, /seller claims, returns, refunds/)
  assert.equal(hero.content.buttons[1].label, 'WhatsApp Us')
  assert.match(hero.content.buttons[1].href, /marketplace%20account%20management/)
})

test('services index metadata targets ecommerce account management services', () => {
  assert.equal(getRouteMetadata('/services').title, 'Ecommerce Account Management Services | EcomXtra')
})

test('marketplace service pages expose canonical, searchable service metadata', () => {
  const service = marketplaceServiceDefaults[0]
  const path = `/services/${service.slug}`
  const metadata = getRouteMetadata(path, null, service)
  const [, structuredService] = getStructuredData(path, null, service)

  assert.equal(metadata.title, 'Amazon Account Management Services | EcomXtra')
  assert.equal(metadata.canonicalUrl, `https://ecomxtra.in${path}`)
  assert.match(metadata.description, /seller claims, return workflows/)
  assert.equal(structuredService['@type'], 'Service')
  assert.equal(structuredService.areaServed.name, 'India')
  assert.equal(structuredService.url, metadata.canonicalUrl)
  assert.match(renderSeoHead(path, null, service), /<title>Amazon Account Management Services \| EcomXtra<\/title>/)
})

test('all marketplace SEO titles target platform account management without a location suffix', () => {
  for (const service of marketplaceServiceDefaults) {
    const metadata = getRouteMetadata(`/services/${service.slug}`, null, service)

    assert.ok(metadata.title.startsWith(service.title))
    assert.doesNotMatch(metadata.title, /\bIndia\b/i)
  }
})

test('each marketplace has editable default article sections and operational FAQs', () => {
  assert.equal(marketplaceServiceDefaults.length, 7)
  for (const service of marketplaceServiceDefaults) {
    assert.ok(service.slug)
    assert.ok(service.details.hero.description.length > 100)
    assert.ok(service.details.included.items.length >= 6)
    assert.ok(service.details.process.steps.every(step => step.article.length > 100))
    assert.ok(service.details.faq.items.length >= 4)
    assert.ok(service.details.seo.description.length <= 160)
  }
})

test('saved marketplace records override defaults while missing platforms remain available', () => {
  const savedAmazon = {
    ...marketplaceServiceDefaults[0],
    title: 'Custom Amazon Service Title',
    details: { hero: { title: 'Custom hero title' } },
  }
  const merged = mergeMarketplaceServiceRows([savedAmazon, { id: 99, title: 'Legacy service' }])

  assert.equal(merged.length, 8)
  assert.equal(merged[0].title, 'Custom Amazon Service Title')
  assert.equal(merged[0].details.hero.title, 'Custom hero title')
  assert.ok(merged.some(service => service.slug === 'zepto-account-management'))
  assert.ok(merged.some(service => service.title === 'Legacy service'))
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
