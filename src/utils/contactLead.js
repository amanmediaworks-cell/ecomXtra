import { marketplaceServiceDefaults } from '../data/marketplaceServiceContent.js'

export const contactLeadServiceOptions = [
  { value: 'general_inquiry', label: 'General inquiry' },
  ...marketplaceServiceDefaults.map(service => ({
    value: service.slug,
    label: service.title.replace(' Account Management Services', ''),
  })),
]

const serviceSlugs = new Set(contactLeadServiceOptions.map(option => option.value))

function cleanText(value, maxLength, allowNewlines = false) {
  if (typeof value !== 'string') return ''
  const cleanValue = Array.from(value, character => character.codePointAt(0))
    .filter(codePoint => codePoint >= 32
      || (allowNewlines && (codePoint === 9 || codePoint === 10 || codePoint === 13)))
    .filter(codePoint => codePoint !== 127)
    .map(codePoint => String.fromCodePoint(codePoint))
    .join('')
  return cleanValue.trim().slice(0, maxLength)
}

export function normalizeContactLead(input) {
  const values = input && typeof input === 'object' && !Array.isArray(input) ? input : {}
  const fullName = cleanText(values.fullName, 100)
  const phone = cleanText(values.phone, 32).replace(/[^\d+]/g, '')
  const phoneDigits = phone.replace(/\D/g, '')
  const email = cleanText(values.email, 254).toLowerCase()
  const serviceSlug = cleanText(values.serviceSlug, 80)
  const message = cleanText(values.message, 3000, true)
  const errors = {}

  if (fullName.length < 2) errors.fullName = 'Enter your full name.'
  if (phoneDigits.length < 7 || phoneDigits.length > 15 || !/^\+?\d+$/.test(phone)) {
    errors.phone = 'Enter a valid phone number.'
  }
  if (email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.email = 'Enter a valid email address.'
  if (!serviceSlugs.has(serviceSlug)) errors.serviceSlug = 'Choose a service.'
  if (message.length < 5) errors.message = 'Please describe how we can help.'

  return {
    errors,
    data: {
      fullName,
      phone,
      email: email || null,
      serviceSlug,
      message,
    },
  }
}
