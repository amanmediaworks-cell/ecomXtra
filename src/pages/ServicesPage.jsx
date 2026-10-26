import { Link } from 'react-router-dom'
import Services from '../components/Services'
import { ArrowRight, ClipboardCheck, FileText, RotateCcw, ShieldCheck } from 'lucide-react'

function ServicesPage({
    services
}) {


    const serviceCategories = [
        {
            icon: FileText,
            title: 'Product and catalogue operations',
            items: ['Product listing creation and updates', 'Catalogue error follow-up', 'Content and attribute checks', 'Image and detail coordination']
        },
        {
            icon: ClipboardCheck,
            title: 'Seller support and claims',
            items: ['Organize supporting information', 'Raise eligible support cases', 'Track platform replies', 'Escalate actions needing seller approval']
        },
        {
            icon: RotateCcw,
            title: 'Returns and refund workflows',
            items: ['Monitor eligible return requests', 'Track refund-related follow-up', 'Keep case status organized', 'Surface decisions for your team']
        },
        {
            icon: ShieldCheck,
            title: 'Account health and daily support',
            items: ['Review account notifications', 'Coordinate routine operations', 'Maintain task ownership', 'Share clear progress reports']
        }
    ]

    return (
        <div className="pt-20 md:pt-24 pb-4">
            {/* Page Header */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${'font-outfit text-violet-600 font-extrabold'
                    }`}>
                    [ MARKETPLACE ACCOUNT OPERATIONS ]
                </span>
                <h1 className={`text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    Marketplace Account Management Services
                </h1>
                <p className={`mt-3 text-xs sm:text-sm md:text-base max-w-3xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                    }`}>
                    EcomXtra supports Indian sellers with the day-to-day work behind marketplace selling: product listings, catalogue updates, seller claims, return workflows, account health, and operational follow-up.
                </p>
            </section>

            {/* Services Core Grid */}
            <div className="border-b border-slate-200/60">
                <Services services={services} content={{
                    eyebrow: '[ MARKETPLACES WE SUPPORT ]',
                    heading: 'Choose your marketplace',
                    description: 'Explore account-management support for leading Indian ecommerce and quick-commerce platforms.',
                }} />
            </div>

            {/* Detailed Capabilities Matrix */}
            <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto border-b border-slate-200/60">
                <h2 className={`text-xl sm:text-2xl md:text-3xl font-bold mb-5 ${'font-outfit text-slate-900 font-extrabold'
                    }`}>
                    Marketplace operations we can support
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
                    {serviceCategories.map((cat) => {
                        const Icon = cat.icon
                        return (
                            <div key={cat.title} className={`p-5 md:p-6 ${'bg-white/95 backdrop-blur-md border border-slate-200 rounded-2xl shadow-md'
                                }`}>
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${'bg-[#243141] text-[#ffc46d]'
                                    }`}>
                                    <Icon className="w-5 h-5" />
                                </div>
                                <h3 className="text-lg font-bold mb-3 font-outfit text-slate-900">
                                    {cat.title}
                                </h3>
                                <ul className="space-y-2">
                                    {cat.items.map(item => (
                                        <li key={item} className={`flex items-center gap-2 text-xs font-semibold ${'font-outfit text-slate-700'
                                            }`}>
                                            <span className="w-1.5 h-1.5 rounded-full bg-[#c96f2e]"></span>
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
                <div className={`p-6 md:p-8 text-center ${'bg-[#243141] text-white rounded-2xl shadow-xl'
                    }`}>
                    <h3 className="text-xl md:text-2xl font-bold font-outfit text-white">
                        Need help managing marketplace operations?
                    </h3>
                    <div className="mt-4 flex justify-center">
                        <Link
                            to="/contact"
                            className={`inline-flex items-center gap-2 px-6 py-3 text-xs font-black tracking-widest uppercase transition-all ${'bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md transform hover:scale-105'
                                }`}
                        >
                            Talk to our team <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    )
}

export default ServicesPage
