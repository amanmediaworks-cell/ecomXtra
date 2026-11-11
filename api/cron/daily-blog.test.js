import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { fileURLToPath } from 'node:url'
import process from 'node:process'
import {
  buildPrompt,
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
import { getBlogTopicValidationIssues } from '../../src/data/blogTopicQueue.js'

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
const topicQueueMigration = await readFile(
  fileURLToPath(new URL('../../supabase/migrations/20261111000000_keyword_first_blog_topic_queue.sql', import.meta.url)),
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
    content: `${heading} Start Here\n\nSee [Amazon account support](https://ecomxtra.in/services/amazon-account-management) for related services.\n\n${practicalBody}\n\n${heading} Next Steps\n\n${practicalBody}\n\n${heading} Conclusion\n\n${conclusion}\n\n${heading} Frequently Asked Questions\n\n${faq}`,
  }
}

const approvedTopic = {
  primary_keyword: 'A Practical Guide to Improving Shopify Checkout',
  marketplace: 'Amazon',
  search_intent: 'seller_education',
  target_audience: 'Indian Amazon sellers',
  content_type: 'Practical guide',
  proposed_title: 'A Practical Guide to Improving Shopify Checkout',
  secondary_keywords: ['seller support'],
  existing_competing_page: null,
  target_internal_url: 'https://ecomxtra.in/services/amazon-account-management',
  priority: 3,
  evidence_source: 'Unit test fixture',
  status: 'generating',
}
const approvedRelatedPages = [
  { title: 'Amazon account support', url: approvedTopic.target_internal_url },
]

test('daily blog slug generation is lowercase, readable, and strips accents', () => {
  assert.equal(slugify('Café: Shopify & Growth!'), 'cafe-shopify-growth')
})

test('category rotation advances and wraps through the fixed list', () => {
  assert.equal(chooseCategory(undefined), 'Amazon')
  assert.equal(chooseCategory('Amazon'), 'Flipkart')
  assert.equal(chooseCategory('Zepto'), 'Myntra')
  assert.equal(chooseCategory('Nykaa'), 'Amazon')
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

test('handler scopes publishing and failure updates to the claimed attempt', () => {
  assert.match(endpoint, /const claim = getClaimedRun\(claimedRun\)[\s\S]*?attemptToken = claim\?\.attempt_token/)
  assert.match(endpoint, /publish_daily_blog_post[\s\S]*?p_attempt_token: attemptToken/)
  assert.match(endpoint, /markRunFailed\(supabase, runId, attemptToken, errorCode, errorReason\)/)
  assert.match(endpoint, /rpc\('fail_daily_blog_run',\s*\{[\s\S]*?p_attempt_token: attemptToken,[\s\S]*?p_error_reason: errorReason/)
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
  assert.match(endpoint, /900–1,400 words/)
  assert.match(endpoint, /## Conclusion/)
  assert.match(endpoint, /## Frequently Asked Questions/)
  assert.match(endpoint, /meta_description: maximum 160 characters/)
  assert.match(endpoint, /tags: 3–6 distinct strings/)
  assert.match(endpoint, /Amazon India, Flipkart, Meesho, Blinkit, JioMart, Swiggy Instamart, Zepto, Myntra, AJIO, or Nykaa/)
  assert.match(endpoint, /return\/refund workflows/)
  assert.match(endpoint, /Every article must be directly about EcomXtra services/)
  assert.match(endpoint, /Assigned service platform: \$\{category\}/)
  assert.match(endpoint, /seller onboarding services for this platform/)
  assert.match(endpoint, /image_url: a direct, publicly accessible HTTPS image URL/)
  assert.match(endpoint, /responds with HTTP 200 and an image content type/)
  assert.match(endpoint, /Never make unsupported leadership, ranking, award, results, guarantee/)
  assert.match(endpoint, /Do not invent, replace, broaden, or switch the primary keyword/)
  assert.match(endpoint, /Verified internal pages allowed for helpful links/)
})

test('approved topic prompt preserves the supplied keyword and verified link targets', () => {
  const prompt = buildPrompt(approvedTopic, [], [], approvedRelatedPages)
  assert.match(prompt, /Exact primary keyword: A Practical Guide to Improving Shopify Checkout/)
  assert.match(prompt, /Search intent: seller_education/)
  assert.match(prompt, /Target audience: Indian Amazon sellers/)
  assert.match(prompt, /https:\/\/ecomxtra\.in\/services\/amazon-account-management/)
  assert.doesNotMatch(prompt, /Choose one specific, search-focused customer problem/)
})

test('editorial queue validates marketplace, intent, status, priority, and internal service URL', () => {
  assert.deepEqual(
    getBlogTopicValidationIssues(approvedTopic, ['Amazon'], [approvedTopic.target_internal_url]),
    [],
  )
  const issues = getBlogTopicValidationIssues({
    ...approvedTopic,
    search_intent: 'unknown',
    status: 'auto_publish',
    priority: 8,
    target_internal_url: 'https://example.com/amazon',
  }, ['Amazon'], [approvedTopic.target_internal_url])
  assert.ok(issues.some(issue => issue.includes('Search intent')))
  assert.ok(issues.some(issue => issue.includes('Editorial status')))
  assert.ok(issues.some(issue => issue.includes('Priority')))
  assert.ok(issues.some(issue => issue.includes('verified EcomXtra marketplace service page')))
  assert.ok(getBlogTopicValidationIssues({
    ...approvedTopic,
    search_intent: 'navigational',
  }, ['Amazon'], [approvedTopic.target_internal_url]).some(issue => issue.includes('cannot be generated')))
})

test('article quality validation rejects missing target keywords and unapproved links', () => {
  const article = validArticle()
  const issues = getArticleValidationIssues({
    ...article,
    content: article.content.replace(
      'https://ecomxtra.in/services/amazon-account-management',
      'https://example.com/amazon',
    ),
  }, 'Amazon', approvedTopic, approvedRelatedPages)
  assert.ok(issues.includes('content must include the approved target service page link'))
  assert.ok(issues.some(issue => issue.includes('unverified internal or external link')))
})

test('topic queue migration restricts publication to approved, locked topics', () => {
  assert.match(topicQueueMigration, /create table if not exists public\.blog_topic_queue/)
  assert.match(topicQueueMigration, /status = 'approved'/)
  assert.match(topicQueueMigration, /for update skip locked/)
  assert.match(topicQueueMigration, /publish_daily_blog_post_from_topic/)
  assert.match(topicQueueMigration, /status = 'published'/)
  assert.match(topicQueueMigration, /status = 'approved'[\s\S]*?status = 'generating'/)
  assert.match(topicQueueMigration, /REPLACE_WITH_EXISTING_ADMIN_AUTH_UID/)
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
    const article = await generateArticle(approvedTopic, [], [], approvedRelatedPages)
    assert.equal(isValidArticle(article, 'Amazon', approvedTopic, approvedRelatedPages), true)
    assert.equal(prompts.length, 2)
    assert.deepEqual(schemas[0].required.slice(-2), ['image_url', 'image_alt'])
    assert.equal(article.image_url, 'https://images.unsplash.com/photo-test?auto=format&fit=crop&w=1200&q=80')
    assert.match(prompts[0], /Any Markdown links in the article must use only the verified internal URLs/)
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
    const article = await generateArticle(approvedTopic, [], [], approvedRelatedPages)
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
  assert.match(endpoint, /p_error_reason: errorReason/)
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
  for (const category of ['Amazon', 'Flipkart', 'Meesho', 'Blinkit', 'JioMart', 'Swiggy Instamart', 'Zepto', 'Myntra', 'AJIO', 'Nykaa']) {
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
