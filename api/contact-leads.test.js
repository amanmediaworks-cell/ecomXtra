import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'
import { createContactLeadHandler } from './contact-leads.js'

const validBody = {
  idempotencyKey: 'b6f2c8a4-f17a-4b9d-9e22-123456789abc',
  fullName: 'Anjali Sen',
  phone: '+91 8700259557',
  email: 'anjali@example.com',
  serviceSlug: 'amazon-account-management',
  message: 'Please help with account management.',
  website: '',
}

function createResponse() {
  return {
    headers: {},
    statusCode: 0,
    body: '',
    setHeader(name, value) { this.headers[name] = value },
    end(body = '') { this.body = body },
    json(body) {
      this.body = JSON.stringify(body)
      return this
    },
    status(status) {
      this.statusCode = status
      return this
    },
  }
}

function createRequest(overrides = {}) {
  return {
    method: 'POST',
    headers: {
      host: 'ecomxtra.in',
      origin: 'https://ecomxtra.in',
      'x-vercel-forwarded-for': '203.0.113.8',
      'content-length': '300',
    },
    body: validBody,
    ...overrides,
  }
}

function createDatabase({ rateLimit = true, submitError = null } = {}) {
  const calls = []
  return {
    calls,
    async rpc(name, args) {
      calls.push({ name, args })
      if (name === 'consume_contact_submission_limit') {
        return { data: rateLimit, error: null }
      }
      if (submitError) return { data: null, error: submitError }
      return {
        data: [{
          lead_id: 'lead-uuid',
          notification_id: 'notification-uuid',
          was_duplicate: false,
        }],
        error: null,
      }
    },
  }
}

const env = {
  CONTACT_RATE_LIMIT_SECRET: 'test-secret-with-at-least-thirty-two-characters',
  SUPABASE_URL: 'https://supabase.example',
  SUPABASE_SERVICE_ROLE_KEY: 'test-service-role-key',
}

test('valid contact request atomically invokes rate limit and lead/notification RPCs', async () => {
  const database = createDatabase()
  const handler = createContactLeadHandler({
    env,
    createDatabaseClient: () => database,
    now: () => new Date('2026-11-11T00:00:00.000Z'),
    logError: () => {},
  })
  const response = createResponse()

  await handler(createRequest(), response)

  assert.equal(response.statusCode, 200)
  assert.deepEqual(JSON.parse(response.body), { ok: true, leadId: 'lead-uuid' })
  assert.deepEqual(database.calls.map(call => call.name), [
    'consume_contact_submission_limit',
    'submit_contact_lead',
  ])
  assert.equal(database.calls[1].args.p_email, 'anjali@example.com')
  assert.equal(database.calls[1].args.p_message, 'Please help with account management.')
  assert.match(database.calls[0].args.p_bucket_hash, /^[a-f0-9]{64}$/)
  assert.notEqual(database.calls[0].args.p_bucket_hash, '203.0.113.8')
})

test('validation and cross-origin failures do not call the database', async () => {
  const database = createDatabase()
  const handler = createContactLeadHandler({
    env,
    createDatabaseClient: () => database,
    logError: () => {},
  })
  const invalidResponse = createResponse()
  await handler(createRequest({ body: { ...validBody, email: 'invalid' } }), invalidResponse)
  assert.equal(invalidResponse.statusCode, 400)
  assert.equal(database.calls.length, 0)

  const crossOriginResponse = createResponse()
  await handler(createRequest({
    headers: { ...createRequest().headers, origin: 'https://attacker.example' },
  }), crossOriginResponse)
  assert.equal(crossOriginResponse.statusCode, 403)
  assert.equal(database.calls.length, 0)
})

test('rate-limited and failed database submissions never return success', async () => {
  const limitedDatabase = createDatabase({ rateLimit: false })
  const limitedHandler = createContactLeadHandler({
    env,
    createDatabaseClient: () => limitedDatabase,
    logError: () => {},
  })
  const limitedResponse = createResponse()
  await limitedHandler(createRequest(), limitedResponse)
  assert.equal(limitedResponse.statusCode, 429)
  assert.equal(limitedDatabase.calls.length, 1)

  const failedDatabase = createDatabase({ submitError: new Error('database unavailable') })
  const failedHandler = createContactLeadHandler({
    env,
    createDatabaseClient: () => failedDatabase,
    logError: () => {},
  })
  const failedResponse = createResponse()
  await failedHandler(createRequest(), failedResponse)
  assert.equal(failedResponse.statusCode, 500)
  assert.deepEqual(JSON.parse(failedResponse.body), {
    ok: false,
    error: 'contact_submission_failed',
  })
})

test('contact migration keeps lead tables private and creation transactional', async () => {
  const migration = await readFile(new URL('../supabase/migrations/20261112000000_contact_lead_management.sql', import.meta.url), 'utf8')
  assert.match(migration, /REPLACE_WITH_EXISTING_ADMIN_AUTH_UID/)
  assert.match(migration, /create table if not exists public\.contact_leads/)
  assert.match(migration, /create table if not exists public\.admin_notifications/)
  assert.match(migration, /on conflict \(idempotency_key\) do nothing/)
  assert.match(migration, /grant execute on function public\.submit_contact_lead[\s\S]+to service_role/)
  assert.match(migration, /create or replace function public\.get_contact_lead_records/)
  assert.match(migration, /limit least\(greatest\(coalesce\(p_limit, 10\), 1\), 10\)/)
  assert.match(migration, /grant update \(status, priority, follow_up_at, assigned_admin_id\) on public\.contact_leads to authenticated/)
  assert.match(migration, /create or replace function public\.mark_all_contact_notifications_read/)
  assert.match(migration, /Admins can read contact leads/)
  assert.doesNotMatch(migration, /create policy[\s\S]{0,100}to anon/)
})
