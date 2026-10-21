import Contact from '../components/Contact'
import { Mail, Phone, Building2, ExternalLink } from 'lucide-react'

function ContactPage() {


    return (
        <div className="pt-20 md:pt-24 pb-4">
            {/* Page Header */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${'font-outfit text-violet-600 font-extrabold'
                    }`}>
                    [ CONTACT US & CAREERS PORTAL ]
                </span>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    Let's Build & Scale Together
                </h1>
                <p className={`mt-3 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                    }`}>
                    Book a technical consultation for your store, or apply for open engineering, marketing, and design positions at EcomXtra.
                </p>
            </section>

            {/* Direct Quick Contact Grid */}
            <section className="py-6 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
                    <a
                        href="mailto:info@ecomxtra.in"
                        className={`p-4 sm:p-5 flex items-center gap-3.5 transition-all ${'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-xl shadow-sm hover:border-violet-400'
                            }`}
                    >
                        <div className="p-3 rounded-lg bg-violet-100 text-violet-600">
                            <Mail className="w-4 h-4" />
                        </div>
                        <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest block ${'font-outfit text-slate-400'
                                }`}>
                                Direct Email
                            </span>
                            <span className={`text-xs sm:text-sm font-bold block ${'font-outfit text-slate-900 font-extrabold'
                                }`}>
                                info@ecomxtra.in
                            </span>
                        </div>
                    </a>

                    <a
                        href="https://wa.me/918700259557?text=Hi%20EcomXtra%2C%20I%20want%20to%20request%20a%20quotation"
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`p-4 sm:p-5 flex items-center gap-3.5 transition-all ${'bg-white/95 backdrop-blur-md border-2 border-pink-150 rounded-xl shadow-sm hover:border-pink-400'
                            }`}
                    >
                        <div className="p-3 rounded-lg bg-pink-100 text-pink-600">
                            <Phone className="w-4 h-4" />
                        </div>
                        <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest block ${'font-outfit text-slate-400'
                                }`}>
                                Phone & WhatsApp
                            </span>
                            <span className={`text-xs sm:text-sm font-bold block ${'font-outfit text-slate-900 font-extrabold'
                                }`}>
                                +91 8700259557
                            </span>
                        </div>
                    </a>

                    <div
                        className={`p-4 sm:p-5 flex items-center gap-3.5 ${'bg-white/95 backdrop-blur-md border-2 border-amber-150 rounded-xl shadow-sm'
                            }`}
                    >
                        <div className="p-3 rounded-lg bg-amber-100 text-amber-600">
                            <Building2 className="w-4 h-4" />
                        </div>
                        <div>
                            <span className={`text-[10px] font-black uppercase tracking-widest block ${'font-outfit text-slate-400'
                                }`}>
                                Parent Company
                            </span>
                            <span className={`text-xs sm:text-sm font-bold block ${'font-outfit text-slate-900 font-extrabold'
                                }`}>
                                <a href="https://quadranex-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                                    Quadranex IT Solutions
                                    <ExternalLink aria-hidden="true" className="h-3 w-3" />
                                </a>
                            </span>
                        </div>
                    </div>
                </div>
            </section>

            {/* Main Double Portal Form */}
            <Contact />
        </div>
    )
}

export default ContactPage
