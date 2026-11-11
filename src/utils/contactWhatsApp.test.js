import test from 'node:test'
import assert from 'node:assert/strict'
import { getTelephoneHref } from './contactWhatsApp.js'

test('telephone links keep only the configured international phone number', () => {
  assert.equal(getTelephoneHref('+91 (87002) 59557'), 'tel:+918700259557')
  assert.equal(getTelephoneHref(''), 'tel:+918700259557')
  assert.equal(getTelephoneHref('invalid'), 'tel:+918700259557')
})
