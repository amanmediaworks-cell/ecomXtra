import About from '../components/About'
import HomeContentSection from '../components/HomeContentSection'
import { ArrowRight, ExternalLink } from 'lucide-react'
import { siteContentFallback } from '../data/siteContentDefaults'
import ContactModalTrigger from '../components/ContactModalTrigger'

function PhilosophyPage({ siteContent = [] }) {
    const rows = Object.fromEntries(siteContent.map(row => [row.content_key, row]))
    const getContent = key => rows[key]
        ? { ...siteContentFallback[key]?.content, ...rows[key].content }
        : null

    return (
        <div className="pt-20 md:pt-24 pb-4">
            {/* Page Header */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${'font-outfit text-violet-600 font-extrabold'
                    }`}>
                    [ OUR PHILOSOPHY & METHOD ]
                </span>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    Engineering High-Converting Commerce Systems
                </h1>
                <p className={`mt-3 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                    }`}>
                    At EcomXtra (Parent Co:{' '}
                    <a href="https://quadranex-seven.vercel.app/" target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 hover:underline">
                        Quadranex IT Solutions
                        <ExternalLink aria-hidden="true" className="h-3 w-3" />
                    </a>
                    ), we reject generic agency templates. We design custom digital engines where high-speed storefronts, automated catalog syncs, and AI-driven Hinglish WhatsApp closers work in perfect harmony.
                </p>
            </section>

            {/* Philosophy Component Core */}
            {rows.about && (
                <div className="border-b border-slate-200/60">
                    <About content={getContent('about')} />
                </div>
            )}

            {/* Strategic Pillars */}
            {rows.why_choose_us && (
                <div className="border-b border-slate-200/60">
                    <HomeContentSection section="why_choose_us" content={getContent('why_choose_us')} />
                </div>
            )}

            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                {/* CTA Banner */}
                <div className={`p-6 md:p-8 text-center ${'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-2xl shadow-xl'
                    }`}>
                    <h3 className="text-xl md:text-2xl font-bold font-outfit text-white">
                        Ready to implement high-converting eCommerce systems?
                    </h3>
                    <div className="mt-4 flex justify-center">
                        <ContactModalTrigger
                            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all ${'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
                                }`}
                        >
                            Book a Strategy Consultation <ArrowRight className="w-4 h-4" />
                        </ContactModalTrigger>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PhilosophyPage
