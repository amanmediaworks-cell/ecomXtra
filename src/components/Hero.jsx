import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'

function Hero({ content }) {
  const hero = content || {}
  const buttons = hero.buttons || []

  return (
    <section className={`relative overflow-hidden flex flex-col items-center justify-center text-center px-4 ${
      'pt-28 pb-16 md:pt-40 md:pb-28'
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
      <div className="max-w-3xl mt-6">
        {hero.imageUrl && (
          <img src={hero.imageUrl} alt="" className="mx-auto mb-6 max-h-48 max-w-full object-contain" />
        )}
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
    </section>
  );
}

export default Hero
