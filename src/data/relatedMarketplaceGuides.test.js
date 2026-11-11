import test from 'node:test'
import assert from 'node:assert/strict'
import { marketplaceServiceDefaults } from './marketplaceServiceContent.js'
import { getBlogServiceLinks, getRelatedMarketplaceGuides } from './relatedMarketplaceGuides.js'

test('each marketplace service page links to a verified guide that matches its page type', () => {
  for (const service of marketplaceServiceDefaults) {
    const managementGuides = getRelatedMarketplaceGuides(service.slug)
    const onboardingGuides = getRelatedMarketplaceGuides(service.slug, 'onboarding')
    assert.equal(managementGuides.length, 1, `${service.slug} management page should have a guide`)
    assert.equal(onboardingGuides.length, 1, `${service.slug} onboarding page should have a guide`)
    assert.ok(managementGuides[0].path.startsWith('/blog/'))
    assert.ok(onboardingGuides[0].path.startsWith('/blog/'))
    assert.notEqual(managementGuides[0].path, onboardingGuides[0].path)
  }
})

test('article CTAs link to matching marketplace services and onboarding routes', () => {
  assert.deepEqual(
    getBlogServiceLinks({ title: 'Amazon Seller Onboarding Guide' }),
    {
      serviceType: 'onboarding',
      marketplaces: ['Amazon'],
      serviceLinks: [{
        path: '/services/amazon-account-management/onboarding',
        label: 'Amazon seller onboarding support',
      }],
    },
  )
  assert.deepEqual(
    getBlogServiceLinks({ title: 'Catalog health for Amazon and Flipkart' }).serviceLinks.map(link => link.path),
    ['/services/amazon-account-management', '/services/flipkart-account-management'],
  )
  assert.equal(getBlogServiceLinks({ title: 'Marketplace operations for Indian sellers' }).serviceLinks[0].path, '/services')
})
