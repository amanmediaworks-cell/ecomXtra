import { useState } from 'react'

const multiLineFields = new Set(['description', 'subheading', 'heading', 'companyDescription', 'copyright'])

function formatLabel(value) {
  return value
    .replace(/([A-Z])/g, ' $1')
    .replace(/[_-]/g, ' ')
    .replace(/^./, character => character.toUpperCase())
}

function isValidContentUrl(value, allowRelative = true) {
  if (typeof value !== 'string' || !value.trim()) return true
  if (allowRelative && value.startsWith('/') && !value.startsWith('//')) return true
  try {
    const url = new URL(value)
    return ['http:', 'https:'].includes(url.protocol)
  } catch {
    return false
  }
}

function WebsiteContentEditor({ sections, onSave, isSaving, isLoading, errorMessage, successMessage }) {
  const [selectedKey, setSelectedKey] = useState(sections[0]?.content_key || '')
  const selectedSection = sections.find(section => section.content_key === selectedKey) || sections[0]

  if (!selectedSection) return null

  return (
    <section className="space-y-6">
      <header>
        <h2 className="font-clash text-xl font-bold text-[#f2f2f2]">Website Content</h2>
        <p className="mt-1 text-xs text-[#f2f2f2]/45">
          Edit site sections, visibility, and display order. Structured fields use JSON arrays/objects.
        </p>
      </header>

      <label className="block max-w-xl">
        <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[#f2f2f2]/45">Section</span>
        <select
          value={selectedSection.content_key}
          onChange={event => setSelectedKey(event.target.value)}
          className="w-full border border-[#f2f2f2]/15 bg-[#1a1a1a] p-3 text-xs text-[#f2f2f2]"
        >
          {sections.map(section => (
            <option key={section.content_key} value={section.content_key}>
              {formatLabel(section.content_key)}
            </option>
          ))}
        </select>
      </label>

      {errorMessage && <p role="alert" className="border border-red-500/30 bg-red-500/5 p-3 text-xs text-red-300">{errorMessage}</p>}
      {successMessage && <p role="status" className="border border-green-500/30 bg-green-500/5 p-3 text-xs text-green-300">{successMessage}</p>}
      {isLoading && <p role="status" className="text-xs text-[#f2f2f2]/50">Loading website content…</p>}
      <WebsiteContentForm
        key={`${selectedSection.content_key}:${selectedSection.updated_at || 'default'}`}
        section={selectedSection}
        onSave={onSave}
        isSaving={isSaving}
        isLoading={isLoading}
      />
    </section>
  )
}

function WebsiteContentForm({ section, onSave, isSaving, isLoading }) {
  const [draft, setDraft] = useState(() => ({
    ...section,
    content: structuredClone(section.content),
  }))
  const [structuredInputs, setStructuredInputs] = useState(() => Object.fromEntries(
    Object.entries(section.content)
      .filter(([, value]) => typeof value === 'object' && value !== null)
      .map(([key, value]) => [key, JSON.stringify(value, null, 2)]),
  ))
  const [jsonError, setJsonError] = useState('')

  const updateContentValue = (field, value) => {
    setDraft(current => ({
      ...current,
      content: { ...current.content, [field]: value },
    }))
  }

  const handleSubmit = async event => {
    event.preventDefault()
    setJsonError('')
    if (!Number.isInteger(draft.display_order) || draft.display_order < 0) {
      setJsonError('Display order must be a non-negative whole number.')
      return
    }
    const content = { ...draft.content }
    try {
      for (const [field, text] of Object.entries(structuredInputs)) {
        content[field] = JSON.parse(text)
      }
    } catch (error) {
      setJsonError(`Invalid JSON in a structured field: ${error.message}`)
      return
    }
    for (const [field, value] of Object.entries(content)) {
      if (/(url|imageurl|socialimage|href)$/i.test(field) && !isValidContentUrl(value)) {
        setJsonError(`${formatLabel(field)} must be an http(s) URL or a site-relative path.`)
        return
      }
      if (Array.isArray(value)) {
        const requiredLinkFields = {
          buttons: ['label', 'href'],
          navigationLinks: ['label', 'path'],
          socialLinks: ['label', 'url'],
        }[field]
        if (requiredLinkFields) {
          const [labelField, urlField] = requiredLinkFields
          const hasInvalidLink = value.some(item => {
            if (!item || typeof item !== 'object' || Array.isArray(item)) return true
            if (typeof item[labelField] !== 'string' || !item[labelField].trim()) return true
            if (typeof item[urlField] !== 'string' || !item[urlField].trim()) return true
            if (field === 'navigationLinks') {
              return !item.path.startsWith('/') || item.path.startsWith('//')
            }
            return !isValidContentUrl(item[urlField], field === 'buttons')
          })
          if (hasInvalidLink) {
            setJsonError(`${formatLabel(field)} entries need a label and a valid link.`)
            return
          }
        }
      }
    }
    await onSave({ ...draft, content })
  }

  return (
    <>
      {jsonError && <p role="alert" className="text-xs text-red-300">{jsonError}</p>}
      <form onSubmit={handleSubmit} className="max-w-4xl space-y-5 border border-[#f2f2f2]/10 bg-[#141414] p-6">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <label>
            <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[#f2f2f2]/45">Display order</span>
            <input
              type="number"
              value={draft.display_order}
              onChange={event => setDraft(current => ({ ...current, display_order: Number(event.target.value) }))}
              className="w-full border border-[#f2f2f2]/15 bg-[#1a1a1a] p-3 text-xs text-[#f2f2f2]"
            />
          </label>
          <label className="flex items-end gap-3 pb-3 text-xs text-[#f2f2f2]/70">
            <input
              type="checkbox"
              checked={draft.is_public}
              onChange={event => setDraft(current => ({ ...current, is_public: event.target.checked }))}
              className="h-4 w-4 accent-violet-500"
            />
            Visible to public visitors
          </label>
        </div>

        {Object.entries(draft.content).map(([field, value]) => {
          const isStructured = typeof value === 'object' && value !== null
          const controlValue = isStructured ? structuredInputs[field] ?? JSON.stringify(value, null, 2) : String(value ?? '')
          return (
            <label key={field} className="block">
              <span className="mb-2 block text-[10px] font-black uppercase tracking-widest text-[#f2f2f2]/45">
                {formatLabel(field)}{field.toLowerCase().includes('image') || field.toLowerCase().includes('url') ? ' (URL)' : ''}
              </span>
              {isStructured || field === 'imageUrl' || multiLineFields.has(field) ? (
                <textarea
                  rows={isStructured ? 10 : multiLineFields.has(field) ? 4 : 2}
                  value={controlValue}
                  onChange={event => {
                    const text = event.target.value
                    if (!isStructured) {
                      updateContentValue(field, text)
                      return
                    }
                    setStructuredInputs(current => ({ ...current, [field]: text }))
                    setJsonError('')
                  }}
                  className="w-full resize-y border border-[#f2f2f2]/15 bg-[#1a1a1a] p-3 font-mono text-xs text-[#f2f2f2]"
                />
              ) : (
                <input
                  type="text"
                  value={controlValue}
                  onChange={event => updateContentValue(field, event.target.value)}
                  className="w-full border border-[#f2f2f2]/15 bg-[#1a1a1a] p-3 text-xs text-[#f2f2f2]"
                />
              )}
            </label>
          )
        })}

        <button
          type="submit"
          disabled={isSaving || isLoading || Boolean(jsonError)}
          className="bg-[#f2f2f2] px-5 py-3 text-[10px] font-black uppercase tracking-widest text-[#111111] disabled:cursor-not-allowed disabled:opacity-50"
        >
          {isSaving ? 'Saving…' : 'Save Section'}
        </button>
      </form>
    </>
  )
}

export default WebsiteContentEditor
