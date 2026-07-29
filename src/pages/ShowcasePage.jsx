import React from 'react'
import { Link } from 'react-router-dom'
import ShowcaseGrid from '../components/ShowcaseGrid'
import { ArrowRight } from 'lucide-react'

function ShowcasePage({ theme, showcases }) {
  const isSwiss = theme === 'swiss'

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ PROVEN RESULTS & CASE STUDIES ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          Marketplace Audits & Growth Case Studies
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
        }`}>
          Explore how EcomXtra has propelled D2C brands to the top of Amazon IN, Flipkart, Meesho, and JioMart listing ranks through precision keyword mapping, automated catalog pipelines, and CRO.
        </p>
      </section>

      {/* Showcase Grid Core */}
      <ShowcaseGrid theme={theme} showcases={showcases} />

      {/* Case Study Process Breakdown */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className={`text-2xl md:text-4xl font-bold mb-8 ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          Our 3-Phase Marketplace Growth Framework
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg'
          }`}>
            <div className="text-3xl font-black text-violet-600 mb-4">01</div>
            <h3 className={`text-lg font-bold mb-2 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900'}`}>
              Algorithm & Keyword Audit
            </h3>
            <p className={`text-xs leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              We evaluate search indexing, competitor ranking gaps, and buy-box ownership rates across target marketplace platforms.
            </p>
          </div>

          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-pink-150 rounded-3xl shadow-lg'
          }`}>
            <div className="text-3xl font-black text-pink-600 mb-4">02</div>
            <h3 className={`text-lg font-bold mb-2 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900'}`}>
              Listing & Creative Optimization
            </h3>
            <p className={`text-xs leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              Overhauling A+ content, bullet points, mobile-first carousel images, and localized search tags for maximum organic CTR.
            </p>
          </div>

          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-amber-150 rounded-3xl shadow-lg'
          }`}>
            <div className="text-3xl font-black text-amber-600 mb-4">03</div>
            <h3 className={`text-lg font-bold mb-2 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900'}`}>
              Automated Conversions & PPC
            </h3>
            <p className={`text-xs leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              Deploying Hinglish WhatsApp chatbots and target ad campaigns to continuously scale sales volume and maintain #1 ranking spots.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className={`mt-12 mb-6 p-8 md:p-12 text-center ${
          isSwiss ? 'border border-swiss-text bg-swiss-bg' : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className={`text-2xl md:text-3xl font-bold ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-white'}`}>
            Want similar marketplace ranking gains for your brand?
          </h3>
          <div className="mt-6 flex justify-center">
            <Link
              to="/contact"
              className={`inline-flex items-center gap-2 px-8 py-4 text-xs font-black tracking-widest uppercase transition-all ${
                isSwiss
                  ? 'bg-swiss-text text-swiss-bg border border-swiss-text hover:bg-swiss-bg hover:text-swiss-text'
                  : 'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
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
