import { useLayoutEffect } from 'react'

let activeLocks = 0
let originalStyles = null

function acquireScrollLock() {
  if (activeLocks === 0) {
    const body = document.body
    const root = document.documentElement
    const scrollbarWidth = window.innerWidth - root.clientWidth
    const bodyPaddingRight = Number.parseFloat(window.getComputedStyle(body).paddingRight) || 0

    originalStyles = {
      bodyOverflow: body.style.overflow,
      bodyPaddingRight: body.style.paddingRight,
      rootOverflow: root.style.overflow,
    }

    root.style.overflow = 'hidden'
    body.style.overflow = 'hidden'
    if (scrollbarWidth > 0) {
      body.style.paddingRight = `${bodyPaddingRight + scrollbarWidth}px`
    }
  }

  activeLocks += 1
  let released = false

  return () => {
    if (released) return
    released = true
    activeLocks = Math.max(0, activeLocks - 1)

    if (activeLocks === 0 && originalStyles) {
      document.body.style.overflow = originalStyles.bodyOverflow
      document.body.style.paddingRight = originalStyles.bodyPaddingRight
      document.documentElement.style.overflow = originalStyles.rootOverflow
      originalStyles = null
    }
  }
}

export default function useModalScrollLock(locked) {
  useLayoutEffect(() => {
    if (!locked) return undefined
    return acquireScrollLock()
  }, [locked])
}
