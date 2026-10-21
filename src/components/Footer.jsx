import { Link } from 'react-router-dom'
import { ExternalLink } from 'lucide-react'

function Footer({ content }) {

    const defaultLinks = [
        { label: 'Home', path: '/' },
        { label: 'Philosophy', path: '/philosophy' },
        { label: 'Showcase', path: '/showcase' },
        { label: 'Services', path: '/services' },
        { label: 'Blog', path: '/blog' },
        { label: 'Testimonials', path: '/testimonials' },
        { label: 'Contact', path: '/contact' },
    ];
    const links = content?.navigationLinks?.length ? content.navigationLinks : defaultLinks
    const socialLinks = content?.socialLinks || [
        { label: 'GitHub', url: 'https://github.com' },
        { label: 'LinkedIn', url: 'https://linkedin.com' },
        { label: 'X / Twitter', url: 'https://x.com' },
    ]

    return (
        <footer className={`py-10 md:py-12 px-4 sm:px-6 md:px-12 border-t ${'bg-slate-950 text-slate-400 font-outfit border-slate-800'
            }`}>
            <div className="max-w-7xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 md:gap-8">
                {/* Col 1: Brand */}
                <div className="flex flex-col gap-3">
                    {<Link to="/" className="font-outfit font-extrabold text-xl text-white flex items-center gap-2 select-none hover:opacity-90 transition-opacity">
                        <img src="/logo.png" alt="EcomXtra" className="w-6 h-6 rounded-full object-contain shrink-0 drop-shadow-sm" />
                        <div className="flex items-center gap-0.5">
                            <span className="font-bold text-white">ecom</span>
                            <span className="font-black text-transparent bg-clip-text bg-gradient-to-r from-violet-400 via-pink-400 to-amber-400 px-0.5">X</span>
                            <span className="font-bold text-white">tra</span>
                        </div>
                    </Link>}
                    <p className="text-xs leading-relaxed max-w-[220px]">
                        {content?.companyDescription || 'High-converting custom store design, catalog automation, and custom Hinglish AI closers.'}
                    </p>
                </div>

                {/* Col 2: Navigation */}
                <div>
                    <span className={`font-bold text-xs uppercase tracking-widest block mb-3 ${'text-violet-400'
                        }`}>
                        Navigation
                    </span>
                    <ul className="space-y-2 text-xs font-medium">
                        {links.map((link) => (
                            <li key={link.label}>
                                <Link to={link.path} className="transition-colors hover:text-pink-400">
                                    {link.label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Col 3: Details & Corporate Info */}
                <div>
                    <span className={`font-bold text-xs uppercase tracking-widest block mb-3 ${'text-violet-400'
                        }`}>
                        Corporate Info
                    </span>
                    <ul className="space-y-2 text-xs font-medium">
                        <li>
                            Parent Co:{' '}
                            <a href={content?.parentCompanyUrl || 'https://quadranex-seven.vercel.app/'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-pink-400">
                                {content?.parentCompany || 'Quadranex IT Solutions'}
                                <ExternalLink aria-hidden="true" className="h-3 w-3" />
                            </a>
                        </li>
                        <li>Email: {content?.email || 'info@ecomxtra.in'}</li>
                        <li>Phone: {content?.phone || '+91 8700259557'}</li>
                    </ul>
                </div>

                {/* Col 4: Socials */}
                <div>
                    <span className={`font-bold text-xs uppercase tracking-widest block mb-3 ${'text-violet-400'
                        }`}>
                        Social Links
                    </span>
                    <ul className="space-y-2 text-xs font-medium">
                        {socialLinks.map(link => (
                            <li key={link.label}>
                                <a href={link.url} target="_blank" rel="noopener noreferrer" className="transition-colors hover:text-pink-400">{link.label}</a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>

            {/* Separator and copyright */}
            <div className={`max-w-7xl mx-auto border-t mt-8 pt-6 flex flex-col sm:flex-row justify-between items-center gap-4 text-[10px] ${'border-slate-800/80 text-slate-500'
                }`}>
                <span>© {new Date().getFullYear()} {content?.copyright || 'EcomXtra. All rights reserved.'}</span>
                <span>
                    A{' '}
                    <a href={content?.parentCompanyUrl || 'https://quadranex-seven.vercel.app/'} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 transition-colors hover:text-pink-400">
                        {content?.parentCompany || 'Quadranex IT Solutions'}
                        <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </a>{' '}
                    Subsidiary.
                </span>
            </div>
        </footer>
    );
}

export default Footer
