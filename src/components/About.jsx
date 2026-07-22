import React from 'react'

function About({ theme }) {
  const stats = [
    { value: '2.4x', label: 'Average Client Conversion Boost', text: 'Optimizing product visibility and search queries across Amazon and Shopify stores.' },
    { value: '45%', label: 'AI Whatsapp Deal Closures', text: 'Trained to communicate fluidly in English, Hindi, and Hinglish like a human support representative.' },
    { value: '15h+', label: 'Admin Hours Saved Weekly', text: 'Automating inventory synchronization, fulfillment channels, and marketing lists.' }
  ];

  if (theme === 'swiss') {
    return (
      <section id="philosophy" className="py-20 md:py-28 px-6 md:px-12 border-b border-swiss-text">
        {/* Hairline top border and layout */}
        <div className="border-t border-swiss-text pt-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            {/* Title / Section Name */}
            <div className="lg:col-span-3">
              <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text">
                [ PHILOSOPHY ]
              </span>
            </div>

            {/* Giant Bold Quote with italic serif */}
            <div className="lg:col-span-9">
              <h2 className="font-clash text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-swiss-text leading-tight">
                We design systems where digital efficiency and raw <span className="font-serif italic font-light font-bold">automation</span> align to drive commerce.
              </h2>
              <p className="font-satoshi text-sm md:text-base text-swiss-text/80 mt-6 max-w-2xl leading-relaxed">
                We reject standard, bloated templates. EcomXtra operates on Swiss editorial principles: heavy typography, high-contrast layouts, and robust backend integrations that require zero manual upkeep.
              </p>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-20 border-t border-swiss-text pt-12">
          {stats.map((stat, idx) => (
            <div key={idx} className="flex flex-col">
              <span className="font-clash text-5xl md:text-6xl font-bold text-swiss-text">{stat.value}</span>
              <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text mt-3">
                {stat.label}
              </span>
              <p className="font-satoshi text-xs text-swiss-text/70 mt-2 leading-relaxed">
                {stat.text}
              </p>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Softly Theme Philosophy
  return (
    <section id="philosophy" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Side: Cursive + Text */}
        <div className="lg:col-span-5 text-left">
          <span className="text-softly-sage font-semibold tracking-wider text-sm uppercase block mb-2">[ OUR METHOD ]</span>
          <h2 className="font-outfit text-3xl md:text-4xl font-bold text-softly-text leading-snug">
            A quiet, systematic approach to eCommerce optimization.
          </h2>
          <p className="font-outfit text-sm text-softly-text/80 mt-4 leading-relaxed">
            We believe that scaling doesn't have to mean frantic firefighting. By implementing elegant, automatic pipelines, custom Shopify themes, and conversational AI, we give you the space to breathe and focus on the big picture.
          </p>
          <div className="mt-4">
            <span className="font-reenie text-3xl text-softly-peach block transform -rotate-2">
              slow growth is sustainable growth.
            </span>
          </div>
        </div>

        {/* Right Side: Curved stat blocks */}
        <div className="lg:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-4">
          {stats.map((stat, idx) => {
            const bgColors = ['bg-softly-sage/10', 'bg-softly-peach/10', 'bg-softly-lavender/10'];
            const borderColors = ['border-softly-sage/30', 'border-softly-peach/30', 'border-softly-lavender/30'];
            const textColors = ['text-softly-sage', 'text-softly-peach', 'text-softly-lavender'];

            return (
              <div
                key={idx}
                className={`${bgColors[idx]} border ${borderColors[idx]} p-6 rounded-[2rem] flex flex-col justify-between h-[220px] shadow-sm`}
              >
                <div>
                  <span className={`font-outfit text-4xl font-black ${textColors[idx]}`}>{stat.value}</span>
                  <h3 className="font-outfit text-xs font-bold text-softly-text mt-2 uppercase tracking-wide">
                    {stat.label}
                  </h3>
                </div>
                <p className="font-outfit text-[11px] text-softly-text/75 leading-relaxed">
                  {stat.text}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default About
