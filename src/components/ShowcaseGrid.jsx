import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { TrendingUp, ArrowUpRight } from 'lucide-react'

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

// Rank badge
function RankBadge({ rank, isSwiss = true }) {
  return (
    <div className={`flex flex-col items-center justify-center w-20 h-20 border-2 shrink-0 ${
      isSwiss ? 'border-swiss-text bg-swiss-text text-swiss-bg' : 'border-swiss-text'
    }`}>
      <span className="font-clash text-[9px] font-black tracking-widest uppercase opacity-75 leading-none">RANK</span>
      <span className="font-clash text-2xl font-black leading-none mt-0.5">{rank}</span>
    </div>
  )
}

function ShowcaseGrid({ theme, showcases }) {
  const [hoveredCard, setHoveredCard] = useState(null)
  const isSwiss = theme === 'swiss'

  const defaultShowcasesList = [
    { id: 1, key: 'amazon', title: 'Amazon Ranking Boost', metric: '#1 Best Seller', description: 'Boosted search rankings to the first page, resulting in a 2.4x organic sales increase within 60 days.', link: '#' },
    { id: 2, key: 'flipkart', title: 'Flipkart Visibility Multiplier', metric: '1.8x Conversions', description: 'Ranked accessories catalog into the top 3 spots, optimizing images and titles for search visibility.', link: '#' },
    { id: 3, key: 'meesho', title: 'Meesho High-Velocity Funnel', metric: '310% Order Vol', description: 'Designed optimized descriptions and images for tier 2/3 buyers, unlocking a massive surge in daily orders.', link: '#' },
    { id: 4, key: 'jiomart', title: 'JioMart Grocery Launch', metric: '20k Monthly Orders', description: 'Configured inventory pipelines and keyword listings, reaching top slots for critical local queries.', link: '#' }
  ]

  const getItemByKey = (key, fallbackIdx) => {
    if (Array.isArray(showcases) && showcases.length > 0) {
      const found = showcases.find(item => item && (item.key === key || (item.title && item.title.toLowerCase().includes(key))))
      if (found) return found
      if (showcases[fallbackIdx]) return showcases[fallbackIdx]
    }
    return defaultShowcasesList[fallbackIdx] || { title: 'Case Study', metric: 'N/A', description: '' }
  }

  const amazon   = getItemByKey('amazon', 0)
  const flipkart = getItemByKey('flipkart', 1)
  const meesho   = getItemByKey('meesho', 2)
  const jiomart  = getItemByKey('jiomart', 3)

  return (
    <section id="showcase" className={`py-20 md:py-28 px-6 max-w-6xl mx-auto ${isSwiss ? 'border-b border-swiss-text' : ''}`}>
      {/* Section Header */}
      <div className={`mb-14 grid grid-cols-1 md:grid-cols-12 gap-6 items-end pb-10 ${isSwiss ? 'border-b border-swiss-text' : ''}`}>
        <div className="md:col-span-7">
          <span className={`text-[10px] font-black tracking-[0.3em] uppercase block mb-3 ${
            isSwiss ? 'font-satoshi text-swiss-text/50' : 'font-outfit text-violet-600 font-extrabold'
          }`}>
            [ METRIC SHOWCASE ]
          </span>
          <h2 className={`text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight leading-none ${
            isSwiss ? 'font-clash text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
          }`}>
            App Store &<br />Marketplace<br />Ranking Audits
          </h2>
        </div>
        <div className="md:col-span-5">
          <p className={`text-sm leading-relaxed ${
            isSwiss ? 'font-satoshi text-swiss-text/70' : 'font-outfit text-slate-600 font-medium'
          }`}>
            We don't guess — we audit, optimize, and measure. These are real client results across four of India's largest commerce platforms, achieved within 30–90 days.
          </p>
          <div className="mt-4 flex items-center gap-2">
            <TrendingUp className={`w-4 h-4 ${isSwiss ? 'text-swiss-text' : 'text-violet-600'}`} />
            <span className={`text-xs font-bold ${
              isSwiss ? 'font-satoshi text-swiss-text' : 'font-outfit text-slate-900 font-extrabold'
            }`}>
              Average 2.4× revenue lift across audited accounts
            </span>
          </div>
        </div>
      </div>

      {/* ── Row 1: Amazon (hero) + Flipkart (pill) ── */}
      <div className={`grid grid-cols-1 md:grid-cols-12 gap-6 mb-6`}>

        {/* AMAZON — 8 col full-height feature card */}
        <div
          className={`md:col-span-8 p-8 md:p-10 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
            isSwiss
              ? 'border border-swiss-text hover:bg-swiss-text group'
              : 'bg-white/90 backdrop-blur-md border-2 border-emerald-200 rounded-3xl shadow-lg shadow-emerald-500/5 hover:border-emerald-400 hover:-translate-y-1'
          }`}
          onMouseEnter={() => setHoveredCard('amazon')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            {/* Top strip */}
            <div className="flex items-start justify-between mb-6">
              <PlatformBadge name="Amazon IN" color={isSwiss ? '#111111' : '#10b981'} />
              <div className={`text-[10px] font-black tracking-widest uppercase transition-colors ${
                isSwiss ? (hoveredCard === 'amazon' ? 'text-swiss-bg/60' : 'text-swiss-text/40') : 'text-slate-400 font-extrabold'
              }`}>
                Case Study #01
              </div>
            </div>

            {/* Metric big number */}
            <div className="mb-6">
              <span className={`text-7xl md:text-8xl font-black tracking-tight leading-none ${
                isSwiss
                  ? (hoveredCard === 'amazon' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                  : 'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-emerald-600 to-teal-600'
              }`}>
                {amazon.metric}
              </span>
            </div>

            <h3 className={`text-xl md:text-2xl font-bold mb-3 ${
              isSwiss
                ? (hoveredCard === 'amazon' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                : 'font-outfit text-slate-900'
            }`}>
              {amazon.title}
            </h3>
            <p className={`text-sm leading-relaxed max-w-lg mb-8 ${
              isSwiss
                ? (hoveredCard === 'amazon' ? 'text-swiss-bg/70' : 'text-swiss-text/75') + ' font-satoshi'
                : 'font-outfit text-slate-600'
            }`}>
              {amazon.description}
            </p>
          </div>

          {/* Animated Bar Chart */}
          <div className={`border-t pt-6 ${
            isSwiss ? (hoveredCard === 'amazon' ? 'border-swiss-bg/20' : 'border-swiss-text/15') : 'border-slate-100'
          }`}>
            <div className="flex justify-between items-end mb-2">
              <span className={`text-[9px] font-black tracking-widest uppercase ${
                isSwiss ? (hoveredCard === 'amazon' ? 'text-swiss-bg/50' : 'text-swiss-text/40') : 'text-slate-400 font-extrabold'
              }`}>
                SALES VELOCITY (60 DAYS)
              </span>
              <span className={`text-xs font-bold ${
                isSwiss ? (hoveredCard === 'amazon' ? 'text-swiss-bg' : 'text-swiss-text') : 'text-emerald-600 font-extrabold'
              }`}>
                ↑ 2.4×
              </span>
            </div>
            <BarChart
              bars={[15, 22, 28, 32, 38, 45, 50, 60, 68, 72, 88, 100]}
              accent={isSwiss ? (hoveredCard === 'amazon' ? '#f2f2f2' : '#111111') : '#10b981'}
            />
          </div>
        </div>

        {/* FLIPKART — 4 col vertical card */}
        <div
          className={`md:col-span-4 cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden transition-all duration-300 ${
            isSwiss
              ? 'border border-swiss-text hover:bg-swiss-text group'
              : 'bg-gradient-to-br from-purple-500/10 via-white to-fuchsia-500/10 border-2 border-purple-200 rounded-3xl shadow-lg hover:border-purple-400 hover:-translate-y-1'
          }`}
          style={{ minHeight: '440px' }}
          onMouseEnter={() => setHoveredCard('flipkart')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          {/* Top label */}
          <div className="w-full px-6 pt-8 flex justify-between items-center">
            <PlatformBadge name="Flipkart" color={isSwiss ? '#111111' : '#9333ea'} />
            <span className={`text-[10px] font-black tracking-wider uppercase ${
              isSwiss ? (hoveredCard === 'flipkart' ? 'text-swiss-bg/50' : 'text-swiss-text/40') : 'text-slate-400 font-extrabold'
            }`}>
              #02
            </span>
          </div>

          {/* Center content */}
          <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
            {/* Big circular metric */}
            <div className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-300 mb-6 ${
              isSwiss
                ? (hoveredCard === 'flipkart' ? 'border-swiss-bg bg-swiss-bg/10' : 'border-swiss-text bg-transparent')
                : 'border-purple-300 bg-white shadow-md shadow-purple-500/10'
            }`}>
              <span className={`text-3xl font-black leading-none ${
                isSwiss
                  ? (hoveredCard === 'flipkart' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                  : 'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600'
              }`}>{flipkart.metric}</span>
              <span className={`text-[9px] font-black tracking-wider uppercase mt-1 ${
                isSwiss ? (hoveredCard === 'flipkart' ? 'text-swiss-bg/60' : 'text-swiss-text/50') : 'text-purple-600 font-bold'
              }`}>GROWTH</span>
            </div>

            <h3 className={`text-lg font-bold ${
              isSwiss
                ? (hoveredCard === 'flipkart' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                : 'font-outfit text-slate-900'
            }`}>
              {flipkart.title}
            </h3>
          </div>

          {/* Bottom description */}
          <div className={`w-full px-6 pb-8 border-t ${
            isSwiss
              ? (hoveredCard === 'flipkart' ? 'border-swiss-bg/20 text-swiss-bg/65' : 'border-swiss-text/15 text-swiss-text/65')
              : 'border-slate-100 text-slate-600'
          }`}>
            <p className="text-xs leading-relaxed mt-6">{flipkart.description}</p>
          </div>
        </div>
      </div>

      {/* ── Row 2: Meesho (5 col) + JioMart (7 col) ── */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">

        {/* MEESHO — 5 col circular/centered */}
        <div
          className={`md:col-span-5 p-8 md:p-10 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
            isSwiss
              ? 'border border-swiss-text hover:bg-swiss-text group'
              : 'bg-white/90 backdrop-blur-md border-2 border-orange-200 rounded-3xl shadow-lg hover:border-orange-400 hover:-translate-y-1'
          }`}
          onMouseEnter={() => setHoveredCard('meesho')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            <div className="flex items-center justify-between mb-8">
              <PlatformBadge name="Meesho" color={isSwiss ? '#111111' : '#f97316'} />
              <span className={`text-[10px] font-black tracking-wider uppercase ${
                isSwiss ? (hoveredCard === 'meesho' ? 'text-swiss-bg/50' : 'text-swiss-text/40') : 'text-slate-400 font-extrabold'
              }`}>#03</span>
            </div>

            {/* Concentric ring visual */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-32 h-32">
                <div className={`absolute inset-0 rounded-full border-2 ${
                  isSwiss ? (hoveredCard === 'meesho' ? 'border-swiss-bg/30' : 'border-swiss-text/15') : 'border-orange-200'
                }`} />
                <div className={`absolute inset-3 rounded-full border-2 ${
                  isSwiss ? (hoveredCard === 'meesho' ? 'border-swiss-bg/50' : 'border-swiss-text/30') : 'border-orange-300'
                }`} />
                <div className={`absolute inset-6 rounded-full border-2 flex items-center justify-center ${
                  isSwiss
                    ? (hoveredCard === 'meesho' ? 'border-swiss-bg bg-swiss-bg/10' : 'border-swiss-text')
                    : 'border-orange-500 bg-orange-50/50'
                }`}>
                  <span className={`text-xs font-black ${
                    isSwiss ? (hoveredCard === 'meesho' ? 'text-swiss-bg' : 'text-swiss-text') : 'text-orange-600'
                  }`}>↑</span>
                </div>
              </div>
            </div>

            {/* Metric */}
            <div className="text-center mb-4">
              <span className={`text-5xl font-black ${
                isSwiss
                  ? (hoveredCard === 'meesho' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                  : 'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-rose-600'
              }`}>{meesho.metric}</span>
            </div>

            <h3 className={`text-lg font-bold text-center mb-3 ${
              isSwiss
                ? (hoveredCard === 'meesho' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                : 'font-outfit text-slate-900'
            }`}>{meesho.title}</h3>
          </div>

          <p className={`text-xs text-center leading-relaxed mt-auto ${
            isSwiss
              ? (hoveredCard === 'meesho' ? 'text-swiss-bg/65' : 'text-swiss-text/65') + ' font-satoshi'
              : 'font-outfit text-slate-600'
          }`}>{meesho.description}</p>
        </div>

        {/* JIOMART — 7 col feature card */}
        <div
          className={`md:col-span-7 p-8 md:p-10 cursor-pointer transition-all duration-300 flex flex-col justify-between ${
            isSwiss
              ? 'border border-swiss-text hover:bg-swiss-text group'
              : 'bg-white/90 backdrop-blur-md border-2 border-indigo-200 rounded-3xl shadow-lg hover:border-indigo-400 hover:-translate-y-1'
          }`}
          onMouseEnter={() => setHoveredCard('jiomart')}
          onMouseLeave={() => setHoveredCard(null)}
        >
          <div>
            <div className="flex items-start justify-between mb-6">
              <PlatformBadge name="JioMart" color={isSwiss ? '#111111' : '#4f46e5'} />
              <span className={`text-[10px] font-black tracking-wider uppercase ${
                isSwiss ? (hoveredCard === 'jiomart' ? 'text-swiss-bg/50' : 'text-swiss-text/40') : 'text-slate-400 font-extrabold'
              }`}>#04</span>
            </div>

            <span className={`text-6xl font-black leading-none mb-4 block ${
              isSwiss
                ? (hoveredCard === 'jiomart' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                : 'font-outfit text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-cyan-600'
            }`}>{jiomart.metric}</span>

            <h3 className={`text-xl md:text-2xl font-bold mb-3 ${
              isSwiss
                ? (hoveredCard === 'jiomart' ? 'text-swiss-bg' : 'text-swiss-text') + ' font-clash'
                : 'font-outfit text-slate-900'
            }`}>{jiomart.title}</h3>

            <p className={`text-sm leading-relaxed max-w-lg ${
              isSwiss
                ? (hoveredCard === 'jiomart' ? 'text-swiss-bg/70' : 'text-swiss-text/75') + ' font-satoshi'
                : 'font-outfit text-slate-600'
            }`}>{jiomart.description}</p>
          </div>

          {/* Category grid — seeding indicator */}
          <div className={`mt-8 border-t pt-6 ${
            isSwiss ? (hoveredCard === 'jiomart' ? 'border-swiss-bg/20' : 'border-swiss-text/15') : 'border-slate-100'
          }`}>
            <div className="flex justify-between items-end mb-2">
              <span className={`text-[9px] font-black tracking-widest uppercase ${
                isSwiss ? (hoveredCard === 'jiomart' ? 'text-swiss-bg/50' : 'text-swiss-text/40') : 'text-slate-400 font-extrabold'
              }`}>
                CATEGORY COVERAGE (30 DAYS)
              </span>
              <ArrowUpRight className={`w-4 h-4 ${
                isSwiss ? (hoveredCard === 'jiomart' ? 'text-swiss-bg' : 'text-swiss-text') : 'text-indigo-600'
              }`} />
            </div>
            <div className="grid grid-cols-8 gap-1.5">
              {[...Array(8)].map((_, i) => (
                <div
                  key={i}
                  className="transition-all duration-500 rounded-sm"
                  style={{
                    height: `${20 + (i * 9)}px`,
                    backgroundColor: isSwiss
                      ? (hoveredCard === 'jiomart' ? `rgba(242,242,242,${0.2 + i * 0.1})` : `rgba(17,17,17,${0.15 + i * 0.1})`)
                      : `rgba(79,70,229,${0.25 + i * 0.1})`
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Bottom CTA strip */}
      <div className={`mt-8 px-8 py-6 flex flex-col sm:flex-row items-center justify-between gap-4 ${
        isSwiss
          ? 'bg-swiss-text border border-swiss-text'
          : 'bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white rounded-3xl shadow-xl shadow-pink-500/20'
      }`}>
        <span className={`text-xs font-black tracking-widest uppercase ${
          isSwiss ? 'font-satoshi text-swiss-bg/80' : 'font-outfit text-white'
        }`}>
          Want results like these for your brand?
        </span>
        <Link
          to="/contact"
          className={`inline-flex items-center gap-2 text-xs font-black tracking-widest uppercase px-6 py-3 transition-all ${
            isSwiss
              ? 'font-satoshi bg-swiss-bg text-swiss-text hover:bg-swiss-bg/85'
              : 'font-outfit bg-white text-slate-900 rounded-full hover:bg-slate-100 shadow-md hover:scale-105'
          }`}
        >
          Get a Free Audit <ArrowUpRight className={`w-4 h-4 ${isSwiss ? '' : 'text-violet-600'}`} />
        </Link>
      </div>
    </section>
  )
}

export default ShowcaseGrid
