export const BLOG_TOPIC_STATUSES = [
  'proposed',
  'approved',
  'generating',
  'generated',
  'needs_review',
  'published',
  'rejected',
  'update_existing',
]

export const BLOG_SEARCH_INTENTS = [
  'commercial_service',
  'seller_problem',
  'seller_education',
  'navigational',
  'consumer_irrelevant',
  'ambiguous',
]

export function getBlogTopicValidationIssues(topic, categories, serviceUrls, serviceUrlByMarketplace = {}) {
  const issues = []
  if (!topic || typeof topic !== 'object') return ['Topic must be an object.']

  for (const field of [
    'primary_keyword',
    'marketplace',
    'search_intent',
    'target_audience',
    'content_type',
    'proposed_title',
    'target_internal_url',
    'evidence_source',
  ]) {
    if (typeof topic[field] !== 'string' || !topic[field].trim()) {
      issues.push(`${field} is required.`)
    }
  }

  if (topic.primary_keyword?.trim().length > 160) issues.push('Primary keyword must be at most 160 characters.')
  if (topic.marketplace && !categories.includes(topic.marketplace)) issues.push('Marketplace is not supported.')
  if (topic.search_intent && !BLOG_SEARCH_INTENTS.includes(topic.search_intent)) issues.push('Search intent is invalid.')
  if (topic.status && !BLOG_TOPIC_STATUSES.includes(topic.status)) issues.push('Editorial status is invalid.')
  if (topic.status === 'generating'
    && ['navigational', 'consumer_irrelevant'].includes(topic.search_intent)) {
    issues.push('Navigational and consumer/irrelevant topics cannot be generated.')
  }
  if (!Number.isInteger(Number(topic.priority)) || Number(topic.priority) < 1 || Number(topic.priority) > 5) {
    issues.push('Priority must be an integer from 1 to 5.')
  }
  if (!Array.isArray(topic.secondary_keywords)
    || topic.secondary_keywords.some(keyword => typeof keyword !== 'string' || !keyword.trim())) {
    issues.push('Secondary keywords must be a list of non-empty strings.')
  }
  if (topic.target_internal_url && !serviceUrls.includes(topic.target_internal_url)) {
    issues.push('Target URL must be a verified EcomXtra marketplace service page.')
  }
  if (topic.target_internal_url
    && serviceUrlByMarketplace[topic.marketplace]
    && topic.target_internal_url !== serviceUrlByMarketplace[topic.marketplace]) {
    issues.push('Target service URL must match the assigned marketplace.')
  }
  if (topic.existing_competing_page) {
    try {
      const url = new URL(topic.existing_competing_page)
      if (url.protocol !== 'https:' || url.hostname !== 'ecomxtra.in') {
        issues.push('Existing page must use the canonical EcomXtra HTTPS host.')
      }
    } catch {
      issues.push('Existing page must be a valid canonical EcomXtra URL.')
    }
  }
  return issues
}
