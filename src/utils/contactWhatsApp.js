const DEFAULT_WHATSAPP_NUMBER = '918700259557'

export function openWhatsAppMessage(message, whatsappNumber = DEFAULT_WHATSAPP_NUMBER) {
  const url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`
  window.open(url, '_blank', 'noopener,noreferrer')
}
