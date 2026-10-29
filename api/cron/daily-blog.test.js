import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import {
  chooseCategory,
  countWords,
  getCategoryImage,
  generateArticle,
  getArticleValidationIssues,
  getClaimedRun,
  getScheduledDate,
  isValidImagePayload,
  isValidArticle,
  RUN_LEASE_MS,
  secureSecretMatch,
  slugify,
  titleSimilarity,
} from './daily-blog.js'
import dailyBlogHandler from './daily-blog.js'

const migration = await readFile(
  fileURLToPath(new URL('../../supabase/migrations/20261020000000_daily_ai_blog_automation.sql', import.meta.url)),
  'utf8',
)
const singleImageMigration = await readFile(
  fileURLToPath(new URL('../../supabase/migrations/20261026000000_single_blog_cover_image.sql', import.meta.url)),
  'utf8',
)
const fullErrorReasonMigration = await readFile(
  fileURLToPath(new URL('../../supabase/migrations/20261029000000_daily_blog_full_error_reason.sql', import.meta.url)),
  'utf8',
)
const endpoint = await readFile(fileURLToPath(new URL('./daily-blog.js', import.meta.url)), 'utf8')
const vercelConfig = JSON.parse(await readFile(
  fileURLToPath(new URL('../../vercel.json', import.meta.url)),
  'utf8',
))

function validArticle(heading = '###') {
  const practicalBody = Array.from({ length: 120 }, (_, index) => `practical guidance ${index}`).join(' ')
  const conclusion = Array.from({ length: 40 }, (_, index) => `closing takeaway ${index}`).join(' ')
  const faq = [
    '#### What should I measure first?',
    'Start with checkout completion, form errors, and the drop-off points that already exist in your store analytics dashboard.',
    '#### How should I test changes?',
    'Change one checkout step at a time and compare results against the previous version before you ship the next edit.',
  ].join('\n\n')
  return {
    title: 'A Practical Guide to Improving Shopify Checkout',
    excerpt: 'A detailed practical guide to simplifying a Shopify checkout and improving the customer experience.',
    seo_title: 'Improve Shopify Checkout: Practical Guide',
    meta_description: 'Learn practical, low-risk ways to make a Shopify checkout clearer and easier for customers.',
    tags: ['Shopify', 'Checkout', 'Conversion'],
    image_url: 'https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80',
    image_alt: 'Marketplace seller reviewing a product listing on a laptop',
    content: `${heading} Start Here\n\n${practicalBody}\n\n${heading} Next Steps\n\n${practicalBody}\n\n${heading} Conclusion\n\n${conclusion}\n\n${heading} Frequently Asked Questions\n\n${faq}`,
  }
}

test('daily blog slug generation is lowercase, readable, and strips accents', () => {
  assert.equal(slugify('Café: Shopify & Growth!'), 'cafe-shopify-growth')
})

test('category rotation advances and wraps through the fixed list', () => {
  assert.equal(chooseCategory(undefined), 'Amazon')
  assert.equal(chooseCategory('Amazon'), 'Flipkart')
  assert.equal(chooseCategory('Zepto'), 'Amazon')
})

test('claim RPC result handles the table-returning response shape', () => {
  const claim = { run_id: 'run-id', attempt_token: 'attempt-token' }
  assert.deepEqual(getClaimedRun([claim]), claim)
  assert.deepEqual(getClaimedRun(claim), claim)
  assert.equal(getClaimedRun([]), null)
})

test('scheduled dates allow authorized recovery of past UTC dates only', () => {
  const now = new Date('2026-10-20T08:00:00.000Z')
  assert.equal(getScheduledDate(undefined, now), '2026-10-20')
  assert.equal(getScheduledDate({ scheduled_date: '2026-10-19' }, now), '2026-10-19')
  for (const invalid of ['2026-10-21', '2026-02-30', '10/19/2026', ['2026-10-19']]) {
    assert.throws(() => getScheduledDate({ scheduled_date: invalid }, now), { code: 'invalid_scheduled_date' })
  }
})

test('Gemini HTTP failure preserves the complete provider response', async () => {
  const originalFetch = globalThis.fetch
  const oldApiKey = process.env.GEMINI_API_KEY
  const providerResponse = {
    error: {
      code: 400,
      message: 'Invalid generation request',
      status: 'INVALID_ARGUMENT',
      details: [{ field: 'generationConfig', reason: 'unsupported setting' }],
    },
    requestId: 'provider-request-id',
  }
  process.env.GEMINI_API_KEY = 'unit-test-key'
  globalThis.fetch = async () => new Response(JSON.stringify(providerResponse), {
    status: 400,
    statusText: 'Bad Request',
    headers: { 'Content-Type': 'application/json' },
  })
  try {
    await assert.rejects(
      generateArticle('Amazon', [], []),
      error => error.code === 'gemini_http_400'
        && JSON.parse(error.reason).response.requestId === providerResponse.requestId
        && JSON.parse(error.reason).response.error.details[0].reason === 'unsupported setting',
    )
  } finally {
    globalThis.fetch = originalFetch
    if (oldApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = oldApiKey
  }
})

test('handler scopes publishing and failure updates to the claimed attempt', () => {
  assert.match(endpoint, /const claim = getClaimedRun\(claimedRun\)[\s\S]*?attemptToken = claim\?\.attempt_token/)
  assert.match(endpoint, /publish_daily_blog_post[\s\S]*?p_attempt_token: attemptToken/)
  assert.match(endpoint, /markRunFailed\(supabase, runId, attemptToken, errorCode, errorReason\)/)
  assert.match(endpoint, /\.update\(\{[\s\S]*?error_reason: errorReason,[\s\S]*?\.eq\('attempt_token', attemptToken\)[\s\S]*?\.eq\('status', 'running'\)/)
})

test('ten-minute lease exceeds configured function maximum and provider timeouts', () => {
  const maxDurationSeconds = vercelConfig.functions['api/cron/daily-blog.js'].maxDuration
  const leaseSeconds = RUN_LEASE_MS / 1000
  assert.equal(maxDurationSeconds, 300)
  assert.ok(leaseSeconds > maxDurationSeconds)
  assert.match(endpoint, /EXPECTED_GEMINI_MODEL = 'gemini-3\.1-flash-lite'/)
  assert.match(endpoint, /models\/\$\{EXPECTED_GEMINI_MODEL\}:generateContent/)
  assert.match(endpoint, /GEMINI_REQUEST_TIMEOUT_MS = 28000/)
  assert.match(endpoint, /MAX_SUPABASE_REQUEST_MS = 4000/)
})

test('generation prompt states every article requirement enforced by validation', () => {
  assert.match(endpoint, /800–1000 words/)
  assert.match(endpoint, /## Conclusion/)
  assert.match(endpoint, /## Frequently Asked Questions/)
  assert.match(endpoint, /meta_description: maximum 160 characters/)
  assert.match(endpoint, /tags: 3–6 distinct strings/)
  assert.match(endpoint, /Amazon India, Flipkart, Meesho, Blinkit, JioMart, Swiggy Instamart, and Zepto/)
  assert.match(endpoint, /return\/refund workflows/)
  assert.match(endpoint, /Every article must be directly about EcomXtra services/)
  assert.match(endpoint, /Assigned service platform: \$\{category\}/)
  assert.match(endpoint, /seller onboarding services for this platform/)
  assert.match(endpoint, /image_url: a direct, publicly accessible HTTPS image URL/)
  assert.match(endpoint, /responds with HTTP 200 and an image content type/)
  assert.match(endpoint, /as an aspiration or slogan, never as a factual ranking/)
})

test('generation retry reinforces validation requirements after invalid output', async () => {
  const originalFetch = globalThis.fetch
  const oldApiKey = process.env.GEMINI_API_KEY
  const prompts = []
  const schemas = []
  let requestCount = 0
  process.env.GEMINI_API_KEY = 'unit-test-key'
  globalThis.fetch = async (_url, options) => {
    if (String(_url).startsWith('https://images.unsplash.com/')) {
      return new Response(null, { status: 200, headers: { 'Content-Type': 'image/jpeg' } })
    }
    const request = JSON.parse(options.body)
    prompts.push(request.contents[0].parts[0].text)
    schemas.push(request.generationConfig.responseSchema)
    const article = validArticle()
    if (requestCount++ === 0) {
      article.content = article.content.replace('### Frequently Asked Questions', '### Additional Notes')
    }
    return new Response(JSON.stringify({
      candidates: [{
        content: { parts: [{ text: JSON.stringify(article) }] },
        finishReason: 'STOP',
      }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const article = await generateArticle('Amazon', [], [])
    assert.equal(isValidArticle(article, 'Amazon'), true)
    assert.equal(prompts.length, 2)
    assert.deepEqual(schemas[0].required.slice(-2), ['image_url', 'image_alt'])
    assert.equal(article.image_url, 'https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80')
    assert.match(prompts[0], /final direct image URL that can be used in an HTML img src or as the image inside an anchor tag/)
    assert.match(prompts[1], /previous response failed these validation checks/i)
    assert.match(prompts[1], /Frequently Asked Questions or FAQs section/)
  } finally {
    globalThis.fetch = originalFetch
    if (oldApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = oldApiKey
  }
})

test('generation uses a curated category image when the generated image is unavailable', async () => {
  const originalFetch = globalThis.fetch
  const oldApiKey = process.env.GEMINI_API_KEY
  let generationCount = 0
  let imageCount = 0
  const fallbackImage = getCategoryImage('Amazon')
  process.env.GEMINI_API_KEY = 'unit-test-key'
  globalThis.fetch = async url => {
    if (String(url).startsWith('https://images.unsplash.com/')) {
      imageCount += 1
      return new Response(null, {
        status: String(url) === validArticle().image_url ? 404 : 200,
        headers: { 'Content-Type': 'image/jpeg' },
      })
    }
    generationCount += 1
    return new Response(JSON.stringify({
      candidates: [{
        content: { parts: [{ text: JSON.stringify(validArticle()) }] },
        finishReason: 'STOP',
      }],
    }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  }
  try {
    const article = await generateArticle('Amazon', [], [])
    assert.equal(article.image_url, fallbackImage.url)
    assert.equal(article.image_alt, fallbackImage.alt)
    assert.equal(generationCount, 1)
    assert.equal(imageCount, 2)
  } finally {
    globalThis.fetch = originalFetch
    if (oldApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = oldApiKey
  }
})

test('generation failure retains the final article validation reason', async () => {
  const originalFetch = globalThis.fetch
  const oldApiKey = process.env.GEMINI_API_KEY
  process.env.GEMINI_API_KEY = 'unit-test-key'
  globalThis.fetch = async () => new Response(JSON.stringify({
    candidates: [{
      content: { parts: [{ text: JSON.stringify({
        ...validArticle(),
        content: validArticle().content.replace('### Frequently Asked Questions', '### Additional Notes'),
      }) }] },
      finishReason: 'STOP',
    }],
  }), { status: 200, headers: { 'Content-Type': 'application/json' } })
  try {
    await assert.rejects(
      generateArticle('Amazon', [], []),
      error => error.code === 'gemini_output_validation_failed'
        && JSON.parse(error.reason).issues.includes('content must include a Frequently Asked Questions or FAQs section')
        && JSON.parse(error.reason).geminiResponse.candidates[0].content.parts[0].text.includes('"title"'),
    )
  } finally {
    globalThis.fetch = originalFetch
    if (oldApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = oldApiKey
  }
})

test('single-image migration preserves cover URLs and removes social_image storage', () => {
  assert.match(singleImageMigration, /set cover_image = coalesce/)
  assert.match(singleImageMigration, /drop column social_image/)
  assert.match(singleImageMigration, /insert into public\.blog_posts[\s\S]*?cover_image,[\s\S]*?image_metadata,[\s\S]*?automation_run_id/)
  const publisherFunction = singleImageMigration.split('create or replace function')[1]
  assert.ok(publisherFunction)
  assert.doesNotMatch(publisherFunction, /social_image/)
})

test('migration guards concurrent claims, expired leases, and stale attempts', () => {
  assert.match(migration, /scheduled_date date not null unique/)
  assert.match(migration, /on conflict \(scheduled_date\) do update/)
  assert.match(migration, /attempt_token = pg_catalog\.gen_random_uuid\(\)/)
  assert.match(migration, /current_run\.started_at < pg_catalog\.clock_timestamp\(\) - interval '10 minutes'/)
  assert.match(migration, /current_run\.attempt_token is distinct from p_attempt_token/)
  assert.match(migration, /current_run\.started_at <= pg_catalog\.clock_timestamp\(\) - interval '10 minutes'/)
  assert.match(migration, /select \*[\s\S]*?from public\.automation_runs\s+where id = p_run_id\s+for update/)
})

test('migration makes publication atomic and idempotent per run', () => {
  assert.match(migration, /create unique index if not exists blog_posts_automation_run_id_unique_idx/)
  assert.match(migration, /if current_run\.status = 'succeeded' then\s+return current_run\.post_id;/)
  assert.match(migration, /insert into public\.blog_posts[\s\S]*?update public\.automation_runs[\s\S]*?and attempt_token = p_attempt_token[\s\S]*?return inserted_post_id;/)
  assert.match(migration, /get diagnostics updated_rows = row_count;/)
  assert.match(migration, /and started_at > pg_catalog\.clock_timestamp\(\) - interval '10 minutes'/)
  assert.match(migration, /if updated_rows <> 1 then\s+raise exception 'Automation attempt changed during publish';/)
})

test('failure recording requires the current running attempt', () => {
  assert.match(migration, /create function public\.fail_daily_blog_run\([\s\S]*?where id = p_run_id\s+and attempt_token = p_attempt_token\s+and status = 'running';/)
})

test('failure recording saves the complete error reason without truncation', () => {
  assert.match(endpoint, /error_reason: errorReason/)
  assert.match(fullErrorReasonMigration, /error_reason = p_error_reason/)
  assert.doesNotMatch(fullErrorReasonMigration, /left\(p_error_reason/)
})

test('schema preflight checks generated columns, text arrays, and PostgreSQL aggregate syntax', () => {
  assert.match(migration, /created_at must have a default or generated value/)
  assert.match(migration, /udt_name = '_text'/)
  assert.match(migration, /pg_catalog\.count\(\*\) > 1/)
  assert.match(migration, /read_time[\s\S]*?data_type in \('text', 'character varying', 'character'\)/)
  assert.match(migration, /published_at, created_at, and updated_at must be timestamp columns/)
  assert.match(migration, /cover_image, social_image, and image_metadata must allow NULL/)
  assert.match(migration, /created_at_default is null[\s\S]*?created_at must have a default or generated value/)
})

test('article validation rejects malformed tag values and image URLs', () => {
  const article = validArticle()
  assert.equal(isValidArticle({ ...article, tags: ['one', 2, 'three'] }, 'Amazon'), false)
  assert.equal(isValidArticle({ ...article, tags: [] }, 'Amazon'), false)
  assert.equal(isValidArticle({ ...article, image_url: 'https://unsplash.com/photos/example' }, 'Amazon'), false)
  assert.equal(isValidArticle({ ...article, image_url: 'http://images.unsplash.com/photo-test' }, 'Amazon'), false)
  assert.equal(isValidArticle({ ...article, image_alt: 'x'.repeat(161) }, 'Amazon'), false)
  assert.equal(isValidArticle(article, 'Shopify & Tech'), false)
  assert.equal(isValidImagePayload(null, null), true)
  assert.equal(isValidImagePayload('http://images.pexels.com/x', {}), false)
  const image = getCategoryImage('Marketplace SEO')
  assert.match(image.url, /^https:\/\/images\.unsplash\.com\//)
  assert.ok(image.alt)
  assert.equal(isValidImagePayload(image.url, { provider: 'Unsplash', alt: image.alt }), true)
})

test('category fallback images use curated Unsplash URLs without an image provider API', () => {
  for (const category of ['Amazon', 'Flipkart', 'Meesho', 'Blinkit', 'JioMart', 'Swiggy Instamart', 'Zepto']) {
    const image = getCategoryImage(category)
    assert.match(image.url, /^https:\/\/images\.unsplash\.com\//)
    assert.ok(image.alt)
  }
  assert.doesNotMatch(endpoint, /pixabay\.com|PIXABAY_API_KEY/i)
})

test('SQL contract covers invalid tags, duplicate posts, and rollback on publish failure', () => {
  assert.match(migration, /jsonb_typeof\(p_post->'tags'\) is distinct from 'array'/)
  assert.match(migration, /jsonb_typeof\(tag\.value\) is distinct from 'string'/)
  assert.match(migration, /create unique index if not exists blog_posts_automation_run_id_unique_idx/)
  assert.match(migration, /insert into public\.blog_posts[\s\S]*?if updated_rows <> 1 then\s+raise exception/)
  assert.match(migration, /raise exception 'Automation attempt changed during publish'/)
})

test('secret comparison accepts only the exact bearer token', () => {
  assert.equal(secureSecretMatch('Bearer ' + 's'.repeat(40), 's'.repeat(40)), true)
  assert.equal(secureSecretMatch('Bearer wrong', 's'.repeat(40)), false)
  assert.equal(secureSecretMatch('Bearer ' + 's'.repeat(39), 's'.repeat(40)), false)
  assert.equal(secureSecretMatch(undefined, 's'.repeat(40)), false)
})

test('article validation enforces length and required article sections', () => {
  const article = validArticle()
  assert.ok(countWords(article.content) >= 700)
  assert.equal(isValidArticle(article, 'Amazon'), true)
  assert.equal(isValidArticle(validArticle('##'), 'Amazon'), true)
  assert.equal(isValidArticle({
    ...article,
    content: article.content
      .replace('### Conclusion', '## Conclusion:')
      .replace('### Frequently Asked Questions', '## Frequently Asked Questions:'),
  }, 'Amazon'), true)
  assert.equal(isValidArticle({
    ...article,
    content: article.content
      .replace('### Frequently Asked Questions', '## Frequently Asked Questions (FAQ)'),
  }, 'Amazon'), true)
  assert.equal(isValidArticle({
    ...article,
    content: article.content.replace(/###/g, '#'),
  }, 'Amazon'), true)
  const issues = getArticleValidationIssues({
    ...article,
    meta_description: 'x'.repeat(170),
    content: article.content.replace('### Frequently Asked Questions', '### Additional Notes'),
  }, 'Amazon')
  assert.ok(issues.includes('meta_description must be at most 160 characters'))
  assert.ok(issues.includes('content must include a Frequently Asked Questions or FAQs section'))
  assert.equal(isValidArticle({ ...article, content: `${article.content}<script>alert(1)</script>` }, 'Amazon'), false)
  assert.equal(isValidArticle({ ...article, content: article.content.replace('### Frequently Asked Questions', '### More') }, 'Amazon'), false)
})

test('title similarity continues to distinguish near-duplicate topics', () => {
  assert.ok(titleSimilarity('Shopify checkout conversion guide', 'A Shopify checkout conversion guide') > 0.7)
})

test('cron endpoint rejects unauthorized and non-GET requests', async () => {
  const response = {
    statusCode: 0,
    headers: {},
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    setHeader(name, value) {
      this.headers[name] = value
    },
    json(body) {
      this.body = body
      return this
    },
  }
  const oldSecret = process.env.CRON_SECRET
  process.env.CRON_SECRET = 'x'.repeat(40)
  try {
    await dailyBlogHandler({ method: 'GET', headers: { authorization: 'Bearer invalid' } }, response)
    assert.equal(response.statusCode, 401)
    assert.equal(response.body.error, 'unauthorized')

    response.statusCode = 0
    response.body = null
    await dailyBlogHandler({ method: 'POST', headers: {} }, response)
    assert.equal(response.statusCode, 405)
    assert.equal(response.headers.Allow, 'GET')
  } finally {
    if (oldSecret === undefined) delete process.env.CRON_SECRET
    else process.env.CRON_SECRET = oldSecret
  }
})

test('cron creates and publishes a generated blog post successfully', async () => {
  const originalFetch = globalThis.fetch
  const originalConsole = {
    info: console.info,
    warn: console.warn,
    error: console.error,
  }
  const environment = {
    CRON_SECRET: process.env.CRON_SECRET,
    GEMINI_API_KEY: process.env.GEMINI_API_KEY,
    SUPABASE_URL: process.env.SUPABASE_URL,
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
  }
  const secret = 'test-cron-secret-'.padEnd(40, 'x')
  const claim = { run_id: 'test-run-id', attempt_token: 'test-attempt-token' }
  const postId = 'test-post-id'
  const publishedCalls = []
  const failedRunCalls = []
  const events = []
  let invalidOutput = false
  const article = {
    ...validArticle(),
    title: 'A Practical Guide to Managing Amazon Seller Account Listings',
    excerpt: 'Learn practical ways to organize Amazon seller listings, improve catalogue accuracy, and manage recurring account work.',
    seo_title: 'Amazon Seller Account Listing Guide',
    meta_description: 'Practical guidance for managing Amazon seller listings, maintaining catalogue quality, and organizing account operations.',
    tags: ['Amazon', 'Seller Support', 'Listings'],
  }

  const jsonResponse = (body, status = 200) => new Response(JSON.stringify(body), {
    status,
    headers: { 'Content-Type': 'application/json' },
  })

  process.env.CRON_SECRET = secret
  process.env.GEMINI_API_KEY = 'test-gemini-key'
  process.env.SUPABASE_URL = 'https://supabase.test'
  process.env.SUPABASE_SERVICE_ROLE_KEY = 'test-supabase-key'
  console.info = (...args) => events.push(args)
  console.warn = (...args) => events.push(args)
  console.error = (...args) => events.push(args)
  globalThis.fetch = async (input, options = {}) => {
    const url = new URL(String(input))

    if (url.hostname === 'generativelanguage.googleapis.com') {
      const generatedArticle = invalidOutput
        ? {
          ...article,
          content: article.content.replace('### Frequently Asked Questions', '### Additional Notes'),
        }
        : article
      return jsonResponse({
        candidates: [{
          content: { parts: [{ text: JSON.stringify(generatedArticle) }] },
          finishReason: 'STOP',
        }],
      })
    }

    if (url.hostname === 'images.unsplash.com') {
      return new Response(null, { status: 200, headers: { 'Content-Type': 'image/jpeg' } })
    }

    if (url.hostname !== 'supabase.test') {
      throw new Error(`Unexpected request host: ${url.hostname}`)
    }

    const requestBody = options.body ? JSON.parse(options.body) : null
    if (url.pathname === '/rest/v1/automation_runs' && options.method === 'PATCH') {
      failedRunCalls.push({
        body: requestBody,
        query: url.searchParams,
      })
      return jsonResponse([{ id: claim.run_id }])
    }
    if (url.pathname === '/rest/v1/automation_runs' && options.method !== 'POST') {
      return jsonResponse([])
    }
    if (url.pathname === '/rest/v1/blog_posts' && options.method !== 'POST') {
      return jsonResponse([])
    }
    if (url.pathname === '/rest/v1/rpc/claim_daily_blog_run') {
      return jsonResponse([claim])
    }
    if (url.pathname === '/rest/v1/rpc/publish_daily_blog_post') {
      publishedCalls.push(requestBody)
      return jsonResponse(postId)
    }
    throw new Error(`Unexpected Supabase request: ${options.method} ${url.pathname}`)
  }

  const response = {
    statusCode: 0,
    body: null,
    status(code) {
      this.statusCode = code
      return this
    },
    json(body) {
      this.body = body
      return this
    },
  }

  try {
    await dailyBlogHandler({
      method: 'GET',
      headers: { authorization: `Bearer ${secret}` },
      query: { scheduled_date: '2026-10-28' },
    }, response)

    assert.equal(response.statusCode, 200)
    assert.deepEqual(response.body, {
      ok: true,
      status: 'published',
      scheduledDate: '2026-10-28',
      postId,
      slug: 'a-practical-guide-to-managing-amazon-seller-account-listings',
      category: 'Amazon',
    })
    assert.equal(publishedCalls.length, 1)
    assert.equal(publishedCalls[0].p_run_id, claim.run_id)
    assert.equal(publishedCalls[0].p_attempt_token, claim.attempt_token)
    assert.deepEqual(publishedCalls[0].p_post, {
      slug: 'a-practical-guide-to-managing-amazon-seller-account-listings',
      title: article.title,
      category: 'Amazon',
      author: 'EcomXtra Editorial Team',
      author_role: 'Editorial Team',
      read_time: `${Math.ceil(countWords(article.content) / 220)} min read`,
      cover_image: article.image_url,
      tags: article.tags,
      excerpt: article.excerpt,
      content: article.content,
      published_at: publishedCalls[0].p_post.published_at,
      seo_title: article.seo_title,
      meta_description: article.meta_description,
      image_metadata: { provider: 'Unsplash', alt: article.image_alt },
    })
    assert.ok(events.some(([entry]) => entry.includes('"event":"daily_blog_published"')))

    invalidOutput = true
    response.statusCode = 0
    response.body = null
    await dailyBlogHandler({
      method: 'GET',
      headers: { authorization: `Bearer ${secret}` },
      query: { scheduled_date: '2026-10-27' },
    }, response)

    assert.equal(response.statusCode, 502)
    assert.equal(response.body.error, 'gemini_output_validation_failed')
    assert.equal(failedRunCalls.length, 1, JSON.stringify(events))
    const savedFailure = failedRunCalls[0]
    assert.equal(savedFailure.body.error_code, 'gemini_output_validation_failed')
    assert.equal(savedFailure.query.get('attempt_token'), `eq.${claim.attempt_token}`)
    assert.equal(savedFailure.query.get('status'), 'eq.running')
    const savedReason = JSON.parse(savedFailure.body.error_reason)
    assert.ok(savedReason.issues.includes('content must include a Frequently Asked Questions or FAQs section'))
    assert.equal(
      savedReason.geminiResponse.candidates[0].content.parts[0].text,
      JSON.stringify({
        ...article,
        content: article.content.replace('### Frequently Asked Questions', '### Additional Notes'),
      }),
    )
  } finally {
    globalThis.fetch = originalFetch
    console.info = originalConsole.info
    console.warn = originalConsole.warn
    console.error = originalConsole.error
    for (const [name, value] of Object.entries(environment)) {
      if (value === undefined) delete process.env[name]
      else process.env[name] = value
    }
  }
})
