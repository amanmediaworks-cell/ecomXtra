import { defaultBlogs } from './defaultBlogs.js'
import { marketplaceServiceDefaults } from './marketplaceServiceContent.js'

export const initialContent = {
  services: marketplaceServiceDefaults.map((service, index) => ({ id: `fallback-service-${index + 1}`, ...service })),
  showcases: [
    { id: 'fallback-showcase-1', key: 'amazon', title: 'Amazon Ranking Boost', metric: '#1 Best Seller', description: 'Boosted search rankings to the first page, resulting in a 2.4x organic sales increase within 60 days.', link: '#' },
    { id: 'fallback-showcase-2', key: 'flipkart', title: 'Flipkart Visibility Multiplier', metric: '1.8x Conversions', description: 'Ranked accessories catalog into the top 3 spots, optimizing images and titles for search visibility.', link: '#' },
    { id: 'fallback-showcase-3', key: 'meesho', title: 'Meesho High-Velocity Funnel', metric: '310% Order Vol', description: 'Designed optimized descriptions and images for tier 2/3 buyers, unlocking a massive surge in daily orders.', link: '#' },
    { id: 'fallback-showcase-4', key: 'jiomart', title: 'JioMart Grocery Launch', metric: '20k Monthly Orders', description: 'Configured inventory pipelines and keyword listings, reaching top slots for critical local queries.', link: '#' },
  ],
  testimonials: [
    { id: 'fallback-testimonial-1', author: 'Karan Sharma', company: 'FitFuel Co.', text: 'Working with EcomXtra automated our entire catalog update system. The custom AI Whatsapp chatbot closes deals automatically in Hinglish - sales are up 45%.' },
    { id: 'fallback-testimonial-2', author: 'Sonal Verma', company: 'GlowOrganic', text: 'Their minimalist brutalist aesthetic options represent a high-end luxury vibe perfectly. The wellness theme is super calming. Amazing work.' },
    { id: 'fallback-testimonial-3', author: 'Rahul Gupta', company: 'Urban Threads', text: 'Our custom Shopify integration has saved us 15+ hours of manual data sync per week. Highly recommended for ecommerce brands.' },
  ],
  blogs: defaultBlogs,
}

export const fallbackContent = {
  services: initialContent.services.slice(0, 2),
  showcases: initialContent.showcases.slice(0, 2),
  testimonials: initialContent.testimonials.slice(0, 2),
  blogs: initialContent.blogs.slice(0, 2),
}
