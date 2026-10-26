import { Plus, Trash2 } from 'lucide-react'

function TextField({ label, value, onChange, multiline = false, rows = 3, className }) {
  const controlClass = 'w-full rounded-md border border-white/15 bg-[#111] px-3 py-2.5 text-xs text-white outline-none focus:border-[#ffc46d]'
  return (
    <label className={`block ${className || ''}`}>
      <span className="mb-1.5 block text-[10px] font-bold uppercase tracking-[0.16em] text-white/55">{label}</span>
      {multiline ? (
        <textarea
          rows={rows}
          value={value ?? ''}
          onChange={event => onChange(event.target.value)}
          className={`${controlClass} resize-y`}
        />
      ) : (
        <input
          value={value ?? ''}
          onChange={event => onChange(event.target.value)}
          className={controlClass}
        />
      )}
    </label>
  )
}

function EditorSection({ title, children }) {
  return (
    <section className="space-y-4 border-t border-white/10 pt-5 first:border-t-0 first:pt-0">
      <h4 className="text-[11px] font-black uppercase tracking-[0.16em] text-[#ffc46d]">{title}</h4>
      {children}
    </section>
  )
}

function ListEditor({ title, items = [], fields, onChange }) {
  const updateItem = (index, field, value) => {
    onChange(items.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: value } : item))
  }
  const addItem = () => {
    onChange([...items, Object.fromEntries(fields.map(field => [field.key, '']))])
  }

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between gap-3">
        <p className="text-xs font-semibold text-white/80">{title}</p>
        <button type="button" onClick={addItem} className="inline-flex items-center gap-1.5 rounded border border-white/15 px-2.5 py-1.5 text-[10px] font-bold text-white hover:border-[#ffc46d]">
          <Plus className="h-3.5 w-3.5" /> Add item
        </button>
      </div>
      {items.map((item, index) => (
        <div key={`${title}-${index}`} className="grid gap-3 rounded-lg border border-white/10 bg-white/[0.025] p-3 sm:grid-cols-[1fr_auto]">
          <div className="space-y-3">
            {fields.map(field => (
              <TextField
                key={field.key}
                label={`${index + 1}. ${field.label}`}
                value={item[field.key]}
                onChange={value => updateItem(index, field.key, value)}
                multiline={field.multiline}
                rows={field.rows}
              />
            ))}
          </div>
          <button type="button" onClick={() => onChange(items.filter((_, itemIndex) => itemIndex !== index))} aria-label={`Remove ${title} ${index + 1}`} className="h-9 rounded border border-red-400/20 px-2.5 text-red-300 hover:bg-red-500/10">
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      ))}
    </div>
  )
}

function splitParagraphs(value) {
  return value.split(/\n\s*\n/).map(paragraph => paragraph.trim()).filter(Boolean)
}

function ServicePageEditor({ details, onChange }) {
  const update = (section, field, value) => {
    onChange({
      ...details,
      [section]: { ...details[section], [field]: value },
    })
  }

  return (
    <div className="mt-5 space-y-6 rounded-xl border border-white/10 bg-[#111] p-4 sm:p-5">
      <EditorSection title="Hero section">
        <TextField label="Eyebrow" value={details.hero?.eyebrow} onChange={value => update('hero', 'eyebrow', value)} />
        <TextField label="Headline" value={details.hero?.title} onChange={value => update('hero', 'title', value)} />
        <TextField label="Introduction" value={details.hero?.description} onChange={value => update('hero', 'description', value)} multiline rows={4} />
        <TextField label="Image URL" value={details.hero?.imageUrl} onChange={value => update('hero', 'imageUrl', value)} />
        <TextField label="Image alt text" value={details.hero?.imageAlt} onChange={value => update('hero', 'imageAlt', value)} />
      </EditorSection>

      <EditorSection title="Service overview">
        <TextField label="Heading" value={details.overview?.title} onChange={value => update('overview', 'title', value)} />
        <TextField
          label="Article paragraphs (separate paragraphs with a blank line)"
          value={(details.overview?.paragraphs || []).join('\n\n')}
          onChange={value => update('overview', 'paragraphs', splitParagraphs(value))}
          multiline
          rows={7}
        />
      </EditorSection>

      <EditorSection title="Services included cards">
        <TextField label="Heading" value={details.included?.title} onChange={value => update('included', 'title', value)} />
        <TextField label="Intro" value={details.included?.intro} onChange={value => update('included', 'intro', value)} multiline rows={2} />
        <ListEditor
          title="Service cards"
          items={details.included?.items}
          fields={[
            { key: 'title', label: 'Card title' },
            { key: 'description', label: 'Card description', multiline: true, rows: 3 },
          ]}
          onChange={items => update('included', 'items', items)}
        />
      </EditorSection>

      <EditorSection title="Featured service article">
        <TextField label="Heading" value={details.feature?.title} onChange={value => update('feature', 'title', value)} />
        <TextField label="Article body" value={details.feature?.body} onChange={value => update('feature', 'body', value)} multiline rows={6} />
        <TextField label="Bullet points (one per line)" value={(details.feature?.bullets || []).join('\n')} onChange={value => update('feature', 'bullets', value.split('\n').map(line => line.trim()).filter(Boolean))} multiline rows={4} />
        <TextField label="Image URL" value={details.feature?.imageUrl} onChange={value => update('feature', 'imageUrl', value)} />
        <TextField label="Image alt text" value={details.feature?.imageAlt} onChange={value => update('feature', 'imageAlt', value)} />
      </EditorSection>

      <EditorSection title="Why choose this service">
        <TextField label="Heading" value={details.benefits?.title} onChange={value => update('benefits', 'title', value)} />
        <TextField label="Intro" value={details.benefits?.intro} onChange={value => update('benefits', 'intro', value)} multiline rows={2} />
        <ListEditor
          title="Benefits"
          items={details.benefits?.items}
          fields={[
            { key: 'title', label: 'Benefit title' },
            { key: 'description', label: 'Description', multiline: true, rows: 3 },
          ]}
          onChange={items => update('benefits', 'items', items)}
        />
      </EditorSection>

      <EditorSection title="Who this service is for">
        <TextField label="Heading" value={details.audience?.title} onChange={value => update('audience', 'title', value)} />
        <TextField label="Intro" value={details.audience?.intro} onChange={value => update('audience', 'intro', value)} multiline rows={2} />
        <ListEditor
          title="Seller groups"
          items={details.audience?.items}
          fields={[
            { key: 'title', label: 'Group title' },
            { key: 'description', label: 'Description', multiline: true, rows: 3 },
          ]}
          onChange={items => update('audience', 'items', items)}
        />
      </EditorSection>

      <EditorSection title="Process steps and articles">
        <TextField label="Heading" value={details.process?.title} onChange={value => update('process', 'title', value)} />
        <TextField label="Intro" value={details.process?.intro} onChange={value => update('process', 'intro', value)} multiline rows={2} />
        <ListEditor
          title="Process steps"
          items={details.process?.steps}
          fields={[
            { key: 'title', label: 'Step title' },
            { key: 'summary', label: 'Short summary', multiline: true, rows: 2 },
            { key: 'article', label: 'Read-more article', multiline: true, rows: 5 },
          ]}
          onChange={items => update('process', 'steps', items)}
        />
      </EditorSection>

      <EditorSection title="Frequently asked questions">
        <TextField label="Heading" value={details.faq?.title} onChange={value => update('faq', 'title', value)} />
        <ListEditor
          title="Questions and answers"
          items={details.faq?.items}
          fields={[
            { key: 'question', label: 'Question', multiline: true, rows: 2 },
            { key: 'answer', label: 'Answer', multiline: true, rows: 4 },
          ]}
          onChange={items => update('faq', 'items', items)}
        />
      </EditorSection>

      <EditorSection title="Search and sharing metadata">
        <TextField label="SEO title" value={details.seo?.title} onChange={value => update('seo', 'title', value)} />
        <TextField label="Meta description" value={details.seo?.description} onChange={value => update('seo', 'description', value)} multiline rows={2} />
      </EditorSection>
    </div>
  )
}

export default ServicePageEditor
