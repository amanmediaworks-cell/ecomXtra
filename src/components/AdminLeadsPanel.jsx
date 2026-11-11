import { useCallback, useEffect, useRef, useState } from 'react'
import { ArrowDown, Bell, CalendarClock, Check, ChevronDown, ChevronUp, ExternalLink, MessageCircle, Phone, Search, X } from 'lucide-react'
import { supabase } from '../src/lib/supabase'
import { contactLeadServiceOptions } from '../utils/contactLead'

const PAGE_SIZE = 10
const STATUS_OPTIONS = [
  ['new', 'New'],
  ['contacted', 'Contacted'],
  ['follow_up_required', 'Follow-up required'],
  ['qualified', 'Qualified'],
  ['converted', 'Converted'],
  ['closed', 'Closed'],
]
const PRIORITY_OPTIONS = [
  ['low', 'Low'],
  ['medium', 'Medium'],
  ['high', 'High'],
]

function formatDate(value) {
  if (!value) return '—'
  const date = new Date(value)
  return Number.isNaN(date.getTime()) ? '—' : date.toLocaleString()
}

function localDateTimeValue(value) {
  if (!value) return ''
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const local = new Date(date.getTime() - date.getTimezoneOffset() * 60000)
  return local.toISOString().slice(0, 16)
}

function getPhoneHref(value) {
  const phone = String(value || '').replace(/[^\d+]/g, '')
  return /^\+?\d{7,15}$/.test(phone) ? `tel:${phone}` : null
}

function getWhatsAppHref(value) {
  const phone = String(value || '').replace(/\D/g, '')
  return /^\d{7,15}$/.test(phone)
    ? `https://wa.me/${phone}?text=${encodeURIComponent('Hello, following up on your EcomXtra enquiry.')}`
    : null
}

function AdminLeadsPanel({ userId, hideTrigger = false }) {
  const [drawerOpen, setDrawerOpen] = useState(false)
  const [records, setRecords] = useState([])
  const [metrics, setMetrics] = useState(null)
  const [filter, setFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('')
  const [priorityFilter, setPriorityFilter] = useState('')
  const [serviceFilter, setServiceFilter] = useState('')
  const [search, setSearch] = useState('')
  const [debouncedSearch, setDebouncedSearch] = useState('')
  const [followUpDue, setFollowUpDue] = useState(false)
  const [createdFrom, setCreatedFrom] = useState('')
  const [createdTo, setCreatedTo] = useState('')
  const [selectedIds, setSelectedIds] = useState([])
  const [expandedId, setExpandedId] = useState(null)
  const [details, setDetails] = useState({})
  const [noteDraft, setNoteDraft] = useState('')
  const [noteBusy, setNoteBusy] = useState(false)
  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(false)
  const [errorMessage, setErrorMessage] = useState('')
  const [actionMessage, setActionMessage] = useState('')
  const cursorRef = useRef(null)
  const loadingRef = useRef(false)
  const requestIdRef = useRef(0)
  const loadRecordsRef = useRef(null)
  const drawerOpenRef = useRef(drawerOpen)
  const headingRef = useRef(null)

  const loadMetrics = useCallback(async () => {
    try {
      const { data, error } = await supabase.rpc('get_contact_lead_metrics')
      if (error) {
        setErrorMessage(`Unable to load lead metrics: ${error.message}`)
        return
      }
      setMetrics(Array.isArray(data) ? data[0] : data)
    } catch (error) {
      setErrorMessage(`Unable to load lead metrics: ${error.message}`)
    }
  }, [])

  const loadRecords = useCallback(async (reset = false) => {
    if (!drawerOpen || (loadingRef.current && !reset)) return
    const requestId = ++requestIdRef.current
    loadingRef.current = true
    setErrorMessage('')
    if (reset) {
      setLoading(true)
      cursorRef.current = null
    } else {
      setLoadingMore(true)
    }

    const cursor = reset ? null : cursorRef.current
    const createdFromDate = createdFrom ? new Date(`${createdFrom}T00:00:00`) : null
    const createdToDate = createdTo ? new Date(`${createdTo}T00:00:00`) : null
    if (createdToDate) createdToDate.setDate(createdToDate.getDate() + 1)

    try {
      const { data, error } = await supabase.rpc('get_contact_lead_records', {
        p_limit: PAGE_SIZE,
        p_before_created_at: cursor?.createdAt || null,
        p_before_id: cursor?.id || null,
        p_notification_filter: filter,
        p_status: statusFilter || null,
        p_priority: priorityFilter || null,
        p_service_slug: serviceFilter || null,
        p_search: debouncedSearch.trim().slice(0, 100) || null,
        p_follow_up_due: followUpDue,
        p_created_from: createdFromDate?.toISOString() || null,
        p_created_to: createdToDate?.toISOString() || null,
      })
      if (error) throw error
      if (requestId !== requestIdRef.current) return

      const page = Array.isArray(data) ? data : []
      cursorRef.current = page.length
        ? { createdAt: page[page.length - 1].notification_created_at, id: page[page.length - 1].notification_id }
        : cursor
      setHasMore(page.length === PAGE_SIZE)
      setRecords(current => reset
        ? page
        : [...current, ...page.filter(row => !current.some(existing => existing.notification_id === row.notification_id))])
      if (reset) setSelectedIds([])
    } catch (loadError) {
      if (requestId !== requestIdRef.current) return
      setErrorMessage(`Unable to load contact leads: ${loadError.message}`)
    } finally {
      if (requestId === requestIdRef.current) {
        loadingRef.current = false
        setLoading(false)
        setLoadingMore(false)
      }
    }
  }, [createdFrom, createdTo, debouncedSearch, drawerOpen, filter, followUpDue, priorityFilter, serviceFilter, statusFilter])

  useEffect(() => {
    loadRecordsRef.current = loadRecords
  }, [loadRecords])

  useEffect(() => {
    drawerOpenRef.current = drawerOpen
  }, [drawerOpen])

  useEffect(() => {
    const timer = window.setTimeout(() => setDebouncedSearch(search), 300)
    return () => window.clearTimeout(timer)
  }, [search])

  useEffect(() => {
    const openLeads = () => setDrawerOpen(true)
    window.addEventListener('admin-open-leads', openLeads)
    return () => window.removeEventListener('admin-open-leads', openLeads)
  }, [])

  useEffect(() => {
    if (!drawerOpen) return
    headingRef.current?.focus()
    const timer = window.setTimeout(() => loadRecords(true), 0)
    return () => window.clearTimeout(timer)
  }, [drawerOpen, loadRecords])

  useEffect(() => {
    const initialRefresh = window.setTimeout(loadMetrics, 0)
    const poll = window.setInterval(() => {
      loadMetrics()
      if (drawerOpenRef.current) loadRecordsRef.current?.(true)
    }, 30000)
    return () => {
      window.clearTimeout(initialRefresh)
      window.clearInterval(poll)
    }
  }, [loadMetrics])

  useEffect(() => {
    const channel = supabase
      .channel(`admin-contact-notifications:${userId}`)
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'admin_notifications',
      }, () => {
        loadMetrics()
        if (drawerOpenRef.current) loadRecordsRef.current?.(true)
      })
      .subscribe(status => {
        if (status === 'CHANNEL_ERROR' || status === 'TIMED_OUT') {
          setErrorMessage('Live lead updates are unavailable. The dashboard will continue polling for changes.')
        }
      })

    return () => {
      supabase.removeChannel(channel)
    }
  }, [loadMetrics, userId])

  useEffect(() => {
    if (!drawerOpen) return undefined
    const handleKeyDown = event => {
      if (event.key === 'Escape') setDrawerOpen(false)
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [drawerOpen])

  const updateLead = async (leadId, changes) => {
    setErrorMessage('')
    setActionMessage('')
    try {
      const { error } = await supabase.from('contact_leads').update(changes).eq('id', leadId)
      if (error) throw error
      setRecords(current => current.map(record => record.lead_id === leadId ? { ...record, ...changes } : record))
      setActionMessage('Lead updated.')
      await loadMetrics()
      return true
    } catch (error) {
      setErrorMessage(`Unable to update lead: ${error.message}`)
      return false
    }
  }

  const setReadState = async (notificationIds, read) => {
    setErrorMessage('')
    setActionMessage('')
    try {
      const result = read
        ? await supabase.from('admin_notification_reads').upsert(
          notificationIds.map(notification_id => ({ notification_id, admin_id: userId })),
          { onConflict: 'notification_id,admin_id', ignoreDuplicates: true },
        )
        : await supabase.from('admin_notification_reads').delete()
          .eq('admin_id', userId)
          .in('notification_id', notificationIds)
      if (result.error) throw result.error
      setActionMessage(read ? 'Selected notifications marked as read.' : 'Selected notifications marked as unread.')
      setSelectedIds([])
      await Promise.all([loadMetrics(), loadRecords(true)])
    } catch (error) {
      setErrorMessage(`Unable to update notification read state: ${error.message}`)
    }
  }

  const markAllRead = async () => {
    setErrorMessage('')
    try {
      const { data, error } = await supabase.rpc('mark_all_contact_notifications_read')
      if (error) throw error
      setActionMessage(`${Number(data) || 0} notification${Number(data) === 1 ? '' : 's'} marked as read.`)
      setSelectedIds([])
      await Promise.all([loadMetrics(), loadRecords(true)])
    } catch (error) {
      setErrorMessage(`Unable to mark all notifications as read: ${error.message}`)
    }
  }

  const toggleDetails = async record => {
    if (expandedId === record.lead_id) {
      setExpandedId(null)
      return
    }
    setExpandedId(record.lead_id)
    setNoteDraft('')
    if (details[record.lead_id]) return

    try {
      const [notesResult, activityResult] = await Promise.all([
        supabase.from('contact_lead_notes').select('id, admin_id, note, created_at')
          .eq('lead_id', record.lead_id).order('created_at', { ascending: false }),
        supabase.from('contact_lead_activity').select('id, admin_id, action_type, metadata, created_at')
          .eq('lead_id', record.lead_id).order('created_at', { ascending: false }),
      ])
      if (notesResult.error || activityResult.error) throw notesResult.error || activityResult.error
      setDetails(current => ({
        ...current,
        [record.lead_id]: { notes: notesResult.data || [], activity: activityResult.data || [] },
      }))
    } catch (error) {
      setErrorMessage(`Unable to load lead history: ${error.message}`)
      return
    }
  }

  const addNote = async leadId => {
    const note = noteDraft.trim()
    if (!note) return
    setNoteBusy(true)
    setErrorMessage('')
    try {
      const { data, error } = await supabase.from('contact_lead_notes')
        .insert({ lead_id: leadId, admin_id: userId, note })
        .select('id, admin_id, note, created_at')
        .single()
      if (error) throw error
      setDetails(current => ({
        ...current,
        [leadId]: {
          ...current[leadId],
          notes: [data, ...(current[leadId]?.notes || [])],
        },
      }))
      setNoteDraft('')
      setActionMessage('Internal note added.')
    } catch (error) {
      setErrorMessage(`Unable to add note: ${error.message}`)
    } finally {
      setNoteBusy(false)
    }
  }

  const selectVisible = checked => {
    setSelectedIds(checked ? records.map(record => record.notification_id) : [])
  }

  const closeDrawer = () => setDrawerOpen(false)
  const controlClass = 'min-h-10 border border-white/15 bg-[#1a1a1a] px-3 text-xs text-[#f2f2f2] outline-none focus:border-white/50'
  const buttonClass = 'inline-flex min-h-9 items-center justify-center gap-2 border border-white/15 px-3 text-[10px] font-bold uppercase tracking-wider text-[#f2f2f2]/75 transition hover:border-white/40 hover:text-white disabled:cursor-not-allowed disabled:opacity-40'
  const count = Number(metrics?.unread_notifications) || 0

  return (
    <>
      {!hideTrigger && <button
        type="button"
        onClick={() => setDrawerOpen(true)}
        aria-label={`Open lead inbox, ${count} unread`}
        className="relative inline-flex min-h-10 items-center gap-2 border border-white/15 px-3 text-xs font-bold uppercase tracking-widest text-[#f2f2f2]/70 hover:border-white/40 hover:text-white"
      >
        <Bell aria-hidden="true" className="h-4 w-4" />
        Leads
        {count > 0 && <span className="rounded-full bg-rose-500 px-2 py-0.5 text-[10px] text-white">{count > 99 ? '99+' : count}</span>}
      </button>}

      {drawerOpen && (
        <div className="fixed inset-0 z-[100] flex justify-end bg-black/70 backdrop-blur-sm" onMouseDown={event => {
          if (event.target === event.currentTarget) closeDrawer()
        }}>
          <section
            role="dialog"
            aria-modal="true"
            aria-labelledby="admin-leads-title"
            className="flex h-full w-full max-w-5xl flex-col overflow-hidden border-l border-white/10 bg-[#111111] text-[#f2f2f2] shadow-2xl"
          >
            <header className="flex items-start justify-between gap-4 border-b border-white/10 px-4 py-4 sm:px-6">
              <div>
                <h2 id="admin-leads-title" ref={headingRef} tabIndex={-1} className="font-clash text-xl font-bold tracking-tight outline-none">Contact leads</h2>
                <p className="mt-1 text-[10px] uppercase tracking-[0.18em] text-white/40">Private admin inbox · latest 10 per page</p>
              </div>
              <button type="button" aria-label="Close lead inbox" onClick={closeDrawer} className="p-2 text-white/60 hover:text-white"><X className="h-4 w-4" /></button>
            </header>

            <div className="flex-1 overflow-y-auto p-4 sm:p-6">
              <div className="grid grid-cols-2 gap-2 md:grid-cols-5">
                {[
                  ['Total leads', metrics?.total_leads, null],
                  ['New', metrics?.new_leads, 'new'],
                  ['Unread', metrics?.unread_notifications, 'unread'],
                  ['Follow-ups due', metrics?.follow_ups_due, 'due'],
                  ['Qualified', metrics?.qualified_leads, 'qualified'],
                ].map(([label, value, action]) => (
                  <button
                    type="button"
                    key={label}
                    disabled={!action}
                    onClick={() => {
                      if (action === 'unread') setFilter('unread')
                      if (action === 'due') setFollowUpDue(true)
                      if (action === 'new') setStatusFilter('new')
                      if (action === 'qualified') setStatusFilter('qualified')
                    }}
                    className="border border-white/10 bg-white/[0.025] px-3 py-3 text-left disabled:cursor-default"
                  >
                    <span className="block text-[9px] font-bold uppercase tracking-wider text-white/40">{label}</span>
                    <span className="mt-1 block font-clash text-lg font-bold">{value ?? '—'}</span>
                  </button>
                ))}
              </div>

              <div className="mt-4 flex flex-wrap items-center gap-2 border-y border-white/10 py-3">
                <button type="button" className={buttonClass} onClick={markAllRead} disabled={!count}>
                  <Check className="h-3.5 w-3.5" /> Mark all read
                </button>
                <button type="button" className={buttonClass} onClick={() => setReadState(selectedIds, true)} disabled={!selectedIds.length}>
                  Mark selected read
                </button>
                <button type="button" className={buttonClass} onClick={() => setReadState(selectedIds, false)} disabled={!selectedIds.length}>
                  Mark selected unread
                </button>
                <span className="ml-auto text-[10px] text-white/40">{selectedIds.length} selected</span>
              </div>

              <div className="grid gap-2 py-4 sm:grid-cols-2 xl:grid-cols-4">
                <label className="relative sm:col-span-2">
                  <span className="sr-only">Search leads</span>
                  <Search aria-hidden="true" className="pointer-events-none absolute left-3 top-3 h-4 w-4 text-white/35" />
                  <input value={search} onChange={event => setSearch(event.target.value)} maxLength={100} placeholder="Search name, phone, email, service" className={`${controlClass} w-full pl-9`} />
                </label>
                <label><span className="sr-only">Notification read status</span><select value={filter} onChange={event => setFilter(event.target.value)} className={`${controlClass} w-full`}>
                  <option value="all">All notifications</option><option value="unread">Unread</option><option value="read">Read</option>
                </select></label>
                <label><span className="sr-only">Lead status</span><select value={statusFilter} onChange={event => setStatusFilter(event.target.value)} className={`${controlClass} w-full`}>
                  <option value="">All statuses</option>{STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select></label>
                <label><span className="sr-only">Lead priority</span><select value={priorityFilter} onChange={event => setPriorityFilter(event.target.value)} className={`${controlClass} w-full`}>
                  <option value="">All priorities</option>{PRIORITY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                </select></label>
                <label><span className="sr-only">Service</span><select value={serviceFilter} onChange={event => setServiceFilter(event.target.value)} className={`${controlClass} w-full`}>
                  <option value="">All services</option>{contactLeadServiceOptions.map(option => <option key={option.value} value={option.value}>{option.label}</option>)}
                </select></label>
                <label className="flex min-h-10 items-center gap-2 border border-white/15 px-3 text-xs text-white/65">
                  <input type="checkbox" checked={followUpDue} onChange={event => setFollowUpDue(event.target.checked)} />
                  Follow-up due only
                </label>
                <label><span className="sr-only">Created from</span><input aria-label="Created from" type="date" value={createdFrom} onChange={event => setCreatedFrom(event.target.value)} className={`${controlClass} w-full`} /></label>
                <label><span className="sr-only">Created to</span><input aria-label="Created to" type="date" value={createdTo} onChange={event => setCreatedTo(event.target.value)} className={`${controlClass} w-full`} /></label>
              </div>

              {errorMessage && <div role="alert" className="mb-3 border border-rose-500/30 bg-rose-500/10 px-3 py-2 text-xs text-rose-200">{errorMessage}</div>}
              {actionMessage && <p role="status" className="mb-3 text-xs text-emerald-300">{actionMessage}</p>}

              <div className="overflow-hidden border border-white/10">
                <div className="flex items-center gap-3 border-b border-white/10 bg-white/[0.025] px-3 py-3">
                  <input type="checkbox" aria-label="Select all visible leads" checked={records.length > 0 && selectedIds.length === records.length} onChange={event => selectVisible(event.target.checked)} />
                  <span className="text-[10px] font-bold uppercase tracking-widest text-white/45">Enquiry · status · priority</span>
                  <span className="ml-auto text-[10px] text-white/40">{records.length} loaded</span>
                </div>
                {loading && records.length === 0 ? (
                  <p className="p-8 text-center text-xs text-white/45">Loading contact leads…</p>
                ) : records.length === 0 ? (
                  <p className="p-8 text-center text-xs text-white/45">No contact leads match these filters.</p>
                ) : records.map(record => {
                  const phoneHref = getPhoneHref(record.phone)
                  const whatsappHref = getWhatsAppHref(record.phone)
                  const expanded = expandedId === record.lead_id
                  const history = details[record.lead_id]
                  return (
                    <article key={record.notification_id} className={`border-b border-white/10 last:border-b-0 ${!record.read_at ? 'bg-white/[0.025]' : ''}`}>
                      <div className="grid gap-3 p-3 sm:grid-cols-[auto_minmax(0,1fr)_auto] sm:items-start sm:p-4">
                        <input type="checkbox" aria-label={`Select ${record.full_name}`} checked={selectedIds.includes(record.notification_id)} onChange={event => setSelectedIds(current => event.target.checked
                          ? [...new Set([...current, record.notification_id])]
                          : current.filter(id => id !== record.notification_id))} />
                        <div className="min-w-0">
                          <div className="flex flex-wrap items-center gap-2">
                            <h3 className="font-clash text-sm font-bold">{record.full_name}</h3>
                            {!record.read_at && <span className="rounded-full bg-amber-400/15 px-2 py-0.5 text-[9px] font-bold uppercase tracking-wider text-amber-200">Unread</span>}
                            <span className="text-[10px] text-white/35">{formatDate(record.notification_created_at)}</span>
                          </div>
                          <p className="mt-1 break-words text-xs text-white/65">{record.message}</p>
                          <p className="mt-2 text-[10px] text-white/45">
                            {record.phone}{record.email ? ` · ${record.email}` : ''} · {contactLeadServiceOptions.find(option => option.value === record.service_slug)?.label || record.service_slug}
                          </p>
                          {record.follow_up_at && <p className="mt-1 flex items-center gap-1 text-[10px] text-amber-200/75"><CalendarClock className="h-3 w-3" /> Follow-up {formatDate(record.follow_up_at)}</p>}
                          <div className="mt-3 flex flex-wrap gap-2">
                            {phoneHref && <a className={buttonClass} href={phoneHref}><Phone className="h-3 w-3" /> Call</a>}
                            {whatsappHref && <a className={buttonClass} href={whatsappHref} target="_blank" rel="noreferrer"><MessageCircle className="h-3 w-3" /> WhatsApp</a>}
                            {record.email && <a className={buttonClass} href={`mailto:${encodeURIComponent(record.email)}`}><ExternalLink className="h-3 w-3" /> Email</a>}
                            <button type="button" className={buttonClass} onClick={() => setReadState([record.notification_id], !record.read_at)}>
                              {record.read_at ? 'Mark unread' : 'Mark read'}
                            </button>
                            <button type="button" className={buttonClass} aria-expanded={expanded} onClick={() => toggleDetails(record)}>
                              Details {expanded ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                            </button>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-2 sm:w-56 sm:grid-cols-1">
                          <label><span className="sr-only">Status for {record.full_name}</span><select value={record.status} onChange={event => updateLead(record.lead_id, { status: event.target.value })} className={`${controlClass} w-full`}>
                            {STATUS_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                          </select></label>
                          <label><span className="sr-only">Priority for {record.full_name}</span><select value={record.priority} onChange={event => updateLead(record.lead_id, { priority: event.target.value })} className={`${controlClass} w-full`}>
                            {PRIORITY_OPTIONS.map(([value, label]) => <option key={value} value={value}>{label}</option>)}
                          </select></label>
                          <label className="col-span-2 sm:col-span-1"><span className="sr-only">Schedule follow-up for {record.full_name}</span><input type="datetime-local" value={localDateTimeValue(record.follow_up_at)} onChange={event => updateLead(record.lead_id, { follow_up_at: event.target.value ? new Date(event.target.value).toISOString() : null })} className={`${controlClass} w-full`} /></label>
                        </div>
                      </div>

                      {expanded && (
                        <div className="grid gap-5 border-t border-white/10 bg-black/15 p-4 md:grid-cols-2">
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Internal notes</h4>
                            <form className="mt-2 space-y-2" onSubmit={event => { event.preventDefault(); addNote(record.lead_id) }}>
                              <textarea value={noteDraft} onChange={event => setNoteDraft(event.target.value)} maxLength={4000} rows={3} placeholder="Only visible to authorized admins" className="w-full border border-white/15 bg-[#161616] p-3 text-xs text-white outline-none focus:border-white/40" />
                              <button type="submit" className={buttonClass} disabled={noteBusy || !noteDraft.trim()}>{noteBusy ? 'Saving…' : 'Add private note'}</button>
                            </form>
                            <ul className="mt-3 space-y-2">
                              {history?.notes?.map(note => <li key={note.id} className="border-l border-white/20 pl-3 text-xs">
                                <p className="whitespace-pre-wrap text-white/75">{note.note}</p>
                                <time className="mt-1 block text-[9px] text-white/35">{formatDate(note.created_at)}</time>
                              </li>)}
                              {history && !history.notes.length && <li className="text-xs text-white/35">No notes yet.</li>}
                            </ul>
                          </div>
                          <div>
                            <h4 className="text-[10px] font-bold uppercase tracking-widest text-white/50">Activity</h4>
                            <ul className="mt-3 space-y-3">
                              {history?.activity?.map(activity => <li key={activity.id} className="border-l border-white/20 pl-3 text-xs">
                                <p className="text-white/70">{activity.action_type.replaceAll('_', ' ')}</p>
                                {activity.metadata?.from && <p className="mt-1 text-[10px] text-white/40">{activity.metadata.from} → {activity.metadata.to}</p>}
                                {activity.metadata?.follow_up_at && <p className="mt-1 text-[10px] text-white/40">Follow-up {formatDate(activity.metadata.follow_up_at)}</p>}
                                <time className="mt-1 block text-[9px] text-white/35">{formatDate(activity.created_at)}</time>
                              </li>)}
                              {history && !history.activity.length && <li className="text-xs text-white/35">No activity yet.</li>}
                            </ul>
                          </div>
                        </div>
                      )}
                    </article>
                  )
                })}
              </div>

              {hasMore && (
                <div className="flex justify-center py-4">
                  <button type="button" className={buttonClass} disabled={loadingMore} onClick={() => loadRecords(false)}>
                    <ArrowDown className="h-3.5 w-3.5" /> {loadingMore ? 'Loading…' : 'Load next 10'}
                  </button>
                </div>
              )}
              {metrics?.converted_leads != null && <p className="mt-4 text-right text-[10px] text-white/35">{metrics.converted_leads} converted leads · contact records created {formatDate(records[0]?.lead_created_at)}</p>}
            </div>
          </section>
        </div>
      )}
    </>
  )
}

export default AdminLeadsPanel
