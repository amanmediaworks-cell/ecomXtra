import { useState, useEffect, useRef } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { ArrowUpRight, ChevronDown } from 'lucide-react'
import { marketplaceServiceDefaults } from '../data/marketplaceServiceContent'
import { defaultNavigationLinks, normalizeNavigationLinks } from '../data/navigationLinks'

const marketplaceLogoDomains = {
  'amazon-account-management': 'amazon.in',
  'flipkart-account-management': 'flipkart.com',
  'meesho-account-management': 'meesho.com',
  'blinkit-account-management': 'blinkit.com',
  'jiomart-account-management': 'jiomart.com',
  'swiggy-instamart-account-management': 'swiggy.com',
  'zepto-account-management': 'zeptonow.com',
}

function MarketplaceLogo({ service }) {
  const [imageFailed, setImageFailed] = useState(false)
  const platformName = service.title.replace(' Account Management Services', '')
  const domain = marketplaceLogoDomains[service.slug]

  if (imageFailed || !domain) {
    return (
      <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#eadbc9] bg-white text-xs font-black text-[#bd6530]">
        {platformName.charAt(0)}
      </span>
    )
  }

  return (
    <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-[#eadbc9] bg-white p-1">
      <img
        src={`https://www.google.com/s2/favicons?domain=${domain}&sz=64`}
        alt={`${platformName} logo`}
        className="h-full w-full object-contain"
        loading="lazy"
        onError={() => setImageFailed(true)}
      />
    </span>
  )
}

// Logo with brand mark
function Logo() {
  return (
    <Link to="/" className="font-outfit font-extrabold tracking-tight hover:opacity-90 transition-opacity text-slate-900 flex items-center gap-2 select-none group">
      <img src="/logo.png" alt="EcomXtra Logo" className="w-8 h-8 rounded-full object-contain shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
      <div className="flex items-center gap-0.5">
        <span className="text-xl font-bold tracking-tight text-slate-900">ecom</span>
        <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 leading-none px-0.5">X</span>
        <span className="text-xl font-bold tracking-tight text-slate-900">tra</span>
      </div>
    </Link>
  )
}

function Navbar({ content }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [servicesOpen, setServicesOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const servicesMenuRef = useRef(null)
  const servicesMenuCloseTimeoutRef = useRef(null)

  const openServicesMenu = () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    setServicesOpen(true)
  }

  const scheduleServicesMenuClose = () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    servicesMenuCloseTimeoutRef.current = window.setTimeout(() => {
      setServicesOpen(false)
    }, 250)
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 8)
    }
    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
  }, [])

  useEffect(() => {
    if (!servicesOpen) return undefined

    const closeOnOutsideClick = event => {
      if (!servicesMenuRef.current?.contains(event.target)) setServicesOpen(false)
    }
    const closeOnEscape = event => {
      if (event.key === 'Escape') setServicesOpen(false)
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [servicesOpen])

  const navLinks = normalizeNavigationLinks(content?.navigationLinks || defaultNavigationLinks)
  const marketplaceManagement = marketplaceServiceDefaults.slice(0, 3)
  const quickCommerce = marketplaceServiceDefaults.slice(3)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div className="max-w-7xl mx-auto pointer-events-auto">
        <div className={`w-full rounded-full bg-white transition-all duration-300 border ${
          isScrolled
            ? 'border-slate-300/90 shadow-xl'
            : 'border-slate-200/90 shadow-md'
        }`}>
          <div className="px-5 sm:px-7 py-3 flex items-center justify-between">
            {/* Logo */}
            <Logo />

            {/* Desktop links */}
            <nav className="relative hidden md:flex items-center space-x-7 text-sm font-semibold">
              {navLinks.map(link => link.path === '/services' ? (
                <div
                  key={link.label}
                  ref={servicesMenuRef}
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesMenuClose}
                  className="relative flex items-center gap-1"
                >
                  <NavLink
                    to={link.path}
                    onClick={() => setServicesOpen(false)}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1 transition-colors ${isActive ? 'text-violet-600 font-extrabold' : 'text-slate-700 hover:text-violet-600'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                  <button
                    type="button"
                    aria-label="Open marketplace services menu"
                    aria-expanded={servicesOpen}
                    aria-controls="marketplace-services-menu"
                    onClick={openServicesMenu}
                    className="rounded p-1 text-slate-700 transition hover:bg-violet-50 hover:text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesOpen ? 'rotate-180' : ''}`} />
                  </button>
                  {servicesOpen && (
                  <div id="marketplace-services-menu" className="fixed left-1/2 top-20 z-50 w-[min(calc(100vw-32px),1160px)] -translate-x-1/2 rounded-2xl border border-[#eadbc9] bg-white p-5 shadow-[0_24px_70px_rgba(25,39,51,0.18)] lg:p-7">
                    <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
                      <div className="border-r border-[#eadbc9] pr-4">
                        <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Marketplace management</h2>
                        <div className="space-y-2">
                          {marketplaceManagement.map(service => (
                            <Link key={service.slug} onClick={() => setServicesOpen(false)} to={`/services/${service.slug}`} className="flex min-h-12 items-center gap-2 rounded-lg bg-[#fffdfa] px-2 py-2 text-sm font-semibold leading-5 text-[#243141] transition hover:bg-[#fff6e8] hover:text-[#a54f21]">
                              <MarketplaceLogo service={service} />
                              <span>{service.title.replace(' Account Management Services', '')} Account Management</span>
                              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="border-r border-[#eadbc9] pr-4">
                        <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Marketplace onboarding</h2>
                        <div className="space-y-2">
                          {quickCommerce.map(service => (
                            <Link key={service.slug} onClick={() => setServicesOpen(false)} to={`/services/${service.slug}`} className="flex min-h-12 items-center gap-2 rounded-lg bg-[#fffdfa] px-2 py-2 text-sm font-semibold leading-5 text-[#243141] transition hover:bg-[#fff6e8] hover:text-[#a54f21]">
                              <MarketplaceLogo service={service} />
                              <span>{service.title.replace(' Account Management Services', '')} Onboarding</span>
                              <ArrowUpRight className="ml-auto h-3.5 w-3.5 shrink-0" />
                            </Link>
                          ))}
                        </div>
                      </div>
                      <div className="border-r border-[#eadbc9] pr-4">
                        <h2 className="mb-5 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Seller operations</h2>
                        <div className="space-y-3 text-sm leading-6 text-slate-600">
                          <p>Product listings and catalogue updates</p>
                          <p>Seller claims and support requests</p>
                          <p>Returns, refunds, and account health</p>
                          <div className="flex flex-wrap gap-x-4 gap-y-2 pt-1">
                            <Link onClick={() => setServicesOpen(false)} to="/services" className="inline-flex items-center gap-1 font-bold text-[#243141] hover:text-[#a54f21]">
                              All services <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                            <Link onClick={() => setServicesOpen(false)} to="/blog" className="inline-flex items-center gap-1 font-bold text-[#243141] hover:text-[#a54f21]">
                              Seller guides <ArrowUpRight className="h-3.5 w-3.5" />
                            </Link>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col justify-between rounded-xl bg-[#243141] p-5 text-white">
                        <div>
                          <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffc46d]">EcomXtra support</p>
                          <h2 className="mt-3 font-clash text-xl font-bold">A partner for your marketplace operations.</h2>
                          <p className="mt-2 text-xs leading-5 text-slate-200">Choose a platform to explore the service and the work we can help manage.</p>
                        </div>
                        <Link onClick={() => setServicesOpen(false)} to="/contact" className="mt-5 inline-flex items-center justify-between rounded-lg bg-white px-3 py-2.5 text-xs font-bold text-[#243141]">
                          Talk to our team <ArrowUpRight className="h-4 w-4" />
                        </Link>
                      </div>
                    </div>
                  </div>
                  )}
                </div>
              ) : (
                <NavLink
                  key={link.label}
                  to={link.path}
                  className={({ isActive }) =>
                    `transition-colors ${isActive ? 'text-violet-600 font-extrabold' : 'text-slate-700 hover:text-violet-600'}`
                  }
                >
                  {link.label}
                </NavLink>
              ))}
            </nav>

            {/* CTA */}
            <div className="flex items-center gap-2">
              <Link
                to="/contact"
                className="hidden sm:inline-block bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-violet-500/20 transform hover:scale-105"
              >
                Consultation
              </Link>

              {/* Mobile hamburger */}
              <button
                className="md:hidden flex flex-col gap-1 p-1.5 focus:outline-none"
                onClick={() => setMobileOpen(v => !v)}
                aria-label="Toggle menu"
              >
                <span className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all ${mobileOpen ? 'rotate-45 translate-y-1.5' : ''}`} />
                <span className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
                <span className={`w-5 h-0.5 bg-slate-800 rounded-full transition-all ${mobileOpen ? '-rotate-45 -translate-y-1.5' : ''}`} />
              </button>
            </div>
          </div>
        </div>

        {/* Mobile dropdown */}
        {mobileOpen && (
          <div className="md:hidden mt-2 bg-white rounded-2xl border border-slate-200 px-6 py-4 flex flex-col gap-3 shadow-2xl pointer-events-auto">
            {navLinks.map(link => link.path === '/services' ? (
              <div key={link.label}>
                <NavLink
                  to={link.path}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    `block py-1 text-sm font-semibold transition-colors ${
                      isActive ? 'text-violet-600 font-extrabold' : 'text-slate-800 hover:text-violet-600'
                    }`
                  }
                >
                  {link.label}
                </NavLink>
                <div className="ml-3 mt-2 space-y-1 border-l border-slate-200 pl-3">
                  {marketplaceServiceDefaults.map(service => (
                    <Link
                      key={service.slug}
                      to={`/services/${service.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="block py-1.5 text-xs font-medium text-slate-600 hover:text-[#a54f21]"
                    >
                      <span className="inline-flex items-center gap-2">
                        <MarketplaceLogo service={service} />
                        {service.title.replace(' Account Management Services', '')} account management
                      </span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `text-sm font-semibold py-1 transition-colors ${
                    isActive ? 'text-violet-600 font-extrabold' : 'text-slate-800 hover:text-violet-600'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white text-xs font-bold px-5 py-2.5 rounded-full text-center shadow-md shadow-violet-500/20 mt-1"
            >
              Book Consultation
            </Link>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
