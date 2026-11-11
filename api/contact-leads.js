import { createHmac } from 'node:crypto'
import process from 'node:process'
import { createClient } from '@supabase/supabase-js'
import { normalizeContactLead } from '../src/utils/contactLead.js'

const MAX_REQUEST_BYTES = 16 * 1024
const MAX_SUBMISSIONS_PER_HOUR = 5
const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i

function sendJson(res, status, body) {
  res.setHeader('Content-Type', 'application/json; charset=utf-8')
  res.setHeader('Cache-Control', 'no-store')
  res.setHeader('X-Content-Type-Options', 'nosniff')
  res.statusCode = status
  res.end(JSON.stringify(body))
}

function sameOrigin(req) {
  const origin = req.headers?.origin
  const host = req.headers?.['x-forwarded-host'] || req.headers?.host
  if (!origin || !host) return true
  try {
    return new URL(origin).host.toLowerCase() === String(host).toLowerCase()
  } catch {
    return false
  }
}

function getClientAddress(req) {
  const vercelAddress = req.headers?.['x-vercel-forwarded-for']
  if (typeof vercelAddress === 'string' && vercelAddress.trim()) return vercelAddress.split(',').at(-1).trim()
  const forwardedAddress = req.headers?.['x-forwarded-for']
  if (typeof forwardedAddress === 'string' && forwardedAddress.trim()) return forwardedAddress.split(',').at(-1).trim()
  return req.socket?.remoteAddress || ''
}

function getSupabaseClient(env) {
  if (!env.SUPABASE_URL || !env.SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('Contact lead database credentials are not configured.')
  }
  return createClient(env.SUPABASE_URL, env.SUPABASE_SERVICE_ROLE_KEY, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  })
}

export function createContactLeadHandler({
  env = process.env,
  createDatabaseClient = getSupabaseClient,
  now = () => new Date(),
  logError = console.error,
} = {}) {
  return async function contactLeadHandler(req, res) {
    if ((req.method || 'GET').toUpperCase() !== 'POST') {
      res.setHeader('Allow', 'POST')
      sendJson(res, 405, { ok: false, error: 'method_not_allowed' })
      return
    }

    if (!sameOrigin(req)) {
      sendJson(res, 403, { ok: false, error: 'same_origin_required' })
      return
    }

    const fetchSite = req.headers?.['sec-fetch-site']
    if (fetchSite === 'cross-site') {
      sendJson(res, 403, { ok: false, error: 'same_origin_required' })
      return
    }

    const contentLength = Number(req.headers?.['content-length'] || 0)
    if (contentLength > MAX_REQUEST_BYTES) {
      sendJson(res, 413, { ok: false, error: 'request_too_large' })
      return
    }

    const body = typeof req.body === 'string'
      ? (() => {
        try { return JSON.parse(req.body) } catch { return null }
      })()
      : req.body
    if (!body || typeof body !== 'object' || Array.isArray(body)) {
      sendJson(res, 400, { ok: false, error: 'invalid_request' })
      return
    }
    if (body.website) {
      sendJson(res, 400, { ok: false, error: 'invalid_request' })
      return
    }

    const idempotencyKey = body.idempotencyKey
    if (typeof idempotencyKey !== 'string' || !UUID_PATTERN.test(idempotencyKey)) {
      sendJson(res, 400, { ok: false, error: 'invalid_idempotency_key' })
      return
    }
    const { data: lead, errors } = normalizeContactLead(body)
    if (Object.keys(errors).length) {
      sendJson(res, 400, { ok: false, error: 'validation_failed', fields: errors })
      return
    }

    const rateLimitSecret = env.CONTACT_RATE_LIMIT_SECRET
    if (typeof rateLimitSecret !== 'string' || rateLimitSecret.length < 32) {
      logError('Contact lead endpoint is missing CONTACT_RATE_LIMIT_SECRET.')
      sendJson(res, 503, { ok: false, error: 'contact_service_unavailable' })
      return
    }
    const clientAddress = getClientAddress(req)
    if (!clientAddress) {
      logError('Contact lead endpoint could not determine the request address.')
      sendJson(res, 503, { ok: false, error: 'contact_service_unavailable' })
      return
    }

    try {
      const database = createDatabaseClient(env)
      const bucketHash = createHmac('sha256', rateLimitSecret).update(clientAddress).digest('hex')
      const { data: withinLimit, error: rateLimitError } = await database.rpc(
        'consume_contact_submission_limit',
        {
          p_bucket_hash: bucketHash,
          p_now: now().toISOString(),
          p_max_submissions: MAX_SUBMISSIONS_PER_HOUR,
        },
      )
      if (rateLimitError) throw rateLimitError
      if (withinLimit !== true) {
        sendJson(res, 429, { ok: false, error: 'rate_limit_exceeded' })
        return
      }

      const { data, error } = await database.rpc('submit_contact_lead', {
        p_idempotency_key: idempotencyKey,
        p_full_name: lead.fullName,
        p_phone: lead.phone,
        p_email: lead.email,
        p_service_slug: lead.serviceSlug,
        p_message: lead.message,
      })
      if (error) throw error
      const result = Array.isArray(data) ? data[0] : data
      if (!result?.lead_id || !result?.notification_id) {
        throw new Error('Contact lead transaction returned an incomplete result.')
      }

      sendJson(res, 200, { ok: true, leadId: result.lead_id })
    } catch (error) {
      logError('Contact lead submission failed.', error)
      sendJson(res, 500, { ok: false, error: 'contact_submission_failed' })
    }
  }
}

export default createContactLeadHandler()
