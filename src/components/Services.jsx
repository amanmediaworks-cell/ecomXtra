import { Link } from 'react-router-dom'
import { ArrowUpRight, Code, Cpu, LineChart, Link2, ShoppingBag, Zap } from 'lucide-react'

function Services({
  services,
  content,
}) {


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

  return (
    <section id="services" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="mb-16 text-center md:text-left">
        <span className={`text-xs font-black tracking-widest uppercase block mb-2 ${
          'font-outfit text-violet-600 font-extrabold'
        }`}>
          {content?.eyebrow || '[ AGENCY CAPABILITIES ]'}
        </span>
        <h2 className={`text-3xl md:text-5xl font-bold tracking-tight ${
          'font-outfit text-slate-900 font-extrabold'
        }`}>
          {content?.heading || 'Bespoke eCommerce Solutions'}
        </h2>
      </div>

      {content?.description && <p className="mb-8 max-w-3xl text-sm text-slate-600">{content.description}</p>}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service, idx) => {
          const cardThemes = [
            { bg: 'bg-gradient-to-br from-emerald-500/10 via-white to-teal-500/5 border-emerald-200', icon: 'bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md shadow-emerald-500/20', hoverText: 'hover:text-emerald-600' },
            { bg: 'bg-gradient-to-br from-violet-500/10 via-white to-indigo-500/5 border-violet-200', icon: 'bg-gradient-to-br from-violet-600 to-indigo-600 text-white shadow-md shadow-violet-500/20', hoverText: 'hover:text-violet-600' },
            { bg: 'bg-gradient-to-br from-pink-500/10 via-white to-rose-500/5 border-pink-200', icon: 'bg-gradient-to-br from-pink-500 to-rose-600 text-white shadow-md shadow-pink-500/20', hoverText: 'hover:text-pink-600' },
            { bg: 'bg-gradient-to-br from-amber-500/10 via-white to-orange-500/5 border-amber-200', icon: 'bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-md shadow-amber-500/20', hoverText: 'hover:text-amber-600' },
            { bg: 'bg-gradient-to-br from-cyan-500/10 via-white to-sky-500/5 border-cyan-200', icon: 'bg-gradient-to-br from-cyan-500 to-sky-600 text-white shadow-md shadow-cyan-500/20', hoverText: 'hover:text-cyan-600' },
            { bg: 'bg-gradient-to-br from-fuchsia-500/10 via-white to-purple-500/5 border-fuchsia-200', icon: 'bg-gradient-to-br from-fuchsia-500 to-purple-600 text-white shadow-md shadow-fuchsia-500/20', hoverText: 'hover:text-fuchsia-600' },
          ];

          const t = cardThemes[idx % cardThemes.length];



          return (
            <div
              key={service.id || idx}
              className={`${t.bg} border-2 p-8 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between min-h-[340px] group`}
            >
              <div>
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center ${t.icon} group-hover:rotate-12 transition-transform duration-300`}>
                  {getIcon(idx, "w-7 h-7")}
                </div>
                <h3 className="font-outfit text-xl font-extrabold mt-6 text-slate-900 leading-snug">
                  {service.title}
                </h3>
                <p className="font-outfit text-xs text-slate-600 mt-3 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>

              <Link
                to="/contact"
                className={`inline-flex items-center gap-2 text-xs font-bold text-slate-800 ${t.hoverText} transition-colors mt-6 pt-4 border-t border-slate-100 uppercase tracking-wider`}
              >
                Inquire Service <ArrowUpRight className="w-4 h-4" />
              </Link>
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services
