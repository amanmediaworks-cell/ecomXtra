import { Children } from 'react'
import { useLocation } from 'react-router-dom'
import { useContactModal } from './ContactModalContext'
import { marketplaceServiceDefaults } from '../data/marketplaceServiceContent'
import { openWhatsAppMessage } from '../utils/contactWhatsApp'

function ContactModalTrigger({
  children,
  className = '',
  onClick,
  serviceName,
  buttonText: providedButtonText,
  buttonLocation = 'website_cta',
  ...buttonProps
}) {
  const { openContactModal, whatsappNumber } = useContactModal()
  const { pathname } = useLocation()
  const buttonText = providedButtonText || buttonProps['aria-label']
    || Children.toArray(children).filter(child => typeof child === 'string').join(' ').replace(/\s+/g, ' ').trim()
    || 'Contact EcomXtra'
  const routeServiceName = pathname.match(/^\/services\/([^/]+)/)?.[1]
  const resolvedServiceName = serviceName || marketplaceServiceDefaults
    .find(service => service.slug === routeServiceName)
    ?.title.replace(' Account Management Services', '')

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={event => {
        onClick?.(event)
        if (event.defaultPrevented) return
        if (pathname === '/contact') {
          openContactModal()
          return
        }

        const message = resolvedServiceName
          ? `Hello EcomXtra Team, I am interested in your ${resolvedServiceName} service. Please share the details and consultation process.`
          : 'Hello EcomXtra Team, I am interested in your e-commerce account management services. I would like to know more about your services, pricing, and consultation process. Please assist me.'
        openWhatsAppMessage(message, whatsappNumber, {
          buttonText,
          buttonLocation,
          pagePath: pathname,
          serviceName: resolvedServiceName,
        })
      }}
      className={className}
    >
      {children}
    </button>
  )
}

export default ContactModalTrigger
