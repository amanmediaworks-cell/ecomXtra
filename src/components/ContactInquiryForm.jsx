import { useId, useRef, useState } from 'react'
import { contactLeadServiceOptions, normalizeContactLead } from '../utils/contactLead'
import { trackConversionEvent } from '../utils/analytics'

const EMPTY_FORM = {
  fullName: '',
  phone: '',
  email: '',
  serviceSlug: '',
  message: '',
}

function ContactInquiryForm({ compact = false }) {
  const [form, setForm] = useState(EMPTY_FORM)
  const [errors, setErrors] = useState({})
  const [requestError, setRequestError] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)
  const fieldId = useId()
  const idempotencyKeyRef = useRef(null)

  function updateField(name, value) {
    if (!submitting) idempotencyKeyRef.current = null
    setForm(current => ({ ...current, [name]: value }))
    setErrors(current => ({ ...current, [name]: undefined }))
    setRequestError('')
  }

  async function handleSubmit(event) {
    event.preventDefault()
    if (submitting) return

    const { data: lead, errors: validationErrors } = normalizeContactLead(form)
    if (Object.keys(validationErrors).length) {
      setErrors(validationErrors)
      return
    }

    if (!idempotencyKeyRef.current) {
      if (typeof window.crypto?.randomUUID !== 'function') {
        setRequestError('Your browser cannot securely submit this form. Please update your browser and try again.')
        return
      }
      idempotencyKeyRef.current = window.crypto.randomUUID()
    }

    setSubmitting(true)
    setRequestError('')
    try {
      const response = await fetch('/api/contact-leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...lead,
          idempotencyKey: idempotencyKeyRef.current,
          website: '',
        }),
      })
      const result = await response.json()
      if (!response.ok || result?.ok !== true) {
        if (result?.fields && typeof result.fields === 'object') setErrors(result.fields)
        if (response.status === 429) {
          setRequestError('We received several requests from this connection. Please wait a little and try again.')
        } else {
          setRequestError('We could not submit your request. Your details are still here; please try again.')
        }
        return
      }

      const selectedService = contactLeadServiceOptions.find(option => option.value === lead.serviceSlug)
      trackConversionEvent('contact_form_submit', {
        formId: 'contact_inquiry',
        formLocation: 'contact_modal',
        pagePath: window.location.pathname,
        serviceName: selectedService?.label,
      })
      idempotencyKeyRef.current = null
      setForm(EMPTY_FORM)
      setErrors({})
      setSubmitted(true)
    } catch (error) {
      console.error('Contact inquiry submission failed.', error)
      setRequestError('We could not submit your request. Your details are still here; please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  const inputClassName = 'w-full rounded-xl border border-violet-200 bg-violet-50/40 p-3 text-sm font-medium text-slate-900 shadow-xs transition-all focus:border-violet-500 focus:outline-none focus:ring-2 focus:ring-violet-500/20'

  if (submitted) {
    return (
      <div role="status" className="rounded-2xl border-2 border-violet-200 bg-violet-50 px-5 py-8 text-center">
        <span className="block font-outfit text-lg font-bold text-slate-900">Your request was submitted</span>
        <span className="mt-2 block font-outfit text-sm leading-6 text-slate-600">
          Thank you. Our team has received your enquiry and will be in touch.
        </span>
      </div>
    )
  }

  const fieldError = name => errors[name]

  return (
    <form onSubmit={handleSubmit} className={compact ? 'space-y-3' : 'space-y-3.5'} noValidate>
      <div className="absolute -left-[10000px] top-auto h-px w-px overflow-hidden" aria-hidden="true">
        <label htmlFor={`${fieldId}-website`}>Leave this field empty</label>
        <input id={`${fieldId}-website`} name="website" tabIndex={-1} autoComplete="off" />
      </div>
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
            disabled={submitting}
            maxLength={100}
            value={form.fullName}
            aria-invalid={Boolean(fieldError('fullName'))}
            aria-describedby={fieldError('fullName') ? `${fieldId}-name-error` : undefined}
            onChange={event => updateField('fullName', event.target.value)}
            className={inputClassName}
            placeholder="e.g. Rahul Verma"
          />
          {fieldError('fullName') && <p id={`${fieldId}-name-error`} className="mt-1 text-xs text-red-700">{fieldError('fullName')}</p>}
        </div>
        <div>
          <label htmlFor={`${fieldId}-phone`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
            Phone number *
          </label>
          <input
            id={`${fieldId}-phone`}
            autoComplete="tel"
            type="tel"
            required
            disabled={submitting}
            maxLength={32}
            value={form.phone}
            aria-invalid={Boolean(fieldError('phone'))}
            aria-describedby={fieldError('phone') ? `${fieldId}-phone-error` : undefined}
            onChange={event => updateField('phone', event.target.value)}
            className={inputClassName}
            placeholder="+91 87002 59557"
          />
          {fieldError('phone') && <p id={`${fieldId}-phone-error`} className="mt-1 text-xs text-red-700">{fieldError('phone')}</p>}
        </div>
      </div>
      <div>
        <label htmlFor={`${fieldId}-email`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Email address
        </label>
        <input
          id={`${fieldId}-email`}
          autoComplete="email"
          type="email"
          disabled={submitting}
          maxLength={254}
          value={form.email}
          aria-invalid={Boolean(fieldError('email'))}
          aria-describedby={fieldError('email') ? `${fieldId}-email-error` : undefined}
          onChange={event => updateField('email', event.target.value)}
          className={inputClassName}
          placeholder="you@example.com (optional)"
        />
        {fieldError('email') && <p id={`${fieldId}-email-error`} className="mt-1 text-xs text-red-700">{fieldError('email')}</p>}
      </div>
      <div>
        <label htmlFor={`${fieldId}-service`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Service interested in *
        </label>
        <select
          id={`${fieldId}-service`}
          required
          disabled={submitting}
          value={form.serviceSlug}
          aria-invalid={Boolean(fieldError('serviceSlug'))}
          onChange={event => updateField('serviceSlug', event.target.value)}
          className={inputClassName}
        >
          <option value="">Select a service</option>
          {contactLeadServiceOptions.map(option => (
            <option key={option.value} value={option.value}>{option.label}</option>
          ))}
        </select>
        {fieldError('serviceSlug') && <p className="mt-1 text-xs text-red-700">{fieldError('serviceSlug')}</p>}
      </div>
      <div>
        <label htmlFor={`${fieldId}-message`} className="mb-1.5 block text-[11px] font-extrabold uppercase tracking-wider text-slate-700">
          Message / requirements *
        </label>
        <textarea
          id={`${fieldId}-message`}
          rows={compact ? 3 : 4}
          required
          disabled={submitting}
          maxLength={3000}
          value={form.message}
          aria-invalid={Boolean(fieldError('message'))}
          aria-describedby={fieldError('message') ? `${fieldId}-message-error` : undefined}
          onChange={event => updateField('message', event.target.value)}
          className={`${inputClassName} resize-y`}
          placeholder="Tell us what you need help with."
        />
        {fieldError('message') && <p id={`${fieldId}-message-error`} className="mt-1 text-xs text-red-700">{fieldError('message')}</p>}
      </div>
      {requestError && <p role="alert" className="text-sm leading-6 text-red-700">{requestError}</p>}
      <button
        type="submit"
        disabled={submitting}
        className="w-full rounded-full bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 py-3 text-xs font-extrabold uppercase tracking-widest text-white shadow-lg shadow-pink-500/20 transition hover:scale-[1.01] hover:opacity-95 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-violet-600 disabled:cursor-wait disabled:opacity-60"
      >
        {submitting ? 'Submitting…' : 'Submit enquiry'}
      </button>
      <p className="text-center text-[11px] leading-5 text-slate-500">
        Your details are sent securely to EcomXtra and are not included in analytics.
      </p>
    </form>
  )
}

export default ContactInquiryForm
