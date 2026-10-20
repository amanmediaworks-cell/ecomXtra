import { useState } from 'react'
import { Link, NavLink } from 'react-router-dom'

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

  const defaultLinks = [
    { label: 'Home',         path: '/' },
    { label: 'Philosophy',   path: '/philosophy' },
    { label: 'Showcase',     path: '/showcase' },
    { label: 'Services',     path: '/services' },
    { label: 'Blog',         path: '/blog' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact',      path: '/contact' },
  ]
  const navLinks = content?.navigationLinks?.length ? content.navigationLinks : defaultLinks

  return (
    <header className="fixed top-3 sm:top-4 left-0 right-0 z-40 mx-auto max-w-6xl px-3 sm:px-4 transition-all duration-500">
      <div className="bg-white/90 backdrop-blur-xl border border-violet-150/80 shadow-lg shadow-violet-500/5 rounded-full py-3 px-5 sm:px-8 flex items-center justify-between">
        {/* Logo */}
        <Logo  />

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
