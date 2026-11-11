import test from 'node:test'
import assert from 'node:assert/strict'
import { setAnalyticsConsent, trackConversionEvent, trackPageView } from './analytics.js'

test('conversion events are not sent without explicit analytics consent and a data layer', () => {
  const originalWindow = globalThis.window
  try {
    globalThis.window = { dataLayer: [], location: { pathname: '/contact', origin: 'https://ecomxtra.in' } }
    assert.equal(trackConversionEvent('whatsapp_click', {
      buttonText: 'Contact us',
      buttonLocation: 'home_hero',
    }), false)
    assert.equal(window.dataLayer.length, 0)

    window.__ECOMXTRA_ANALYTICS_CONSENT__ = true
    delete window.dataLayer
    assert.equal(trackConversionEvent('whatsapp_click', {
      buttonText: 'Contact us',
      buttonLocation: 'home_hero',
    }), false)
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})

test('consented conversion events include only approved event name and safe source', () => {
  const originalWindow = globalThis.window
  try {
    globalThis.window = {
      __ECOMXTRA_ANALYTICS_CONSENT__: true,
      dataLayer: [],
      location: { pathname: '/contact', origin: 'https://ecomxtra.in' },
    }

    assert.equal(trackConversionEvent('contact_form_submit', {
      formId: 'contact_inquiry',
      formLocation: 'contact_modal',
    }), true)
    assert.deepEqual(window.dataLayer, [{
      event: 'contact_form_submit',
      form_id: 'contact_inquiry',
      form_location: 'contact_modal',
      page_path: '/contact',
    }])
    assert.equal(trackConversionEvent('generate_lead'), false)
    assert.equal(trackConversionEvent('page_view'), false)
    assert.equal(window.dataLayer.length, 1)
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})

test('consent updates change analytics storage only after the explicit choice', () => {
  const originalWindow = globalThis.window
  try {
    globalThis.window = {
      dataLayer: [],
      gtag: (...args) => window.dataLayer.push(args),
    }

    assert.equal(setAnalyticsConsent(false), true)
    assert.equal(window.__ECOMXTRA_ANALYTICS_CONSENT__, false)
    assert.deepEqual(window.dataLayer[0], [
      'consent',
      'update',
      {
        analytics_storage: 'denied',
        ad_storage: 'denied',
        ad_user_data: 'denied',
        ad_personalization: 'denied',
      },
    ])

    assert.equal(setAnalyticsConsent(true), true)
    assert.equal(window.__ECOMXTRA_ANALYTICS_CONSENT__, true)
    assert.equal(window.dataLayer[1][2].analytics_storage, 'granted')
    assert.equal(window.dataLayer[1][2].ad_storage, 'denied')
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})

test('page views require consent and omit query strings', () => {
  const originalWindow = globalThis.window
  const originalDocument = globalThis.document
  try {
    globalThis.window = {
      __ECOMXTRA_ANALYTICS_CONSENT__: false,
      dataLayer: [],
      location: { origin: 'https://ecomxtra.in', pathname: '/contact' },
    }
    globalThis.document = { title: 'Contact EcomXtra' }

    assert.equal(trackPageView('/contact?email=private@example.com'), false)
    window.__ECOMXTRA_ANALYTICS_CONSENT__ = true
    assert.equal(trackPageView('/contact?email=private@example.com'), true)
    assert.deepEqual(window.dataLayer, [{
      event: 'page_view',
      page_location: 'https://ecomxtra.in/contact',
      page_title: 'EcomXtra',
    }])
    assert.equal(trackPageView('/contact?next=%2Fservices'), false)
    assert.equal(window.dataLayer.length, 1)
    assert.equal(trackPageView('/services'), true)
    assert.equal(window.dataLayer.length, 2)
    assert.equal(trackPageView('/blog/customer@example.com'), false)
    assert.equal(trackPageView('/blog/9876543210'), false)
    assert.equal(trackPageView('/unknown/john-doe'), false)
    assert.equal(trackPageView('https://ecomxtra.in/contact'), false)
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
    if (originalDocument === undefined) delete globalThis.document
    else globalThis.document = originalDocument
  }
})

test('WhatsApp, phone, and form events have mutually exclusive safe payloads', () => {
  const originalWindow = globalThis.window
  try {
    globalThis.window = {
      __ECOMXTRA_ANALYTICS_CONSENT__: true,
      dataLayer: [],
      location: { origin: 'https://ecomxtra.in', pathname: '/services/amazon-account-management' },
    }

    assert.equal(trackConversionEvent('whatsapp_click', {
      buttonText: 'Book consultation',
      buttonLocation: 'service_hero',
      serviceName: 'Amazon',
    }), true)
    assert.equal(trackConversionEvent('phone_click', {
      buttonLocation: 'site_footer',
    }), true)
    assert.equal(trackConversionEvent('contact_form_submit', {
      formId: 'contact_inquiry',
      formLocation: 'contact_modal',
      serviceName: 'Amazon',
    }), true)
    assert.deepEqual(window.dataLayer, [
      {
        event: 'whatsapp_click',
        button_text: 'Book consultation',
        button_location: 'service_hero',
        page_path: '/services/amazon-account-management',
        service_name: 'Amazon',
      },
      {
        event: 'phone_click',
        button_location: 'site_footer',
        page_path: '/services/amazon-account-management',
      },
      {
        event: 'contact_form_submit',
        form_id: 'contact_inquiry',
        form_location: 'contact_modal',
        page_path: '/services/amazon-account-management',
        service_name: 'Amazon',
      },
    ])
    assert.equal(trackConversionEvent('whatsapp_click', {
      buttonText: 'seller@example.com',
      buttonLocation: 'service_hero',
    }), false)
    assert.equal(trackConversionEvent('phone_click', {
      buttonLocation: 'seller@example.com',
    }), false)
    assert.equal(trackConversionEvent('contact_form_submit', {
      formId: 'contact_inquiry',
      formLocation: 'https://ecomxtra.in/contact?email=seller@example.com',
    }), false)
    assert.equal(window.dataLayer.length, 3)
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})
