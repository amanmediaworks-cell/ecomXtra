export function isEmailOrPhone(value) {
  const trimmedValue = value.trim()
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedValue)) return true

  const digits = trimmedValue.replace(/\D/g, '')
  return /^[+\d().\s-]+$/.test(trimmedValue) && digits.length >= 7 && digits.length <= 15
}
