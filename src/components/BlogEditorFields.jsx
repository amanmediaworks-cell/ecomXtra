import { useState } from 'react'
import BlogMarkdown from './BlogMarkdown'
import { slugifyBlogTitle } from '../data/blogPostUtils'

function BlogEditorFields({ article, onChange, inputClassName, labelClassName, suggestSlug = false }) {
  const [slugEdited, setSlugEdited] = useState(Boolean(article.slug) && !suggestSlug)
  const [showPreview, setShowPreview] = useState(false)

  const updateField = (field, value) => {
    if (field === 'slug') setSlugEdited(true)
    onChange(current => {
      const updated = { ...current, [field]: value }
      if (field === 'title' && suggestSlug && !slugEdited) {
        updated.slug = slugifyBlogTitle(value)
      }
      return updated
    })
  }

  const textField = (field, label, options = {}) => (
    <label className={options.wrapperClass || ''}>
      <span className={labelClassName}>{label}</span>
      <input
        value={field === 'tags' && Array.isArray(article[field])
          ? article[field].join(', ')
          : article[field] ?? ''}
        onChange={event => updateField(field, event.target.value)}
        maxLength={options.maxLength}
        required={options.required}
        type={options.type || 'text'}
        placeholder={options.placeholder}
        className={inputClassName}
      />
      {options.hint && <span className="mt-1 block text-[9px] text-[#f2f2f2]/35">{options.hint}</span>}
    </label>
  )

  const textArea = (field, label, options = {}) => (
    <label className={options.wrapperClass || ''}>
      <span className={labelClassName}>{label}</span>
      <textarea
        rows={options.rows || 3}
        value={article[field] ?? ''}
        onChange={event => updateField(field, event.target.value)}
        maxLength={options.maxLength}
        required={options.required}
        placeholder={options.placeholder}
        className={`${inputClassName} resize-y`}
      />
      {options.hint && <span className="mt-1 block text-[9px] text-[#f2f2f2]/35">{options.hint}</span>}
    </label>
  )

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {textField('title', 'Article Title', { wrapperClass: 'sm:col-span-2', required: true })}
        <label>
          <span className={labelClassName}>Category</span>
          <select
            value={article.category || 'AI Automation'}
            onChange={event => updateField('category', event.target.value)}
            className={inputClassName}
          >
            {['AI Automation', 'Shopify & Tech', 'Marketplace SEO', 'CRO & Growth'].map(category => (
              <option key={category}>{category}</option>
            ))}
          </select>
        </label>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {textField('author', 'Author Name')}
        {textField('authorRole', 'Author Role')}
        {textField('readTime', 'Read Time')}
        {textField('tags', 'Tags (comma-separated)')}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {textField('coverImage', 'Cover Image URL', { placeholder: 'https://... or /image.png' })}
        {textField('socialImage', 'Social-sharing Image URL', {
          placeholder: article.coverImage || 'Defaults to the cover image',
          hint: 'If blank, the cover image is used.',
        })}
      </div>

      {textArea('excerpt', 'Excerpt / Summary', { rows: 2, required: true })}

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {textField('slug', 'URL Slug', {
          required: true,
          placeholder: 'readable-lowercase-slug',
          hint: 'Suggested from the title. Change it only when you intend to change the article URL.',
        })}
        {textField('canonicalUrl', 'Canonical URL (optional)', {
          placeholder: 'https://example.com/blog/article-slug',
        })}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <label>
          <span className={labelClassName}>SEO Title</span>
          <input
            value={article.seoTitle || ''}
            onChange={event => updateField('seoTitle', event.target.value)}
            maxLength={60}
            placeholder={article.title || 'Defaults to the article title'}
            className={inputClassName}
          />
          <span className="mt-1 block text-[9px] text-[#f2f2f2]/35">
            {article.seoTitle?.length || 0}/60 characters; aim for 50–60.
          </span>
        </label>
        <label>
          <span className={labelClassName}>Meta Description</span>
          <textarea
            rows={2}
            value={article.metaDescription || ''}
            onChange={event => updateField('metaDescription', event.target.value)}
            maxLength={160}
            placeholder={article.excerpt || 'Defaults to the article excerpt'}
            className={`${inputClassName} resize-y`}
          />
          <span className="mt-1 block text-[9px] text-[#f2f2f2]/35">
            {article.metaDescription?.length || 0}/160 characters; aim for 150–160.
          </span>
        </label>
      </div>

      <label className="block">
        <span className={labelClassName}>Publishing Status</span>
        <select
          value={article.is_published ? 'published' : 'draft'}
          onChange={event => updateField('is_published', event.target.value === 'published')}
          className={inputClassName}
        >
          <option value="draft">Draft — only visible in admin</option>
          <option value="published">Published — visible to visitors</option>
        </select>
      </label>

      <div>
        <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
          <span className={labelClassName}>Full Article Body (Markdown supported)</span>
          <button
            type="button"
            onClick={() => setShowPreview(value => !value)}
            className="text-[9px] font-bold uppercase tracking-wider text-violet-300 hover:text-violet-200"
          >
            {showPreview ? 'Edit Markdown' : 'Preview Markdown'}
          </button>
        </div>
        {showPreview ? (
          <div className="min-h-40 border border-[#f2f2f2]/15 bg-[#1a1a1a] p-4 text-[#f2f2f2]">
            {article.content
              ? <div className="prose prose-invert max-w-none"><BlogMarkdown content={article.content} /></div>
              : <p className="text-xs text-[#f2f2f2]/40">Markdown preview will appear here.</p>}
          </div>
        ) : (
          <textarea
            rows={8}
            value={article.content || ''}
            onChange={event => updateField('content', event.target.value)}
            required
            placeholder={'### Section Heading\n\nDetailed explanation and breakdown...\n\n> Key insight or quote\n\n* Action item 1\n* Action item 2'}
            className={`${inputClassName} font-mono text-[11px] leading-relaxed resize-y`}
          />
        )}
      </div>
    </div>
  )
}

export default BlogEditorFields
