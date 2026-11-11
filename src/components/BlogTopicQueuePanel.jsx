import { useEffect, useState } from 'react'
import { Check, Pencil, Plus, RefreshCw, X } from 'lucide-react'
import { supabase } from '../src/lib/supabase'
import { marketplaceServiceDefaults } from '../data/marketplaceServiceContent'
import { BLOG_SEARCH_INTENTS, BLOG_TOPIC_STATUSES, getBlogTopicValidationIssues } from '../data/blogTopicQueue'

const marketplaces = marketplaceServiceDefaults.map(service => ({
  name: service.title.replace(' Account Management Services', ''),
  url: `https://ecomxtra.in/services/${service.slug}`,
}))

function createEmptyTopic() {
  return {
    primary_keyword: '',
    marketplace: marketplaces[0]?.name || '',
    search_intent: 'seller_education',
    target_audience: '',
    content_type: 'Practical seller guide',
    proposed_title: '',
    secondary_keywords: '',
    existing_competing_page: '',
    target_internal_url: marketplaces[0]?.url || '',
    priority: 3,
    evidence_source: '',
    status: 'proposed',
  }
}

function toTopicForm(topic) {
  return {
    ...topic,
    secondary_keywords: (topic.secondary_keywords || []).join(', '),
    existing_competing_page: topic.existing_competing_page || '',
    priority: topic.priority || 3,
  }
}

function getTopicPayload(form) {
  return {
    primary_keyword: form.primary_keyword.trim(),
    marketplace: form.marketplace,
    search_intent: form.search_intent,
    target_audience: form.target_audience.trim(),
    content_type: form.content_type.trim(),
    proposed_title: form.proposed_title.trim(),
    secondary_keywords: form.secondary_keywords
      .split(',')
      .map(keyword => keyword.trim())
      .filter(Boolean),
    existing_competing_page: form.existing_competing_page.trim() || null,
    target_internal_url: form.target_internal_url,
    priority: Number(form.priority),
    evidence_source: form.evidence_source.trim(),
    status: form.status,
    last_reviewed_at: new Date().toISOString(),
  }
}

const serviceUrlByMarketplace = Object.fromEntries(marketplaces.map(item => [item.name, item.url]))
const editableStatuses = BLOG_TOPIC_STATUSES.filter(status => status !== 'generating')

export default function BlogTopicQueuePanel() {
  const [topics, setTopics] = useState([])
  const [form, setForm] = useState(createEmptyTopic)
  const [editingId, setEditingId] = useState(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [notice, setNotice] = useState('')

  const loadTopics = async () => {
    setLoading(true)
    setError('')
    try {
      const { data, error: loadError } = await supabase
        .from('blog_topic_queue')
        .select('*')
        .order('priority', { ascending: false })
        .order('created_at', { ascending: true })
      if (loadError) {
        setError(`Unable to load editorial topics: ${loadError.message}`)
      } else {
        setTopics(data || [])
      }
    } catch (loadError) {
      setError(`Unable to load editorial topics: ${loadError.message}`)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    let active = true
    supabase
      .from('blog_topic_queue')
      .select('*')
      .order('priority', { ascending: false })
      .order('created_at', { ascending: true })
      .then(({ data, error: loadError }) => {
        if (!active) return
        if (loadError) {
          setError(`Unable to load editorial topics: ${loadError.message}`)
        } else {
          setTopics(data || [])
        }
        setLoading(false)
      })
      .catch(loadError => {
        if (!active) return
        setError(`Unable to load editorial topics: ${loadError.message}`)
        setLoading(false)
      })
    return () => { active = false }
  }, [])

  const updateForm = (field, value) => {
    setForm(current => {
      const next = { ...current, [field]: value }
      if (field === 'marketplace') {
        next.target_internal_url = marketplaces.find(item => item.name === value)?.url || ''
      }
      return next
    })
  }

  const resetForm = () => {
    setForm(createEmptyTopic())
    setEditingId(null)
  }

  const saveTopic = async event => {
    event.preventDefault()
    setError('')
    setNotice('')
    const payload = getTopicPayload(form)
    const issues = getBlogTopicValidationIssues(
      payload,
      marketplaces.map(item => item.name),
      marketplaces.map(item => item.url),
      serviceUrlByMarketplace,
    )
    if (issues.length) {
      setError(issues.join(' '))
      return
    }

    setSaving(true)
    try {
      const request = editingId
        ? supabase.from('blog_topic_queue').update(payload).eq('id', editingId)
        : supabase.from('blog_topic_queue').insert(payload)
      const { data, error: saveError } = await request.select('*').single()
      if (saveError) {
        setError(`Unable to save editorial topic: ${saveError.message}`)
        return
      }

      setTopics(current => editingId
        ? current.map(topic => topic.id === editingId ? data : topic)
        : [...current, data].sort((left, right) => right.priority - left.priority))
      setNotice(editingId ? 'Editorial topic updated.' : 'Editorial topic added.')
      resetForm()
    } catch (saveError) {
      setError(`Unable to save editorial topic: ${saveError.message}`)
    } finally {
      setSaving(false)
    }
  }

  const inputClass = 'w-full border border-[#f2f2f2]/15 bg-[#1a1a1a] p-2.5 text-xs text-[#f2f2f2] focus:border-[#f2f2f2]/40 focus:outline-none'
  const labelClass = 'mb-1.5 block text-[10px] font-black uppercase tracking-[0.2em] text-[#f2f2f2]/45'

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-clash text-xl font-bold tracking-tight text-[#f2f2f2]">SEO Editorial Topic Queue</h2>
        <p className="mt-1 max-w-3xl text-xs leading-relaxed text-[#f2f2f2]/45">
          Only approved, distinct seller topics can enter generation. Search Console evidence is observational, not search-volume or ranking-potential data.
        </p>
      </header>

      {(error || notice) && (
        <p role={error ? 'alert' : 'status'} className={`border p-3 text-xs ${error ? 'border-red-500/30 text-red-300' : 'border-green-500/30 text-green-300'}`}>
          {error || notice}
        </p>
      )}

      <form onSubmit={saveTopic} className="grid gap-4 border border-[#f2f2f2]/10 bg-[#141414] p-5 md:grid-cols-2">
        <label>
          <span className={labelClass}>Primary keyword</span>
          <input className={inputClass} required maxLength={160} value={form.primary_keyword} onChange={event => updateForm('primary_keyword', event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Marketplace</span>
          <select className={inputClass} value={form.marketplace} onChange={event => updateForm('marketplace', event.target.value)}>
            {marketplaces.map(item => <option key={item.name} value={item.name}>{item.name}</option>)}
          </select>
        </label>
        <label>
          <span className={labelClass}>Search intent</span>
          <select className={inputClass} value={form.search_intent} onChange={event => updateForm('search_intent', event.target.value)}>
            {BLOG_SEARCH_INTENTS.map(intent => <option key={intent} value={intent}>{intent.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
        <label>
          <span className={labelClass}>Editorial status</span>
          <select className={inputClass} value={form.status} onChange={event => updateForm('status', event.target.value)}>
            {editableStatuses.map(status => <option key={status} value={status}>{status.replaceAll('_', ' ')}</option>)}
          </select>
        </label>
        <label>
          <span className={labelClass}>Target audience</span>
          <input className={inputClass} required value={form.target_audience} onChange={event => updateForm('target_audience', event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Content type</span>
          <input className={inputClass} required value={form.content_type} onChange={event => updateForm('content_type', event.target.value)} />
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Proposed title</span>
          <input className={inputClass} required value={form.proposed_title} onChange={event => updateForm('proposed_title', event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Related secondary keywords (comma separated)</span>
          <input className={inputClass} value={form.secondary_keywords} onChange={event => updateForm('secondary_keywords', event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Priority (1–5)</span>
          <input className={inputClass} type="number" min="1" max="5" step="1" value={form.priority} onChange={event => updateForm('priority', event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Existing competing page (optional)</span>
          <input className={inputClass} type="url" value={form.existing_competing_page} onChange={event => updateForm('existing_competing_page', event.target.value)} />
        </label>
        <label>
          <span className={labelClass}>Target internal service URL</span>
          <select className={inputClass} value={form.target_internal_url} onChange={event => updateForm('target_internal_url', event.target.value)}>
            {marketplaces.map(item => <option key={item.url} value={item.url}>{item.name} service page</option>)}
          </select>
        </label>
        <label className="md:col-span-2">
          <span className={labelClass}>Keyword evidence source (include date and observed metrics, if available)</span>
          <textarea className={inputClass} required rows={3} value={form.evidence_source} onChange={event => updateForm('evidence_source', event.target.value)} />
        </label>
        <div className="flex flex-wrap gap-2 md:col-span-2">
          <button type="submit" disabled={saving} className="inline-flex items-center gap-2 bg-[#f2f2f2] px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#111] disabled:opacity-50">
            {saving ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : editingId ? <Check className="h-3.5 w-3.5" /> : <Plus className="h-3.5 w-3.5" />}
            {saving ? 'Saving' : editingId ? 'Save changes' : 'Add topic'}
          </button>
          {editingId && (
            <button type="button" onClick={resetForm} className="inline-flex items-center gap-2 border border-[#f2f2f2]/15 px-4 py-2 text-[10px] font-black uppercase tracking-widest text-[#f2f2f2]/70">
              <X className="h-3.5 w-3.5" /> Cancel
            </button>
          )}
        </div>
      </form>

      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-[10px] font-black uppercase tracking-[0.25em] text-[#f2f2f2]/40">{topics.length} editorial topics</h3>
          <button type="button" onClick={() => void loadTopics()} disabled={loading} className="inline-flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#f2f2f2]/55 disabled:opacity-40">
            <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} /> Refresh
          </button>
        </div>
        {loading ? <p className="text-xs text-[#f2f2f2]/40">Loading topics…</p> : topics.map(topic => (
          <article key={topic.id} className="flex flex-col gap-3 border border-[#f2f2f2]/10 bg-[#141414] p-4 sm:flex-row sm:items-start sm:justify-between">
            <div className="min-w-0">
              <div className="mb-1 flex flex-wrap items-center gap-2">
                <span className="border border-[#f2f2f2]/15 px-2 py-0.5 text-[9px] uppercase tracking-wider text-[#f2f2f2]/65">{topic.status.replaceAll('_', ' ')}</span>
                <span className="text-[9px] uppercase tracking-wider text-[#f2f2f2]/35">{topic.marketplace} · priority {topic.priority}</span>
              </div>
              <h4 className="text-sm font-bold text-[#f2f2f2]">{topic.primary_keyword}</h4>
              <p className="mt-1 text-xs text-[#f2f2f2]/55">{topic.proposed_title}</p>
              <p className="mt-2 break-words text-[10px] leading-relaxed text-[#f2f2f2]/35">{topic.evidence_source}</p>
            </div>
            <button
              type="button"
              onClick={() => { setEditingId(topic.id); setForm(toTopicForm(topic)); setError(''); setNotice('') }}
              disabled={topic.status === 'generating'}
              className="inline-flex shrink-0 items-center gap-2 self-start border border-[#f2f2f2]/15 px-3 py-2 text-[10px] uppercase tracking-wider text-[#f2f2f2]/70 hover:border-[#f2f2f2]/35 disabled:cursor-not-allowed disabled:opacity-40"
            >
              <Pencil className="h-3 w-3" /> Edit
            </button>
          </article>
        ))}
        {!loading && topics.length === 0 && <p className="border border-dashed border-[#f2f2f2]/15 p-5 text-xs text-[#f2f2f2]/40">No topics yet. Add evidence-backed topics and approve only those that do not overlap an existing page.</p>}
      </div>
    </section>
  )
}
