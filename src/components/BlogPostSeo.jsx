import { useEffect } from 'react'

const managedMeta = [
  ['meta[name="description"]', 'name', 'description', 'description'],
  ['meta[property="og:type"]', 'property', 'og:type', 'type'],
  ['meta[property="og:title"]', 'property', 'og:title', 'title'],
  ['meta[property="og:description"]', 'property', 'og:description', 'description'],
  ['meta[property="og:image"]', 'property', 'og:image', 'image'],
  ['meta[property="og:url"]', 'property', 'og:url', 'url'],
  ['meta[name="twitter:card"]', 'name', 'twitter:card', 'card'],
  ['meta[name="twitter:title"]', 'name', 'twitter:title', 'title'],
  ['meta[name="twitter:description"]', 'name', 'twitter:description', 'description'],
  ['meta[name="twitter:image"]', 'name', 'twitter:image', 'image'],
]

function absoluteHttpUrl(value) {
  if (!value) return ''
  try {
    const url = new URL(value, window.location.origin)
    return ['http:', 'https:'].includes(url.protocol) ? url.href : ''
  } catch {
    return ''
  }
}

function setMeta(selector, attribute, attributeValue, content) {
  let element = document.head.querySelector(selector)
  if (!element) {
    element = document.createElement('meta')
    element.setAttribute(attribute, attributeValue)
    document.head.appendChild(element)
  }
  element.content = content
}

function BlogPostSeo({ blog }) {
  useEffect(() => {
    if (!blog?.is_published) return undefined

    const title = blog.seoTitle?.trim() || blog.title
    const description = blog.metaDescription?.trim() || blog.excerpt
    const canonical = absoluteHttpUrl(blog.canonicalUrl)
    const image = absoluteHttpUrl(blog.socialImage || blog.coverImage)
    const currentUrl = window.location.href
    const previousTitle = document.title
    const previousMeta = managedMeta.map(([selector]) => {
      const element = document.head.querySelector(selector)
      return { selector, element, content: element?.content }
    })
    const canonicalSelector = 'link[rel="canonical"]'
    const previousCanonical = document.head.querySelector(canonicalSelector)
    const previousCanonicalHref = previousCanonical?.href
    const jsonLdId = 'blog-post-json-ld'
    const previousJsonLd = document.getElementById(jsonLdId)
    const previousJsonLdContent = previousJsonLd?.textContent

    document.title = title
    managedMeta.forEach(([selector, attribute, attributeValue, key]) => {
      const value = key === 'type'
        ? 'article'
        : key === 'title'
          ? title
          : key === 'description'
            ? description
            : key === 'image'
              ? image
              : key === 'url'
                ? canonical || currentUrl
                : key === 'card'
                  ? 'summary_large_image'
                  : ''
      setMeta(selector, attribute, attributeValue, value)
    })

    if (canonical) {
      let link = previousCanonical
      if (!link) {
        link = document.createElement('link')
        link.rel = 'canonical'
        document.head.appendChild(link)
      }
      link.href = canonical
    }

    const structuredData = {
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: blog.title,
      description,
      image: image ? [image] : undefined,
      datePublished: blog.published_at || undefined,
      dateModified: blog.updated_at || blog.published_at || undefined,
      author: blog.author ? {
        '@type': blog.authorRole === 'Editorial Team' ? 'Organization' : 'Person',
        name: blog.author,
      } : undefined,
      mainEntityOfPage: { '@type': 'WebPage', '@id': canonical || currentUrl },
      url: canonical || currentUrl,
    }
    let script = previousJsonLd
    if (!script) {
      script = document.createElement('script')
      script.id = jsonLdId
      script.type = 'application/ld+json'
      document.head.appendChild(script)
    }
    script.textContent = JSON.stringify(structuredData).replace(/</g, '\\u003c')

    return () => {
      document.title = previousTitle
      previousMeta.forEach(({ selector, element, content }) => {
        const current = document.head.querySelector(selector)
        if (element) {
          if (content !== undefined) element.content = content
        } else {
          current?.remove()
        }
      })
      if (canonical && previousCanonical) {
        previousCanonical.href = previousCanonicalHref
      } else if (canonical) {
        document.head.querySelector(canonicalSelector)?.remove()
      }
      if (previousJsonLd) {
        previousJsonLd.textContent = previousJsonLdContent
      } else {
        document.getElementById(jsonLdId)?.remove()
      }
    }
  }, [blog])

  return null
}

export default BlogPostSeo
