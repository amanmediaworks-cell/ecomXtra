import { Link } from 'react-router-dom'
import ShowcaseGrid from '../components/ShowcaseGrid'
import HomeContentSection from '../components/HomeContentSection'
import { ArrowRight } from 'lucide-react'
import { siteContentFallback } from '../data/siteContentDefaults'

function ShowcasePage({
  showcases,
  siteContent = [],
}) {
  const rows = Object.fromEntries(siteContent.map(row => [row.content_key, row]))
  const getContent = key => rows[key]
    ? { ...siteContentFallback[key]?.content, ...rows[key].content }
    : null

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ PROVEN RESULTS & CASE STUDIES ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          'font-outfit text-slate-900 font-extrabold'
        }`}>
          Marketplace Audits & Growth Case Studies
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          'font-outfit text-slate-600 font-medium'
        }`}>
          Explore how EcomXtra has propelled D2C brands to the top of Amazon IN, Flipkart, Meesho, and JioMart listing ranks through precision keyword mapping, automated catalog pipelines, and CRO.
        </p>
      </section>

      {/* Showcase Grid Core */}
      <ShowcaseGrid showcases={showcases} content={getContent('showcase_section')} />

      {/* Case Study Process Breakdown */}
      {rows.process && (
        <HomeContentSection section="process" content={getContent('process')} />
      )}

      <section className="py-10 px-6 max-w-6xl mx-auto">
        {/* CTA Banner */}
        <div className={`mt-12 mb-6 p-8 md:p-12 text-center ${
          'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className="text-2xl md:text-3xl font-bold font-outfit text-white">
            Want similar marketplace ranking gains for your brand?
          </h3>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
                'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
              }`}
            >
              Request Free Marketplace Audit <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ShowcasePage
