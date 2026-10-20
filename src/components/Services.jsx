import { Link } from 'react-router-dom'
import { ArrowUpRight, Code, Cpu, LineChart, Link2, ShoppingBag, Zap } from 'lucide-react'
import SafeImage from './SafeImage'

const SERVICE_VISUALS = [
  'https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_640.jpg', // Shopify & WooCommerce
  'https://cdn.pixabay.com/photo/2018/07/26/09/56/ecommerce-3563183_640.jpg', // eCommerce Store Development
  'https://cdn.pixabay.com/photo/2016/12/20/22/32/holiday-shopping-1921658_640.jpg', // AI Chatbots & Whatsapp
  'https://cdn.pixabay.com/photo/2017/08/10/04/44/analytics-2618277_640.jpg', // Growth Marketing & CRO
  'https://cdn.pixabay.com/photo/2016/03/09/13/58/online-marketing-1246457_640.jpg', // Marketing Automation
  'https://cdn.pixabay.com/photo/2020/10/01/17/11/store-5619201_640.jpg', // Custom Integrations
]

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
    <section id="services" className="py-20 md:py-28 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
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
          const serviceImage = service.imageUrl || SERVICE_VISUALS[idx % SERVICE_VISUALS.length];

          return (
            <div
              key={service.id || idx}
              className={`${t.bg} border-2 p-6 md:p-7 rounded-3xl shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col justify-between group overflow-hidden`}
            >
              <div>
                {/* Visual Thumbnail Header with Safe Caching */}
                <div className="relative h-44 w-full rounded-2xl overflow-hidden mb-6 bg-slate-900 border border-slate-200/60 shadow-xs">
                  <SafeImage
                    src={serviceImage}
                    alt={service.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent pointer-events-none" />
                  <div className={`absolute bottom-3 left-3 w-11 h-11 rounded-xl flex items-center justify-center ${t.icon} group-hover:rotate-12 transition-transform duration-300`}>
                    {getIcon(idx, "w-5 h-5")}
                  </div>
                </div>

                <h3 className="font-outfit text-xl font-extrabold text-slate-900 leading-snug">
                  {service.title}
                </h3>
                <p className="font-outfit text-xs text-slate-600 mt-2.5 leading-relaxed font-medium">
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
