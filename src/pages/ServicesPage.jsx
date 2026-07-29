import React from 'react'
import { Link } from 'react-router-dom'
import Services from '../components/Services'
import { ArrowRight, Bot, Settings, Store, Target } from 'lucide-react'

function ServicesPage({ theme, services }) {
  const isSwiss = theme === 'swiss'

  const serviceCategories = [
    {
      icon: Store,
      title: 'Shopify & Headless Development',
      items: ['Custom Theme Architecture', 'Liquid & React Components', 'Sub-second Page Speeds', 'Multi-Currency & Regional Checkouts']
    },
    {
      icon: Bot,
      title: 'AI Chatbots & WhatsApp Automation',
      items: ['Hinglish NLP Model Training', '24/7 Cart Abandonment Recovery', 'Automated COD Verification', 'Instant Order Status Updates']
    },
    {
      icon: Target,
      title: 'Marketplace Optimization & Ranking',
      items: ['Amazon IN A+ Content & SEO', 'Flipkart Listing Score Boost', 'Meesho Tier-2/3 Buyer Funnels', 'JioMart Catalog Automation']
    },
    {
      icon: Settings,
      title: 'Custom ERP & Logistics Integration',
      items: ['Unicommerce / Increff Sync', 'Real-time Inventory Feeds', 'Shiprocket & Porter API Setup', 'Custom Financial Dashboards']
    }
  ]

  return (
    <div className="pt-20 md:pt-28 pb-4">
      {/* Page Header */}
      <section className="py-8 md:py-12 px-6 max-w-6xl mx-auto border-b border-gray-200/40">
        <span className={`text-xs font-black tracking-widest uppercase block mb-3 ${
          isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
        }`}>
          [ AGENCY SOLUTIONS & CAPABILITIES ]
        </span>
        <h1 className={`text-3xl sm:text-4xl md:text-6xl font-bold tracking-tight ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          End-to-End eCommerce Services
        </h1>
        <p className={`mt-4 text-sm md:text-base max-w-3xl leading-relaxed ${
          isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
        }`}>
          From custom store builds and AI Hinglish WhatsApp closers to deep marketplace ranking audits and ERP logistics integrations, explore our full suite of technical capabilities.
        </p>
      </section>

      {/* Services Core Grid */}
      <Services theme={theme} services={services} />

      {/* Detailed Capabilities Matrix */}
      <section className="py-10 px-6 max-w-6xl mx-auto">
        <h2 className={`text-2xl md:text-4xl font-bold mb-8 ${
          isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
        }`}>
          Technical Delivery Spectrum
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {serviceCategories.map((cat) => {
            const Icon = cat.icon
            return (
              <div key={cat.title} className={`p-8 ${
                isSwiss ? 'border border-swiss-text bg-white' : 'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-3xl shadow-lg'
              }`}>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 ${
                  isSwiss ? 'bg-swiss-text text-swiss-bg' : 'bg-gradient-to-r from-violet-600 to-pink-500 text-white'
                }`}>
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className={`text-xl font-bold mb-4 ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-bold'}`}>
                  {cat.title}
                </h3>
                <ul className="space-y-3">
                  {cat.items.map(item => (
                    <li key={item} className={`flex items-center gap-2 text-xs font-semibold ${
                      isSwiss ? 'font-satoshi text-swiss-text/85' : 'font-outfit text-slate-700'
                    }`}>
                      <span className="w-1.5 h-1.5 rounded-full bg-violet-600"></span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            )
          })}
        </div>

        {/* CTA Banner */}
        <div className={`mt-12 mb-6 p-8 md:p-12 text-center ${
          isSwiss ? 'border border-swiss-text bg-swiss-bg' : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl'
        }`}>
          <h3 className={`text-2xl md:text-3xl font-bold ${isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-white'}`}>
            Have a custom technical requirement for your store?
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
              Discuss Your Stack <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default ServicesPage
