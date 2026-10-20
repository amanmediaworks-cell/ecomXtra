import React from 'react'

function renderInline(text, keyPrefix = '') {
  if (!text) return null
  const regex = /(\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\*\*([^*]+)\*\*|`([^`]+)`|\*([^*]+)\*)/g
  const parts = []
  let lastIndex = 0
  let match
  let i = 0

  while ((match = regex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.slice(lastIndex, match.index))
    }
    const [full, , linkText, linkUrl, boldText, codeText, italicText] = match
    if (linkText && linkUrl) {
      parts.push(
        <a
          key={`${keyPrefix}-l-${i++}`}
          href={linkUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="text-violet-600 hover:text-violet-800 underline font-semibold transition-colors"
        >
          {linkText}
        </a>,
      )
    } else if (boldText) {
      parts.push(
        <strong key={`${keyPrefix}-b-${i++}`} className="font-bold text-slate-900">
          {boldText}
        </strong>,
      )
    } else if (codeText) {
      parts.push(
        <code key={`${keyPrefix}-c-${i++}`} className="px-1.5 py-0.5 rounded-md bg-slate-100 text-violet-700 font-mono text-xs border border-slate-200">
          {codeText}
        </code>,
      )
    } else if (italicText) {
      parts.push(
        <em key={`${keyPrefix}-i-${i++}`} className="italic text-slate-800">
          {italicText}
        </em>,
      )
    }
    lastIndex = match.index + full.length
  }

  if (lastIndex < text.length) {
    parts.push(text.slice(lastIndex))
  }

  return parts.length > 0 ? parts : text
}

function BlogMarkdown({ content = '' }) {
  if (!content) return null

  const elements = []
  const rawLines = String(content).replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n')
  let key = 0
  let listBuffer = []
  let listType = null // 'ul' | 'ol'
  let quoteBuffer = []

  const flushList = () => {
    if (!listBuffer.length) return
    const currentBuffer = [...listBuffer]
    const currentType = listType
    const listKey = `list-${key++}`

    if (currentType === 'ol') {
      elements.push(
        <ol key={listKey} className="my-5 space-y-2.5 pl-1">
          {currentBuffer.map((item, idx) => (
            <li key={`ol-${idx}`} className="flex items-start gap-3 text-slate-700 text-base sm:text-[17px] leading-relaxed">
              <span className="w-5 h-5 rounded-full bg-violet-100 text-violet-700 text-xs font-bold flex items-center justify-center flex-shrink-0 mt-0.5 shadow-xs">
                {idx + 1}
              </span>
              <span className="flex-1">{renderInline(item, `${listKey}-${idx}`)}</span>
            </li>
          ))}
        </ol>,
      )
    } else {
      elements.push(
        <ul key={listKey} className="my-5 space-y-2.5 pl-1">
          {currentBuffer.map((item, idx) => (
            <li key={`ul-${idx}`} className="flex items-start gap-3 text-slate-700 text-base sm:text-[17px] leading-relaxed">
              <span className="w-2 h-2 rounded-full bg-violet-600 flex-shrink-0 mt-2.5 shadow-xs"></span>
              <span className="flex-1">{renderInline(item, `${listKey}-${idx}`)}</span>
            </li>
          ))}
        </ul>,
      )
    }
    listBuffer = []
    listType = null
  }

  const flushQuote = () => {
    if (!quoteBuffer.length) return
    const currentQuote = quoteBuffer.join(' ')
    const quoteKey = `quote-${key++}`
    elements.push(
      <blockquote
        key={quoteKey}
        className="my-6 p-5 border-l-4 border-violet-600 bg-gradient-to-r from-violet-50/90 via-purple-50/40 to-transparent rounded-r-2xl text-slate-800 italic leading-relaxed shadow-xs"
      >
        <p className="text-base sm:text-[17px] font-medium text-slate-800">
          {renderInline(currentQuote, quoteKey)}
        </p>
      </blockquote>,
    )
    quoteBuffer = []
  }

  for (let index = 0; index < rawLines.length; index += 1) {
    const rawLine = rawLines[index]
    const trimmed = rawLine.trim()

    // Handle empty line
    if (!trimmed) {
      flushList()
      flushQuote()
      continue
    }

    // Check blockquote: starts with >
    if (trimmed.startsWith('>')) {
      flushList()
      quoteBuffer.push(trimmed.replace(/^>\s*/, ''))
      continue
    } else {
      flushQuote()
    }

    // Check unordered list item: starts with * or -
    if (/^[-*]\s+/.test(trimmed)) {
      if (listType && listType !== 'ul') flushList()
      listType = 'ul'
      listBuffer.push(trimmed.replace(/^[-*]\s+/, ''))
      continue
    }

    // Check ordered list item: starts with 1. 2. etc.
    if (/^\d+\.\s+/.test(trimmed)) {
      if (listType && listType !== 'ol') flushList()
      listType = 'ol'
      listBuffer.push(trimmed.replace(/^\d+\.\s+/, ''))
      continue
    }

    // If not a list item, flush any buffered list
    flushList()

    // Check horizontal rule: --- or ***
    if (/^(?:---|---|\*\*\*)$/.test(trimmed)) {
      elements.push(<hr key={`hr-${key++}`} className="my-10 border-slate-200" />)
      continue
    }

    // Check headings
    // Level 1: # Title
    if (trimmed.startsWith('# ')) {
      elements.push(
        <h1 key={`h1-${key++}`} className="text-3xl sm:text-4xl font-extrabold text-slate-900 tracking-tight mt-10 mb-5">
          {renderInline(trimmed.slice(2), `h1-t-${key}`)}
        </h1>,
      )
      continue
    }

    // Level 2: ## Section
    if (trimmed.startsWith('## ')) {
      const headingText = trimmed.slice(3).trim()
      const isConclusion = /^(?:in\s+|final\s+)?conclusion:?$/i.test(headingText)
      const isFaq = /^(?:frequently\s+asked\s+questions|faqs?)(?:\s*\(faqs?\))?:?$/i.test(headingText)

      if (isConclusion) {
        elements.push(
          <div key={`h2-conc-${key++}`} className="mt-12 pt-8 border-t border-slate-200/80">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-violet-100 text-violet-800 mb-3">
              Strategic Takeaways
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-4">
              {headingText.replace(/:$/, '')}
            </h2>
          </div>,
        )
      } else if (isFaq) {
        elements.push(
          <div key={`h2-faq-${key++}`} className="mt-14 pt-8 border-t border-slate-200/80">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-black uppercase tracking-wider bg-emerald-100 text-emerald-800 mb-3">
              Common Questions
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 tracking-tight mb-6">
              {headingText.replace(/:$/, '')}
            </h2>
          </div>,
        )
      } else {
        elements.push(
          <h2
            key={`h2-${key++}`}
            className="text-2xl sm:text-3xl font-extrabold tracking-tight text-slate-900 mt-10 mb-4 pt-6 border-t border-slate-200/60 first:border-0 first:pt-0"
          >
            {renderInline(headingText, `h2-t-${key}`)}
          </h2>,
        )
      }
      continue
    }

    // Level 3: ### Subsection or FAQ question
    if (trimmed.startsWith('### ')) {
      const subHeadingText = trimmed.slice(4).trim()
      const isFaqQuestion = subHeadingText.endsWith('?')

      if (isFaqQuestion) {
        elements.push(
          <div
            key={`h3-faq-q-${key++}`}
            className="mt-6 mb-3 p-4 sm:p-5 rounded-2xl bg-slate-50 border border-slate-200/70 hover:border-violet-300 hover:bg-violet-50/20 transition-all shadow-xs"
          >
            <h3 className="text-lg sm:text-xl font-bold text-slate-900 flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 rounded-full bg-violet-600 text-white flex items-center justify-center text-xs font-black shadow-xs mt-0.5">
                Q
              </span>
              <span className="flex-1">{renderInline(subHeadingText, `h3-q-${key}`)}</span>
            </h3>
          </div>,
        )
      } else {
        elements.push(
          <h3
            key={`h3-${key++}`}
            className="text-xl sm:text-2xl font-bold tracking-tight text-slate-900 mt-8 mb-3"
          >
            {renderInline(subHeadingText, `h3-t-${key}`)}
          </h3>,
        )
      }
      continue
    }

    // Level 4: #### Sub-subsection
    if (trimmed.startsWith('#### ')) {
      elements.push(
        <h4
          key={`h4-${key++}`}
          className="text-base sm:text-lg font-bold text-violet-800 mt-6 mb-2"
        >
          {renderInline(trimmed.slice(5).trim(), `h4-t-${key}`)}
        </h4>,
      )
      continue
    }

    // Regular Paragraph
    elements.push(
      <p
        key={`p-${key++}`}
        className="text-base sm:text-[17px] leading-relaxed text-slate-700 mb-5 font-normal"
      >
        {renderInline(trimmed, `p-t-${key}`)}
      </p>,
    )
  }

  flushList()
  flushQuote()

  return elements
}

export default BlogMarkdown
