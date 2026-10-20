import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import {
  chooseCategory,
  countWords,
  findPexelsImage,
  generateArticle,
  getArticleValidationIssues,
  getClaimedRun,
  getScheduledDate,
  isValidImagePayload,
  isValidArticle,
  RUN_LEASE_MS,
  safeProviderUrl,
  secureSecretMatch,
  slugify,
  titleSimilarity,
} from './daily-blog.js'
import dailyBlogHandler from './daily-blog.js'

const migration = await readFile(
  fileURLToPath(new URL('../../supabase/migrations/20261020000000_daily_ai_blog_automation.sql', import.meta.url)),
  'utf8',
)
const endpoint = await readFile(fileURLToPath(new URL('./daily-blog.js', import.meta.url)), 'utf8')
const vercelConfig = JSON.parse(await readFile(
  fileURLToPath(new URL('../../vercel.json', import.meta.url)),
  'utf8',
))

function validArticle() {
  const practicalBody = Array.from({ length: 300 }, (_, index) => `practical guidance ${index}`).join(' ')
  return {
    title: 'A Practical Guide to Improving Shopify Checkout',
    excerpt: 'A detailed practical guide to simplifying a Shopify checkout and improving the customer experience.',
    seo_title: 'Improve Shopify Checkout: Practical Guide',
    meta_description: 'Learn practical, low-risk ways to make a Shopify checkout clearer and easier for customers.',
    tags: ['Shopify', 'Checkout', 'Conversion'],
    image_search_query: 'online shopping checkout',
    content: `### Start Here\n\n${practicalBody}\n\n### Conclusion\n\nReview changes carefully.\n\n### Frequently Asked Questions\n\n#### What should I measure?\n\nUse your existing analytics.`,
  }
}

test('daily blog slug generation is lowercase, readable, and strips accents', () => {
  assert.equal(slugify('Café: Shopify & Growth!'), 'cafe-shopify-growth')
})

test('category rotation advances and wraps through the fixed list', () => {
  assert.equal(chooseCategory(undefined), 'AI Automation')
  assert.equal(chooseCategory('AI Automation'), 'Shopify & Tech')
  assert.equal(chooseCategory('CRO & Growth'), 'AI Automation')
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

test('handler passes the claimed token to both publishing and failure RPCs', () => {
  assert.match(endpoint, /const claim = getClaimedRun\(claimedRun\)[\s\S]*?attemptToken = claim\?\.attempt_token/)
  assert.match(endpoint, /publish_daily_blog_post[\s\S]*?p_attempt_token: attemptToken/)
  assert.match(endpoint, /markRunFailed\(supabase, runId, attemptToken, errorCode\)/)
  assert.match(endpoint, /fail_daily_blog_run[\s\S]*?p_attempt_token: attemptToken/)
})

test('ten-minute lease exceeds configured function maximum and provider timeouts', () => {
  const maxDurationSeconds = vercelConfig.functions['api/cron/daily-blog.js'].maxDuration
  const leaseSeconds = RUN_LEASE_MS / 1000
  assert.equal(maxDurationSeconds, 120)
  assert.ok(leaseSeconds > maxDurationSeconds)
  assert.match(endpoint, /EXPECTED_GEMINI_MODEL = 'gemini-3\.1-flash-lite'/)
  assert.match(endpoint, /models\/\$\{EXPECTED_GEMINI_MODEL\}:generateContent/)
  assert.match(endpoint, /GEMINI_REQUEST_TIMEOUT_MS = 28000/)
  assert.match(endpoint, /PEXELS_REQUEST_TIMEOUT_MS = 8000/)
  assert.match(endpoint, /MAX_SUPABASE_REQUEST_MS = 4000/)
})

test('generation prompt states every article requirement enforced by validation', () => {
  assert.match(endpoint, /950–1150 words/)
  assert.match(endpoint, /### Conclusion/)
  assert.match(endpoint, /### Frequently Asked Questions/)
  assert.match(endpoint, /meta_description at most 160 characters/)
  assert.match(endpoint, /tags 3–6 distinct strings/)
})

test('generation retry reinforces validation requirements after invalid output', async () => {
  const originalFetch = globalThis.fetch
  const oldApiKey = process.env.GEMINI_API_KEY
  const prompts = []
  let requestCount = 0
  process.env.GEMINI_API_KEY = 'unit-test-key'
  globalThis.fetch = async (_url, options) => {
    const request = JSON.parse(options.body)
    prompts.push(request.contents[0].parts[0].text)
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
    const article = await generateArticle('Shopify & Tech', [], [])
    assert.equal(isValidArticle(article, 'Shopify & Tech'), true)
    assert.equal(prompts.length, 2)
    assert.match(prompts[1], /previous response failed these validation checks/i)
    assert.match(prompts[1], /Frequently Asked Questions or FAQs section/)
  } finally {
    globalThis.fetch = originalFetch
    if (oldApiKey === undefined) delete process.env.GEMINI_API_KEY
    else process.env.GEMINI_API_KEY = oldApiKey
  }
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
  assert.equal(isValidArticle({ ...article, tags: ['one', 2, 'three'] }, 'Shopify & Tech'), false)
  assert.equal(isValidArticle({ ...article, tags: [] }, 'Shopify & Tech'), false)
  assert.equal(isValidImagePayload(null, null, null), true)
  assert.equal(isValidImagePayload('http://images.pexels.com/x', 'http://images.pexels.com/x', {}), false)
  assert.equal(isValidImagePayload(
    'https://images.pexels.com/photos/1/photo.jpg',
    'https://images.pexels.com/photos/1/photo.jpg',
    {
      provider: 'Pexels',
      photoUrl: 'https://www.pexels.com/photo/1/',
      photographerUrl: 'https://www.pexels.com/@photographer/',
      photographer: 'Photographer',
    },
  ), true)
})

test('Pexels is optional and missing API key skips the network request', async () => {
  const oldKey = process.env.PEXELS_API_KEY
  delete process.env.PEXELS_API_KEY
  try {
    assert.equal(await findPexelsImage('ecommerce checkout'), null)
  } finally {
    if (oldKey === undefined) delete process.env.PEXELS_API_KEY
    else process.env.PEXELS_API_KEY = oldKey
  }
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
  assert.equal(isValidArticle(article, 'Shopify & Tech'), true)
  const issues = getArticleValidationIssues({
    ...article,
    meta_description: 'x'.repeat(170),
    content: article.content.replace('### Frequently Asked Questions', '### Additional Notes'),
  }, 'Shopify & Tech')
  assert.ok(issues.includes('meta_description must be at most 160 characters'))
  assert.ok(issues.includes('content must include a Frequently Asked Questions or FAQs section'))
  assert.equal(isValidArticle({ ...article, content: `${article.content}<script>alert(1)</script>` }, 'Shopify & Tech'), false)
  assert.equal(isValidArticle({ ...article, content: article.content.replace('### Frequently Asked Questions', '### More') }, 'Shopify & Tech'), false)
})

test('title similarity and Pexels URLs reject inappropriate matches and hosts', () => {
  assert.ok(titleSimilarity('Shopify checkout conversion guide', 'A Shopify checkout conversion guide') > 0.7)
  assert.equal(safeProviderUrl('https://images.pexels.com/photos/1/large.jpeg', 'images.pexels.com'), 'https://images.pexels.com/photos/1/large.jpeg')
  assert.equal(safeProviderUrl('http://images.pexels.com/photos/1/large.jpeg', 'images.pexels.com'), '')
  assert.equal(safeProviderUrl('https://example.com/photo.jpg', 'images.pexels.com'), '')
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
