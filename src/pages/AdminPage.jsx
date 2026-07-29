import React, { useState, useEffect } from 'react'
import { Navigate } from 'react-router-dom'
import AdminConsole from '../components/AdminConsole'

// Default datasets (mirrored from App.jsx so Admin can read localStorage)
const defaultServices = [
  { id: 1, title: 'Shopify & WooCommerce Solutions', description: 'Bespoke store setups, theme design, custom plugin development, and secure transactional setups.', category: 'Development' },
  { id: 2, title: 'eCommerce Store Development', description: 'End-to-end headless architecture, ultra-fast loading speeds, and multi-currency storefront structures.', category: 'Development' },
  { id: 3, title: 'AI Chatbots & Whatsapp Automation', description: 'Smart English/Hinglish custom-trained chatbots that automatically close deals and nurture leads 24/7.', category: 'AI Automation' },
  { id: 4, title: 'Growth Marketing & CRO', description: 'Data-driven marketing, search engine optimization, email list nurturing, and continuous landing page optimization.', category: 'Growth' },
  { id: 5, title: 'Marketing Automation', description: 'Set-and-forget marketing campaigns, automated customer retargeting, and post-purchase follow-ups.', category: 'Marketing' },
  { id: 6, title: 'Custom Integrations', description: 'Flawlessly sync your storefront with ERP, CRM, logistics, inventory management, and financial dashboards.', category: 'Integrations' }
]
const defaultShowcases = [
  { id: 1, key: 'amazon', title: 'Amazon Ranking Boost', metric: '#1 Best Seller', description: 'Boosted search rankings to the first page, resulting in a 2.4x organic sales increase within 60 days.', link: '#' },
  { id: 2, key: 'flipkart', title: 'Flipkart Visibility Multiplier', metric: '1.8x Conversions', description: 'Ranked accessories catalog into the top 3 spots, optimizing images and titles for search visibility.', link: '#' },
  { id: 3, key: 'meesho', title: 'Meesho High-Velocity Funnel', metric: '310% Order Vol', description: 'Designed optimized descriptions and images for tier 2/3 buyers, unlocking a massive surge in daily orders.', link: '#' },
  { id: 4, key: 'jiomart', title: 'JioMart Grocery Launch', metric: '20k Monthly Orders', description: 'Configured inventory pipelines and keyword listings, reaching top slots for critical local queries.', link: '#' }
]
const defaultTestimonials = [
  { id: 1, author: 'Karan Sharma', company: 'FitFuel Co.', text: 'Working with EcomXtra automated our entire catalog update system. The custom AI Whatsapp chatbot closes deals automatically in Hinglish - sales are up 45%.' },
  { id: 2, author: 'Sonal Verma', company: 'GlowOrganic', text: 'Their minimalist brutalist aesthetic options represent a high-end luxury vibe perfectly. The wellness theme is super calming. Amazing work.' },
  { id: 3, author: 'Rahul Gupta', company: 'Urban Threads', text: 'Our custom Shopify integration has saved us 15+ hours of manual data sync per week. Highly recommended for ecommerce brands.' }
]

// ── Login Screen ────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [showPass, setShowPass] = useState(false)
  const [shaking, setShaking] = useState(false)

  const handleSubmit = (e) => {
    e.preventDefault()
    if (username === 'jhakkas' && password === 'Jh@tu') {
      onLogin()
    } else {
      setError('Invalid credentials. Access denied.')
      setShaking(true)
      setTimeout(() => setShaking(false), 600)
    }
  }

  return (
    <div className="min-h-screen bg-[#111111] flex items-center justify-center px-4 relative overflow-hidden font-satoshi">
      {/* Background grid lines */}
      <div
        className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `
            linear-gradient(#f2f2f2 1px, transparent 1px),
            linear-gradient(90deg, #f2f2f2 1px, transparent 1px)
          `,
          backgroundSize: '80px 80px'
        }}
      />

      {/* Ambient glow blobs */}
      <div className="absolute top-[-20%] right-[-10%] w-[40vw] h-[40vw] rounded-full bg-white/[0.02] blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[35vw] h-[35vw] rounded-full bg-white/[0.02] blur-[100px] pointer-events-none" />

      {/* Card */}
      <div
        className={`relative w-full max-w-md transition-all duration-150 ${shaking ? 'translate-x-3' : ''}`}
        style={{ animation: shaking ? 'shake 0.5s ease' : 'none' }}
      >
        {/* Top bar accent */}
        <div className="h-[3px] w-full bg-gradient-to-r from-transparent via-[#f2f2f2]/60 to-transparent mb-0" />

        <div className="border border-[#f2f2f2]/15 bg-[#1a1a1a]/80 backdrop-blur-xl p-10">
          {/* Header */}
          <div className="mb-10 text-center">
            {/* Lock icon SVG */}
            <div className="w-14 h-14 border border-[#f2f2f2]/20 flex items-center justify-center mx-auto mb-6 bg-[#111111]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="#f2f2f2" className="w-7 h-7">
                <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
              </svg>
            </div>

            <span className="font-clash text-[10px] font-black tracking-[0.35em] uppercase text-[#f2f2f2]/40 block mb-3">
              RESTRICTED ACCESS
            </span>
            <h1 className="font-clash text-3xl font-bold text-[#f2f2f2] tracking-tight">
              ECOMXTRA
            </h1>
            <p className="font-satoshi text-xs text-[#f2f2f2]/40 mt-1 tracking-widest uppercase">
              Control Hub · Admin Portal
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#f2f2f2]/50 mb-2">
                USERNAME
              </label>
              <input
                id="admin-username"
                type="text"
                required
                autoComplete="username"
                value={username}
                onChange={(e) => { setUsername(e.target.value); setError('') }}
                placeholder="Enter username"
                className="w-full bg-[#111111] border border-[#f2f2f2]/15 text-[#f2f2f2] text-xs p-3.5 placeholder-[#f2f2f2]/20 focus:outline-none focus:border-[#f2f2f2]/50 transition-colors duration-200 font-satoshi tracking-wide"
              />
            </div>

            {/* Password */}
            <div>
              <label className="block text-[10px] font-black tracking-[0.2em] uppercase text-[#f2f2f2]/50 mb-2">
                PASSWORD
              </label>
              <div className="relative">
                <input
                  id="admin-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); setError('') }}
                  placeholder="Enter password"
                  className="w-full bg-[#111111] border border-[#f2f2f2]/15 text-[#f2f2f2] text-xs p-3.5 pr-10 placeholder-[#f2f2f2]/20 focus:outline-none focus:border-[#f2f2f2]/50 transition-colors duration-200 font-satoshi tracking-wide"
                />
                <button
                  type="button"
                  onClick={() => setShowPass(!showPass)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-[#f2f2f2]/30 hover:text-[#f2f2f2]/60 transition-colors"
                  tabIndex={-1}
                >
                  {showPass ? (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 0 0 1.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.451 10.451 0 0 1 12 4.5c4.756 0 8.773 3.162 10.065 7.498a10.522 10.522 0 0 1-4.293 5.774M6.228 6.228 3 3m3.228 3.228 3.65 3.65m7.894 7.894L21 21m-3.228-3.228-3.65-3.65m0 0a3 3 0 1 0-4.243-4.243m4.242 4.242L9.88 9.88" />
                    </svg>
                  ) : (
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                      <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {/* Error message */}
            {error && (
              <div className="border border-red-500/30 bg-red-500/5 p-3 flex items-center gap-2">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-red-400 shrink-0">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126ZM12 15.75h.007v.008H12v-.008Z" />
                </svg>
                <span className="text-red-400 text-[10px] font-black tracking-wider uppercase">{error}</span>
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              className="w-full py-4 bg-[#f2f2f2] text-[#111111] font-clash font-black text-xs tracking-[0.25em] uppercase border border-[#f2f2f2] hover:bg-[#111111] hover:text-[#f2f2f2] transition-all duration-300 mt-2"
            >
              AUTHENTICATE & ENTER
            </button>
          </form>

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#f2f2f2]/8 text-center">
            <p className="text-[10px] text-[#f2f2f2]/20 tracking-widest uppercase">
              A Quadranex IT Solutions System · Restricted
            </p>
          </div>
        </div>

        {/* Bottom bar accent */}
        <div className="h-[1px] w-full bg-gradient-to-r from-transparent via-[#f2f2f2]/20 to-transparent mt-0" />
      </div>

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          15% { transform: translateX(-8px); }
          30% { transform: translateX(8px); }
          45% { transform: translateX(-6px); }
          60% { transform: translateX(6px); }
          75% { transform: translateX(-3px); }
          90% { transform: translateX(3px); }
        }
      `}</style>
    </div>
  )
}

// ── Admin Dashboard (post-login) ────────────────────────────────────────────
function AdminDashboard({ onLogout }) {
  const [theme, setTheme] = useState(() => localStorage.getItem('ecom_theme_mode') || 'swiss')
  const [services, setServices]     = useState(() => { try { return JSON.parse(localStorage.getItem('ecom_services')) || defaultServices } catch { return defaultServices } })
  const [showcases, setShowcases]   = useState(() => { try { return JSON.parse(localStorage.getItem('ecom_showcases')) || defaultShowcases } catch { return defaultShowcases } })
  const [testimonials, setTestimonials] = useState(() => { try { return JSON.parse(localStorage.getItem('ecom_testimonials')) || defaultTestimonials } catch { return defaultTestimonials } })
  const [careers, setCareers]       = useState(() => { try { return JSON.parse(localStorage.getItem('ecom_careers')) || [] } catch { return [] } })
  const [consultations, setConsultations] = useState(() => { try { return JSON.parse(localStorage.getItem('ecom_consultations')) || [] } catch { return [] } })
  const [logs, setLogs]             = useState(() => { try { return JSON.parse(localStorage.getItem('ecom_logs')) || [] } catch { return [] } })

  // Persist theme changes so they reflect on the public site too
  useEffect(() => { localStorage.setItem('ecom_theme_mode', theme) }, [theme])
  useEffect(() => { localStorage.setItem('ecom_services', JSON.stringify(services)) }, [services])
  useEffect(() => { localStorage.setItem('ecom_showcases', JSON.stringify(showcases)) }, [showcases])
  useEffect(() => { localStorage.setItem('ecom_testimonials', JSON.stringify(testimonials)) }, [testimonials])
  useEffect(() => { localStorage.setItem('ecom_careers', JSON.stringify(careers)) }, [careers])
  useEffect(() => { localStorage.setItem('ecom_logs', JSON.stringify(logs)) }, [logs])

  // Cross-tab: pick up consultation submissions from public site tab
  useEffect(() => {
    const onStorage = (e) => {
      if (e.key === 'ecom_consultations' && e.newValue) {
        try { setConsultations(JSON.parse(e.newValue)) } catch {}
      }
    }
    window.addEventListener('storage', onStorage)
    return () => window.removeEventListener('storage', onStorage)
  }, [])

  const addLog = (text) => {
    setLogs(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), text }, ...prev])
  }

  const handleCRUD = {
    addService:    (s)     => { const n = { id: Date.now(), ...s }; setServices(p => [...p, n]); addLog(`[Admin] Created Service: "${s.title}"`) },
    updateService: (id, s) => { setServices(p => p.map(x => x.id === id ? { ...x, ...s } : x)); addLog(`[Admin] Updated Service ID: ${id}`) },
    deleteService: (id)    => { setServices(p => p.filter(x => x.id !== id)); addLog(`[Admin] Deleted Service ID: ${id}`) },

    addShowcase:    (s)     => { const n = { id: Date.now(), ...s }; setShowcases(p => [...p, n]); addLog(`[Admin] Created Case Study: "${s.title}"`) },
    updateShowcase: (id, s) => { setShowcases(p => p.map(x => x.id === id ? { ...x, ...s } : x)); addLog(`[Admin] Updated Showcase ID: ${id}`) },
    deleteShowcase: (id)    => { setShowcases(p => p.filter(x => x.id !== id)); addLog(`[Admin] Deleted Showcase ID: ${id}`) },

    addTestimonial:    (t)     => { const n = { id: Date.now(), ...t }; setTestimonials(p => [...p, n]); addLog(`[Admin] Created Testimonial by: "${t.author}"`) },
    updateTestimonial: (id, t) => { setTestimonials(p => p.map(x => x.id === id ? { ...x, ...t } : x)); addLog(`[Admin] Updated Testimonial ID: ${id}`) },
    deleteTestimonial: (id)    => { setTestimonials(p => p.filter(x => x.id !== id)); addLog(`[Admin] Deleted Testimonial ID: ${id}`) },
  }

  return (
    <div className="min-h-screen bg-[#0e0e0e] font-satoshi">
      {/* Admin Top Header Bar */}
      <header className="sticky top-0 z-50 bg-[#111111] border-b border-[#f2f2f2]/10 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          {/* Live status dot */}
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-green-400 animate-ping block" />
            <span className="w-2 h-2 rounded-full bg-green-400 block absolute" />
          </div>
          <div>
            <span className="font-clash text-sm font-black text-[#f2f2f2] tracking-widest uppercase">
              ECOMXTRA CONTROL HUB
            </span>
            <span className="font-satoshi text-[10px] text-[#f2f2f2]/40 block tracking-widest uppercase">
              Admin · Quadranex IT Solutions
            </span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {/* Theme badge */}
          <div className={`px-3 py-1.5 text-[10px] font-black tracking-widest uppercase border ${
            theme === 'swiss'
              ? 'border-[#f2f2f2]/20 text-[#f2f2f2]/60'
              : 'border-softly-peach/40 text-softly-peach'
          }`}>
            {theme === 'swiss' ? 'Swiss Mode Active' : 'Softly Mode Active'}
          </div>

          {/* Back to site link */}
          <a
            href="/"
            className="text-[10px] font-black tracking-widest uppercase text-[#f2f2f2]/40 hover:text-[#f2f2f2]/80 transition-colors border border-[#f2f2f2]/10 px-3 py-1.5 hover:border-[#f2f2f2]/30"
          >
            ← Back to Site
          </a>

          {/* Logout */}
          <button
            onClick={onLogout}
            className="text-[10px] font-black tracking-widest uppercase bg-[#f2f2f2] text-[#111111] px-4 py-1.5 hover:bg-[#f2f2f2]/80 transition-colors"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Full-page AdminConsole — always open, no drawer */}
      <div className="relative">
        <AdminConsoleInline
          theme={theme}
          setTheme={(t) => { setTheme(t); addLog(`[Admin] Switched site theme to ${t.toUpperCase()}`) }}
          services={services}
          showcases={showcases}
          testimonials={testimonials}
          careers={careers}
          consultations={consultations}
          logs={logs}
          handleCRUD={handleCRUD}
        />
      </div>
    </div>
  )
}

// ── Inline variant of AdminConsole (no drawer overlay, full page) ────────────
import { X, Save, Trash2, Edit, Check, Settings, RefreshCw, List, Clipboard, Terminal } from 'lucide-react'

function AdminConsoleInline({ theme, setTheme, services, showcases, testimonials, careers, consultations = [], logs, handleCRUD }) {
  const [activeTab, setActiveTab]   = useState('db')
  const [dbSubTab, setDbSubTab]     = useState('services')

  const [newService, setNewService] = useState({ title: '', description: '', category: 'Development' })
  const [editingServiceId, setEditingServiceId] = useState(null)
  const [editingService, setEditingService]     = useState({})

  const [newShowcase, setNewShowcase] = useState({ key: '', title: '', metric: '', description: '' })
  const [editingShowcaseId, setEditingShowcaseId] = useState(null)
  const [editingShowcase, setEditingShowcase]     = useState({})

  const [newTestimonial, setNewTestimonial] = useState({ author: '', company: '', text: '' })
  const [editingTestimonialId, setEditingTestimonialId] = useState(null)
  const [editingTestimonial, setEditingTestimonial]     = useState({})

  const tabs = [
    { id: 'db',            label: 'CRUD Manager',   icon: <List      className="w-4 h-4" /> },
    { id: 'consultations', label: 'Consultations',  icon: <Clipboard className="w-4 h-4" /> },
    { id: 'leads',         label: 'Career Leads',   icon: <Clipboard className="w-4 h-4" /> },
    { id: 'logs',          label: 'Sync Terminal',  icon: <Terminal  className="w-4 h-4" /> },
    { id: 'health',        label: 'Theme & API',    icon: <RefreshCw className="w-4 h-4" /> },
  ]

  const inputCls  = "bg-[#1a1a1a] border border-[#f2f2f2]/15 text-[#f2f2f2] text-xs p-2.5 w-full focus:outline-none focus:border-[#f2f2f2]/40 placeholder-[#f2f2f2]/20"
  const labelCls  = "block text-[10px] font-black tracking-[0.2em] uppercase text-[#f2f2f2]/40 mb-1.5"
  const btnCreate = "px-4 py-2 bg-[#f2f2f2] text-[#111111] text-[10px] font-black tracking-widest uppercase hover:bg-[#d9d9d9] transition-colors"
  const cardCls   = "border border-[#f2f2f2]/10 bg-[#1a1a1a] p-4 flex flex-col sm:flex-row justify-between gap-4"

  return (
    <div className="min-h-screen flex">
      {/* Sidebar tabs */}
      <aside className="w-[220px] shrink-0 bg-[#111111] border-r border-[#f2f2f2]/10 flex flex-col py-6 px-0">
        <div className="px-5 mb-8">
          <span className="text-[9px] font-black tracking-[0.3em] uppercase text-[#f2f2f2]/25">NAVIGATION</span>
        </div>
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex items-center gap-3 px-5 py-3.5 text-xs font-black tracking-widest uppercase text-left transition-all duration-200 border-l-2 ${
              activeTab === t.id
                ? 'bg-[#f2f2f2]/5 border-[#f2f2f2] text-[#f2f2f2]'
                : 'border-transparent text-[#f2f2f2]/35 hover:text-[#f2f2f2]/65 hover:bg-[#f2f2f2]/3'
            }`}
          >
            <span className={activeTab === t.id ? 'text-[#f2f2f2]' : 'text-[#f2f2f2]/30'}>{t.icon}</span>
            {t.label}
          </button>
        ))}

        <div className="mt-auto px-5 space-y-4 pt-8 border-t border-[#f2f2f2]/8">
          {[
            { label: 'Services',     val: services.length },
            { label: 'Case Studies', val: showcases.length },
            { label: 'Reviews',      val: testimonials.length },
            { label: 'Enquiries',    val: consultations.length },
            { label: 'Career Leads', val: careers.length },
          ].map(s => (
            <div key={s.label} className="flex justify-between items-center">
              <span className="text-[10px] text-[#f2f2f2]/30 uppercase tracking-wider">{s.label}</span>
              <span className="font-clash font-bold text-sm text-[#f2f2f2]/70">{s.val}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main content area */}
      <main className="flex-1 p-8 overflow-y-auto bg-[#0e0e0e]">

        {/* ─── CRUD Manager ─── */}
        {activeTab === 'db' && (
          <div>
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">CRUD Database Manager</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">Create, read, update and delete records — changes sync to the live site instantly.</p>
            </div>

            {/* Sub tabs */}
            <div className="flex gap-1 mb-8 border-b border-[#f2f2f2]/10 pb-0">
              {['services', 'showcases', 'testimonials'].map(s => (
                <button
                  key={s}
                  onClick={() => setDbSubTab(s)}
                  className={`px-5 py-2.5 text-[10px] font-black tracking-[0.2em] uppercase border-b-2 -mb-px transition-all ${
                    dbSubTab === s
                      ? 'border-[#f2f2f2] text-[#f2f2f2]'
                      : 'border-transparent text-[#f2f2f2]/30 hover:text-[#f2f2f2]/60'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            {/* ── SERVICES ── */}
            {dbSubTab === 'services' && (
              <div className="space-y-8">
                <form onSubmit={(e) => { e.preventDefault(); if (!newService.title.trim()) return; handleCRUD.addService(newService); setNewService({ title: '', description: '', category: 'Development' }) }}
                  className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ New Service Record ]</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Title</label><input required value={newService.title} onChange={e => setNewService({...newService, title: e.target.value})} placeholder="Service name..." className={inputCls} /></div>
                    <div>
                      <label className={labelCls}>Category</label>
                      <select value={newService.category} onChange={e => setNewService({...newService, category: e.target.value})} className={inputCls}>
                        {['Development','AI Automation','Growth','Marketing','Integrations'].map(c => <option key={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>
                  <div><label className={labelCls}>Description</label><textarea required rows={3} value={newService.description} onChange={e => setNewService({...newService, description: e.target.value})} placeholder="Describe the service..." className={`${inputCls} resize-none`} /></div>
                  <button type="submit" className={btnCreate}>+ Add Service</button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">[ {services.length} Active Services ]</h4>
                  {services.map(s => (
                    <div key={s.id} className={cardCls}>
                      {editingServiceId === s.id ? (
                        <div className="flex-1 space-y-3">
                          <input value={editingService.title} onChange={e => setEditingService({...editingService, title: e.target.value})} className={inputCls} />
                          <textarea rows={3} value={editingService.description} onChange={e => setEditingService({...editingService, description: e.target.value})} className={`${inputCls} resize-none`} />
                          <div className="flex gap-2">
                            <button onClick={() => { handleCRUD.updateService(s.id, editingService); setEditingServiceId(null) }} className="p-1.5 bg-green-600 text-white"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingServiceId(null)} className="p-1.5 bg-[#f2f2f2]/10 text-[#f2f2f2]"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <span className="text-[9px] font-black tracking-wider uppercase text-[#f2f2f2]/30 border border-[#f2f2f2]/10 px-2 py-0.5">{s.category}</span>
                          </div>
                          <h5 className="text-sm font-bold text-[#f2f2f2]">{s.title}</h5>
                          <p className="text-[11px] text-[#f2f2f2]/45 mt-1 leading-relaxed">{s.description}</p>
                        </div>
                      )}
                      <div className="flex gap-2 items-start justify-end shrink-0">
                        <button onClick={() => { setEditingServiceId(s.id); setEditingService(s) }} className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleCRUD.deleteService(s.id)} className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── SHOWCASES ── */}
            {dbSubTab === 'showcases' && (
              <div className="space-y-8">
                <form onSubmit={(e) => { e.preventDefault(); if (!newShowcase.title.trim()) return; handleCRUD.addShowcase(newShowcase); setNewShowcase({ key: '', title: '', metric: '', description: '' }) }}
                  className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ New Showcase Audit ]</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div><label className={labelCls}>Key</label><input required value={newShowcase.key} onChange={e => setNewShowcase({...newShowcase, key: e.target.value})} placeholder="e.g. amazon" className={inputCls} /></div>
                    <div><label className={labelCls}>Title</label><input required value={newShowcase.title} onChange={e => setNewShowcase({...newShowcase, title: e.target.value})} placeholder="Study title..." className={inputCls} /></div>
                    <div><label className={labelCls}>Core Metric</label><input required value={newShowcase.metric} onChange={e => setNewShowcase({...newShowcase, metric: e.target.value})} placeholder="e.g. #1 Best Seller" className={inputCls} /></div>
                  </div>
                  <div><label className={labelCls}>Description</label><textarea required rows={3} value={newShowcase.description} onChange={e => setNewShowcase({...newShowcase, description: e.target.value})} placeholder="Audit detail..." className={`${inputCls} resize-none`} /></div>
                  <button type="submit" className={btnCreate}>+ Add Case Study</button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">[ {showcases.length} Case Studies ]</h4>
                  {showcases.map(s => (
                    <div key={s.id} className={cardCls}>
                      {editingShowcaseId === s.id ? (
                        <div className="flex-1 space-y-3">
                          <input value={editingShowcase.title}  onChange={e => setEditingShowcase({...editingShowcase, title: e.target.value})} className={inputCls} />
                          <input value={editingShowcase.metric} onChange={e => setEditingShowcase({...editingShowcase, metric: e.target.value})} className={inputCls} placeholder="Metric..." />
                          <textarea rows={3} value={editingShowcase.description} onChange={e => setEditingShowcase({...editingShowcase, description: e.target.value})} className={`${inputCls} resize-none`} />
                          <div className="flex gap-2">
                            <button onClick={() => { handleCRUD.updateShowcase(s.id, editingShowcase); setEditingShowcaseId(null) }} className="p-1.5 bg-green-600 text-white"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingShowcaseId(null)} className="p-1.5 bg-[#f2f2f2]/10 text-[#f2f2f2]"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-1.5">
                            <span className="text-[9px] font-black tracking-wider uppercase text-[#f2f2f2]/25 border border-[#f2f2f2]/8 px-2 py-0.5">[{s.key}]</span>
                            <span className="text-xs font-black text-[#f2f2f2]/60">{s.metric}</span>
                          </div>
                          <h5 className="text-sm font-bold text-[#f2f2f2]">{s.title}</h5>
                          <p className="text-[11px] text-[#f2f2f2]/45 mt-1 leading-relaxed">{s.description}</p>
                        </div>
                      )}
                      <div className="flex gap-2 items-start justify-end shrink-0">
                        <button onClick={() => { setEditingShowcaseId(s.id); setEditingShowcase(s) }} className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleCRUD.deleteShowcase(s.id)} className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ── TESTIMONIALS ── */}
            {dbSubTab === 'testimonials' && (
              <div className="space-y-8">
                <form onSubmit={(e) => { e.preventDefault(); if (!newTestimonial.author.trim()) return; handleCRUD.addTestimonial(newTestimonial); setNewTestimonial({ author: '', company: '', text: '' }) }}
                  className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
                  <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/50">[ New Testimonial Record ]</h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div><label className={labelCls}>Author Name</label><input required value={newTestimonial.author} onChange={e => setNewTestimonial({...newTestimonial, author: e.target.value})} placeholder="Client name..." className={inputCls} /></div>
                    <div><label className={labelCls}>Company</label><input value={newTestimonial.company} onChange={e => setNewTestimonial({...newTestimonial, company: e.target.value})} placeholder="Brand / Company..." className={inputCls} /></div>
                  </div>
                  <div><label className={labelCls}>Testimonial Text</label><textarea required rows={3} value={newTestimonial.text} onChange={e => setNewTestimonial({...newTestimonial, text: e.target.value})} placeholder="Client's exact words..." className={`${inputCls} resize-none`} /></div>
                  <button type="submit" className={btnCreate}>+ Add Testimonial</button>
                </form>

                <div className="space-y-3">
                  <h4 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/30">[ {testimonials.length} Reviews ]</h4>
                  {testimonials.map(t => (
                    <div key={t.id} className={cardCls}>
                      {editingTestimonialId === t.id ? (
                        <div className="flex-1 space-y-3">
                          <input value={editingTestimonial.author}  onChange={e => setEditingTestimonial({...editingTestimonial, author: e.target.value})} className={inputCls} placeholder="Author..." />
                          <input value={editingTestimonial.company} onChange={e => setEditingTestimonial({...editingTestimonial, company: e.target.value})} className={inputCls} placeholder="Company..." />
                          <textarea rows={3} value={editingTestimonial.text} onChange={e => setEditingTestimonial({...editingTestimonial, text: e.target.value})} className={`${inputCls} resize-none`} />
                          <div className="flex gap-2">
                            <button onClick={() => { handleCRUD.updateTestimonial(t.id, editingTestimonial); setEditingTestimonialId(null) }} className="p-1.5 bg-green-600 text-white"><Check className="w-4 h-4" /></button>
                            <button onClick={() => setEditingTestimonialId(null)} className="p-1.5 bg-[#f2f2f2]/10 text-[#f2f2f2]"><X className="w-4 h-4" /></button>
                          </div>
                        </div>
                      ) : (
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1.5">
                            <span className="text-xs font-bold text-[#f2f2f2]">{t.author}</span>
                            <span className="text-[10px] text-[#f2f2f2]/30">· {t.company}</span>
                          </div>
                          <p className="text-[11px] text-[#f2f2f2]/50 italic leading-relaxed">"{t.text}"</p>
                        </div>
                      )}
                      <div className="flex gap-2 items-start justify-end shrink-0">
                        <button onClick={() => { setEditingTestimonialId(t.id); setEditingTestimonial(t) }} className="p-2 border border-[#f2f2f2]/10 text-[#f2f2f2]/50 hover:text-[#f2f2f2] hover:border-[#f2f2f2]/30"><Edit className="w-4 h-4" /></button>
                        <button onClick={() => handleCRUD.deleteTestimonial(t.id)} className="p-2 border border-red-500/20 text-red-400/60 hover:text-red-400 hover:border-red-500/40"><Trash2 className="w-4 h-4" /></button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── Consultation Enquiries ─── */}
        {activeTab === 'consultations' && (
          <div>
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">Consultation Enquiries</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">{consultations.length} enquiries received from the website contact form</p>
            </div>
            {consultations.length === 0 ? (
              <div className="border border-dashed border-[#f2f2f2]/10 py-20 flex flex-col items-center justify-center text-center">
                <Clipboard className="w-10 h-10 text-[#f2f2f2]/15 mb-4" />
                <span className="text-xs font-bold text-[#f2f2f2]/25 uppercase tracking-widest">No enquiries yet</span>
                <p className="text-[11px] text-[#f2f2f2]/20 mt-2">Submissions from the website contact form appear here.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {consultations.map(c => (
                  <div key={c.id} className="border border-[#f2f2f2]/10 bg-[#141414] p-5">
                    <div className="flex flex-wrap items-start justify-between gap-3 mb-3">
                      <div>
                        <h5 className="font-bold text-sm text-[#f2f2f2]">{c.name}</h5>
                        <span className="text-[11px] text-[#f2f2f2]/40">{c.email}</span>
                      </div>
                      {c.business && (
                        <span className="border border-[#f2f2f2]/20 text-[#f2f2f2]/60 text-[10px] font-black tracking-widest uppercase px-3 py-1">{c.business}</span>
                      )}
                    </div>
                    {c.message && (
                      <p className="text-[11px] text-[#f2f2f2]/55 leading-relaxed border-l-2 border-[#f2f2f2]/15 pl-3 mb-3 italic">"{c.message}"</p>
                    )}
                    <div className="pt-2 border-t border-[#f2f2f2]/8">
                      <span className="text-[10px] text-[#f2f2f2]/25">{c.date}</span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Career Leads ─── */}
        {activeTab === 'leads' && (
          <div>
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">Career Application Leads</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">{careers.length} total submissions received</p>
            </div>

            {careers.length === 0 ? (
              <div className="border border-dashed border-[#f2f2f2]/10 py-20 flex flex-col items-center justify-center text-center">
                <Clipboard className="w-10 h-10 text-[#f2f2f2]/15 mb-4" />
                <span className="text-xs font-bold text-[#f2f2f2]/25 uppercase tracking-widest">No applications received yet</span>
              </div>
            ) : (
              <div className="space-y-4">
                {careers.map(c => (
                  <div key={c.id} className="border border-[#f2f2f2]/10 bg-[#141414] p-5 space-y-3">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div>
                        <h5 className="font-bold text-sm text-[#f2f2f2]">{c.name}</h5>
                        <span className="text-[11px] text-[#f2f2f2]/40">{c.email}</span>
                      </div>
                      <span className="bg-[#f2f2f2] text-[#111111] text-[10px] font-black tracking-widest uppercase px-3 py-1">{c.role}</span>
                    </div>
                    {c.message && (
                      <p className="text-[11px] text-[#f2f2f2]/50 leading-relaxed border-l-2 border-[#f2f2f2]/10 pl-3">"{c.message}"</p>
                    )}
                    <div className="flex flex-wrap justify-between items-center gap-2 pt-2 border-t border-[#f2f2f2]/8">
                      <span className="text-[10px] text-[#f2f2f2]/25">{c.date}</span>
                      <a href={c.resume} target="_blank" rel="noreferrer" className="text-[10px] font-bold text-[#f2f2f2]/50 hover:text-[#f2f2f2] underline tracking-wider uppercase transition-colors">
                        View Resume ↗
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ─── Sync Terminal ─── */}
        {activeTab === 'logs' && (
          <div>
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">Sync Terminal Log Stream</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">Real-time WhatsApp API & Google Sheets sync events</p>
            </div>
            <div className="bg-[#080808] border border-[#f2f2f2]/8 p-5 h-[calc(100vh-260px)] overflow-y-auto font-mono text-[11px] leading-loose">
              {logs.length === 0 ? (
                <span className="text-[#f2f2f2]/20">{">"} Waiting for sync events…</span>
              ) : (
                logs.map(log => (
                  <div key={log.id} className="flex gap-3 group">
                    <span className="text-[#f2f2f2]/20 shrink-0">[{log.timestamp}]</span>
                    <span className={`whitespace-pre-wrap ${
                      log.text.includes('[WhatsApp') ? 'text-green-400' :
                      log.text.includes('[Google')   ? 'text-blue-400'  :
                      log.text.includes('[Admin')    ? 'text-yellow-400' :
                      'text-[#f2f2f2]/60'
                    }`}>{log.text}</span>
                  </div>
                ))
              )}
              <div className="flex gap-2 mt-2">
                <span className="text-[#f2f2f2]/20">{">"}</span>
                <span className="w-2 h-4 bg-[#f2f2f2]/40 animate-pulse block" />
              </div>
            </div>
          </div>
        )}

        {/* ─── Theme & API ─── */}
        {activeTab === 'health' && (
          <div className="space-y-8">
            <div className="mb-8">
              <h2 className="font-clash text-xl font-bold text-[#f2f2f2] tracking-tight">Theme & API Configuration</h2>
              <p className="text-xs text-[#f2f2f2]/35 mt-1">Manage global site theme and integration health</p>
            </div>

            {/* Theme toggle */}
            <div className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-5">
              <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/40">[ Global Site Theme ]</h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <button
                  onClick={() => setTheme('swiss')}
                  className={`p-6 border text-left transition-all duration-300 ${
                    theme === 'swiss'
                      ? 'border-[#f2f2f2] bg-[#f2f2f2]/5'
                      : 'border-[#f2f2f2]/10 hover:border-[#f2f2f2]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-clash text-sm font-bold text-[#f2f2f2]">Swiss Brutalist</span>
                    {theme === 'swiss' && <span className="w-2 h-2 rounded-full bg-green-400 animate-ping" />}
                  </div>
                  <p className="text-[11px] text-[#f2f2f2]/40 leading-relaxed">High-contrast monochrome palette. Clash Display heavy headlines, sharp borders, editorial layout.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="w-6 h-6 bg-[#111111] border border-[#f2f2f2]/20" />
                    <span className="w-6 h-6 bg-[#f2f2f2]" />
                    <span className="w-6 h-6 bg-[#b6b5b5]" />
                  </div>
                </button>
                <button
                  onClick={() => setTheme('softly')}
                  className={`p-6 border text-left transition-all duration-300 ${
                    theme !== 'swiss'
                      ? 'border-softly-peach/60 bg-softly-peach/5'
                      : 'border-[#f2f2f2]/10 hover:border-[#f2f2f2]/30'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-outfit text-sm font-bold text-[#f2f2f2]">Colourful Wellness</span>
                    {theme !== 'swiss' && <span className="w-2 h-2 rounded-full bg-softly-peach animate-ping" />}
                  </div>
                  <p className="text-[11px] text-[#f2f2f2]/40 leading-relaxed">Vibrant pastels, high-radius borders, cursive accents, ambient glow. Relaxed digital experience.</p>
                  <div className="mt-4 flex gap-2">
                    <span className="w-6 h-6 rounded-full bg-[#606C56]" />
                    <span className="w-6 h-6 rounded-full bg-[#DD8D6B]" />
                    <span className="w-6 h-6 rounded-full bg-[#D1C4E9]" />
                  </div>
                </button>
              </div>
              <p className="text-[10px] text-[#f2f2f2]/25">Theme change is applied site-wide via localStorage. Visitors see the new theme on their next page load.</p>
            </div>

            {/* API Health status */}
            <div className="border border-[#f2f2f2]/10 bg-[#141414] p-6 space-y-4">
              <h3 className="text-[10px] font-black tracking-[0.25em] uppercase text-[#f2f2f2]/40">[ Integration API Health ]</h3>
              {[
                { name: 'Google Sheets Integration (v4)', status: 'CONNECTED', color: 'text-green-400' },
                { name: 'WhatsApp Business API Gateway', status: 'ONLINE',    color: 'text-green-400' },
                { name: 'Hinglish AI Agent Core Engine', status: 'READY',     color: 'text-green-400' },
                { name: 'Quadranex IT Solutions Parent CDN', status: 'ACTIVE', color: 'text-green-400' },
              ].map(api => (
                <div key={api.name} className="flex justify-between items-center py-3 border-b border-[#f2f2f2]/5 last:border-0">
                  <span className="text-xs text-[#f2f2f2]/60 font-satoshi">{api.name}</span>
                  <span className={`text-[10px] font-black tracking-widest uppercase ${api.color} border border-current/20 px-2 py-0.5`}>{api.status}</span>
                </div>
              ))}
            </div>
          </div>
        )}

      </main>
    </div>
  )
}

// ── Main Export: Admin Page with login gate ─────────────────────────────────
export default function AdminPage() {
  const [authed, setAuthed] = useState(() => sessionStorage.getItem('ecom_admin_authed') === 'true')

  const handleLogin = () => {
    sessionStorage.setItem('ecom_admin_authed', 'true')
    setAuthed(true)
  }

  const handleLogout = () => {
    sessionStorage.removeItem('ecom_admin_authed')
    setAuthed(false)
  }

  if (!authed) return <LoginScreen onLogin={handleLogin} />
  return <AdminDashboard onLogout={handleLogout} />
}
