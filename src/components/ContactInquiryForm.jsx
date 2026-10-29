import { useId, useState } from 'react'
import { openWhatsAppMessage } from '../utils/contactWhatsApp'
import { isEmailOrPhone } from '../utils/contactValidation'

function ContactInquiryForm({ content, compact = false }) {
  const [form, setForm] = useState({ name: '', contact: '', business: '', message: '' })
  const [submitted, setSubmitted] = useState(false)
  const fieldId = useId()

  const handleSubmit = event => {
    event.preventDefault()
    if (!isEmailOrPhone(form.contact)) {
      event.currentTarget.elements.contact.setCustomValidity('Enter a valid email address or phone number.')
      event.currentTarget.elements.contact.reportValidity()
      return
    }
    openWhatsAppMessage([
      'Hi EcomXtra, I would like to book a consultation.',
      '',
      `Name: ${form.name}`,
      `Email or phone: ${form.contact.trim()}`,
      `Business: ${form.business || 'Not provided'}`,
      `How can we help: ${form.message || 'Not provided'}`,
    ].join('\n'), content?.whatsappNumber)
    setSubmitted(true)
  }

  const inputClassName = 'w-full rounded-xl border border-violet-200 bg-violet-50/40 p-3 text-sm font-medium text-slate-900 shadow-xs transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20'

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border-2 border-violet-200 bg-violet-50 px-5 py-8 text-center">
        <span className="block font-outfit text-lg font-bold text-slate-900">WhatsApp message ready</span>
        <span className="mt-2 block font-outfit text-sm leading-6 text-slate-600">
          Your details are pre-filled in WhatsApp. Press Send there to submit your request.
        </span>
        <button
          type="button"
          onClick={() => {
            setSubmitted(false)
            setForm({ name: '', contact: '', business: '', message: '' })
          }}
          className="mt-5 rounded-full border border-violet-300 px-4 py-2 text-xs font-bold text-violet-700 transition hover:bg-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
        >
          Send another request
        </button>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-3.5'}>
      <div className={compact ? 'grid gap-3 sm:grid-cols-2' : 'space-y-3.5'}>
        <div>
          <label htmlFor={`${fieldId}-name`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
            Full name *
          </label>
          <input
            id={`${fieldId}-name`}
            autoComplete="name"
            type="text"
            required
            value={form.name}
            onChange={event => setForm({ ...form, name: event.target.value })}
            className={inputClassName}
            placeholder="e.g. Rahul Verma"
          />
        </div>
        <div>
          <label htmlFor={`${fieldId}-contact`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
            Email or phone number *
          </label>
          <input
            id={`${fieldId}-contact`}
            name="contact"
            autoComplete="on"
            type="text"
            required
            value={form.contact}
            onChange={event => {
              const { value } = event.target
              event.target.setCustomValidity(value && !isEmailOrPhone(value)
                ? 'Enter a valid email address or phone number.'
                : '')
              setForm({ ...form, contact: value })
            }}
            className={inputClassName}
            placeholder="Email or phone number"
          />
        </div>
      </div>
      <div>
        <label htmlFor={`${fieldId}-business`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Business name
        </label>
        <input
          id={`${fieldId}-business`}
          autoComplete="organization"
          type="text"
          value={form.business}
          onChange={event => setForm({ ...form, business: event.target.value })}
          className={inputClassName}
          placeholder="e.g. FitFuel Brand"
        />
      </div>
      <div>
        <label htmlFor={`${fieldId}-message`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          How can we help?
        </label>
        <textarea
          id={`${fieldId}-message`}
          rows={compact ? 3 : 4}
          value={form.message}
          onChange={event => setForm({ ...form, message: event.target.value })}
          className={`${inputClassName} resize-y`}
          placeholder="Tell us about your business and what you need."
        />
      </div>
      <button
        type="submit"
        className="w-full rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg shadow-pink-500/20 transition hover:scale-[1.01] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600"
      >
        {content?.consultationButton || 'Continue to WhatsApp'}
      </button>
      <p className="text-center text-[11px] leading-5 text-slate-500">
        Your details will be added to a WhatsApp message for you to review and send.
      </p>
    </form>
  )
}

export default ContactInquiryForm
