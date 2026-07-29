import React from 'react'
import { Link } from 'react-router-dom'
import About from '../components/About'
import { ArrowRight, ShieldCheck, Zap, Cpu, BarChart3 } from 'lucide-react'

function PhilosophyPage({ theme }) {
  const isSwiss = theme === 'swiss'

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ OUR PHILOSOPHY & METHOD ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          Engineering High-Converting Commerce Systems
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
        }`}>
          At EcomXtra (Parent Co: Quadranex IT Solutions), we reject generic agency templates. We design custom digital engines where high-speed storefronts, automated catalog syncs, and AI-driven Hinglish WhatsApp closers work in perfect harmony.
        </p>
      </section>

      {/* Philosophy Component Core */}
      <About theme={theme} />

      {/* Strategic Pillars */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className={`text-2xl md:text-4xl font-bold mb-8 ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          The 4 Core Pillars of EcomXtra
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
              isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-gradient-to-r from-violet-600 to-pink-500 text-white'
            }`}>
              <Zap className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-bold'}`}>
              Sub-Second Speed Architecture
            </h3>
            <p className={`text-sm leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              Speed directly dictates conversion rate. We engineer headless storefronts and optimized Shopify setups with instant page load times to eliminate bounce rates.
            </p>
          </div>

          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-pink-150 rounded-3xl shadow-lg'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
              isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-gradient-to-r from-pink-500 to-amber-500 text-white'
            }`}>
              <Cpu className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-bold'}`}>
              Hinglish AI Conversational Closers
            </h3>
            <p className={`text-sm leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              Indian buyers convert when spoken to in natural language. Our custom WhatsApp AI chatbots engage leads, resolve COD queries, and recover abandoned carts 24/7.
            </p>
          </div>

          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-amber-150 rounded-3xl shadow-lg'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
              isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-gradient-to-r from-amber-500 to-emerald-500 text-white'
            }`}>
              <BarChart3 className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-bold'}`}>
              Algorithmic Marketplace Dominance
            </h3>
            <p className={`text-sm leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              From Amazon IN to Flipkart & Meesho, we optimize listing keywords, A+ content, and fulfillment pipelines to guarantee top category placements.
            </p>
          </div>

          <div className={`p-8 ${
            isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/90 backdrop-blur-md border-2 border-emerald-150 rounded-3xl shadow-lg'
          }`}>
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
              isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-gradient-to-r from-emerald-500 to-violet-600 text-white'
            }`}>
              <ShieldCheck className="w-6 h-6" />
            </div>
            <h3 className={`text-xl font-bold mb-3 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-bold'}`}>
              Enterprise Backend Reliability
            </h3>
            <p className={`text-sm leading-relaxed ${isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600'}`}>
              Backing every deployment with Quadranex IT Solutions enterprise architecture, ensuring 99.99% uptime during high-volume sales events.
            </p>
          </div>
        </div>

        {/* CTA Banner */}
        <div className={`mt-12 mb-6 p-8 md:p-12 text-center ${
          isSwiss ? 'border border-swiss-text bg-swiss-bg' : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className={`text-2xl md:text-3xl font-bold ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-white'}`}>
            Ready to implement high-converting eCommerce systems?
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
              Book a Strategy Consultation <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default PhilosophyPage
