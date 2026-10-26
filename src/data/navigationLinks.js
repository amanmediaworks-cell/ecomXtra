export const defaultNavigationLinks = [
  { label: 'Home', path: '/' },
  { label: 'Services', path: '/services' },
  { label: 'Showcase', path: '/showcase' },
  { label: 'Testimonials', path: '/testimonials' },
  { label: 'About', path: '/philosophy' },
  { label: 'Blog', path: '/blog' },
  { label: 'Contact', path: '/contact' },
]

const navigationOrder = new Map(defaultNavigationLinks.map((link, index) => [link.path, index]))

export function normalizeNavigationLinks(links) {
  const normalizedLinks = (links?.length ? links : defaultNavigationLinks)
    .map(link => link.label?.toLowerCase() === 'philosophy' ? { ...link, label: 'About' } : link)

  return normalizedLinks.sort((first, second) =>
    (navigationOrder.get(first.path) ?? defaultNavigationLinks.length - 1.5)
      - (navigationOrder.get(second.path) ?? defaultNavigationLinks.length - 1.5))
}
