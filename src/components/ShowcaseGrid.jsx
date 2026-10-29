import { Link } from 'react-router-dom'
import { TrendingUp, ArrowUpRight } from 'lucide-react'
import ContactModalTrigger from './ContactModalTrigger'

// Animated bar chart component
function BarChart({ bars, accent = '#111111' }) {
  return (
    <div className="flex items-end gap-1.5 h-16 w-full">
      {bars.map((h, i) => (
        <div
          key={i}
          className="flex-1 transition-all duration-700"
          style={{
            height: `${h}%`,
            backgroundColor: i === bars.length - 1 ? accent : `${accent}${Math.round(20 + (i / bars.length) * 80).toString(16).padStart(2, '0')}`,
          }}
        />
      ))}
    </div>
  )
}

// Platform pill badge
function PlatformBadge({ name, color = '#111111' }) {
  return (
    <span
      className="inline-flex items-center gap-1 text-[10px] font-black tracking-widest uppercase px-2.5 py-1 border"
      style={{ borderColor: color, color }}
    >
      <span className="w-1.5 h-1.5 rounded-full inline-block" style={{ background: color }} />
      {name}
    </span>
  )
}

function ShowcaseGrid({
  showcases,
  content,
}) {
  const getItemByKey = (key, fallbackIdx) => {
    const found = showcases.find(item => item.key === key)
    return found || showcases[fallbackIdx]
  }

  const amazon = getItemByKey('amazon', 0)
  const flipkart = getItemByKey('flipkart', 1)
  const meesho = getItemByKey('meesho', 2)
  const jiomart = getItemByKey('jiomart', 3)

  return (
    <section id="showcase" className="py-6 md:py-8 px-4 sm:px-6 lg:px-8 xl:px-12 max-w-7xl mx-auto w-full">
      {/* Section Header */}
      <div className="mb-6 md:mb-8 grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 items-end pb-5 border-b border-slate-200/60">
        <div className="md:col-span-7">
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase block mb-2 ${'font-outfit text-violet-600 font-extrabold'
            }`}>
            {content?.eyebrow || '[ METRIC SHOWCASE ]'}
          </span>
          <h2 className={`text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight leading-tight ${'font-outfit text-slate-900 font-extrabold'
            }`}>
            {content?.heading || 'App Store & Marketplace Ranking Audits'}
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className={`text-xs md:text-sm leading-relaxed ${'font-outfit text-slate-600 font-medium'
            }`}>
            {content?.description || "We don't guess — we audit, optimize, and measure. These are real client results across four of India's largest commerce platforms, achieved within 30–90 days."}
          </p>
          <div className="mt-3 flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-violet-600" />
            <span className={`text-xs font-bold ${'font-outfit text-slate-900 font-extrabold'
              }`}>
              {content?.metric || 'Average 2.4× revenue lift across audited accounts'}
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 1: Amazon (hero) + Flipkart (pill) ── */}
      {(amazon || flipkart) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6 mb-4 md:mb-6">

          {/* AMAZON — 8 col full-height feature card */}
          {amazon && (
            <div
              className={`md:col-span-8 p-6 md:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between ${'bg-white/90 backdrop-blur-md border-2 border-emerald-200 rounded-2xl shadow-lg shadow-emerald-500/5 hover:border-emerald-400 hover:-translate-y-1'
                }`}
            >
              <div>
                {/* Top strip */}
                <div className="flex items-start justify-between mb-4">
                  <PlatformBadge name="Amazon IN" color={'#10b981'} />
                  <div className={`text-[10px] font-black tracking-widest uppercase transition-colors ${'text-slate-400 font-extrabold'
                    }`}>
                    Case Study #01
                  </div>
                </div>

                {/* Metric big number */}
                <div className="mb-4">
                  <span className={`text-6xl md:text-7xl font-black tracking-tight leading-none ${'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600'
                    }`}>
                    {amazon.metric}
                  </span>
                </div>

                <h3 className={`text-lg md:text-xl font-bold mb-2 ${'font-outfit text-slate-900'
                  }`}>
                  {amazon.title}
                </h3>
                <p className={`text-xs md:text-sm leading-relaxed max-w-lg mb-5 ${'font-outfit text-slate-600'
                  }`}>
                  {amazon.description}
                </p>
              </div>

              {/* Animated Bar Chart */}
              <div className={`border-t pt-4 ${'border-slate-100'
                }`}>
                <div className="flex justify-between items-end mb-2">
                  <span className={`text-[9px] font-black tracking-widest uppercase ${'text-slate-400 font-extrabold'
                    }`}>
                    SALES VELOCITY (60 DAYS)
                  </span>
                  <span className={`text-xs font-bold ${'text-emerald-600 font-extrabold'
                    }`}>
                    ↑ 2.4×
                  </span>
                </div>
                <BarChart
                  bars={[15, 22, 28, 32, 38, 45, 50, 60, 68, 72, 88, 100]}
                  accent={'#10b981'}
                />
              </div>
            </div>
          )}

          {/* FLIPKART — 4 col vertical card */}
          {flipkart && (
            <div
              className={`md:col-span-4 cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 ${'bg-gradient-to-br from-purple-500/10 via-white to-fuchsia-500/10 border-2 border-purple-200 rounded-2xl shadow-lg hover:border-purple-400 hover:-translate-y-1'
                }`}
              style={{ minHeight: '340px' }}
            >
              {/* Top label */}
              <div className="w-full px-5 pt-5 flex justify-between items-center">
                <PlatformBadge name="Flipkart" color={'#9333ea'} />
                <span className={`text-[10px] font-black tracking-wider uppercase ${'text-slate-400 font-extrabold'
                  }`}>
                  #02
                </span>
              </div>

              {/* Center content */}
              <div className="flex-1 flex flex-col items-center justify-center px-5 py-4">
                {/* Big circular metric */}
                <div className={`w-28 h-28 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 mb-4 ${'border-purple-300 bg-white shadow-md shadow-purple-500/10'
                  }`}>
                  <span className={`text-2xl font-black leading-none ${'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
                    }`}>{flipkart.metric}</span>
                  <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${'text-purple-600 font-bold'
                    }`}>GROWTH</span>
                </div>

                <h3 className={`text-base font-bold ${'font-outfit text-slate-900'
                  }`}>
                  {flipkart.title}
                </h3>
              </div>

              {/* Bottom description */}
              <div className={`w-full px-5 pb-5 border-t ${'border-slate-100 text-slate-600'
                }`}>
                <p className="text-xs leading-relaxed mt-3">{flipkart.description}</p>
              </div>
            </div>
          )}
        </div>
      )}

      {/* ── Row 2: Meesho (5 col) + JioMart (7 col) ── */}
      {(meesho || jiomart) && (
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 md:gap-6">

          {/* MEESHO — 5 col circular/centered */}
          {meesho && (
            <div
              className={`md:col-span-5 p-6 md:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between ${'bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-2xl shadow-lg hover:border-orange-400 hover:-translate-y-1'
                }`}
            >
              <div>
                <div className="flex items-center justify-between mb-4">
                  <PlatformBadge name="Meesho" color={'#f97316'} />
                  <span className={`text-[10px] font-black tracking-wider uppercase ${'text-slate-400 font-extrabold'
                    }`}>#03</span>
                </div>

                {/* Concentric ring visual */}
                <div className="flex items-center justify-center my-2">
                  <div className="relative w-24 h-24">
                    <div className={`absolute inset-0 rounded-full border-2 ${'border-orange-200'
                      }`} />
                    <div className={`absolute inset-2.5 rounded-full border-2 ${'border-orange-300'
                      }`} />
                    <div className={`absolute inset-5 rounded-full border-2 flex items-center justify-center ${'border-orange-500 bg-orange-50/50'
                      }`}>
                      <span className={`text-xs font-black ${'text-orange-600'
                        }`}>↑</span>
                    </div>
                  </div>
                </div>

                {/* Metric */}
                <div className="text-center mb-2">
                  <span className={`text-4xl font-black ${'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600'
                    }`}>{meesho.metric}</span>
                </div>

                <h3 className={`text-base font-bold text-center mb-2 ${'font-outfit text-slate-900'
                  }`}>{meesho.title}</h3>
              </div>

              <p className={`text-xs text-center leading-relaxed mt-auto ${'font-outfit text-slate-600'
                }`}>{meesho.description}</p>
            </div>
          )}

          {/* JIOMART — 7 col feature card */}
          {jiomart && (
            <div
              className={`md:col-span-7 p-6 md:p-7 cursor-pointer transition-all duration-300 flex flex-col justify-between ${'bg-white/90 backdrop-blur-md border-2 border-indigo-200 rounded-2xl shadow-lg hover:border-indigo-400 hover:-translate-y-1'
                }`}
            >
              <div>
                <div className="flex items-start justify-between mb-4">
                  <PlatformBadge name="JioMart" color={'#4f46e5'} />
                  <span className={`text-[10px] font-black tracking-wider uppercase ${'text-slate-400 font-extrabold'
                    }`}>#04</span>
                </div>

                <span className={`text-5xl font-black leading-none mb-3 block ${'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600'
                  }`}>{jiomart.metric}</span>

                <h3 className={`text-lg md:text-xl font-bold mb-2 ${'font-outfit text-slate-900'
                  }`}>{jiomart.title}</h3>

                <p className={`text-xs md:text-sm leading-relaxed max-w-lg ${'font-outfit text-slate-600'
                  }`}>{jiomart.description}</p>
              </div>

              {/* Category grid — seeding indicator */}
              <div className={`mt-5 border-t pt-4 ${'border-slate-100'
                }`}>
                <div className="flex justify-between items-end mb-1.5">
                  <span className={`text-[9px] font-black tracking-widest uppercase ${'text-slate-400 font-extrabold'
                    }`}>
                    CATEGORY COVERAGE (30 DAYS)
                  </span>
                  <ArrowUpRight className={`w-4 h-4 ${'text-indigo-600'
                    }`} />
                </div>
                <div className="grid grid-cols-8 gap-1.5">
                  {[...Array(8)].map((_, i) => (
                    <div
                      key={i}
                      className="transition-all duration-500 rounded-sm"
                      style={{
                        height: `${16 + (i * 7)}px`,
                        backgroundColor: `rgba(79,70,229,${0.25 + i * 0.1})`
                      }}
                    />
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Bottom CTA strip */}
      <div className={`mt-6 px-6 py-4 md:px-8 md:py-4.5 flex flex-col sm:flex-row items-center justify-between gap-4 ${'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-2xl shadow-xl shadow-pink-500/20'
        }`}>
        <span className={`text-xs font-black tracking-widest uppercase ${'font-outfit text-white'
          }`}>
          {content?.ctaText || 'Want results like these for your brand?'}
        </span>
        {(/^\/contact(?:[/?#]|$)/.test(content?.ctaHref || '/contact')) ? (
          <ContactModalTrigger className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-6 py-2.5 font-outfit bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md hover:scale-105 transition-all">
            {content?.ctaButton || 'Get a Free Audit'} <ArrowUpRight className="w-4 h-4 text-violet-600" />
          </ContactModalTrigger>
        ) : (content?.ctaHref || '/contact').startsWith('/') ? (
          <Link
            to={content?.ctaHref || '/contact'}
            className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-6 py-2.5 font-outfit bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md hover:scale-105 transition-all"
          >
            {content?.ctaButton || 'Get a Free Audit'} <ArrowUpRight className="w-4 h-4 text-violet-600" />
          </Link>
        ) : (
          <a
            href={content?.ctaHref}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-6 py-2.5 font-outfit bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md hover:scale-105 transition-all"
          >
            {content?.ctaButton || 'Get a Free Audit'} <ArrowUpRight className="w-4 h-4 text-violet-600" />
          </a>
        )}
      </div>
    </section>
  )
}

export default ShowcaseGrid
