const BLOG_IMAGES = {
  'AI Automation': {
    url: 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80',
    alt: 'Abstract artificial intelligence visualization',
  },
  'Shopify & Tech': {
    url: 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80',
    alt: 'Team collaborating around a table',
  },
  'Marketplace SEO': {
    url: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80',
    alt: 'Analytics dashboard displayed on a laptop',
  },
  'CRO & Growth': {
    url: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80',
    alt: 'Online checkout using a payment terminal',
  },
}

export function getBlogImageForCategory(category) {
  return BLOG_IMAGES[category] || BLOG_IMAGES['Shopify & Tech']
}

export function normalizeBlogImageUrl(value, category) {
  const fallback = getBlogImageForCategory(category)
  if (typeof value !== 'string' || !value.trim() || value.startsWith('blob:')) return fallback.url
  try {
    const url = new URL(value)
    if (url.protocol !== 'https:'
      || !['images.unsplash.com', 'images.pexels.com'].includes(url.hostname)) {
      return fallback.url
    }
    return url.href
  } catch {
    return fallback.url
  }
}
