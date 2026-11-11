import { useEffect, useState } from 'react'
import { useLocation } from 'react-router-dom'
import { setAnalyticsConsent, trackPageView } from '../utils/analytics'

const CONSENT_STORAGE_KEY = 'ecomxtra_analytics_consent'

function AnalyticsConsent() {
  const { pathname } = useLocation()
  const [choice, setChoice] = useState('pending')

  useEffect(() => {
    let savedChoice = null
    try {
      savedChoice = window.localStorage.getItem(CONSENT_STORAGE_KEY)
    } catch (error) {
      console.error('Unable to read the analytics consent preference.', error)
    }

    window.setTimeout(() => {
      if (savedChoice === 'accepted' || savedChoice === 'rejected') {
        setAnalyticsConsent(savedChoice === 'accepted')
        setChoice(savedChoice)
        return
      }

      setAnalyticsConsent(false)
      setChoice('unanswered')
    }, 0)
  }, [])

  useEffect(() => {
    if (choice === 'accepted') trackPageView(pathname)
  }, [choice, pathname])

  function chooseAnalytics(accepted) {
    const savedChoice = accepted ? 'accepted' : 'rejected'
    setAnalyticsConsent(accepted)
    try {
      window.localStorage.setItem(CONSENT_STORAGE_KEY, savedChoice)
    } catch (error) {
      console.error('Unable to save the analytics consent preference.', error)
    }
    setChoice(savedChoice)
  }

  if (choice !== 'unanswered') return null

  return (
    <aside
      aria-label="Analytics preferences"
      className="fixed inset-x-4 bottom-4 z-[100] mx-auto flex max-w-3xl flex-col gap-4 rounded-2xl border border-slate-200 bg-white p-5 text-slate-900 shadow-2xl sm:flex-row sm:items-center sm:justify-between sm:p-6"
    >
      <div>
        <h2 className="text-base font-bold">Your analytics choice</h2>
        <p className="mt-1 max-w-xl text-sm leading-6 text-slate-600">
          We use Google Analytics to understand site visits only if you allow it.
          Contact and WhatsApp details are not sent to analytics.
        </p>
      </div>
      <div className="flex shrink-0 flex-wrap gap-2">
        <button
          type="button"
          onClick={() => chooseAnalytics(false)}
          className="rounded-lg border border-slate-300 px-4 py-2.5 text-sm font-semibold text-slate-700 hover:bg-slate-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-slate-700"
        >
          Reject optional
        </button>
        <button
          type="button"
          onClick={() => chooseAnalytics(true)}
          className="rounded-lg bg-[#243141] px-4 py-2.5 text-sm font-semibold text-white hover:bg-[#17222e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#243141]"
        >
          Allow analytics
        </button>
      </div>
    </aside>
  )
}

export default AnalyticsConsent
