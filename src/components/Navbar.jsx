import { useState, useEffect, useRef } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, ShoppingBag, X, Zap } from 'lucide-react'
import { AnimatePresence, m } from 'motion/react'
import { marketplaceServiceDefaults } from '../data/marketplaceServiceContent'
import ContactModalTrigger from './ContactModalTrigger'
import { defaultNavigationLinks, normalizeNavigationLinks } from '../data/navigationLinks'

const marketplaceLogoDomains = {
  'amazon-account-management': 'amazon.in',
  'flipkart-account-management': 'flipkart.com',
  'meesho-account-management': 'meesho.com',
  'blinkit-account-management': 'blinkit.com',
  'jiomart-account-management': 'jiomart.com',
  'swiggy-instamart-account-management': 'swiggy.com',
  'zepto-account-management': 'zeptonow.com',
  'myntra-account-management': 'myntra.com',
  'ajio-account-management': 'ajio.com',
  'nykaa-account-management': 'nykaa.com',
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
  const { pathname, search } = useLocation()
  const letterGroups = [
    { letters: ['e', 'c', 'o', 'm'], startIndex: 0 },
    { letters: ['X'], startIndex: 4, isBrandX: true },
    { letters: ['t', 'r', 'a'], startIndex: 5 },
  ]

  return (
    <Link to="/" aria-label="EcomXtra" className="font-outfit font-extrabold tracking-tight hover:opacity-90 transition-opacity text-slate-900 flex items-center gap-2 select-none group">
      <img src="/logo.png" alt="EcomXtra Logo" className="w-8 h-8 rounded-full object-contain shrink-0 drop-shadow-sm transition-transform duration-300 group-hover:rotate-6 group-hover:scale-105" />
      <div key={`${pathname}${search}`} aria-hidden="true" className="flex items-center gap-0.5">
        {letterGroups.map((group, groupIndex) => {
          const groupLetters = group.letters.map((letter, index) => (
            <m.span
              key={`${pathname}${search}-${letter}-${group.startIndex + index}`}
              initial={{ opacity: 0, y: -8, scale: 0.8 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: (group.startIndex + index) * 0.04, ease: 'easeOut' }}
              className={group.isBrandX
                ? 'inline-block text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 leading-none px-0.5'
                : 'inline-block text-xl font-bold tracking-tight text-slate-900'}
            >
              {letter}
            </m.span>
          ))

          return group.isBrandX
            ? groupLetters
            : <span key={`${pathname}${search}-group-${groupIndex}`} className="inline-flex">{groupLetters}</span>
        })}
      </div>
    </Link>
  )
}

function Navbar({ content, servicesMenuOpen, onServicesMenuOpenChange }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const [selectedMarketplace, setSelectedMarketplace] = useState(null)
  const servicesMenuRef = useRef(null)
  const marketplaceDialogRef = useRef(null)
  const marketplaceTriggerRef = useRef(null)
  const servicesMenuCloseTimeoutRef = useRef(null)

  const openServicesMenu = () => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    onServicesMenuOpenChange(true)
  }

  const scheduleServicesMenuClose = () => {
    if (selectedMarketplace) return
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    servicesMenuCloseTimeoutRef.current = window.setTimeout(() => {
      if (!selectedMarketplace) onServicesMenuOpenChange(false)
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
    if (!servicesMenuOpen && !selectedMarketplace) return undefined

    const closeOnOutsideClick = event => {
      if (!servicesMenuRef.current?.contains(event.target)) {
        onServicesMenuOpenChange(false)
        setSelectedMarketplace(null)
      }
    }
    const closeOnEscape = event => {
      if (event.key === 'Escape') {
        if (selectedMarketplace) setSelectedMarketplace(null)
        else onServicesMenuOpenChange(false)
      }
    }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    document.addEventListener('keydown', closeOnEscape)
    return () => {
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      document.removeEventListener('keydown', closeOnEscape)
    }
  }, [servicesMenuOpen, selectedMarketplace, onServicesMenuOpenChange])

  useEffect(() => {
    if (selectedMarketplace) {
      if (!marketplaceTriggerRef.current) marketplaceTriggerRef.current = document.activeElement
      marketplaceDialogRef.current?.focus()
    } else {
      marketplaceTriggerRef.current?.focus()
      marketplaceTriggerRef.current = null
    }
  }, [selectedMarketplace])

  const navLinks = normalizeNavigationLinks(content?.navigationLinks || defaultNavigationLinks)
  const quickCommerceSlugs = new Set([
    'blinkit-account-management',
    'jiomart-account-management',
    'swiggy-instamart-account-management',
    'zepto-account-management',
  ])
  const marketplaceGroups = [
    {
      title: 'Ecommerce',
      description: 'Marketplace account support for online retail brands.',
      icon: ShoppingBag,
      services: marketplaceServiceDefaults.filter(service => !quickCommerceSlugs.has(service.slug)),
    },
    {
      title: 'Quick Commerce',
      description: 'Partner operations for quick-commerce platforms.',
      icon: Zap,
      services: marketplaceServiceDefaults.filter(service => quickCommerceSlugs.has(service.slug)),
    },
  ]
  const marketplaceName = service => service.title.replace(' Account Management Services', '')
  const openMarketplaceChooser = service => {
    window.clearTimeout(servicesMenuCloseTimeoutRef.current)
    setSelectedMarketplace(service)
  }
  const closeServices = () => {
    setSelectedMarketplace(null)
    onServicesMenuOpenChange(false)
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 pt-3 px-3 sm:px-6 pointer-events-none transition-all duration-300">
      <div ref={servicesMenuRef} className="max-w-7xl mx-auto pointer-events-auto">
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
                  onMouseEnter={openServicesMenu}
                  onMouseLeave={scheduleServicesMenuClose}
                  className="relative flex items-center gap-1"
                >
                  <NavLink
                    to={link.path}
                    onClick={() => onServicesMenuOpenChange(false)}
                    className={({ isActive }) =>
                      `inline-flex items-center gap-1 transition-colors ${isActive ? 'text-violet-600 font-extrabold' : 'text-slate-700 hover:text-violet-600'}`
                    }
                  >
                    {link.label}
                  </NavLink>
                  <button
                    type="button"
                    aria-label="Open marketplace services menu"
                    aria-expanded={servicesMenuOpen}
                    aria-controls="marketplace-services-menu"
                    onClick={openServicesMenu}
                    className="rounded p-1 text-slate-700 transition hover:bg-violet-50 hover:text-violet-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-violet-600"
                  >
                    <ChevronDown className={`h-3.5 w-3.5 transition-transform ${servicesMenuOpen ? 'rotate-180' : ''}`} />
                  </button>
                </div>
              ) : link.path === '/contact' ? (
                <ContactModalTrigger
                  key={link.label}
                  className="transition-colors text-slate-700 hover:text-violet-600"
                >
                  {link.label}
                </ContactModalTrigger>
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
              <ContactModalTrigger
                className="hidden sm:inline-block bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 hover:opacity-95 text-white text-xs font-extrabold px-6 py-2.5 rounded-full transition-all duration-300 shadow-md shadow-violet-500/20 transform hover:scale-105"
              >
                Consultation
              </ContactModalTrigger>

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

        <AnimatePresence>
        {servicesMenuOpen && (
          <m.div
            key="marketplace-services-menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            className="pointer-events-none fixed left-1/2 top-20 z-50 w-[min(calc(100vw-24px),1320px)] -translate-x-1/2"
          >
          <m.section
            id="marketplace-services-menu"
            aria-label="Marketplace services"
            onMouseEnter={openServicesMenu}
            onMouseLeave={scheduleServicesMenuClose}
            initial={{ opacity: 0, y: -12, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.99 }}
            transition={{ duration: 0.22, ease: [0.22, 1, 0.36, 1] }}
            className="pointer-events-auto max-h-[calc(100dvh-6rem)] overflow-y-auto rounded-2xl border border-[#eadbc9] bg-white p-4 shadow-[0_24px_70px_rgba(25,39,51,0.18)] sm:p-5 lg:p-7"
          >
            <div className="mb-5 flex flex-wrap items-end justify-between gap-3 border-b border-[#eadbc9] pb-4">
              <div>
                <p className="text-[10px] font-black uppercase tracking-[0.18em] text-[#bd6530]">One operations partner. {marketplaceServiceDefaults.length} platforms.</p>
                <h2 className="mt-1 font-clash text-xl font-bold text-[#243141] sm:text-2xl">Choose where you want to grow.</h2>
              </div>
              <Link onClick={() => onServicesMenuOpenChange(false)} to="/services" className="inline-flex items-center gap-1 text-xs font-bold text-[#a54f21] hover:underline">
                Explore all services <ArrowUpRight className="h-3.5 w-3.5" />
              </Link>
            </div>
            <div className="grid gap-4 lg:grid-cols-[1fr_1fr_0.85fr] lg:gap-6">
              {marketplaceGroups.map(group => {
                const GroupIcon = group.icon
                return (
                  <section key={group.title} className="rounded-xl border border-[#eadbc9] bg-[#fffdfa] p-3 sm:p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#243141] text-[#ffc46d]">
                        <GroupIcon className="h-4 w-4" />
                      </span>
                      <div>
                        <h3 className="text-sm font-extrabold text-[#243141]">{group.title}</h3>
                        <p className="text-[10px] leading-4 text-slate-500">{group.description}</p>
                      </div>
                    </div>
                    <div className="grid gap-1.5 sm:grid-cols-2 lg:grid-cols-1">
                      {group.services.map(service => (
                        <button
                          key={service.slug}
                          type="button"
                          aria-haspopup="dialog"
                          onClick={event => {
                            marketplaceTriggerRef.current = event.currentTarget
                            openMarketplaceChooser(service)
                          }}
                          className="group flex min-h-11 items-center gap-2 rounded-lg border border-transparent bg-white px-2 py-1.5 text-left text-xs font-semibold leading-4 text-[#243141] transition hover:border-[#f0d5bb] hover:bg-[#fff6e8] hover:text-[#a54f21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]"
                        >
                          <MarketplaceLogo service={service} />
                          <span>{marketplaceName(service)}<span className="block text-[10px] font-medium text-slate-500">Choose support</span></span>
                          <ArrowRight className="ml-auto h-3.5 w-3.5 shrink-0 transition-transform group-hover:translate-x-0.5" />
                        </button>
                      ))}
                    </div>
                  </section>
                )
              })}
              <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-1">
              <div className="rounded-xl border border-[#eadbc9] p-4">
                <h3 className="mb-3 text-[11px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Seller operations</h3>
                <div className="space-y-3 text-sm leading-6 text-slate-600">
                  <p>Product listings and catalogue updates</p>
                  <p>Seller claims and support requests</p>
                  <p>Returns, refunds, and account health</p>
                  <Link onClick={() => onServicesMenuOpenChange(false)} to="/blog" className="inline-flex items-center gap-1 pt-1 font-bold text-[#243141] hover:text-[#a54f21]">
                    Practical seller guides <ArrowUpRight className="h-3.5 w-3.5" />
                  </Link>
                </div>
              </div>
              <div className="flex flex-col justify-between rounded-xl bg-[#243141] p-4 text-white">
                <div>
                  <p className="text-[10px] font-bold uppercase tracking-[0.15em] text-[#ffc46d]">EcomXtra support</p>
                  <h3 className="mt-3 font-clash text-xl font-bold">A partner for your marketplace operations.</h3>
                  <p className="mt-2 text-xs leading-5 text-slate-200">Tell us where you sell—or want to launch—and we’ll help map the next step.</p>
                </div>
                <ContactModalTrigger onClick={closeServices} className="mt-5 inline-flex w-full items-center justify-between rounded-lg bg-white px-3 py-2.5 text-xs font-bold text-[#243141]">
                  Talk to our team <ArrowUpRight className="h-4 w-4" />
                </ContactModalTrigger>
              </div>
              </div>
            </div>
          </m.section>
          </m.div>
        )}
        </AnimatePresence>

        <AnimatePresence>
        {selectedMarketplace && (
          <m.div
            key="marketplace-service-dialog"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.16 }}
            className="fixed inset-0 z-[60] flex items-center justify-center bg-[#17222e]/55 p-4 backdrop-blur-sm"
            onMouseDown={event => {
              if (event.target === event.currentTarget) setSelectedMarketplace(null)
            }}
          >
            <m.section
              ref={marketplaceDialogRef}
              role="dialog"
              aria-modal="true"
              aria-labelledby="marketplace-support-title"
              tabIndex={-1}
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              transition={{ duration: 0.2, ease: [0.22, 1, 0.36, 1] }}
              onKeyDown={event => {
                if (event.key !== 'Tab') return
                const focusableElements = Array.from(event.currentTarget.querySelectorAll(
                  'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
                ))
                const firstElement = focusableElements[0]
                const lastElement = focusableElements[focusableElements.length - 1]
                if (event.shiftKey && document.activeElement === firstElement) {
                  event.preventDefault()
                  lastElement?.focus()
                } else if (!event.shiftKey && (
                  document.activeElement === lastElement
                  || document.activeElement === marketplaceDialogRef.current
                )) {
                  event.preventDefault()
                  firstElement?.focus()
                }
              }}
              className="w-full max-w-md rounded-2xl border border-[#eadbc9] bg-white p-5 shadow-[0_24px_70px_rgba(25,39,51,0.28)] sm:p-7"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex items-center gap-3">
                  <MarketplaceLogo service={selectedMarketplace} />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.16em] text-[#bd6530]">Choose a service</p>
                    <h2 id="marketplace-support-title" className="mt-1 font-clash text-xl font-bold text-[#243141]">
                      {marketplaceName(selectedMarketplace)} support
                    </h2>
                  </div>
                </div>
                <button
                  type="button"
                  aria-label="Close service selection"
                  onClick={() => setSelectedMarketplace(null)}
                  className="rounded-lg p-2 text-slate-500 transition hover:bg-slate-100 hover:text-[#243141] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => {
                  window.clearTimeout(servicesMenuCloseTimeoutRef.current)
                  onServicesMenuOpenChange(true)
                  setSelectedMarketplace(null)
                }}
                className="mt-5 inline-flex items-center gap-2 rounded-lg px-2 py-2 text-sm font-semibold text-[#a54f21] transition hover:bg-[#fff6e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to platforms
              </button>
              <p className="mt-4 text-sm leading-6 text-slate-600">
                What kind of {marketplaceName(selectedMarketplace)} support do you need?
              </p>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Link
                  onClick={closeServices}
                  to={`/services/${selectedMarketplace.slug}`}
                  className="group rounded-xl border border-[#eadbc9] bg-[#fffdfa] p-4 transition hover:border-[#bd6530] hover:bg-[#fff6e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]"
                >
                  <span className="text-sm font-extrabold text-[#243141]">Account management</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">Ongoing listings, catalogue, cases, and account operations.</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a54f21]">Explore service <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                </Link>
                <Link
                  onClick={closeServices}
                  to={`/services/${selectedMarketplace.slug}/onboarding`}
                  className="group rounded-xl border border-[#eadbc9] bg-[#fffdfa] p-4 transition hover:border-[#bd6530] hover:bg-[#fff6e8] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]"
                >
                  <span className="text-sm font-extrabold text-[#243141]">Seller onboarding</span>
                  <span className="mt-1 block text-xs leading-5 text-slate-600">Preparation and coordination to get your marketplace launch-ready.</span>
                  <span className="mt-3 inline-flex items-center gap-1 text-xs font-bold text-[#a54f21]">Explore onboarding <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5" /></span>
                </Link>
              </div>
            </m.section>
          </m.div>
        )}
        </AnimatePresence>

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
                  {marketplaceGroups.map(group => (
                    <section key={group.title} className="py-2">
                      <p className="text-[10px] font-black uppercase tracking-[0.12em] text-[#bd6530]">{group.title}</p>
                      <div className="mt-1 grid grid-cols-2 gap-1">
                        {group.services.map(service => (
                          <button
                            key={service.slug}
                            type="button"
                            aria-haspopup="dialog"
                            onClick={event => {
                              marketplaceTriggerRef.current = event.currentTarget
                              setMobileOpen(false)
                              openMarketplaceChooser(service)
                            }}
                            className="flex items-center gap-2 rounded-lg px-2 py-2 text-left text-xs font-medium text-slate-600 hover:bg-[#fff6e8] hover:text-[#a54f21] focus-visible:outline focus-visible:outline-2 focus-visible:outline-[#bd6530]"
                          >
                            <MarketplaceLogo service={service} />
                            {marketplaceName(service)}
                          </button>
                        ))}
                      </div>
                    </section>
                      ))}
                </div>
              </div>
            ) : link.path === '/contact' ? (
              <ContactModalTrigger
                key={link.label}
                onClick={() => setMobileOpen(false)}
                className="py-1 text-left text-sm font-semibold text-slate-800 transition-colors hover:text-violet-600"
              >
                {link.label}
              </ContactModalTrigger>
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
            <ContactModalTrigger
              onClick={() => setMobileOpen(false)}
              className="bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white text-xs font-bold px-5 py-2.5 rounded-full text-center shadow-md shadow-violet-500/20 mt-1"
            >
              Book Consultation
            </ContactModalTrigger>
          </div>
        )}
      </div>
    </header>
  )
}

export default Navbar
