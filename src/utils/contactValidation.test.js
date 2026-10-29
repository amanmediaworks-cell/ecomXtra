import test from 'node:test'
import assert from 'node:assert/strict'
import { isEmailOrPhone } from './contactValidation.js'

test('contact details accept email addresses or phone numbers', () => {
  assert.equal(isEmailOrPhone(' seller@example.com '), true)
  assert.equal(isEmailOrPhone('+91 (98765) 43210'), true)
  assert.equal(isEmailOrPhone('987-654-3210'), true)
})

test('contact details reject invalid emails and phone numbers', () => {
  assert.equal(isEmailOrPhone('not-an-email'), false)
  assert.equal(isEmailOrPhone('abc@domain'), false)
  assert.equal(isEmailOrPhone('12345'), false)
  assert.equal(isEmailOrPhone('1234567890123456'), false)
})
