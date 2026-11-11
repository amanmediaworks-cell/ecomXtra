import test from 'node:test'
import assert from 'node:assert/strict'
import { normalizeContactLead } from './contactLead.js'

test('normalizes valid contact data and permits an omitted email', () => {
  const result = normalizeContactLead({
    fullName: '  Anjali Sen ',
    phone: '+91 (87002) 59557',
    email: '',
    serviceSlug: 'amazon-account-management',
    message: '  I need help managing my marketplace account.  ',
  })

  assert.deepEqual(result.errors, {})
  assert.deepEqual(result.data, {
    fullName: 'Anjali Sen',
    phone: '+918700259557',
    email: null,
    serviceSlug: 'amazon-account-management',
    message: 'I need help managing my marketplace account.',
  })
})

test('rejects invalid contacts, email, service, and short messages', () => {
  const result = normalizeContactLead({
    fullName: 'A',
    phone: '123abc',
    email: 'not-an-email',
    serviceSlug: 'unlisted-service',
    message: 'help',
  })

  assert.deepEqual(Object.keys(result.errors).sort(), [
    'email',
    'fullName',
    'message',
    'phone',
    'serviceSlug',
  ])
})

test('strips control characters from user-provided data', () => {
  const result = normalizeContactLead({
    fullName: 'Anjali\u0000 Sen',
    phone: '+918700259557',
    serviceSlug: 'general_inquiry',
    message: 'Need help\u0000 with account.',
  })

  assert.equal(result.errors.fullName, undefined)
  assert.equal(result.data.fullName, 'Anjali Sen')
  assert.equal(result.data.message, 'Need help with account.')
})
