import Hero from '../components/Hero'
import About from '../components/About'
import ShowcaseGrid from '../components/ShowcaseGrid'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'
import StatsSection from '../components/StatsSection'
import { siteContentFallback } from '../data/siteContentDefaults'

function HomePage({
  showcases,
  services,
  testimonials,
  siteContent = [],
}) {
  const rows = Object.fromEntries(siteContent.map(row => [row.content_key, row]))
  const sectionContent = key => ({
    ...siteContentFallback[key]?.content,
    ...rows[key]?.content,
  })
  const sections = [
    { key: 'hero', render: () => <Hero content={sectionContent('hero')} /> },
    { key: 'stats', render: () => <StatsSection metrics={sectionContent('stats').metrics} /> },
    { key: 'showcase_section', render: () => <ShowcaseGrid showcases={showcases} content={sectionContent('showcase_section')} /> },
    { key: 'services_section', render: () => <Services services={services} content={sectionContent('services_section')} /> },
    { key: 'testimonials_section', render: () => <Testimonials testimonials={testimonials} content={sectionContent('testimonials_section')} /> },
    { key: 'contact', render: () => <Contact content={sectionContent('contact')} /> },
  ]

  return (
    <>
      {sections
        .filter(section => rows[section.key] && rows[section.key].is_public !== false)
        .sort((left, right) => (rows[left.key]?.display_order ?? 0) - (rows[right.key]?.display_order ?? 0))
        .map(section => <div key={section.key}>{section.render()}</div>)}
    </>
  )
}

export default HomePage
