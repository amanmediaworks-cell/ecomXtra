const contentCache = new Map()

export function loadCachedContent(key, load) {
  const cached = contentCache.get(key)
  if (cached?.data) return Promise.resolve(cached.data)
  if (cached?.request) return cached.request

  const request = load()
    .then(data => {
      contentCache.set(key, { data })
      return data
    })
    .catch(error => {
      contentCache.delete(key)
      throw error
    })

  contentCache.set(key, { request })
  return request
}

export function updateCachedContent(key, update) {
  const cached = contentCache.get(key)
  if (cached?.data) {
    contentCache.set(key, { data: update(cached.data) })
  }
}

export function invalidateCachedContent(prefix) {
  for (const key of contentCache.keys()) {
    if (key.startsWith(prefix)) contentCache.delete(key)
  }
}
