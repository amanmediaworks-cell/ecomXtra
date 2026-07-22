import React, { useState } from 'react'

// Logo with oversized X
function Logo({ theme }) {
  if (theme === 'swiss') {
    return (
      <a href="#" className="font-clash font-bold tracking-tighter hover:opacity-80 transition-opacity text-swiss-text flex items-baseline gap-0 select-none">
        <span className="text-2xl font-black">ECOM</span>
        <span className="text-5xl font-black leading-none" style={{ lineHeight: 1, transform: 'translateY(4px)', display: 'inline-block' }}>X</span>
        <span className="text-2xl font-black">TRA</span>
        <span className="text-[9px] align-super ml-0.5 font-bold opacity-60">®</span>
      </a>
    )
  }
  return (
    <a href="#" className="font-outfit font-bold tracking-tight hover:opacity-80 transition-opacity text-softly-text flex items-baseline gap-0 select-none">
      <span className="text-lg font-semibold">ecom</span>
      <span className="text-4xl font-black text-softly-peach leading-none" style={{ lineHeight: 1, transform: 'translateY(3px)', display: 'inline-block' }}>x</span>
      <span className="text-lg font-semibold">tra</span>
    </a>
  )
}

function Navbar({ theme }) {
  const [mobileOpen, setMobileOpen] = useState(false)

  const navLinks = [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Showcase',   href: '#showcase' },
    { label: 'Services',   href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Careers',    href: '#contact' },
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
              <a
                key={link.label}
                href={link.href}
                className="font-satoshi text-[11px] font-black tracking-widest uppercase text-swiss-text hover:underline underline-offset-4 decoration-2 transition-all"
              >
                {link.label}
              </a>
            ))}
          </nav>

          {/* CTA */}
          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden sm:inline-block text-[11px] font-satoshi font-black tracking-widest uppercase bg-swiss-text text-swiss-bg px-6 py-3 border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text transition-all duration-300"
            >
              Book Consultation
            </a>

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
              <a
                key={link.label}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setMobileOpen(false)}
              className="text-[11px] font-satoshi font-black tracking-widest uppercase bg-swiss-text text-swiss-bg px-6 py-3 text-center border border-swiss-text"
            >
              Book Consultation
            </a>
          </div>
        )}
      </header>
    )
  }

  // ── Softly Wellness Navbar ─────────────────────────────────────────────
  return (
    <header className="fixed top-4 left-0 right-0 z-40 mx-auto max-w-6xl px-4 transition-all duration-500">
      <div className="bg-softly-bg/75 backdrop-blur-lg border border-softly-sand shadow-sm rounded-full py-3 px-6 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Logo theme="softly" />

        {/* Desktop links */}
        <nav className="hidden md:flex items-center space-x-6 text-sm font-medium">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              className="text-softly-text/80 hover:text-softly-sage transition-colors"
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* CTA */}
        <div className="flex items-center gap-2">
          <a
            href="#contact"
            className="bg-softly-sage text-softly-bg text-xs font-semibold px-5 py-2.5 rounded-full hover:bg-softly-peach transition-all duration-300 shadow-sm"
          >
            Consultation
          </a>

          {/* Mobile hamburger */}
          <button
            className="md:hidden flex flex-col gap-1 p-2"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            <span className="w-5 h-0.5 bg-softly-text rounded-full" />
            <span className="w-5 h-0.5 bg-softly-text rounded-full" />
            <span className="w-5 h-0.5 bg-softly-text rounded-full" />
          </button>
        </div>
      </div>

      {/* Mobile dropdown */}
      {mobileOpen && (
        <div className="md:hidden mt-2 bg-softly-bg border border-softly-sand rounded-2xl px-6 py-4 flex flex-col gap-3 shadow-md">
          {navLinks.map(link => (
            <a
              key={link.label}
              href={link.href}
              onClick={() => setMobileOpen(false)}
              className="text-sm font-medium text-softly-text/80 hover:text-softly-sage transition-colors"
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </header>
  )
}

export default Navbar
