function BlogMarkdown({ content = '' }) {
  const elements = []
  let key = 0

  for (const line of content.split('\n')) {
    if (line.startsWith('#### ')) {
      elements.push(<h3 key={key++} className="text-lg font-bold mt-6 mb-2 text-violet-700">{line.slice(5)}</h3>)
    } else if (line.startsWith('### ')) {
      elements.push(<h2 key={key++} className="text-xl sm:text-2xl font-bold mt-8 mb-4 text-slate-900">{line.slice(4)}</h2>)
    } else if (line.startsWith('> ')) {
      elements.push(
        <blockquote key={key++} className="my-6 p-4 border-l-4 italic text-sm leading-relaxed border-violet-500 bg-violet-50/70 text-slate-800 rounded-r-2xl">
          {line.slice(2)}
        </blockquote>,
      )
    } else if (line.startsWith('* ') || line.startsWith('- ')) {
      elements.push(<li key={key++} className="ml-6 list-disc text-sm leading-relaxed mb-1.5">{line.slice(2)}</li>)
    } else if (line.trim() === '---') {
      elements.push(<hr key={key++} className="my-8 border-gray-200/60" />)
    } else if (line.trim()) {
      elements.push(<p key={key++} className="text-sm sm:text-base leading-relaxed mb-4">{line}</p>)
    }
  }

  return elements
}

export default BlogMarkdown
