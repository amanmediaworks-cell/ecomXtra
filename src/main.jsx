import React from 'react'
import { createRoot, hydrateRoot } from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { domAnimation, LazyMotion } from 'motion/react'
import App from './App.jsx'
import AdminPage from './pages/AdminPage.jsx'
import './index.css'

const initialData = window.__ECOMXTRA_INITIAL_DATA__ || {}

const rootElement = document.getElementById('root')
if (!rootElement) throw new Error('The application root element was not found.')

const app = (
  <React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route
          path="/admin"
          element={(
            <LazyMotion features={domAnimation}>
              <AdminPage />
            </LazyMotion>
          )}
        />
        <Route path="/*" element={<App initialData={initialData} />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
)

if (window.__ECOMXTRA_SSR__ === true) {
  hydrateRoot(rootElement, app)
} else {
  createRoot(rootElement).render(app)
}
