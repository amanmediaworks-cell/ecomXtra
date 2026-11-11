import { useEffect, useState } from 'react'
import { Bell } from 'lucide-react'
import { supabase } from '../src/lib/supabase'

function AdminLeadBell({ userId }) {
  const [unreadCount, setUnreadCount] = useState(null)

  useEffect(() => {
    let active = true
    let refreshing = false
    let errorReported = false
    const refreshCount = async () => {
      if (refreshing) return
      refreshing = true
      try {
        const { data, error } = await supabase.rpc('get_contact_lead_metrics')
        if (!active) return
        if (error) throw error
        const metrics = Array.isArray(data) ? data[0] : data
        setUnreadCount(Number(metrics?.unread_notifications) || 0)
        errorReported = false
      } catch (error) {
        if (!active) return
        if (!errorReported) {
          console.error('Unable to load the unread lead notification count.', error)
          errorReported = true
        }
        setUnreadCount(null)
      } finally {
        refreshing = false
      }
    }

    const initialRefresh = window.setTimeout(refreshCount, 0)
    const timer = window.setInterval(refreshCount, 30000)
    return () => {
      active = false
      window.clearTimeout(initialRefresh)
      window.clearInterval(timer)
    }
  }, [userId])

  return (
    <button
      type="button"
      aria-label={unreadCount === null
        ? 'Open lead notifications; count unavailable'
        : `Open lead notifications; ${unreadCount} unread`}
      onClick={() => window.dispatchEvent(new CustomEvent('admin-open-leads'))}
      className="relative inline-flex h-9 w-9 items-center justify-center border border-[#f2f2f2]/15 text-[#f2f2f2]/70 transition hover:border-[#f2f2f2]/40 hover:text-white"
    >
      <Bell aria-hidden="true" className="h-4 w-4" />
      {unreadCount > 0 && (
        <span className="absolute -right-2 -top-2 min-w-5 rounded-full bg-rose-500 px-1 text-center text-[10px] font-bold leading-5 text-white">
          {unreadCount > 99 ? '99+' : unreadCount}
        </span>
      )}
    </button>
  )
}

export default AdminLeadBell
