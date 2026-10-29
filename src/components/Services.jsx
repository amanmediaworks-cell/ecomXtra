import { Link } from 'react-router-dom'
import { ArrowUpRight, Code, Cpu, LineChart, Link2, ShoppingBag, Zap } from 'lucide-react'
import SafeImage from './SafeImage'
import ContactModalTrigger from './ContactModalTrigger'

const SERVICE_VISUALS = [
  'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1523275335684-37898b6baf30?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=900&q=80',
  'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=900&q=80',
]

function Services({
  services,
  content,
}) {
  const marketplaceServices = services.filter(service => service.category === 'Marketplace Account Management')
  const visibleServices = marketplaceServices.length ? marketplaceServices : services

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
    <section id="services" className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
      <div className="mb-6 md:mb-8 text-center md:text-left pb-4 border-b border-slate-200/60">
        <span className={`text-xs font-black tracking-widest uppercase block mb-1.5 ${'font-outfit text-violet-600 font-extrabold'
          }`}>
          {content?.eyebrow || '[ AGENCY CAPABILITIES ]'}
        </span>
        <h2 className={`text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight ${'font-outfit text-slate-900 font-extrabold'
          }`}>
          {content?.heading || 'Bespoke eCommerce Solutions'}
        </h2>
      </div>

      {content?.description && <p className="mb-5 max-w-3xl text-xs md:text-sm text-slate-600">{content.description}</p>}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 md:gap-6 lg:grid-cols-3">
        {visibleServices.map((service, idx) => {
          const serviceImage = service.imageUrl || SERVICE_VISUALS[idx % SERVICE_VISUALS.length];

          return (
            <div
              key={service.id || idx}
              className="service-card group flex flex-col justify-between overflow-hidden rounded-2xl border border-slate-200 bg-white p-5 shadow-[0_8px_24px_rgba(25,39,51,0.07)] md:p-6"
            >
              <div>
                {/* Visual Thumbnail Header with Safe Caching */}
                <div className="relative h-36 md:h-40 w-full rounded-xl overflow-hidden mb-4 bg-slate-900 border border-slate-200/60 shadow-xs">
                  <SafeImage
                    src={serviceImage}
                    alt={service.title}
                    className="w-full h-full"
                    imgClassName="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/70 via-black/20 to-transparent pointer-events-none" />
                  <div className="absolute bottom-2.5 left-2.5 flex h-10 w-10 items-center justify-center rounded-xl bg-[#243141] text-[#ffc46d] shadow-md transition-transform duration-300 group-hover:rotate-6">
                    {getIcon(idx, "w-4 h-4")}
                  </div>
                </div>

                <h3 className="font-outfit text-lg md:text-xl font-extrabold text-slate-900 leading-snug">
                  {service.title}
                </h3>
                <p className="font-outfit text-xs text-slate-600 mt-2 leading-relaxed font-medium">
                  {service.description}
                </p>
              </div>

              {service.slug ? (
                <Link
                  to={`/services/${service.slug}`}
                  className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider text-[#243141] transition-colors hover:text-[#b85f25]"
                >
                  Explore Service <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              ) : (
                <ContactModalTrigger className="mt-4 inline-flex items-center gap-1.5 border-t border-slate-100 pt-3 text-xs font-bold uppercase tracking-wider text-[#243141] transition-colors hover:text-[#b85f25]">
                  Inquire Service <ArrowUpRight className="w-3.5 h-3.5" />
                </ContactModalTrigger>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

export default Services
