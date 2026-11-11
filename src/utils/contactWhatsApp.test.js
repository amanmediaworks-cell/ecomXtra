import test from 'node:test'
import assert from 'node:assert/strict'
import { getTelephoneHref, openWhatsAppMessage } from './contactWhatsApp.js'

test('telephone links keep only the configured international phone number', () => {
  assert.equal(getTelephoneHref('+91 (87002) 59557'), 'tel:+918700259557')
  assert.equal(getTelephoneHref(''), 'tel:+918700259557')
  assert.equal(getTelephoneHref('invalid'), 'tel:+918700259557')
})

test('intentional WhatsApp CTA emits one click event and opens an encoded message', () => {
  const originalWindow = globalThis.window
  const events = []
  try {
    globalThis.window = {
      __ECOMXTRA_ANALYTICS_CONSENT__: true,
      dataLayer: [],
      location: { pathname: '/services/amazon-account-management' },
      open: (...args) => events.push(args),
    }

    openWhatsAppMessage('Hello EcomXtra, I need Amazon support.', '9187000259557', {
      buttonText: 'Book consultation',
      buttonLocation: 'service_hero',
      pagePath: '/services/amazon-account-management',
      serviceName: 'Amazon',
    })

    assert.deepEqual(window.dataLayer, [{
      event: 'whatsapp_click',
      button_text: 'Book consultation',
      button_location: 'service_hero',
      page_path: '/services/amazon-account-management',
      service_name: 'Amazon',
    }])
    assert.deepEqual(events, [[
      'https://wa.me/9187000259557?text=Hello%20EcomXtra%2C%20I%20need%20Amazon%20support.',
      '_blank',
      'noopener,noreferrer',
    ]])
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})

test('WhatsApp launches from a form helper without incorrectly tracking a CTA click', () => {
  const originalWindow = globalThis.window
  const events = []
  try {
    globalThis.window = {
      __ECOMXTRA_ANALYTICS_CONSENT__: true,
      dataLayer: [],
      open: (...args) => events.push(args),
    }

    openWhatsAppMessage('Career application details')
    assert.equal(window.dataLayer.length, 0)
    assert.equal(events.length, 1)
  } finally {
    if (originalWindow === undefined) delete globalThis.window
    else globalThis.window = originalWindow
  }
})
