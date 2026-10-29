import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { X } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import ContactInquiryForm from './ContactInquiryForm'
import { ContactModalContext } from './ContactModalContext'
import useModalScrollLock from '../hooks/useModalScrollLock'

function ContactFormModal({ open, present, onClose, onExitComplete, content }) {
  const dialogRef = useRef(null)
  const previousFocusRef = useRef(null)

  useModalScrollLock(present)

  useLayoutEffect(() => {
    if (present && open) {
      previousFocusRef.current = document.activeElement
      dialogRef.current?.focus({ preventScroll: true })
    } else if (!present) {
      previousFocusRef.current?.focus?.({ preventScroll: true })
    }
  }, [open, present])

  useEffect(() => {
    if (!open) return undefined

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
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open, onClose])

  if (typeof document === 'undefined') return null

  return createPortal(
    <AnimatePresence onExitComplete={onExitComplete}>
      {open && (
        <m.div
          key="contact-modal"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
          className="fixed inset-0 z-[70] flex min-h-dvh items-start justify-center overflow-y-auto overscroll-contain bg-slate-950/65 p-3 sm:items-center sm:p-5"
          style={{ willChange: 'opacity' }}
          onPointerDown={event => {
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
            transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
            style={{ willChange: 'transform' }}
            className="modal-scroll my-auto flex max-h-[calc(100dvh-1.5rem)] w-full max-w-xl flex-col overflow-hidden rounded-3xl border-2 border-violet-200 bg-white p-5 shadow-[0_28px_90px_rgba(15,23,42,0.3)] sm:max-h-[min(calc(100dvh-2.5rem),760px)] sm:p-8"
          >
            <div className="mb-5 flex shrink-0 items-start justify-between gap-4 sm:mb-6">
              <div className="min-w-0">
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
            <div className="modal-scroll min-h-0 flex-1 overflow-y-auto overscroll-contain pr-1">
              <ContactInquiryForm content={content} compact />
            </div>
          </m.section>
        </m.div>
      )}
    </AnimatePresence>,
    document.body,
  )
}

export function ContactModalProvider({ children, content }) {
  const [isOpen, setIsOpen] = useState(false)
  const [isPresent, setIsPresent] = useState(false)
  const openContactModal = useCallback(() => {
    setIsPresent(true)
    setIsOpen(true)
  }, [])
  const closeContactModal = useCallback(() => setIsOpen(false), [])
  const handleExitComplete = useCallback(() => setIsPresent(false), [])

  return (
    <ContactModalContext.Provider value={{ openContactModal }}>
      {children}
      <ContactFormModal
        open={isOpen}
        present={isPresent}
        onClose={closeContactModal}
        onExitComplete={handleExitComplete}
        content={content}
      />
    </ContactModalContext.Provider>
  )
}

export default ContactFormModal
