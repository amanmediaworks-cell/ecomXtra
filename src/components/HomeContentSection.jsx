import { BarChart3, Cpu, ShieldCheck, Zap } from 'lucide-react'

const icons = { BarChart3, Cpu, ShieldCheck, Zap }
const cardStyles = [
  'border-violet-150',
  'border-pink-150',
  'border-amber-150',
  'border-emerald-150',
]
const iconStyles = [
  'from-violet-600 to-pink-500',
  'from-pink-500 to-amber-500',
  'from-amber-500 to-emerald-500',
  'from-emerald-500 to-violet-600',
]

function HomeContentSection({ section, content }) {
  const features = content?.features || content?.steps || []
  const isProcess = section === 'process'

  return (
    <section className="py-10 px-6 max-w-6xl mx-auto">
      <div className="mb-8">
        <h2 className="text-2xl md:text-4xl font-bold font-outfit text-slate-900">
          {content?.heading}
        </h2>
        {content?.description && (
          <p className="mt-3 max-w-3xl text-sm leading-relaxed font-outfit text-slate-600">
            {content.description}
          </p>
        )}
      </div>
      <div className={`grid grid-cols-1 ${isProcess ? 'md:grid-cols-3' : 'md:grid-cols-2'} gap-6`}>
        {features.map((feature, index) => {
          const Icon = icons[feature.icon] || Zap
          return (
            <article
              key={`${feature.title || 'item'}-${index}`}
              className={`rounded-3xl border-2 bg-white/90 p-8 shadow-lg ${cardStyles[index % cardStyles.length]}`}
            >
              {isProcess ? (
                <span className="mb-4 block text-3xl font-black text-violet-600">
                  {String(index + 1).padStart(2, '0')}
                </span>
              ) : (
                <span className={`mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-r text-white ${iconStyles[index % iconStyles.length]}`}>
                  <Icon className="h-6 w-6" />
                </span>
              )}
              <h3 className="mb-3 text-lg font-bold font-outfit text-slate-900">{feature.title}</h3>
              <p className="text-sm leading-relaxed font-outfit text-slate-600">{feature.description}</p>
            </article>
          )
        })}
      </div>
    </section>
  )
}

export default HomeContentSection
