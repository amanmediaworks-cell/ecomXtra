import { Link } from 'react-router-dom'
import { ArrowRight, Zap, Bot, TrendingUp, Sparkles } from 'lucide-react'
import SafeImage from './SafeImage'

const DEFAULT_HERO_IMAGE = 'https://cdn.pixabay.com/photo/2017/03/13/17/26/ecommerce-2140603_1280.jpg'

function Hero({ content }) {
  const hero = content || {}
  const buttons = hero.buttons || []
  const heroImage = hero.imageUrl || DEFAULT_HERO_IMAGE

  return (
    <section className={`relative overflow-hidden flex flex-col items-center justify-center text-center px-4 ${
      'pt-28 pb-16 md:pt-40 md:pb-24'
    }`}>
      {/* Top Feature Pill Badge */}
      <div className="mb-6 inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-300/40 bg-white/70 backdrop-blur-md shadow-xs transition-all hover:scale-105">
        <img src="/logo.png" alt="EcomXtra" className="w-4 h-4 rounded-full object-contain shrink-0" />
        <span className={`text-[11px] font-extrabold uppercase tracking-wider ${
          'font-outfit text-slate-800'
        }`}>
          {hero.badge || 'High-Converting Storefronts & AI Automation'}
        </span>
      </div>

      {/* Typographic Echo Stack */}
      <div className="relative w-full select-none mb-10 h-[170px] sm:h-[240px] md:h-[320px] lg:h-[380px]">
        {/* Echo Layer 5 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[10vw] font-black uppercase font-clash tracking-tighter select-none -translate-y-16 scale-90 ${
          'text-purple-400/15'
        }`}>
          {hero.heading || 'ECOMXTRA'}
        </div>
        {/* Echo Layer 4 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[11vw] font-black uppercase font-clash tracking-tighter select-none -translate-y-10 scale-95 ${
          'text-pink-500/20'
        }`}>
          {hero.heading || 'ECOMXTRA'}
        </div>
        {/* Echo Layer 3 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[12vw] font-black uppercase font-clash tracking-tighter select-none -translate-y-5 ${
          'text-indigo-600/30'
        }`}>
          {hero.heading || 'ECOMXTRA'}
        </div>
        {/* Echo Layer 2 */}
        <div className={`absolute inset-0 flex items-center justify-center text-[12.5vw] font-black uppercase font-clash tracking-tighter select-none translate-y-0 ${
          'text-violet-600/50'
        }`}>
          {hero.heading || 'ECOMXTRA'}
        </div>
        {/* Main front layer */}
        <div className={`absolute inset-0 flex items-center justify-center text-[13vw] font-black uppercase font-clash tracking-tighter select-none translate-y-5 ${
          'text-transparent bg-clip-text bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 drop-shadow-sm'
        }`}>
          {hero.heading || 'ECOMXTRA'}
        </div>
      </div>

      {/* Subhead and CTAs */}
      <div className="max-w-4xl mt-4">
        <p className={`text-base sm:text-lg md:text-xl font-bold tracking-tight leading-relaxed px-4 ${
          'font-outfit text-slate-800'
        }`}>
          {hero.subheading || 'We build high-converting ecommerce storefronts, custom integrations, and smart Hinglish AI automation that automatically closes sales for growth-minded brands.'}
        </p>
        {hero.description && (
          <p className="mt-4 px-4 text-sm leading-relaxed text-slate-600">{hero.description}</p>
        )}

        <div className="flex flex-col sm:flex-row justify-center items-center gap-4 mt-8 w-full sm:w-auto px-4">
          {buttons.map((button, index) => {
            const isPrimary = index === 0
            const className = `w-full sm:w-auto text-xs uppercase transition-all duration-300 inline-flex items-center justify-center gap-2 font-outfit ${isPrimary ? 'font-extrabold bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 text-white shadow-lg shadow-pink-500/25 hover:shadow-xl' : 'font-bold bg-white/90 backdrop-blur-md border-2 border-violet-200 text-slate-800 shadow-sm hover:bg-violet-50'} px-9 py-4 rounded-full hover:scale-105`
            const content = <>{button.label}{isPrimary && <ArrowRight className="w-4 h-4" />}</>
            return button.href?.startsWith('/') ? (
              <Link key={`${button.label}-${index}`} to={button.href} className={className}>{content}</Link>
            ) : (
              <a
                key={`${button.label}-${index}`}
                href={button.href}
                target={/^https?:\/\//i.test(button.href || '') ? '_blank' : undefined}
                rel={/^https?:\/\//i.test(button.href || '') ? 'noopener noreferrer' : undefined}
                className={className}
              >
                {content}
              </a>
            )
          })}
        </div>
      </div>

      {/* Hero Showcase Visual Device Frame */}
      <div className="relative mt-12 md:mt-16 max-w-5xl lg:max-w-6xl xl:max-w-7xl w-full px-2 sm:px-6 lg:px-8 group">
        {/* Ambient Gradient Glow */}
        <div className="absolute -inset-1.5 bg-gradient-to-r from-violet-600 via-pink-500 to-amber-500 rounded-3xl blur-xl opacity-30 group-hover:opacity-50 transition-opacity duration-700 pointer-events-none" />

        {/* Window Container */}
        <div className="relative overflow-hidden rounded-3xl border-2 border-white/60 bg-white/90 backdrop-blur-xl shadow-2xl">
          {/* Mockup Top Navigation Bar */}
          <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/60 bg-slate-50/80 backdrop-blur-sm">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded-full bg-rose-400 inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-amber-400 inline-block shadow-xs" />
              <span className="w-3 h-3 rounded-full bg-emerald-400 inline-block shadow-xs" />
            </div>
            <div className="hidden sm:flex items-center gap-2 px-3 py-1 rounded-full bg-white/80 border border-slate-200/80 text-[11px] font-mono font-medium text-slate-600">
              <Sparkles className="w-3 h-3 text-violet-500" />
              <span>https://ecomxtra.in/storefront-architecture</span>
            </div>
            <div className="text-[10px] font-extrabold uppercase tracking-wider text-violet-600 font-outfit">
              Headless Engine
            </div>
          </div>

          {/* Main Visual Image with Safe Caching & Retry */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] md:aspect-[2.2/1] w-full overflow-hidden bg-slate-900">
            <SafeImage
              src={heroImage}
              alt="EcomXtra High-Converting Storefront Architecture"
              className="w-full h-full"
              imgClassName="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
              priority={true}
            />

            {/* Gradient Overlays for High-Contrast Text Legibility */}
            <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-black/20 pointer-events-none" />

            {/* Floating Glassmorphism Metric Chips */}
            <div className="absolute bottom-4 left-4 right-4 flex flex-wrap items-center justify-between gap-2 pointer-events-none">
              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-auto">
                <Zap className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                <span className="text-xs font-bold font-outfit">0.42s Headless LCP</span>
              </div>

              <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-auto">
                <Bot className="w-3.5 h-3.5 text-pink-400 shrink-0" />
                <span className="text-xs font-bold font-outfit">Hinglish AI Deal Closer: Active</span>
              </div>

              <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/85 backdrop-blur-md border border-white/20 text-white shadow-lg pointer-events-auto">
                <TrendingUp className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                <span className="text-xs font-bold font-outfit">2.4× Revenue Lift</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero
