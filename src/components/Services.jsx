import React from 'react'
import { ArrowUpRight, Code, Cpu, LineChart, Link2, ShoppingBag, Zap } from 'lucide-react'

function Services({ theme, services }) {
  // Map icons to services based on index or title keywords
  const getIcon = (idx, tClass) => {
    switch (idx % 6) {
      case 0: return <ShoppingBag className={tClass} />;
      case 1: return <Code className={tClass} />;
      case 2: return <Cpu className={tClass} />;
      case 3: return <LineChart className={tClass} />;
      case 4: return <Zap className={tClass} />;
      default: return <Link2 className={tClass} />;
    }
  };

  if (theme === 'swiss') {
    return (
      <section id="services" className="py-20 md:py-28 px-6 md:px-12 border-b border-swiss-text">
        <div className="mb-16">
          <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-text block mb-2">
            [ AGENCY CAPABILITIES ]
          </span>
          <h2 className="font-clash text-3xl md:text-4xl font-bold tracking-tight text-swiss-text">
            Bespoke eCommerce Solutions
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-0 border-l border-t border-swiss-text">
          {services.map((service, idx) => (
            <div
              key={service.id || idx}
              className="border-r border-b border-swiss-text p-8 bg-transparent hover:bg-white group transition-all duration-300 flex flex-col justify-between h-[360px]"
            >
              <div>
                {/* 64x64px rotating geometric icon box */}
                <div className="w-16 h-16 border border-swiss-text flex items-center justify-center bg-swiss-bg group-hover:rotate-12 transition-transform duration-300">
                  {getIcon(idx, "w-6 h-6 text-swiss-text")}
                </div>
                <h3 className="font-clash text-xl font-bold mt-6 text-swiss-text">
                  {service.title}
                </h3>
                <p className="font-satoshi text-xs text-swiss-text/75 mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-2 text-xs font-satoshi font-black tracking-widest uppercase mt-6 text-swiss-text group-hover:underline underline-offset-4"
              >
                Inquire Service <ArrowUpRight className="w-4 h-4" />
              </a>
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Softly Theme Services
  return (
    <section id="services" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-16">
        <span className="text-softly-sage font-semibold tracking-wider text-sm uppercase block mb-2">[ OUR SERVICE OFFERING ]</span>
        <h2 className="font-outfit text-3xl md:text-5xl font-bold text-softly-text">
          Growth & Automation Capabilities
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const pastelBgs = ['bg-softly-sage/5', 'bg-softly-peach/5', 'bg-softly-lavender/5'];
          const pastelBorders = ['border-softly-sage/20', 'border-softly-peach/20', 'border-softly-lavender/20'];
          const pastelIcons = ['bg-softly-sage/10 text-softly-sage', 'bg-softly-peach/10 text-softly-peach', 'bg-softly-lavender/10 text-softly-lavender'];

          const cycleIdx = idx % 3;

          return (
            <div
              key={service.id || idx}
              className={`${pastelBgs[cycleIdx]} border ${pastelBorders[cycleIdx]} p-8 rounded-[2rem] shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between h-[340px]`}
            >
              <div>
                <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${pastelIcons[cycleIdx]}`}>
                  {getIcon(idx, "w-5 h-5")}
                </div>
                <h3 className="font-outfit text-lg font-bold mt-6 text-softly-text">
                  {service.title}
                </h3>
                <p className="font-outfit text-xs text-softly-text/80 mt-3 leading-relaxed">
                  {service.description}
                </p>
              </div>

              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-softly-text hover:text-softly-sage transition-colors mt-6"
              >
                Inquire Service <ArrowUpRight className="w-3.5 h-3.5" />
              </a>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services
