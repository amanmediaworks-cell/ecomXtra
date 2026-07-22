import React, { useState } from 'react'
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

  const getItemByKey = (key) =>
    showcases.find(item => item.key === key) || { title: 'Case Study', metric: 'N/A', description: '' }

  const amazon  = getItemByKey('amazon')
  const flipkart = getItemByKey('flipkart')
  const meesho  = getItemByKey('meesho')
  const jiomart  = getItemByKey('jiomart')

  if (theme === 'swiss') {
    return (
      <section id="showcase" className="py-20 md:py-28 px-6 md:px-12 border-b border-swiss-text">
        {/* Section Header */}
        <div className="mb-14 grid grid-cols-1 md:grid-cols-12 gap-6 items-end border-b border-swiss-text pb-10">
          <div className="md:col-span-7">
            <span className="font-satoshi text-[10px] font-black tracking-[0.3em] uppercase text-swiss-text/50 block mb-3">
              [ METRIC SHOWCASE ]
            </span>
            <h2 className="font-clash text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight text-swiss-text leading-none">
              App Store &<br />Marketplace<br />Ranking Audits
            </h2>
          </div>
          <div className="md:col-span-5">
            <p className="font-satoshi text-sm text-swiss-text/70 leading-relaxed">
              We don't guess — we audit, optimize, and measure. These are real client results across four of India's largest commerce platforms, achieved within 30–90 days.
            </p>
            <div className="mt-4 flex items-center gap-2">
              <TrendingUp className="w-4 h-4 text-swiss-text" />
              <span className="font-satoshi text-xs font-black text-swiss-text">Average 2.4× revenue lift across audited accounts</span>
            </div>
          </div>
        </div>

        {/* ── Row 1: Amazon (hero) + Flipkart (pill) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border border-swiss-text mb-0">

          {/* AMAZON — 8 col full-height feature card */}
          <div
            className="md:col-span-8 border-r border-swiss-text p-8 md:p-10 group cursor-pointer transition-colors duration-500 hover:bg-swiss-text"
            onMouseEnter={() => setHoveredCard('amazon')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Top strip */}
            <div className="flex items-start justify-between mb-6">
              <PlatformBadge name="Amazon IN" />
              <div className={`text-[10px] font-black tracking-widest uppercase transition-colors ${hoveredCard === 'amazon' ? 'text-swiss-bg/60' : 'text-swiss-text/40'}`}>
                Case Study #01
              </div>
            </div>

            {/* Metric big number */}
            <div className="mb-6">
              <span className={`font-clash text-7xl md:text-8xl font-black tracking-tight transition-colors leading-none ${
                hoveredCard === 'amazon' ? 'text-swiss-bg' : 'text-swiss-text'
              }`}>
                {amazon.metric}
              </span>
            </div>

            <h3 className={`font-clash text-xl md:text-2xl font-bold mb-3 transition-colors ${
              hoveredCard === 'amazon' ? 'text-swiss-bg' : 'text-swiss-text'
            }`}>
              {amazon.title}
            </h3>
            <p className={`font-satoshi text-sm leading-relaxed max-w-lg mb-8 transition-colors ${
              hoveredCard === 'amazon' ? 'text-swiss-bg/70' : 'text-swiss-text/75'
            }`}>
              {amazon.description}
            </p>

            {/* Animated Bar Chart */}
            <div className={`border-t pt-6 transition-colors ${hoveredCard === 'amazon' ? 'border-swiss-bg/20' : 'border-swiss-text/15'}`}>
              <div className="flex justify-between items-end mb-2">
                <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${hoveredCard === 'amazon' ? 'text-swiss-bg/50' : 'text-swiss-text/40'}`}>
                  SALES VELOCITY (60 DAYS)
                </span>
                <span className={`font-clash text-xs font-bold transition-colors ${hoveredCard === 'amazon' ? 'text-swiss-bg' : 'text-swiss-text'}`}>
                  ↑ 2.4×
                </span>
              </div>
              <BarChart
                bars={[15, 22, 28, 32, 38, 45, 50, 60, 68, 72, 88, 100]}
                accent={hoveredCard === 'amazon' ? '#f2f2f2' : '#111111'}
              />
            </div>
          </div>

          {/* FLIPKART — 4 col vertical pill */}
          <div
            className="md:col-span-4 group cursor-pointer flex flex-col items-center justify-between text-center overflow-hidden transition-colors duration-500 hover:bg-swiss-text"
            style={{ minHeight: '440px' }}
            onMouseEnter={() => setHoveredCard('flipkart')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            {/* Top label */}
            <div className="w-full px-6 pt-8 flex justify-between items-center">
              <PlatformBadge name="Flipkart" />
              <span className={`text-[10px] font-black tracking-wider uppercase transition-colors ${hoveredCard === 'flipkart' ? 'text-swiss-bg/50' : 'text-swiss-text/40'}`}>
                #02
              </span>
            </div>

            {/* Center content */}
            <div className="flex-1 flex flex-col items-center justify-center px-6 py-8">
              {/* Big circular metric */}
              <div className={`w-36 h-36 rounded-full border-2 flex flex-col items-center justify-center transition-all duration-500 mb-6 ${
                hoveredCard === 'flipkart'
                  ? 'border-swiss-bg bg-swiss-bg/10'
                  : 'border-swiss-text bg-transparent'
              }`}>
                <span className={`font-clash text-3xl font-black leading-none transition-colors ${
                  hoveredCard === 'flipkart' ? 'text-swiss-bg' : 'text-swiss-text'
                }`}>{flipkart.metric}</span>
                <span className={`text-[9px] font-black tracking-wider uppercase mt-1 transition-colors ${
                  hoveredCard === 'flipkart' ? 'text-swiss-bg/60' : 'text-swiss-text/50'
                }`}>GROWTH</span>
              </div>

              <h3 className={`font-clash text-lg font-bold transition-colors ${
                hoveredCard === 'flipkart' ? 'text-swiss-bg' : 'text-swiss-text'
              }`}>
                {flipkart.title}
              </h3>
            </div>

            {/* Bottom description */}
            <div className={`w-full px-6 pb-8 border-t transition-colors ${hoveredCard === 'flipkart' ? 'border-swiss-bg/20 text-swiss-bg/65' : 'border-swiss-text/15 text-swiss-text/65'}`}>
              <p className="font-satoshi text-xs leading-relaxed mt-6">{flipkart.description}</p>
            </div>
          </div>
        </div>

        {/* ── Row 2: Meesho (5 col) + JioMart (7 col) ── */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-0 border-l border-r border-b border-swiss-text">

          {/* MEESHO — 5 col circular/centered */}
          <div
            className="md:col-span-5 border-r border-swiss-text p-8 md:p-10 group cursor-pointer transition-colors duration-500 hover:bg-swiss-text flex flex-col"
            onMouseEnter={() => setHoveredCard('meesho')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div className="flex items-center justify-between mb-8">
              <PlatformBadge name="Meesho" />
              <span className={`text-[10px] font-black tracking-wider uppercase transition-colors ${hoveredCard === 'meesho' ? 'text-swiss-bg/50' : 'text-swiss-text/40'}`}>#03</span>
            </div>

            {/* Concentric ring visual */}
            <div className="flex items-center justify-center my-4">
              <div className="relative w-32 h-32">
                {/* Outer ring */}
                <div className={`absolute inset-0 rounded-full border-2 transition-colors duration-500 ${
                  hoveredCard === 'meesho' ? 'border-swiss-bg/30' : 'border-swiss-text/15'
                }`} />
                {/* Middle ring */}
                <div className={`absolute inset-3 rounded-full border-2 transition-colors duration-500 ${
                  hoveredCard === 'meesho' ? 'border-swiss-bg/50' : 'border-swiss-text/30'
                }`} />
                {/* Inner ring */}
                <div className={`absolute inset-6 rounded-full border-2 flex items-center justify-center transition-colors duration-500 ${
                  hoveredCard === 'meesho' ? 'border-swiss-bg bg-swiss-bg/10' : 'border-swiss-text'
                }`}>
                  <span className={`font-clash text-xs font-black transition-colors ${
                    hoveredCard === 'meesho' ? 'text-swiss-bg' : 'text-swiss-text'
                  }`}>↑</span>
                </div>
              </div>
            </div>

            {/* Metric */}
            <div className="text-center mb-4">
              <span className={`font-clash text-5xl font-black transition-colors ${
                hoveredCard === 'meesho' ? 'text-swiss-bg' : 'text-swiss-text'
              }`}>{meesho.metric}</span>
            </div>

            <h3 className={`font-clash text-lg font-bold text-center mb-3 transition-colors ${
              hoveredCard === 'meesho' ? 'text-swiss-bg' : 'text-swiss-text'
            }`}>{meesho.title}</h3>

            <p className={`font-satoshi text-xs text-center leading-relaxed mt-auto transition-colors ${
              hoveredCard === 'meesho' ? 'text-swiss-bg/65' : 'text-swiss-text/65'
            }`}>{meesho.description}</p>
          </div>

          {/* JIOMART — 7 col feature card */}
          <div
            className="md:col-span-7 p-8 md:p-10 group cursor-pointer transition-colors duration-500 hover:bg-swiss-text flex flex-col justify-between"
            onMouseEnter={() => setHoveredCard('jiomart')}
            onMouseLeave={() => setHoveredCard(null)}
          >
            <div>
              <div className="flex items-start justify-between mb-6">
                <PlatformBadge name="JioMart" />
                <span className={`text-[10px] font-black tracking-wider uppercase transition-colors ${hoveredCard === 'jiomart' ? 'text-swiss-bg/50' : 'text-swiss-text/40'}`}>#04</span>
              </div>

              <span className={`font-clash text-6xl font-black transition-colors leading-none mb-4 block ${
                hoveredCard === 'jiomart' ? 'text-swiss-bg' : 'text-swiss-text'
              }`}>{jiomart.metric}</span>

              <h3 className={`font-clash text-xl md:text-2xl font-bold mb-3 transition-colors ${
                hoveredCard === 'jiomart' ? 'text-swiss-bg' : 'text-swiss-text'
              }`}>{jiomart.title}</h3>

              <p className={`font-satoshi text-sm leading-relaxed max-w-lg transition-colors ${
                hoveredCard === 'jiomart' ? 'text-swiss-bg/70' : 'text-swiss-text/75'
              }`}>{jiomart.description}</p>
            </div>

            {/* Category grid — seeding indicator */}
            <div className={`mt-8 border-t pt-6 transition-colors ${hoveredCard === 'jiomart' ? 'border-swiss-bg/20' : 'border-swiss-text/15'}`}>
              <div className="flex justify-between items-end mb-2">
                <span className={`text-[9px] font-black tracking-widest uppercase transition-colors ${hoveredCard === 'jiomart' ? 'text-swiss-bg/50' : 'text-swiss-text/40'}`}>
                  CATEGORY COVERAGE (30 DAYS)
                </span>
                <ArrowUpRight className={`w-4 h-4 transition-colors ${hoveredCard === 'jiomart' ? 'text-swiss-bg' : 'text-swiss-text'}`} />
              </div>
              <div className="grid grid-cols-8 gap-1">
                {[...Array(8)].map((_, i) => (
                  <div
                    key={i}
                    className="transition-all duration-500"
                    style={{
                      height: `${20 + (i * 9)}px`,
                      backgroundColor: hoveredCard === 'jiomart'
                        ? `rgba(242,242,242,${0.2 + i * 0.1})`
                        : `rgba(17,17,17,${0.15 + i * 0.1})`
                    }}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Bottom CTA strip */}
        <div className="border-l border-r border-b border-swiss-text px-8 py-5 flex flex-col sm:flex-row items-center justify-between gap-4 bg-swiss-text">
          <span className="font-satoshi text-xs font-black tracking-widest uppercase text-swiss-bg/80">
            Want results like these for your brand?
          </span>
          <a
            href="#contact"
            className="inline-flex items-center gap-2 font-satoshi text-xs font-black tracking-widest uppercase bg-swiss-bg text-swiss-text px-6 py-3 hover:bg-swiss-bg/85 transition-colors"
          >
            Get a Free Audit <ArrowUpRight className="w-4 h-4" />
          </a>
        </div>
      </section>
    )
  }

  // ── Softly Theme ─────────────────────────────────────────────────────────
  return (
    <section id="showcase" className="py-20 md:py-28 px-6 max-w-6xl mx-auto">
      <div className="text-center mb-12">
        <span className="text-softly-sage font-semibold tracking-wider text-sm uppercase block mb-2">[ OUR IMPACT ]</span>
        <h2 className="font-outfit text-3xl md:text-5xl font-bold text-softly-text">
          Marketplace Optimization Showcase
        </h2>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-stretch">
        {/* Amazon */}
        <div className="md:col-span-7 bg-white border border-softly-sand p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-bold text-softly-sage tracking-wider uppercase">[ AMAZON PLATFORM ]</span>
            <h3 className="font-outfit text-2xl font-bold mt-3 text-softly-text">{amazon.title}</h3>
            <p className="font-outfit text-xs text-softly-text/80 mt-4 leading-relaxed">{amazon.description}</p>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <span className="bg-softly-peach/20 text-softly-peach font-bold text-sm px-4 py-1.5 rounded-full">{amazon.metric}</span>
            <BarChart bars={[15,35,55,70,88,100]} accent="#DD8D6B" />
          </div>
        </div>

        {/* Flipkart */}
        <div className="md:col-span-5 bg-softly-sand/40 border border-softly-sand p-8 rounded-[4rem] flex flex-col justify-between items-center text-center hover:bg-softly-sand/60 transition-all duration-300">
          <span className="text-xs font-bold text-softly-sage tracking-wider uppercase">[ FLIPKART SEO ]</span>
          <div className="my-6">
            <h3 className="font-outfit text-xl font-bold text-softly-text">{flipkart.title}</h3>
            <span className="font-outfit text-3xl font-extrabold text-softly-sage block mt-3">{flipkart.metric}</span>
          </div>
          <p className="font-outfit text-xs text-softly-text/80 px-2 leading-relaxed">{flipkart.description}</p>
        </div>

        {/* Meesho */}
        <div className="md:col-span-5 bg-white border border-softly-sand aspect-square rounded-full p-8 flex flex-col justify-center items-center text-center hover:shadow-md transition-all duration-300">
          <span className="text-xs font-bold text-softly-sage tracking-wider uppercase mb-2">[ MEESHO AUDIT ]</span>
          <h3 className="font-outfit text-lg font-bold text-softly-text max-w-[200px]">{meesho.title}</h3>
          <span className="bg-softly-lavender text-softly-text font-bold text-xs px-4 py-1.5 rounded-full mt-4">{meesho.metric}</span>
          <p className="font-outfit text-xs text-softly-text/75 max-w-[220px] mt-4 leading-relaxed">{meesho.description}</p>
        </div>

        {/* JioMart */}
        <div className="md:col-span-7 bg-white border border-softly-sand p-8 rounded-[2.5rem] shadow-sm flex flex-col justify-between hover:shadow-md transition-all duration-300">
          <div>
            <span className="text-xs font-bold text-softly-sage tracking-wider uppercase">[ JIOMART AUDIT ]</span>
            <h3 className="font-outfit text-2xl font-bold mt-3 text-softly-text">{jiomart.title}</h3>
            <p className="font-outfit text-xs text-softly-text/80 mt-4 leading-relaxed">{jiomart.description}</p>
          </div>
          <div className="mt-8 flex justify-between items-end">
            <span className="bg-softly-sage/20 text-softly-sage font-bold text-sm px-4 py-1.5 rounded-full">{jiomart.metric}</span>
          </div>
        </div>
      </div>
    </section>
  )
}

export default ShowcaseGrid
