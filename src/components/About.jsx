
function About({ content }) {
  const about = content || {}

  return (
    <section id="philosophy" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      {/* Top Section / Layout */}
      <div className="">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Title / Section Name */}
          <div className="lg:col-span-3">
            <span className={`text-xs font-black tracking-widest uppercase ${
              'font-outfit text-violet-600 font-extrabold'
            }`}>
              {about.eyebrow || '[ PHILOSOPHY ]'}
            </span>
          </div>

          {/* Giant Bold Quote */}
          <div className="lg:col-span-9">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${
              'font-outfit text-slate-900 font-extrabold'
            }`}>
              {about.heading || 'We design systems where digital efficiency and raw automation align to drive commerce.'}
            </h2>
            <p className={`text-sm md:text-base mt-6 max-w-2xl leading-relaxed ${
              'font-outfit text-slate-600 font-medium'
            }`}>
              {about.description || 'We reject standard, bloated templates. EcomXtra operates on precision principles: heavy typography, high-contrast layouts, and robust backend integrations that require zero manual upkeep.'}
            </p>
            {about.highlights?.length > 0 && (
              <ul className="mt-5 flex flex-wrap gap-2">
                {about.highlights.map((highlight, index) => (
                  <li key={`${highlight}-${index}`} className="rounded-full border border-violet-200 bg-white/80 px-3 py-1 text-xs font-semibold text-slate-700">
                    {highlight}
                  </li>
                ))}
              </ul>
            )}
            {about.imageUrl && (
              <img src={about.imageUrl} alt="" className="mt-6 max-h-64 max-w-full rounded-2xl object-contain" />
            )}
          </div>
        </div>
      </div>

    </section>
  );
}

export default About
