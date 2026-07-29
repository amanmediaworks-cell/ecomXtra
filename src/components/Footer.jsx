import React from 'react'
import { Link } from 'react-router-dom'

function Footer({ theme }) {
  const isSwiss = theme === 'swiss';
  const links = [
    { label: 'Home', path: '/' },
    { label: 'Philosophy', path: '/philosophy' },
    { label: 'Showcase', path: '/showcase' },
    { label: 'Services', path: '/services' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Contact', path: '/contact' },
  ];

  return (
    <footer className={`py-16 px-6 md:px-12 border-t ${
      isSwiss
        ? 'bg-[#111111] text-[#f2f2f2]/60 font-satoshi border-swiss-text'
        : 'bg-slate-950 text-slate-400 font-outfit border-slate-800'
    }`}>
      <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-10 md:gap-12">
        {/* Col 1: Brand */}
        <div className="flex flex-col gap-4">
          {isSwiss ? (
            <Link to="/" className="font-clash text-2xl font-bold text-white tracking-tighter hover:opacity-80 transition-opacity">
              ECOMXTRA
            </Link>
          ) : (
            <Link to="/" className="font-outfit font-extrabold text-2xl text-white flex items-center gap-0.5 select-none hover:opacity-90 transition-opacity">
              <span className="font-bold text-white">ecom</span>
              <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 px-0.5">X</span>
              <span className="font-bold text-white">tra</span>
            </Link>
          )}
          <p className="text-xs leading-relaxed max-w-[220px]">
            High-converting custom store design, catalog automation, and custom Hinglish AI closers.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <span className={`font-bold text-xs uppercase tracking-widest block mb-4 ${
            isSwiss ? 'text-white' : 'text-violet-400'
          }`}>
            Navigation
          </span>
          <ul className="space-y-2.5 text-xs font-medium">
            {links.map((link) => (
              <li key={link.label}>
                <Link to={link.path} className={`transition-colors ${isSwiss ? 'hover:text-white' : 'hover:text-pink-400'}`}>
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Details & Corporate Info */}
        <div>
          <span className={`font-bold text-xs uppercase tracking-widest block mb-4 ${
            isSwiss ? 'text-white' : 'text-violet-400'
          }`}>
            Corporate Info
          </span>
          <ul className="space-y-2.5 text-xs font-medium">
            <li>Parent Co: Quadranex IT Solutions</li>
            <li>Email: info@ecomxtra.in</li>
            <li>Phone: +91 8700259557</li>
          </ul>
        </div>

        {/* Col 4: Socials */}
        <div>
          <span className={`font-bold text-xs uppercase tracking-widest block mb-4 ${
            isSwiss ? 'text-white' : 'text-violet-400'
          }`}>
            Social Links
          </span>
          <ul className="space-y-2.5 text-xs font-medium">
            <li><a href="https://github.com" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isSwiss ? 'hover:text-white' : 'hover:text-pink-400'}`}>GitHub</a></li>
            <li><a href="https://linkedin.com" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isSwiss ? 'hover:text-white' : 'hover:text-pink-400'}`}>LinkedIn</a></li>
            <li><a href="https://x.com" target="_blank" rel="noopener noreferrer" className={`transition-colors ${isSwiss ? 'hover:text-white' : 'hover:text-pink-400'}`}>X / Twitter</a></li>
          </ul>
        </div>
      </div>

      {/* Separator and copyright */}
      <div className={`max-w-7xl mx-auto border-t mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] ${
        isSwiss ? 'border-white/10 text-white/50' : 'border-slate-800/80 text-slate-500'
      }`}>
        <span>© {new Date().getFullYear()} EcomXtra. All rights reserved.</span>
        <span>A Quadranex IT Solutions Subsidiary.</span>
      </div>
    </footer>
  );
}

export default Footer
