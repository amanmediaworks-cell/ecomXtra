const cardGradients = [
    'bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 border-emerald-200 text-emerald-600 shadow-md shadow-emerald-500/5',
    'bg-gradient-to-br from-pink-500/10 via-white to-rose-500/5 border-pink-200 text-pink-600 shadow-md shadow-pink-500/5',
    'bg-gradient-to-br from-indigo-500/10 via-white to-violet-500/5 border-indigo-200 text-indigo-600 shadow-md shadow-indigo-500/5',
]

function StatsSection({ metrics = [] }) {
    if (!metrics.length) return null

    return (
        <section className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6 py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
            {metrics.map((stat, index) => (
                <article
                    key={`${stat.label || 'metric'}-${index}`}
                    className={`${cardGradients[index % cardGradients.length]} border-2 p-5 md:p-6 rounded-2xl flex flex-col justify-between min-h-[160px] md:min-h-[175px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
                >
                    <div>
                        <span className="font-outfit text-3xl sm:text-4xl md:text-5xl font-black">{stat.value}</span>
                        <h3 className="font-outfit text-xs font-extrabold text-slate-800 mt-2 uppercase tracking-wider">{stat.label}</h3>
                    </div>
                    <p className="font-outfit text-xs text-slate-600 leading-relaxed mt-2.5">{stat.description}</p>
                </article>
            ))}
        </section>
    )
}

export default StatsSection
