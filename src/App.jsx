import React, { useState, useEffect } from 'react'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import About from './components/About'
import ShowcaseGrid from './components/ShowcaseGrid'
import Services from './components/Services'
import Testimonials from './components/Testimonials'
import Contact from './components/Contact'
import Chatbot from './components/Chatbot'
import Footer from './components/Footer'

// Default Datasets
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

function App() {
  // Theme — read from localStorage (set only by /admin)
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('ecom_theme_mode') || 'swiss'
  })

  // Database states
  const [services, setServices] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecom_services')) || defaultServices } catch { return defaultServices }
  })
  const [showcases, setShowcases] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecom_showcases')) || defaultShowcases } catch { return defaultShowcases }
  })
  const [testimonials, setTestimonials] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecom_testimonials')) || defaultTestimonials } catch { return defaultTestimonials }
  })
  const [careers, setCareers] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecom_careers')) || [] } catch { return [] }
  })
  // ── NEW: consultation enquiries ──────────────────────────────────────────
  const [consultations, setConsultations] = useState(() => {
    try { return JSON.parse(localStorage.getItem('ecom_consultations')) || [] } catch { return [] }
  })
  const [logs, setLogs] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem('ecom_logs')) || [
        { id: 1, timestamp: new Date().toLocaleTimeString(), text: 'System initialized.' }
      ]
    } catch {
      return [{ id: 1, timestamp: new Date().toLocaleTimeString(), text: 'System initialized.' }]
    }
  })

  // Persist all state
  useEffect(() => { localStorage.setItem('ecom_theme_mode', theme) }, [theme])
  useEffect(() => { localStorage.setItem('ecom_services', JSON.stringify(services)) }, [services])
  useEffect(() => { localStorage.setItem('ecom_showcases', JSON.stringify(showcases)) }, [showcases])
  useEffect(() => { localStorage.setItem('ecom_testimonials', JSON.stringify(testimonials)) }, [testimonials])
  useEffect(() => { localStorage.setItem('ecom_careers', JSON.stringify(careers)) }, [careers])
  useEffect(() => { localStorage.setItem('ecom_consultations', JSON.stringify(consultations)) }, [consultations])
  useEffect(() => { localStorage.setItem('ecom_logs', JSON.stringify(logs)) }, [logs])

  // Cross-tab sync — admin changes propagate here without reload
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'ecom_theme_mode' && e.newValue)      setTheme(e.newValue)
      if (e.key === 'ecom_services' && e.newValue)        try { setServices(JSON.parse(e.newValue)) } catch {}
      if (e.key === 'ecom_showcases' && e.newValue)       try { setShowcases(JSON.parse(e.newValue)) } catch {}
      if (e.key === 'ecom_testimonials' && e.newValue)    try { setTestimonials(JSON.parse(e.newValue)) } catch {}
    }
    window.addEventListener('storage', handler)
    return () => window.removeEventListener('storage', handler)
  }, [])

  // ── Helpers ──────────────────────────────────────────────────────────────
  const addLog = (text) => {
    setLogs(prev => [{ id: Date.now(), timestamp: new Date().toLocaleTimeString(), text }, ...prev])
  }

  // Save career application + fire sync logs
  const addSubmission = (submission) => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString(),
      ...submission
    }
    setCareers(prev => [entry, ...prev])
    addLog(`[WhatsApp API] Hiring alert sent: ${submission.name} applied for "${submission.role}".`)
    addLog(`[Google Sheets API] Row appended to 'Careers': [${submission.name}, ${submission.email}, ${submission.role}].`)
  }

  // ── NEW: Save consultation enquiry + fire sync logs ──────────────────────
  const addConsultation = (form) => {
    const entry = {
      id: Date.now(),
      date: new Date().toLocaleDateString('en-IN') + ' ' + new Date().toLocaleTimeString(),
      ...form
    }
    setConsultations(prev => [entry, ...prev])
    addLog(`[WhatsApp API] Consultation request received from ${form.name} (${form.email}).`)
    addLog(`[Google Sheets API] Row appended to 'Consultations': [${form.name}, ${form.email}, ${form.business || 'N/A'}].`)
  }

  // CRUD operations
  const handleCRUD = {
    addService:    (s) => { setServices(p => [...p, { id: Date.now(), ...s }]);          addLog(`[Admin] Created Service: "${s.title}"`) },
    updateService: (id, s) => { setServices(p => p.map(x => x.id === id ? { ...x, ...s } : x));  addLog(`[Admin] Updated Service ID: ${id}`) },
    deleteService: (id) => { setServices(p => p.filter(x => x.id !== id));               addLog(`[Admin] Deleted Service ID: ${id}`) },
    addShowcase:    (s) => { setShowcases(p => [...p, { id: Date.now(), ...s }]);        addLog(`[Admin] Created Case Study: "${s.title}"`) },
    updateShowcase: (id, s) => { setShowcases(p => p.map(x => x.id === id ? { ...x, ...s } : x)); addLog(`[Admin] Updated Showcase ID: ${id}`) },
    deleteShowcase: (id) => { setShowcases(p => p.filter(x => x.id !== id));             addLog(`[Admin] Deleted Showcase ID: ${id}`) },
    addTestimonial:    (t) => { setTestimonials(p => [...p, { id: Date.now(), ...t }]); addLog(`[Admin] Created Testimonial by: "${t.author}"`) },
    updateTestimonial: (id, t) => { setTestimonials(p => p.map(x => x.id === id ? { ...x, ...t } : x)); addLog(`[Admin] Updated Testimonial ID: ${id}`) },
    deleteTestimonial: (id) => { setTestimonials(p => p.filter(x => x.id !== id));      addLog(`[Admin] Deleted Testimonial ID: ${id}`) },
  }

  return (
    <div className={`theme-${theme} min-h-screen relative overflow-x-hidden ${
      theme === 'swiss'
        ? 'bg-swiss-bg text-swiss-text font-satoshi'
        : 'bg-softly-bg text-softly-text font-outfit'
    }`}>
      {/* Softly ambient blobs + grain */}
      {theme === 'softly' && (
        <>
          <div className="softly-grain-overlay" />
          <div className="absolute top-[10%] left-[-10%] w-[40vw] h-[40vw] rounded-full bg-softly-peach/10 blur-[80px] pointer-events-none animate-float" />
          <div className="absolute top-[60%] right-[-10%] w-[35vw] h-[35vw] rounded-full bg-softly-lavender/10 blur-[80px] pointer-events-none animate-float" style={{ animationDelay: '2s' }} />
          <div className="absolute top-[110%] left-[20%] w-[30vw] h-[30vw] rounded-full bg-softly-sage/10 blur-[80px] pointer-events-none animate-float" style={{ animationDelay: '4s' }} />
        </>
      )}

      {/* Navbar — no theme toggle on public site */}
      <Navbar theme={theme} />

      <main>
        <Hero theme={theme} />
        <About theme={theme} />
        <ShowcaseGrid theme={theme} showcases={showcases} />
        <Services theme={theme} services={services} />
        <Testimonials theme={theme} testimonials={testimonials} />
        <Contact
          theme={theme}
          onAddSubmission={addSubmission}
          onAddConsultation={addConsultation}
        />
      </main>

      <Footer theme={theme} />
      <Chatbot theme={theme} addLog={addLog} />
    </div>
  )
}

export default App
