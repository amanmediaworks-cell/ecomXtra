import React from 'react'

function Footer({ theme }) {
  const links = [
    { label: 'Philosophy', href: '#philosophy' },
    { label: 'Showcase', href: '#showcase' },
    { label: 'Services', href: '#services' },
    { label: 'Testimonials', href: '#testimonials' },
    { label: 'Contact', href: '#contact' },
  ];

  if (theme === 'swiss') {
    return (
      <footer className="bg-[#111111] text-[#f2f2f2]/60 font-satoshi py-16 px-6 md:px-12 border-t border-swiss-text">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Col 1: Brand */}
          <div className="flex flex-col gap-4">
            <span className="font-clash text-2xl font-bold text-white tracking-tighter">
              ECOMXTRA
            </span>
            <p className="text-xs leading-relaxed max-w-[200px]">
              High-converting custom store design, catalog automation, and custom Hinglish AI closers.
            </p>
          </div>

          {/* Col 2: Navigation */}
          <div>
            <span className="font-bold text-xs uppercase tracking-widest text-white block mb-4">
              Navigation
            </span>
            <ul className="space-y-2 text-xs">
              {links.map((link) => (
                <li key={link.label}>
                  <a href={link.href} className="hover:text-white transition-colors">
                    {link.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Col 3: Details & Identifier */}
          <div>
            <span className="font-bold text-xs uppercase tracking-widest text-white block mb-4">
              Corporate Info
            </span>
            <ul className="space-y-2 text-xs">
              <li>Parent Co: Identifier IT Solutions</li>
              <li>Support: hello@ecomxtra.com</li>
              <li>Region: New Delhi, India</li>
            </ul>
          </div>

          {/* Col 4: Socials */}
          <div>
            <span className="font-bold text-xs uppercase tracking-widest text-white block mb-4">
              Social Links
            </span>
            <ul className="space-y-2 text-xs">
              <li><a href="#" className="hover:text-white transition-colors">GitHub</a></li>
              <li><a href="#" className="hover:text-white transition-colors">LinkedIn</a></li>
              <li><a href="#" className="hover:text-white transition-colors">X / Twitter</a></li>
            </ul>
          </div>
        </div>

        {/* Separator and copyright */}
        <div className="max-w-7xl mx-auto border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px]">
          <span>© {new Date().getFullYear()} EcomXtra. All rights reserved.</span>
          <span>An Identifier IT Solutions Subsidiary.</span>
        </div>
      </footer>
    );
  }

  // Softly Theme Footer
  return (
    <footer className="bg-softly-sand/50 text-softly-text/80 font-outfit py-16 px-6 border-t border-softly-sand">
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12">
        {/* Col 1: Brand */}
        <div className="flex flex-col gap-4">
          <span className="font-bold text-lg text-softly-sage tracking-tight">
            ecom<span className="text-softly-peach font-extrabold">xtra</span>
          </span>
          <p className="text-xs leading-relaxed max-w-[220px]">
            Serene design setups, automated workflows, and quiet marketplace listings growth.
          </p>
        </div>

        {/* Col 2: Navigation */}
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-softly-sage block mb-4">
            Navigate
          </span>
          <ul className="space-y-2 text-xs">
            {links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-softly-peach transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        {/* Col 3: Details */}
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-softly-sage block mb-4">
            Details
          </span>
          <ul className="space-y-2 text-xs">
            <li>Identifier IT Solutions Parent Co.</li>
            <li>hello@ecomxtra.com</li>
            <li>New Delhi, India</li>
          </ul>
        </div>

        {/* Col 4: Socials */}
        <div>
          <span className="font-bold text-xs uppercase tracking-wider text-softly-sage block mb-4">
            Connect
          </span>
          <ul className="space-y-2 text-xs flex flex-col gap-1.5">
            <li><a href="#" className="hover:text-softly-peach transition-colors">LinkedIn</a></li>
            <li><a href="#" className="hover:text-softly-peach transition-colors">Instagram</a></li>
            <li><a href="#" className="hover:text-softly-peach transition-colors">Twitter</a></li>
          </ul>
        </div>
      </div>

      <div className="max-w-6xl mx-auto border-t border-softly-sand mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] text-softly-text/60">
        <span>© {new Date().getFullYear()} ecomxtra. All rights reserved.</span>
        <span>A serene eCommerce agency powered by Identifier.</span>
      </div>
    </footer>
  );
}

export default Footer
