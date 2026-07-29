import React from 'react'
import Contact from '../components/Contact'
import { Mail, Phone, Building2 } from 'lucide-react'

function ContactPage({ theme, onAddSubmission, onAddConsultation }) {
  const isSwiss = theme === 'swiss'

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ CONTACT US & CAREERS PORTAL ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          Let's Build & Scale Together
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
        }`}>
          Book a technical consultation for your store, or apply for open engineering, marketing, and design positions at EcomXtra.
        </p>
      </section>

      {/* Direct Quick Contact Grid */}
      <section className="py-8 px-6 max-w-6xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <a
            href="mailto:info@ecomxtra.in"
            className={`p-6 flex items-center gap-4 transition-all ${
              isSwiss
                ? 'border border-swiss-text bg-white hover:bg-swiss-bg/40'
                : 'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-2xl shadow-md hover:border-violet-400'
            }`}
          >
            <div className={`p-3.5 rounded-xl ${isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-violet-100 text-violet-600'}`}>
              <Mail className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest block ${
                isSwiss ? 'font-satoshi text-swiss-text/60' : 'font-outfit text-slate-400'
              }`}>
                Direct Email
              </span>
              <span className={`text-sm font-bold block ${
                isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
              }`}>
                info@ecomxtra.in
              </span>
            </div>
          </a>

          <a
            href="https://wa.me/918700259557?text=Hi%20EcomXtra%2C%20I%20want%20to%20request%20a%20quotation"
            target="_blank"
            rel="noopener noreferrer"
            className={`p-6 flex items-center gap-4 transition-all ${
              isSwiss
                ? 'border border-swiss-text bg-white hover:bg-swiss-bg/40'
                : 'bg-white/95 backdrop-blur-md border-2 border-pink-150 rounded-2xl shadow-md hover:border-pink-400'
            }`}
          >
            <div className={`p-3.5 rounded-xl ${isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-pink-100 text-pink-600'}`}>
              <Phone className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest block ${
                isSwiss ? 'font-satoshi text-swiss-text/60' : 'font-outfit text-slate-400'
              }`}>
                Phone & WhatsApp
              </span>
              <span className={`text-sm font-bold block ${
                isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
              }`}>
                +91 8700259557
              </span>
            </div>
          </a>

          <div
            className={`p-6 flex items-center gap-4 ${
              isSwiss
                ? 'border border-swiss-text bg-white'
                : 'bg-white/95 backdrop-blur-md border-2 border-amber-150 rounded-2xl shadow-md'
            }`}
          >
            <div className={`p-3.5 rounded-xl ${isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-amber-100 text-amber-600'}`}>
              <Building2 className="w-5 h-5" />
            </div>
            <div>
              <span className={`text-[10px] font-black uppercase tracking-widest block ${
                isSwiss ? 'font-satoshi text-swiss-text/60' : 'font-outfit text-slate-400'
              }`}>
                Parent Company
              </span>
              <span className={`text-sm font-bold block ${
                isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
              }`}>
                Quadranex IT Solutions
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Main Double Portal Form */}
      <Contact
        theme={theme}
        onAddSubmission={onAddSubmission}
        onAddConsultation={onAddConsultation}
      />
    </div>
  )
}

export default ContactPage
