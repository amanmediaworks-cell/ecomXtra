
import SafeImage from './SafeImage'

const DEFAULT_ABOUT_IMAGE = 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1600&q=80'

function About({ content }) {
    const about = content || {}
    const aboutImage = about.imageUrl || DEFAULT_ABOUT_IMAGE

    return (
        <section id="philosophy" className="py-8 md:py-12 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
            {/* Top Section / Layout */}
            <div>
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8 items-start">
                    {/* Title / Section Name */}
                    <div className="lg:col-span-3">
                        <span className={`text-xs font-black tracking-widest uppercase ${'font-outfit text-violet-600 font-extrabold'
                            }`}>
                            {about.eyebrow || '[ PHILOSOPHY ]'}
                        </span>
                    </div>

                    {/* Giant Bold Quote and Visual */}
                    <div className="lg:col-span-9">
                        <h2 className={`text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${'font-outfit text-slate-900 font-extrabold'
                            }`}>
                            {about.heading || 'We design systems where digital efficiency and raw automation align to drive commerce.'}
                        </h2>
                        <p className={`text-xs md:text-sm mt-3 max-w-2xl leading-relaxed ${'font-outfit text-slate-600 font-medium'
                            }`}>
                            {about.description || 'We reject standard, bloated templates. EcomXtra operates on precision principles: heavy typography, high-contrast layouts, and robust backend integrations that require zero manual upkeep.'}
                        </p>
                        {about.highlights?.length > 0 && (
                            <ul className="mt-3 flex flex-wrap gap-2">
                                {about.highlights.map((highlight, index) => (
                                    <li key={`${highlight}-${index}`} className="rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                                        {highlight}
                                    </li>
                                ))}
                            </ul>
                        )}

                        {/* Curated Visual Representation Card */}
                        <div className="mt-6 relative overflow-hidden rounded-2xl border-2 border-violet-200/80 bg-white shadow-xl group">
                            <div className="relative aspect-[16/9] sm:aspect-[2.2/1] w-full overflow-hidden bg-slate-900">
                                <SafeImage
                                    src={aboutImage}
                                    alt="EcomXtra Commerce Architecture & Digital Automation"
                                    className="w-full h-full"
                                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                                />
                                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-transparent to-black/10 pointer-events-none" />
                                <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white">
                                    <span className="text-[11px] font-extrabold font-outfit uppercase tracking-wider bg-violet-600/90 backdrop-blur-md px-3 py-1 rounded-full border border-white/20">
                                        Autonomous Architecture
                                    </span>
                                    <span className="text-[10px] font-mono text-slate-300">
                                        Precision Principles
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
}

export default About
