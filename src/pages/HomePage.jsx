import React from 'react'
import Hero from '../components/Hero'
import About from '../components/About'
import ShowcaseGrid from '../components/ShowcaseGrid'
import Services from '../components/Services'
import Testimonials from '../components/Testimonials'
import Contact from '../components/Contact'

function HomePage({ theme, showcases, services, testimonials, onAddSubmission, onAddConsultation }) {
  return (
    <>
      <Hero theme={theme} />
      <About theme={theme} />
      <ShowcaseGrid theme={theme} showcases={showcases} />
      <Services theme={theme} services={services} />
      <Testimonials theme={theme} testimonials={testimonials} />
      <Contact
        theme={theme}
        onAddSubmission={onAddSubmission}
        onAddConsultation={onAddConsultation}
      />
    </>
  )
}

export default HomePage
