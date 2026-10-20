import React, { useState, useEffect } from 'react'

const memoryCache = new Map()
const inFlightRequests = new Map()
const CACHE_NAME = 'ecomxtra-images-v1'

export async function fetchImageWithRetry(url, maxAttempts = 5) {
  if (!url) return null

  // 1. Check in-memory cache first
  if (memoryCache.has(url)) {
    return memoryCache.get(url)
  }

  // 2. Check in-flight requests to avoid duplicate fetches
  if (inFlightRequests.has(url)) {
    return inFlightRequests.get(url)
  }

  const promise = (async () => {
    // 3. Check browser Cache Storage API
    if (typeof window !== 'undefined' && 'caches' in window) {
      try {
        const cache = await window.caches.open(CACHE_NAME)
        const cachedRes = await cache.match(url)
        if (cachedRes && cachedRes.ok) {
          const contentType = cachedRes.headers.get('content-type') || ''
          if (contentType.startsWith('image/')) {
            const blob = await cachedRes.blob()
            const objectUrl = URL.createObjectURL(blob)
            memoryCache.set(url, objectUrl)
            return objectUrl
          }
        }
      } catch {
        // Cache API access failed, fall back to network
      }
    }

    // 4. Network fetch with retry loop for 429 / Rate limit responses
    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const res = await fetch(url, {
          referrerPolicy: 'no-referrer',
          headers: {
            Accept: 'image/avif,image/webp,image/apng,image/svg+xml,image/*,*/*;q=0.8',
          },
        })

        const contentType = res.headers.get('content-type') || ''

        // If rate limited (429) or non-image text response returned by Pixabay, retry with backoff
        if (res.status === 429 || !contentType.startsWith('image/')) {
          if (attempt < maxAttempts) {
            const delay = Math.min(500 * attempt, 2000)
            await new Promise(resolve => setTimeout(resolve, delay))
            continue
          }
        }

        if (res.ok && contentType.startsWith('image/')) {
          const resClone = res.clone()
          const blob = await res.blob()
          const objectUrl = URL.createObjectURL(blob)
          memoryCache.set(url, objectUrl)

          // Persist in Cache Storage for instant future loads
          if (typeof window !== 'undefined' && 'caches' in window) {
            try {
              const cache = await window.caches.open(CACHE_NAME)
              await cache.put(url, resClone)
            } catch {
              // Storage quota or policy restriction
            }
          }

          return objectUrl
        }
      } catch {
        if (attempt < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, 600 * attempt))
          continue
        }
      }
    }

    // Direct fallback if all retry attempts exhausted
    return url
  })().finally(() => {
    inFlightRequests.delete(url)
  })

  inFlightRequests.set(url, promise)
  return promise
}

export function SafeImage({
  src,
  alt = '',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  fallback = null,
  priority = false,
  ...props
}) {
  const [resolvedSrc, setResolvedSrc] = useState(() => {
    if (!src) return null
    return memoryCache.get(src) || null
  })
  const [isLoading, setIsLoading] = useState(() => !resolvedSrc && Boolean(src))
  const [hasError, setHasError] = useState(false)

  useEffect(() => {
    if (!src) {
      setResolvedSrc(null)
      setIsLoading(false)
      return
    }

    if (memoryCache.has(src)) {
      setResolvedSrc(memoryCache.get(src))
      setIsLoading(false)
      return
    }

    let isMounted = true
    setIsLoading(true)
    setHasError(false)

    fetchImageWithRetry(src)
      .then(finalSrc => {
        if (isMounted) {
          if (finalSrc) {
            setResolvedSrc(finalSrc)
          } else {
            setHasError(true)
          }
          setIsLoading(false)
        }
      })
      .catch(() => {
        if (isMounted) {
          setResolvedSrc(src)
          setIsLoading(false)
        }
      })

    return () => {
      isMounted = false
    }
  }, [src])

  if (!src || (hasError && !resolvedSrc)) {
    return fallback
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {/* Sleek shimmer while loading or resolving */}
      {isLoading && (
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-r from-slate-200 via-slate-100 to-slate-200 dark:from-slate-800 dark:via-slate-700 dark:to-slate-800 animate-pulse"
        />
      )}

      {resolvedSrc && (
        <img
          src={resolvedSrc}
          alt={alt}
          referrerPolicy="no-referrer"
          loading={priority ? 'eager' : 'lazy'}
          onLoad={() => setIsLoading(false)}
          onError={() => {
            if (resolvedSrc === src) {
              setHasError(true)
              setIsLoading(false)
            }
          }}
          className={`${imgClassName} transition-opacity duration-500 ${
            isLoading ? 'opacity-0' : 'opacity-100'
          }`}
          {...props}
        />
      )}
    </div>
  )
}

export default SafeImage
