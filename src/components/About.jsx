import React from 'react'

function About({ theme }) {
  const isSwiss = theme === 'swiss';
  const stats = [
    { value: '2.4x', label: 'Average Client Conversion Boost', text: 'Optimizing product visibility and search queries across Amazon and Shopify stores.' },
    { value: '45%', label: 'AI Whatsapp Deal Closures', text: 'Trained to communicate fluidly in English, Hindi, and Hinglish like a human support representative.' },
    { value: '15h+', label: 'Admin Hours Saved Weekly', text: 'Automating inventory synchronization, fulfillment channels, and marketing lists.' }
  ];

  return (
    <section id="philosophy" className={`py-20 md:py-28 px-6 max-w-6xl mx-auto ${isSwiss ? 'border-b border-swiss-text' : ''}`}>
      {/* Top Section / Layout */}
      <div className={`${isSwiss ? 'border-t border-swiss-text pt-10' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Title / Section Name */}
          <div className="lg:col-span-3">
            <span className={`text-xs font-black tracking-widest uppercase ${
              isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-violet-600 font-extrabold'
            }`}>
              [ PHILOSOPHY ]
            </span>
          </div>

          {/* Giant Bold Quote */}
          <div className="lg:col-span-9">
            <h2 className={`text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-tight ${
              isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
            }`}>
              We design systems where digital efficiency and raw{' '}
              <span className={isSwiss ? 'font-serif italic font-light' : 'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 font-black'}>
                automation
              </span>{' '}
              align to drive commerce.
            </h2>
            <p className={`text-sm md:text-base mt-6 max-w-2xl leading-relaxed ${
              isSwiss ? 'font-satoshi text-swiss-text/80' : 'font-outfit text-slate-600 font-medium'
            }`}>
              We reject standard, bloated templates. EcomXtra operates on precision principles: heavy typography, high-contrast layouts, and robust backend integrations that require zero manual upkeep.
            </p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 mt-16 ${
        isSwiss ? 'border-t border-swiss-text pt-12' : ''
      }`}>
        {stats.map((stat, idx) => {
          const cardGradients = [
            'bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 border-emerald-200 text-emerald-600 shadow-md shadow-emerald-500/5',
            'bg-gradient-to-br from-pink-500/10 via-white to-rose-500/5 border-pink-200 text-pink-600 shadow-md shadow-pink-500/5',
            'bg-gradient-to-br from-indigo-500/10 via-white to-violet-500/5 border-indigo-200 text-indigo-600 shadow-md shadow-indigo-500/5'
          ];

          if (isSwiss) {
            return (
              <div key={idx} className="flex flex-col">
                <span className="font-clash text-5xl md:text-6xl font-bold text-swiss-text">{stat.value}</span>
                <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text mt-3">
                  {stat.label}
                </span>
                <p className="font-satoshi text-xs text-swiss-text/70 mt-2 leading-relaxed">
                  {stat.text}
                </p>
              </div>
            );
          }

          return (
            <div
              key={idx}
              className={`${cardGradients[idx]} border-2 p-8 rounded-3xl flex flex-col justify-between min-h-[220px] hover:shadow-xl hover:-translate-y-1 transition-all duration-300`}
            >
              <div>
                <span className="font-outfit text-5xl font-black">{stat.value}</span>
                <h3 className="font-outfit text-xs font-extrabold text-slate-800 mt-3 uppercase tracking-wider">
                  {stat.label}
                </h3>
              </div>
              <p className="font-outfit text-xs text-slate-600 leading-relaxed mt-4">
                {stat.text}
              </p>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default About
