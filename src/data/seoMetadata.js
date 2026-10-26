import { getServicePageDetails } from './marketplaceServiceContent.js'

const SITE_ORIGIN = 'https://ecomxtra.in'
const DEFAULT_IMAGE = `${SITE_ORIGIN}/logo.png`

const pageMetadata = {
  '/': {
    title: 'Marketplace Account Management India | EcomXtra',
    description: 'EcomXtra manages Amazon, Flipkart, Meesho and more for Indian sellers—listings, catalogues, returns, claims and day-to-day marketplace operations.',
  },
  '/philosophy': {
    title: 'Our Philosophy | EcomXtra',
    description: 'Learn how EcomXtra builds efficient eCommerce systems through thoughtful design, automation, and reliable technology.',
  },
  '/showcase': {
    title: 'eCommerce Work & Results | EcomXtra',
    description: 'Explore EcomXtra eCommerce projects, marketplace work, and growth systems.',
  },
  '/services': {
    title: 'Marketplace Account Management Services | EcomXtra',
    description: 'Outsource marketplace operations to EcomXtra: product listings, catalogue updates, seller claims, returns and account support for Indian platforms.',
  },
  '/blog': {
    title: 'Marketplace Seller Operations Guides | EcomXtra',
    description: 'Practical guides for Indian marketplace sellers on account management, product listings, returns, seller claims and daily operations.',
  },
  '/testimonials': {
    title: 'Client Stories | EcomXtra',
    description: 'Read feedback from eCommerce brands working with EcomXtra.',
  },
  '/contact': {
    title: 'Hire Marketplace Account Support | Contact EcomXtra',
    description: 'Need help managing Amazon, Flipkart, Meesho or other marketplace operations? Contact EcomXtra about account-management support for your business.',
  },
}

const canonicalPathAliases = {
  '/about': '/philosophy',
  '/service': '/services',
  '/blogs': '/blog',
}

export function normalizeRoutePath(pathname = '/') {
  const decoded = pathname.replace(/\/{2,}/g, '/')
  if (decoded === '/') return '/'
  return decoded.replace(/\/+$/, '') || '/'
}

export function getCanonicalUrl(pathname = '/') {
  const normalizedPath = normalizeRoutePath(pathname)
  const canonicalPath = canonicalPathAliases[normalizedPath] || normalizedPath
  return `${SITE_ORIGIN}${canonicalPath === '/' ? '/' : canonicalPath}`
}

function absoluteImageUrl(value) {
  if (!value) return DEFAULT_IMAGE
  try {
    const url = new URL(value, SITE_ORIGIN)
    return url.protocol === 'https:' ? url.href : DEFAULT_IMAGE
  } catch {
    return DEFAULT_IMAGE
  }
}

export function getRouteMetadata(pathname = '/', blog = null, service = null) {
  const normalizedPath = normalizeRoutePath(pathname)
  const canonicalPath = canonicalPathAliases[normalizedPath] || normalizedPath
  const canonicalUrl = getCanonicalUrl(normalizedPath)
  const publishedArticle = Boolean(blog?.is_published)
  const isArticleRoute = /^\/blog\/[^/]+$/.test(normalizedPath)

  if (publishedArticle && isArticleRoute) {
    const title = blog.seoTitle?.trim() || blog.title
    const description = blog.metaDescription?.trim() || blog.excerpt
    const image = absoluteImageUrl(blog.coverImage)
    return {
      title,
      description,
      canonicalUrl,
      image,
      type: 'article',
      robots: 'index,follow',
    }
  }

  const isServiceRoute = Boolean(service?.slug && normalizedPath === `/services/${service.slug}`)
  if (isServiceRoute) {
    const details = getServicePageDetails(service)
    return {
      title: details.seo?.title?.trim() || service.title,
      description: details.seo?.description?.trim() || service.description,
      canonicalUrl,
      image: absoluteImageUrl(details.hero?.imageUrl),
      type: 'website',
      robots: 'index,follow',
    }
  }

  const page = pageMetadata[canonicalPath]
  if (!page) {
    return {
      title: 'Page Not Found | EcomXtra',
      description: 'The page you requested could not be found.',
      canonicalUrl: null,
      image: DEFAULT_IMAGE,
      type: 'website',
      robots: 'noindex,follow',
    }
  }

  return {
    ...page,
    canonicalUrl,
    image: DEFAULT_IMAGE,
    type: 'website',
    robots: 'index,follow',
  }
}

export function getStructuredData(pathname = '/', blog = null, service = null) {
  const normalizedPath = normalizeRoutePath(pathname)
  const metadata = getRouteMetadata(normalizedPath, blog, service)
  const organization = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': `${SITE_ORIGIN}/#organization`,
    name: 'EcomXtra',
    url: `${SITE_ORIGIN}/`,
    logo: DEFAULT_IMAGE,
  }

  if (blog?.is_published && /^\/blog\/[^/]+$/.test(normalizedPath)) {
    const articleUrl = metadata.canonicalUrl
    const article = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description: metadata.description,
      image: [metadata.image],
      datePublished: blog.published_at || undefined,
      dateModified: blog.updated_at || blog.published_at || undefined,
      author: {
        '@type': blog.authorRole === 'Editorial Team' ? 'Organization' : 'Person',
        name: blog.author || 'EcomXtra Editorial Team',
      },
      publisher: { '@id': `${SITE_ORIGIN}/#organization` },
      mainEntityOfPage: { '@type': 'WebPage', '@id': articleUrl },
      url: articleUrl,
    }
    const breadcrumb = {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: `${SITE_ORIGIN}/` },
        { '@type': 'ListItem', position: 2, name: 'Blog', item: `${SITE_ORIGIN}/blog` },
        { '@type': 'ListItem', position: 3, name: blog.title, item: articleUrl },
      ],
    }
    return [organization, article, breadcrumb]
  }

  if (service?.slug && normalizedPath === `/services/${service.slug}`) {
    const details = getServicePageDetails(service)
    return [organization, {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: details.hero?.title || service.title,
      description: metadata.description,
      serviceType: 'Ecommerce marketplace account management',
      provider: { '@id': `${SITE_ORIGIN}/#organization` },
      areaServed: { '@type': 'Country', name: 'India' },
      image: [metadata.image],
      url: metadata.canonicalUrl,
    }]
  }

  const website = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'EcomXtra',
    url: `${SITE_ORIGIN}/`,
    publisher: { '@id': `${SITE_ORIGIN}/#organization` },
  }
  return [organization, website]
}

export function renderSeoHead(pathname = '/', blog = null, service = null) {
  const metadata = getRouteMetadata(pathname, blog, service)
  const structuredData = getStructuredData(pathname, blog, service)
  const tags = [
    `<title>${escapeHtml(metadata.title)}</title>`,
    `<meta name="description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="robots" content="${metadata.robots}" />`,
    metadata.canonicalUrl
      ? `<link rel="canonical" href="${escapeHtml(metadata.canonicalUrl)}" />`
      : '',
    `<meta property="og:type" content="${metadata.type}" />`,
    `<meta property="og:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta property="og:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta property="og:url" content="${escapeHtml(metadata.canonicalUrl || SITE_ORIGIN)}" />`,
    `<meta property="og:image" content="${escapeHtml(metadata.image)}" />`,
    '<meta name="twitter:card" content="summary_large_image" />',
    `<meta name="twitter:title" content="${escapeHtml(metadata.title)}" />`,
    `<meta name="twitter:description" content="${escapeHtml(metadata.description)}" />`,
    `<meta name="twitter:image" content="${escapeHtml(metadata.image)}" />`,
    ...structuredData.map((data, index) => (
      `<script id="structured-data-${index}" type="application/ld+json">${JSON.stringify(data).replace(/</g, '\\u003c')}</script>`
    )),
  ]
  return tags.filter(Boolean).join('\n    ')
}

export function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;')
}
