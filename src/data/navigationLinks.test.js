import test from 'node:test'
import assert from 'node:assert/strict'
import { defaultNavigationLinks, normalizeNavigationLinks } from './navigationLinks.js'

test('default navigation prioritizes services and proof before company information', () => {
  assert.deepEqual(
    defaultNavigationLinks.map(link => link.label),
    ['Home', 'Services', 'Showcase', 'Testimonials', 'About', 'Blog', 'Contact'],
  )
})

test('saved navigation uses the professional order and renames Philosophy to About', () => {
  const links = normalizeNavigationLinks([
    { label: 'Contact', path: '/contact' },
    { label: 'Testimonials', path: '/testimonials' },
    { label: 'Services', path: '/services' },
    { label: 'Philosophy', path: '/philosophy' },
    { label: 'Showcase', path: '/showcase' },
    { label: 'Home', path: '/' },
    { label: 'Blog', path: '/blog' },
  ])

  assert.deepEqual(
    links.map(link => link.label),
    ['Home', 'Services', 'Showcase', 'Testimonials', 'About', 'Blog', 'Contact'],
  )
})

test('custom navigation links remain before Contact', () => {
  const links = normalizeNavigationLinks([
    { label: 'Contact', path: '/contact' },
    { label: 'Resources', path: '/resources' },
    { label: 'Home', path: '/' },
  ])

  assert.deepEqual(
    links.map(link => link.label),
    ['Home', 'Resources', 'Contact'],
  )
})
