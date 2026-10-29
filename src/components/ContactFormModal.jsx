import { useCallback, useEffect, useRef, useState } from 'react'
import { X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import ContactInquiryForm from './ContactInquiryForm'
import { ContactModalContext } from './ContactModalContext'

function ContactFormModal({ open, onClose, content }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useEffect(() => {
    if (!open) return undefined

    previousFocusRef.current = document.activeElement
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    dialogRef.current?.focus()

    const handleKeyDown = event => {
      if (event.key === 'Escape') {
        onClose()
        return
      }
      if (event.key !== 'Tab') return

      const focusableElements = Array.from(dialogRef.current?.querySelectorAll(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) || [])
      const firstElement = focusableElements[0]
      const lastElement = focusableElements[focusableElements.length - 1]

      if (event.shiftKey && document.activeElement === firstElement) {
        event.preventDefault()
        lastElement?.focus()
      } else if (!event.shiftKey && (
        document.activeElement === lastElement
        || document.activeElement === dialogRef.current
      )) {
        event.preventDefault()
        firstElement?.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
      previousFocusRef.current?.focus?.()
    }
  }, [open, onClose])

  return (
    <AnimatePresence>
      {open && (
        <m.div
          key="contact-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm"
          onMouseDown={event => {
            if (event.target === event.currentTarget) onClose()
          }}
        >
          <m.section
            ref={dialogRef}
            role="dialog"
            aria-modal="true"
            aria-labelledby="contact-modal-title"
            tabIndex={-1}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.98 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="max-h-[min(90dvh,760px)] w-full max-w-xl overflow-y-auto rounded-3xl border-2 border-violet-200 bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.3)] sm:p-8"
          >
            <div className="mb-6 flex items-start justify-between gap-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-violet-600">Contact EcomXtra</p>
                <h2 id="contact-modal-title" className="mt-2 font-clash text-2xl font-bold text-slate-900 sm:text-3xl">
                  Let’s talk about your growth
                </h2>
                <p className="mt-2 text-sm leading-6 text-slate-600">
                  Share a few details and we’ll prepare a WhatsApp message for your request.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                aria-label="Close contact form"
                className="shrink-0 rounded-full p-2 text-slate-500 transition hover:bg-violet-50 hover:text-slate-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <ContactInquiryForm content={content} compact />
          </m.section>
        </m.div>
      )}
    </AnimatePresence>
  )
}

export function ContactModalProvider({ children, content }) {
  const [isOpen, setIsOpen] = useState(false)
  const openContactModal = useCallback(() => setIsOpen(true), [])
  const closeContactModal = useCallback(() => setIsOpen(false), [])

  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}
      <ContactFormModal open={isOpen} onClose={closeContactModal} content={content} />
    </ContactModalContext.Provider>
  )
}

export default ContactFormModal
