export function slugifyBlogTitle(title) {
  return title
    .normalize('NFKD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

export function isValidBlogUrl(value, requireHttps = false) {
  if (!value) return true
  if (!requireHttps && value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return requireHttps ? url.protocol === 'https:' : ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

export function validateBlogPost(article) {
  if (!article.title?.trim()) return 'Article title is required.'
  if (!article.slug || !/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test(article.slug)) {
    return 'Enter a readable slug using lowercase letters, numbers, and single hyphens.'
  }
  if (!article.excerpt?.trim()) return 'Article excerpt is required.'
  if (!article.content?.trim()) return 'Article Markdown body is required.'
  if ((article.seoTitle?.length || 0) > 60) return 'SEO title must be 60 characters or fewer.'
  if ((article.metaDescription?.length || 0) > 160) return 'Meta description must be 160 characters or fewer.'
  for (const [field, label] of [
    ['coverImage', 'Cover image URL'],
    ['socialImage', 'Social-sharing image URL'],
    ['canonicalUrl', 'Canonical URL'],
  ]) {
    if (!isValidBlogUrl(article[field], field === 'canonicalUrl')) {
      return `${label} must be a valid ${field === 'canonicalUrl' ? 'HTTPS' : 'HTTP(S)'} URL.`
    }
  }
  return ''
}
