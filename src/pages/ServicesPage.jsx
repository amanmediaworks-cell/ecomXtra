import { Link } from 'react-router-dom'
import Services from '../components/Services'
import { ArrowRight, Bot, Settings, Store, Target } from 'lucide-react'

function ServicesPage({
    services
}) {


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
        <div className="pt-20 md:pt-24 pb-4">
            {/* Page Header */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${'font-outfit text-violet-600 font-extrabold'
                    }`}>
                    [ AGENCY SOLUTIONS & CAPABILITIES ]
                </span>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    End-to-End eCommerce Services
                </h1>
                <p className={`mt-3 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                    }`}>
                    From custom store builds and AI Hinglish WhatsApp closers to deep marketplace ranking audits and ERP logistics integrations, explore our full suite of technical capabilities.
                </p>
            </section>

            {/* Services Core Grid */}
            <div className="border-b border-slate-200/60">
                <Services services={services} />
            </div>

            {/* Detailed Capabilities Matrix */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-5 ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    Technical Delivery Spectrum
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {serviceCategories.map((cat) => {
                        const Icon = cat.icon
                        return (
                            <div key={cat.title} className={`p-5 md:p-6 ${'bg-white/95 backdrop-blur-md border-2 border-violet-150 rounded-2xl shadow-md'
                                }`}>
                                <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${'bg-gradient-to-r from-violet-600 to-pink-500 text-white'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 font-outfit text-slate-900 font-bold">
                                    {cat.title}
                                </h3>
                                <ul className="space-y-2">
                                    {cat.items.map(item => (
                                        <li key={item} className={`flex items-center gap-2 text-xs font-semibold ${'font-outfit text-slate-700'
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
            </section>

            {/* CTA Banner */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto">
                <div className={`p-6 md:p-8 text-center ${'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-2xl shadow-xl'
                    }`}>
                    <h3 className="text-xl md:text-2xl font-bold font-outfit text-white">
                        Have a custom technical requirement for your store?
                    </h3>
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/contact"
                            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all ${'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
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
