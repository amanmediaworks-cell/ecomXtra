import { useState } from 'react'

export function SafeImage({
  src,
  alt = '',
  className = '',
  imgClassName = 'w-full h-full object-cover',
  fallback = null,
  priority = false,
  width = 1200,
  height = 675,
  onError,
  ...props
}) {
  const [failedSrc, setFailedSrc] = useState(null)

  if (!src || failedSrc === src) {
    if (fallback) return fallback
    return (
      <div className={`relative overflow-hidden ${className}`} role="img" aria-label={alt || 'Image unavailable'}>
        <img src="/logo.png" alt="" width={1200} height={675} className={imgClassName} />
      </div>
    )
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      <img
        src={src}
        alt={alt}
        referrerPolicy="no-referrer"
        loading={priority ? 'eager' : 'lazy'}
        fetchPriority={priority ? 'high' : undefined}
        decoding="async"
        {...props}
        width={width}
        height={height}
        onError={event => {
          setFailedSrc(src)
          onError?.(event)
        }}
        className={imgClassName}
      />
    </div>
  )
}

export default SafeImage
