import { marketplaceServiceDefaults } from './marketplaceServiceContent.js'

const GUIDES_BY_SERVICE = {
  'amazon-account-management': {
    management: {
      slug: 'mastering-amazon-india-seller-support-a-guide-to-managing-claims-and-returns',
      label: 'Amazon seller support for claims and returns',
    },
    onboarding: {
      slug: 'mastering-amazon-india-seller-onboarding-a-complete-launch-guide',
      label: 'Preparing to launch an Amazon seller account',
    },
  },
  'flipkart-account-management': {
    management: {
      slug: 'mastering-flipkart-account-health-a-strategic-guide-for-indian-sellers',
      label: 'Maintaining Flipkart seller account health',
    },
    onboarding: {
      slug: 'mastering-flipkart-seller-onboarding-a-complete-guide-to-launching-successfully',
      label: 'Preparing to launch on Flipkart',
    },
  },
  'meesho-account-management': {
    management: {
      slug: 'mastering-meesho-product-listings-a-guide-to-professional-catalog-management',
      label: 'Improving Meesho product listings',
    },
    onboarding: {
      slug: 'mastering-meesho-seller-onboarding-a-comprehensive-guide-for-new-brands',
      label: 'Preparing a Meesho seller launch',
    },
  },
  'myntra-account-management': {
    management: {
      slug: 'optimizing-myntra-product-catalog-a-guide-for-marketplace-success',
      label: 'Optimizing a Myntra product catalogue',
    },
    onboarding: {
      slug: 'mastering-myntra-seller-onboarding-a-strategic-launch-guide-for-brands',
      label: 'Preparing to launch on Myntra',
    },
  },
  'ajio-account-management': {
    management: {
      slug: 'scaling-ajio-seller-performance-a-guide-to-professional-account-management',
      label: 'Managing AJIO seller operations',
    },
    onboarding: {
      slug: 'mastering-ajio-seller-onboarding-a-strategic-guide-for-indian-brands',
      label: 'Preparing to launch on AJIO',
    },
  },
  'nykaa-account-management': {
    management: {
      slug: 'mastering-nykaa-seller-catalog-a-guide-to-professional-management',
      label: 'Maintaining a Nykaa seller catalogue',
    },
    onboarding: {
      slug: 'mastering-nykaa-seller-operations-professional-account-management-guide',
      label: 'Managing Nykaa seller operations',
    },
  },
  'jiomart-account-management': {
    management: {
      slug: 'mastering-jiomart-catalog-management-a-guide-to-boosting-product-visibility',
      label: 'Maintaining a JioMart product catalogue',
    },
    onboarding: {
      slug: 'mastering-jiomart-seller-onboarding-a-complete-guide-for-indian-brands',
      label: 'Preparing to launch on JioMart',
    },
  },
  'blinkit-account-management': {
    management: {
      slug: 'mastering-blinkit-catalog-management-a-guide-to-boosting-visibility',
      label: 'Managing a Blinkit product catalogue',
    },
    onboarding: {
      slug: 'mastering-blinkit-seller-onboarding-a-guide-for-indian-brands',
      label: 'Preparing a Blinkit seller launch',
    },
  },
  'zepto-account-management': {
    management: {
      slug: 'optimizing-zepto-seller-account-performance-a-comprehensive-guide',
      label: 'Managing Zepto seller operations',
    },
    onboarding: {
      slug: 'mastering-zepto-seller-onboarding-a-strategic-guide-for-indian-brands',
      label: 'Preparing to launch on Zepto',
    },
  },
  'swiggy-instamart-account-management': {
    management: {
      slug: 'mastering-swiggy-instamart-catalog-quality-a-guide-for-d2c-brands',
      label: 'Maintaining Swiggy Instamart catalogue quality',
    },
    onboarding: {
      slug: 'mastering-swiggy-instamart-seller-onboarding-a-strategic-launch-guide',
      label: 'Preparing a Swiggy Instamart launch',
    },
  },
}

const marketplaceMatchers = [
  { name: 'Swiggy Instamart', pattern: /\bswiggy\s+instamart\b|\binstamart\b/i },
  { name: 'JioMart', pattern: /\bjiomart\b/i },
  { name: 'Flipkart', pattern: /\bflipkart\b/i },
  { name: 'Amazon', pattern: /\bamazon\b/i },
  { name: 'Meesho', pattern: /\bmeesho\b/i },
  { name: 'Myntra', pattern: /\bmyntra\b/i },
  { name: 'AJIO', pattern: /\bajio\b/i },
  { name: 'Nykaa', pattern: /\bnykaa\b/i },
  { name: 'Blinkit', pattern: /\bblinkit\b/i },
  { name: 'Zepto', pattern: /\bzepto\b/i },
]

export function getRelatedMarketplaceGuides(serviceSlug, serviceType = 'management') {
  const serviceGuides = GUIDES_BY_SERVICE[serviceSlug]
  if (!serviceGuides) return []

  const serviceName = marketplaceServiceDefaults
    .find(service => service.slug === serviceSlug)
    ?.title.replace(' Account Management Services', '')
  if (!serviceName) return []

  return Object.entries(serviceGuides).map(([type, guide]) => ({
    ...guide,
    path: `/blog/${guide.slug}`,
    serviceName,
    type,
  })).filter(guide => guide.type !== serviceType)
}

export function getBlogServiceLinks(blog) {
  const text = [
    blog?.title,
    blog?.excerpt,
    blog?.category,
    ...(Array.isArray(blog?.tags) ? blog.tags : []),
  ].filter(Boolean).join(' ')
  const isOnboarding = /\bonboarding\b|\blaunch\b|\bregistration\b/i.test(text)
  const serviceType = isOnboarding ? 'onboarding' : 'management'
  const matchedPlatforms = marketplaceMatchers
    .filter(marketplace => marketplace.pattern.test(text))
    .sort((left, right) => text.search(left.pattern) - text.search(right.pattern))
    .map(marketplace => marketplace.name)
  const uniquePlatforms = [...new Set(matchedPlatforms)]
  const serviceLinks = uniquePlatforms.flatMap(name => {
    const service = marketplaceServiceDefaults.find(item => (
      item.title.replace(' Account Management Services', '').toLowerCase() === name.toLowerCase()
    ))
    if (!service) return []
    return [{
      path: `/services/${service.slug}${isOnboarding ? '/onboarding' : ''}`,
      label: `${name} ${isOnboarding ? 'seller onboarding' : 'account-management'} support`,
    }]
  })

  return {
    serviceType,
    marketplaces: uniquePlatforms,
    serviceLinks: serviceLinks.length
      ? serviceLinks.slice(0, 2)
      : [{ path: '/services', label: 'Marketplace account-management services' }],
  }
}
