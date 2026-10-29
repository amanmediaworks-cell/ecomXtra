import { useContactModal } from './ContactModalContext'

function ContactModalTrigger({ children, className = '', onClick, ...buttonProps }) {
  const { openContactModal } = useContactModal()

  return (
    <button
      {...buttonProps}
      type="button"
      onClick={event => {
        onClick?.(event)
        if (!event.defaultPrevented) openContactModal()
      }}
      className={className}
    >
      {children}
    </button>
  )
}

export default ContactModalTrigger
