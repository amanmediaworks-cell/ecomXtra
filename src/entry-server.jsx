import { renderToString } from 'react-dom/server'
import { StaticRouter } from 'react-router'
import App from './App.jsx'

export function renderPage(path, initialData) {
  return renderToString(
    <StaticRouter location={path}>
      <App initialData={initialData} />
    </StaticRouter>,
  )
}
