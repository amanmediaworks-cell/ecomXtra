import { Link } from 'react-router-dom'
import {
  ArrowDown,
  ArrowRight,
  ArrowUpRight,
  BadgeCheck,
  Boxes,
  ChartNoAxesCombined,
  ClipboardCheck,
  FileText,
  Headset,
  PackageCheck,
  ShieldCheck,
} from 'lucide-react'
import SafeImage from '../components/SafeImage'
import ContactModalTrigger from '../components/ContactModalTrigger'
import { getServicePageDetails, marketplaceServiceDefaults } from '../data/marketplaceServiceContent'

const serviceIcons = [
  ClipboardCheck,
  FileText,
  Headset,
  PackageCheck,
  ShieldCheck,
  Boxes,
  ChartNoAxesCombined,
  BadgeCheck,
]

function CopyBlocks({ paragraphs = [] }) {
  return paragraphs.map((paragraph, index) => (
    <p key={`${index}-${paragraph.slice(0, 18)}`} className="mt-4 text-base leading-8 text-slate-700">
      {paragraph}
    </p>
  ))
}

function ServiceDetailPage({ service, serviceType = 'management' }) {
  if (!service) {
    return (
      <section className="mx-auto max-w-4xl px-5 py-28 text-center">
        <h1 className="font-clash text-3xl font-bold text-slate-900">Service page not found</h1>
        <p className="mt-3 text-slate-600">The marketplace service may have moved or is not available.</p>
        <Link to="/services" className="mt-6 inline-flex items-center gap-2 rounded-lg bg-[#243141] px-5 py-3 font-semibold text-white">
          Browse services <ArrowRight className="h-4 w-4" />
        </Link>
      </section>
    )
  }

  const isOnboarding = serviceType === 'onboarding'
  const details = getServicePageDetails(service, serviceType)
  const relatedServices = marketplaceServiceDefaults.filter(item => item.slug !== service.slug)
  const serviceFocusAreas = isOnboarding
    ? ['Seller information', 'Catalogue readiness', 'Setup coordination', 'Launch planning']
    : ['Listings', 'Account health', 'Claims', 'Returns & refunds']

  return (
    <article className="service-page bg-white text-slate-900">
      <section className="service-reveal relative overflow-hidden bg-[linear-gradient(118deg,#fffdf3_0%,#fffaf0_57%,#ffc46d_100%)]">
        <div className="mx-auto grid max-w-7xl items-center gap-10 px-5 py-16 sm:px-8 md:grid-cols-2 md:gap-14 md:py-24">
          <div>
            <p className="mb-5 text-xs font-extrabold uppercase tracking-[0.19em] text-[#cb6e27]">
              {details.hero.eyebrow}
            </p>
            <h1 className="max-w-2xl font-clash text-4xl font-bold leading-[1.08] tracking-tight text-[#111820] sm:text-5xl lg:text-6xl">
              {details.hero.title || service.title}
            </h1>
            <p className="mt-6 max-w-2xl text-base italic leading-8 text-slate-700 sm:text-lg">
              {details.hero.description || service.description}
            </p>
            <div className="mt-7 flex flex-wrap gap-2" aria-label={isOnboarding ? 'Seller onboarding support areas' : 'Marketplace operations covered'}>
              {serviceFocusAreas.map(item => (
                <span key={item} className="rounded-full border border-[#243141]/15 bg-white/70 px-3 py-1.5 text-xs font-semibold text-[#243141]">
                  {item}
                </span>
              ))}
            </div>
            <ContactModalTrigger
              className="mt-8 inline-flex items-center gap-3 rounded-lg bg-[#243141] px-6 py-4 text-sm font-bold text-white shadow-lg transition hover:-translate-y-0.5 hover:bg-[#17222e] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#c96f2e]"
            >
              Book a consultation <ArrowRight className="h-4 w-4" />
            </ContactModalTrigger>
          </div>
          <div className="relative mx-auto w-full max-w-2xl">
            <div className="absolute -left-3 top-8 h-3/4 w-4 rounded-l-xl bg-[#f7a73e] sm:-left-5 sm:w-6" />
            <div className="relative overflow-hidden rounded-3xl border border-white/80 bg-white p-2 shadow-[0_28px_70px_rgba(35,46,57,0.18)]">
              <SafeImage
                src={details.hero.imageUrl}
                alt={details.hero.imageAlt || details.hero.title}
                className="aspect-[1.38] w-full overflow-hidden rounded-2xl bg-slate-100"
                imgClassName="h-full w-full object-cover"
              />
              <div className="absolute bottom-5 left-5 right-5 rounded-xl border border-white/70 bg-white/95 p-4 shadow-lg backdrop-blur sm:bottom-7 sm:left-7 sm:right-7">
                <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-[#b86728]">{isOnboarding ? 'Seller onboarding' : 'Marketplace operations'}</p>
                <p className="mt-1 text-sm font-semibold text-[#243141]">{details.feature.title}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="service-reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-4xl text-center">
          <h2 className="font-clash text-3xl font-bold leading-tight text-[#243141] sm:text-4xl">{details.overview.title}</h2>
          <CopyBlocks paragraphs={details.overview.paragraphs || []} />
        </div>
      </section>

      <section className="service-reveal bg-[#fbfaf6] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="font-clash text-3xl font-bold text-[#243141] sm:text-4xl">{details.included.title}</h2>
            <p className="mt-4 leading-7 text-slate-600">{details.included.intro}</p>
          </header>
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {(details.included.items || []).map((item, index) => {
              const Icon = serviceIcons[index % serviceIcons.length]
              return (
                <div key={`${item.title}-${index}`} className="service-card flex min-h-28 items-center gap-4 rounded-2xl bg-white p-5 shadow-[0_8px_24px_rgba(25,39,51,0.08)]">
                  <span className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl border border-slate-200 text-[#243141]">
                    <Icon className="h-7 w-7" strokeWidth={1.7} />
                  </span>
                  <span className="font-semibold leading-snug text-[#17222e]">{item.title}</span>
                </div>
              )
            })}
          </div>
        </div>
      </section>

      <section className="service-reveal px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto grid max-w-7xl overflow-hidden rounded-[2rem] bg-[#243141] text-white shadow-xl lg:grid-cols-2">
          <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
            <p className="text-xs font-bold uppercase tracking-[0.18em] text-[#ffc46d]">{isOnboarding ? 'Launch preparation spotlight' : 'Account operations spotlight'}</p>
            <h2 className="mt-4 font-clash text-3xl font-bold leading-tight sm:text-4xl">{details.feature.title}</h2>
            <p className="mt-5 text-sm leading-7 text-slate-200 sm:text-base">{details.feature.body}</p>
            <ul className="mt-5 space-y-3">
              {(details.feature.bullets || []).map((bullet, index) => (
                <li key={`${index}-${bullet.slice(0, 16)}`} className="flex gap-3 text-sm leading-6 text-slate-100">
                  <BadgeCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#ffc46d]" />
                  <span>{bullet}</span>
                </li>
              ))}
            </ul>
          </div>
          <SafeImage
            src={details.feature.imageUrl}
            alt={details.feature.imageAlt || details.feature.title}
            className="min-h-72 bg-slate-700 lg:min-h-full"
            imgClassName="h-full min-h-72 w-full object-cover"
          />
        </div>
      </section>

      <section className="service-reveal bg-[#fbfaf6] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="font-clash text-3xl font-bold text-[#243141] sm:text-4xl">{details.benefits.title}</h2>
            <p className="mt-4 leading-7 text-slate-600">{details.benefits.intro}</p>
          </header>
          <div className="grid gap-5 md:grid-cols-3">
            {(details.benefits.items || []).map((item, index) => (
              <div key={`${item.title}-${index}`} className="service-card rounded-2xl border border-[#243141]/15 bg-white p-6 text-center shadow-[0_10px_25px_rgba(25,39,51,0.07)]">
                <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[#243141] text-[#ffc46d]">
                  <BadgeCheck className="h-6 w-6" />
                </span>
                <h3 className="mt-4 font-clash text-xl font-bold text-[#243141]">{item.title}</h3>
                <p className="mt-2 text-sm leading-6 text-slate-600">{item.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="service-reveal mx-auto max-w-6xl px-5 py-16 sm:px-8 md:py-20">
        <header className="mx-auto mb-8 max-w-3xl text-center">
          <h2 className="font-clash text-3xl font-bold text-[#243141] sm:text-4xl">{details.audience.title}</h2>
          <p className="mt-4 leading-7 text-slate-600">{details.audience.intro}</p>
        </header>
        <div className="mx-auto max-w-5xl space-y-3">
          {(details.audience.items || []).map((item, index) => (
            <div key={`${item.title}-${index}`} className="flex flex-col gap-1 rounded-xl px-4 py-3 sm:flex-row sm:gap-2">
              <h3 className="shrink-0 font-bold text-[#243141]">{item.title}:</h3>
              <p className="leading-7 text-slate-700">{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="service-reveal bg-[#fbfaf6] px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-6xl">
          <header className="mx-auto mb-10 max-w-3xl text-center">
            <h2 className="font-clash text-3xl font-bold text-[#243141] sm:text-4xl">{details.process.title}</h2>
            <p className="mt-4 leading-7 text-slate-600">{details.process.intro}</p>
          </header>
          <div className="grid items-start gap-8 lg:grid-cols-[0.82fr_1.18fr]">
            <div className="overflow-hidden rounded-3xl bg-[#243141] p-3">
              <SafeImage
                src={details.hero.imageUrl}
                alt={details.hero.imageAlt || details.hero.title}
                className="aspect-[0.9] w-full overflow-hidden rounded-2xl bg-slate-100"
                imgClassName="h-full w-full object-cover"
              />
              <p className="px-3 py-4 text-sm font-semibold text-white">A clear, collaborative workflow for {isOnboarding ? 'seller onboarding' : service.title}</p>
            </div>
            <div className="space-y-3">
              {(details.process.steps || []).map((step, index) => (
                <details key={`${step.title}-${index}`} className="service-step group rounded-xl border-2 border-[#243141]/75 bg-white">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold text-[#243141] marker:hidden">
                    <span><b>Step {index + 1}:</b> {step.title}</span>
                    <span className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#243141] px-3 py-2 text-xs font-bold text-white">
                      Read more <ArrowDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                    </span>
                  </summary>
                  <div className="border-t border-slate-200 px-4 py-4">
                    <p className="font-medium text-slate-700">{step.summary}</p>
                    <p className="mt-3 text-sm leading-7 text-slate-600">{step.article}</p>
                  </div>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="service-reveal px-5 py-16 sm:px-8 md:py-20">
        <div className="mx-auto max-w-5xl rounded-3xl border border-slate-200 bg-white p-5 shadow-[0_12px_36px_rgba(25,39,51,0.08)] sm:p-10">
          <h2 className="text-center font-clash text-3xl font-bold text-[#111820] sm:text-4xl">{details.faq.title}</h2>
          <div className="mt-8 space-y-3">
            {(details.faq.items || []).map((item, index) => (
              <details key={`${item.question}-${index}`} className="group overflow-hidden rounded-xl bg-[#243141] text-white">
                <summary className="flex cursor-pointer list-none items-center justify-between gap-4 p-4 font-semibold marker:hidden sm:p-5">
                  <span>{item.question}</span>
                  <ArrowDown className="h-5 w-5 shrink-0 transition-transform group-open:rotate-180" />
                </summary>
                <p className="border-t border-white/15 px-4 py-4 text-sm leading-7 text-slate-100 sm:px-5">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>

      <section className="service-reveal bg-[linear-gradient(115deg,#fffaf0_0%,#ffd18a_100%)] px-5 py-14 sm:px-8">
        <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-5 sm:flex-row sm:items-center">
          <div>
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[#aa5a24]">{isOnboarding ? 'Preparing a marketplace launch?' : 'Ready to delegate marketplace operations?'}</p>
            <h2 className="mt-2 max-w-2xl font-clash text-2xl font-bold text-[#243141] sm:text-3xl">
              {isOnboarding
                ? `Talk to EcomXtra about launching on ${service.title.replace(' Account Management Services', '')}.`
                : `Talk to EcomXtra about your ${service.title.replace(' Services', '')} account.`}
            </h2>
          </div>
          <ContactModalTrigger className="inline-flex shrink-0 items-center gap-2 rounded-lg bg-[#243141] px-6 py-4 font-bold text-white transition hover:-translate-y-0.5 hover:bg-[#17222e]">
            {isOnboarding ? 'Discuss your launch' : 'Discuss your account'} <ArrowUpRight className="h-4 w-4" />
          </ContactModalTrigger>
        </div>
      </section>

      <nav aria-label={isOnboarding ? 'Other marketplace onboarding services' : 'Other marketplace services'} className="mx-auto flex max-w-6xl flex-wrap justify-center gap-3 px-5 py-10">
        {relatedServices.map(item => (
          <Link key={item.slug} to={`/services/${item.slug}${isOnboarding ? '/onboarding' : ''}`} className="rounded-full border border-[#243141]/20 bg-white px-4 py-2 text-sm font-semibold text-[#243141] transition hover:border-[#cb6e27] hover:text-[#a7521e]">
            {item.title.replace(' Account Management Services', '')} {isOnboarding ? 'onboarding' : 'support'}
          </Link>
        ))}
      </nav>
    </article>
  )
}

export default ServiceDetailPage
