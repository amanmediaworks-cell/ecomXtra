import React, { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

// Logo with oversized X
function Logo({ theme }) {
  if (theme === 'swiss') {
    return (
      <Link to="/" className="font-clash font-bold tracking-tighter hover:opacity-80 transition-opacity text-swiss-text flex items-baseline gap-0 select-none">
        <span className="text-2xl font-black">ECOM</span>
        <span className="text-5xl font-black leading-none" style={{ lineHeight: 1, transform: 'translateY(4px)', display: 'inline-block' }}>X</span>
        <span className="text-2xl font-black">TRA</span>
        <span className="text-[9px] align-super ml-0.5 font-bold opacity-60">®</span>
      </Link>
    )
  }
  return (
    <Link to="/" className="font-outfit font-extrabold tracking-tight hover:opacity-90 transition-opacity text-slate-900 flex items-center gap-0.5 select-none">
      <span className="text-xl font-bold tracking-tight text-slate-900">ecom</span>
      <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 leading-none px-0.5">X</span>
      <span className="text-xl font-bold tracking-tight text-slate-900">tra</span>
    </Link>
  )
}

function Navbar({ theme }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Home',         path: '/' },
    { label: 'Philosophy',   path: '/philosophy' },
    { label: 'Showcase',     path: '/showcase' },
    { label: 'Services',     path: '/services' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact',      path: '/contact' },
  ]

  // ── Swiss Brutalist Navbar ─────────────────────────────────────────────
  if (theme === 'swiss') {
    return (
      <header className="sticky top-0 z-40 w-full bg-swiss-bg/90 backdrop-blur-md border-b border-swiss-text transition-all duration-300">
        <div className="flex items-center justify-between px-6 md:px-12 h-[72px]">
          {/* Logo */}
          <Logo theme="swiss" />

          {/* Desktop nav links */}
          <nav className="hidden md:flex items-center space-x-8">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.path}
                className={({ isActive }) =>
                  `font-satoshi text-[11px] font-black tracking-widest uppercase text-swiss-text transition-all ${
                    isActive ? 'underline underline-offset-4 decoration-2' : 'hover:underline underline-offset-4 decoration-2'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <Link
              to="/contact"
              className="hidden sm:inline-block text-[11px] font-satoshi font-black tracking-widest uppercase bg-swiss-text text-swiss-bg px-6 py-3 border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text transition-all duration-300"
            >
              Book Consultation
            </Link>

            {/* Mobile hamburger */}
            <button
              className="md:hidden flex flex-col gap-1.5 p-2"
              onClick={() => setMobileOpen(v => !v)}
              aria-label="Toggle menu"
            >
              <span className={`w-5 h-0.5 bg-swiss-text transition-all ${mobileOpen ? 'rotate-45 translate-y-2' : ''}`} />
              <span className={`w-5 h-0.5 bg-swiss-text transition-all ${mobileOpen ? 'opacity-0' : ''}`} />
              <span className={`w-5 h-0.5 bg-swiss-text transition-all ${mobileOpen ? '-rotate-45 -translate-y-2' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-swiss-text bg-swiss-bg px-6 py-4 flex flex-col gap-4">
            {navLinks.map(link => (
              <NavLink
                key={link.label}
                to={link.path}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text ${
                    isActive ? 'underline underline-offset-4 decoration-2' : ''
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            <Link
              to="/contact"
              onClick={() => setMobileOpen(false)}
              className="text-[11px] font-satoshi font-black tracking-widest uppercase bg-swiss-text text-swiss-bg px-6 py-3 text-center border border-swiss-text"
            >
              Book Consultation
            </Link>
          </div>
        )}
      </header>
    )
  }

  // ── Colourful Theme Navbar ─────────────────────────────────────────────
  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 mx-auto max-w-6xl px-3 sm:px-4 transition-all duration-500">
      <div className="bg-white/90 backdrop-blur-xl border border-violet-150/80 shadow-lg shadow-violet-500/5 rounded-full py-3 px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Logo theme="colourful" />

        {/* Desktop links */}
        <nav className="hidden md:flex items-center space-x-7 text-sm font-semibold">
          {navLinks.map(link => (
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

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 bg-white/95 backdrop-blur-xl border border-violet-100 rounded-2xl px-6 py-4 flex flex-col gap-3 shadow-xl">
          {navLinks.map(link => (
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
    </header>
  )
}

export default Navbar
