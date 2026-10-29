import ShowcaseGrid from '../components/ShowcaseGrid'
import HomeContentSection from '../components/HomeContentSection'
import { ArrowRight } from 'lucide-react'
import { siteContentFallback } from '../data/siteContentDefaults'
import ContactModalTrigger from '../components/ContactModalTrigger'

function ShowcasePage({
    showcases,
    siteContent = [],
}) {
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
                    [ PROVEN RESULTS & CASE STUDIES ]
                </span>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    Marketplace Audits & Growth Case Studies
                </h1>
                <p className={`mt-3 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                    }`}>
                    Explore how EcomXtra has propelled D2C brands to the top of Amazon IN, Flipkart, Meesho, and JioMart listing ranks through precision keyword mapping, automated catalog pipelines, and CRO.
                </p>
            </section>

            {/* Showcase Grid Core */}
            <div className="border-b border-slate-200/60">
                <ShowcaseGrid showcases={showcases} content={getContent('showcase_section')} />
            </div>

            {/* Case Study Process Breakdown */}
            {rows.process && (
                <div className="border-b border-slate-200/60">
                    <HomeContentSection section="process" content={getContent('process')} />
                </div>
            )}

            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                {/* CTA Banner */}
                <div className={`p-6 md:p-8 text-center ${'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-2xl shadow-xl'
                    }`}>
                    <h3 className="text-xl md:text-2xl font-bold font-outfit text-white">
                        Want similar marketplace ranking gains for your brand?
                    </h3>
                    <div className="mt-4 flex justify-center">
                        <ContactModalTrigger
                            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all ${'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
                                }`}
                        >
                            Request Free Marketplace Audit <ArrowRight className="w-4 h-4" />
                        </ContactModalTrigger>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ShowcasePage
