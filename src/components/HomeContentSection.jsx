import { BarChart3, Cpu, ShieldCheck, Zap } from 'lucide-react'

const icons = { BarChart3, Cpu, ShieldCheck, Zap }
const cardStyles = [
    'border-violet-150',
    'border-pink-150',
    'border-amber-150',
    'border-emerald-150',
]
const iconStyles = [
    'from-violet-600 to-pink-500',
    'from-pink-500 to-amber-500',
    'from-amber-500 to-emerald-500',
    'from-emerald-500 to-violet-600',
]

function HomeContentSection({ section, content }) {
    const features = content?.features || content?.steps || []
    const isProcess = section === 'process'

    return (
        <section className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
            <div className="mb-5 pb-3 border-b border-slate-200/60">
                <h2 className="text-xl sm:text-2xl md:text-3xl font-bold font-outfit text-slate-900">
                    {content?.heading}
                </h2>
                {content?.description && (
                    <p className="mt-2 max-w-3xl text-xs md:text-sm leading-relaxed font-outfit text-slate-600">
                        {content.description}
                    </p>
                )}
            </div>
            <div className={`grid grid-cols-1 ${isProcess ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-4 md:gap-6`}>
                {features.map((feature, index) => {
                    const Icon = icons[feature.icon] || Zap
                    return (
                        <article
                            key={`${feature.title || 'item'}-${index}`}
                            className={`rounded-2xl border-2 bg-white/90 p-5 md:p-6 shadow-md ${cardStyles[index % cardStyles.length]}`}
                        >
                            {isProcess ? (
                                <span className="mb-2 block text-2xl font-black text-violet-600">
                                    {String(index + 1).padStart(2, '0')}
                                </span>
                            ) : (
                                <span className={`mb-4 flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r text-white ${iconStyles[index % iconStyles.length]}`}>
                                    <Icon className="h-5 w-5" />
                                </span>
                            )}
                            <h3 className="mb-2 text-base md:text-lg font-bold font-outfit text-slate-900">{feature.title}</h3>
                            <p className="text-xs md:text-sm leading-relaxed font-outfit text-slate-600">{feature.description}</p>
                        </article>
                    )
                })}
            </div>
        </section>
    )
}

export default HomeContentSection
