import { createClient } from '@supabase/supabase-js'
import process from 'node:process'
import handler from '../cron/daily-blog.js'

/**
 * POST /api/admin/trigger-cron
 *
 * Requires a valid Supabase Bearer token in the Authorization header.
 * Verifies the token server-side, then internally delegates to the
 * daily-blog cron handler (injecting the CRON_SECRET automatically).
 *
 * Response mirrors the cron handler's JSON response plus an extra
 * `triggeredBy` field with the admin user's email.
 */
export default async function triggerCron(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST')
    return res.status(405).json({ ok: false, error: 'method_not_allowed' })
  }

  // ── 1. Verify caller is an authenticated Supabase user ──────────────────
  const authHeader = req.headers.authorization || ''
  const userToken = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null

  if (!userToken) {
    return res.status(401).json({ ok: false, error: 'missing_auth_token' })
  }

  const supabaseUrl = process.env.SUPABASE_URL
  const serviceKey  = process.env.SUPABASE_SERVICE_ROLE_KEY
  if (!supabaseUrl || !serviceKey) {
    return res.status(500).json({ ok: false, error: 'server_configuration_error' })
  }

  const adminClient = createClient(supabaseUrl, serviceKey, {
    auth: { autoRefreshToken: false, detectSessionInUrl: false, persistSession: false },
  })

  const { data: { user }, error: userError } = await adminClient.auth.getUser(userToken)
  if (userError || !user) {
    return res.status(401).json({ ok: false, error: 'invalid_auth_token' })
  }

  const triggeredBy = user.email || user.id

  // ── 2. Build a synthetic request that passes the cron's auth check ───────
  const cronSecret = process.env.CRON_SECRET
  if (!cronSecret) {
    return res.status(500).json({ ok: false, error: 'cron_not_configured' })
  }

  // Pull an optional scheduled_date query param from the admin request
  const scheduledDate = typeof req.query?.scheduled_date === 'string'
    ? req.query.scheduled_date
    : undefined

  const cronQuery = {}
  if (scheduledDate) cronQuery.scheduled_date = scheduledDate
  if (req.body?.maxAttempts !== undefined) {
    cronQuery.max_attempts = String(req.body.maxAttempts)
  }

  const syntheticReq = {
    method: 'GET',
    headers: { authorization: `Bearer ${cronSecret}` },
    query: cronQuery,
  }

  // ── 3. Capture the cron handler's response without sending to the client ──
  let capturedStatus = 500
  let capturedBody   = { ok: false, error: 'cron_response_not_captured' }

  const syntheticRes = {
    status(code) {
      capturedStatus = code
      return this
    },
    json(body) {
      capturedBody = body
      return this
    },
    setHeader() { return this },
  }

  try {
    await handler(syntheticReq, syntheticRes)
  } catch (err) {
    console.error('trigger-cron: unexpected cron handler error', err)
    return res.status(500).json({ ok: false, error: 'cron_handler_threw', message: err?.message })
  }

  // ── 4. Forward the cron result back to the admin dashboard ────────────────
  return res.status(capturedStatus).json({ ...capturedBody, triggeredBy })
}
