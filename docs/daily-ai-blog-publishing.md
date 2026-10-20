# Daily AI blog publishing

The production-only Vercel Cron calls `/api/cron/daily-blog` once a day at 03:30 UTC. Vercel Hobby permits daily schedules but runs with hourly precision (the trigger may be up to 59 minutes late). The SQL migration adds an atomic per-date run claim and an atomic publish transaction; duplicate requests for the same UTC date cannot publish multiple posts. A failed attempt is recorded and may be safely retried using the protected endpoint.

## Database setup

Run `supabase/migrations/20261020000000_daily_ai_blog_automation.sql` in the Supabase SQL Editor. It adds photo attribution and run-ID columns to the existing `blog_posts` table, creates the restricted `automation_runs` table and service-role-only claim, publish, and failure functions, and adds unique indexes. Each claim gets a unique lease token; publish and failure operations must present the current token, and publishing also requires an unexpired lease. The ten-minute lease is longer than the Vercel function's configured 120-second maximum, so a timed-out function cannot legitimately outlive its lease unless the database or deployment configuration changes. The migration checks the existing `blog_posts.id` type/default, `created_at` automatic value, and the columns/types used by publishing; the ID is stored in `automation_runs.post_id` as text using an explicit `id::text` conversion. It does not change blog RLS policies. The public app still depends on the existing published-only blog read policy.

If a request fails before publishing, its current attempt records a sanitized error. A request that times out or terminates before recording failure leaves the run `running`; it can be reclaimed only after its ten-minute lease expires. To retry, invoke the protected endpoint again with the original UTC scheduled date, for example `/api/cron/daily-blog?scheduled_date=2026-10-19`. The endpoint rejects future or malformed dates. The new attempt receives a new token; the old token cannot publish or alter the run status. A successful run is permanently idempotent for that UTC date. If the scheduled run finishes after midnight, use the prior date explicitly for recovery; the normal cron invocation targets the new UTC date.

If the migration stops because of duplicate slugs, resolve those duplicates first and rerun it. Do not expose the service-role key to the browser.

## Environment variables

Set these in local `.env.local` for a `vercel dev` test, and in the Vercel Project Settings for Production:

| Name | Purpose |
| --- | --- |
| `CRON_SECRET` | Random secret of at least 32 bytes; Vercel also uses it to authorize Cron requests. |
| `GEMINI_API_KEY` | Google AI Studio API key; server only. |
| `GEMINI_MODEL` | Optional. If set, must be exactly `gemini-3.1-flash-lite`; when unset, the function uses that model. The function will not silently switch models. |
| `PEXELS_API_KEY` | Optional Pexels API key; server only. If omitted, publishing continues without a cover/social image or attribution. |
| `SUPABASE_URL` | Existing project URL, server variable without the Vite prefix. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key; server only, never use a `VITE_` name. |

Generate a strong cron token, for example with Node:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

The code pins generation to `gemini-3.1-flash-lite` and makes at most two requests; quota exhaustion or provider errors fail closed and are recorded when Supabase is reachable. This model was selected after `gemini-2.5-flash` returned `404 NOT_FOUND` for this API key, even though it appeared in the model listing. Google’s model availability, free-tier eligibility, pricing, and per-project quotas can change; this code cannot inspect the project’s billing configuration or guarantee that requests are free. Before enabling scheduled publishing, confirm the model’s current pricing and the project’s billing state in the [Gemini pricing docs](https://ai.google.dev/gemini-api/docs/pricing), confirm availability in the [Gemini model list](https://ai.google.dev/gemini-api/docs/models), and check [active rate limits](https://aistudio.google.com/rate-limit). Do not enable billing if paid usage is not authorized. Free-tier prompts and outputs may be used to improve Google products under its terms.

When configured, Pexels currently documents a default limit of 200 requests/hour and 20,000/month, and requests visible Pexels linking and photographer attribution. This job uses at most one image-search request per daily article and displays both the photographer/photo link and a prominent Pexels link. If the key is absent, image lookup is skipped and the article is published without an image. See the [Pexels API guidelines](https://www.pexels.com/api/documentation/#guidelines).

Vercel Cron is available on Hobby, with once-daily minimum frequency; the function is bounded to 120 seconds. Vercel’s current Hobby policy describes the plan as for personal, non-commercial use, so a commercial EcomXtra deployment may require a different Vercel plan. Check [Vercel Cron pricing and limits](https://vercel.com/docs/cron-jobs/usage-and-pricing) and [Hobby plan terms](https://vercel.com/docs/plans/hobby).

## Testing

### Local smoke test

1. Keep the root `.env.local` file private and do not paste its contents into chat or terminal output. The server-only variables in it should be `CRON_SECRET`, `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. `PEXELS_API_KEY` is optional. `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are for the browser client; never put the service-role key in a `VITE_` variable.
2. Run `node --test api/cron/daily-blog.test.js`. This only runs local validation tests and checks that missing Pexels credentials result in no Pexels request.
3. Install/use the Vercel CLI if needed, then run `npx vercel dev` from the repository root. If prompted to link a project, choose the EcomXtra Vercel project. Do not use `vercel env pull` if it would overwrite your existing `.env.local`.
4. In a second PowerShell window, verify the endpoint rejects a request with no authorization (expected `401`) and a non-GET method (expected `405`):

   ```powershell
   Invoke-WebRequest -Method Get -Uri "http://localhost:3000/api/cron/daily-blog"
   ```

   PowerShell may display an error object for the expected `401`; it must not contain secrets. A request with a wrong bearer token also returns `401` and does not contact Supabase, Gemini, or Pexels.
5. Do not send a valid bearer token yet unless the migration has already been applied to the Supabase project named in `SUPABASE_URL` and you intend to create/publish a real blog post. A valid authorized request invokes Gemini and writes a published post directly to that database; it is not a dry run. Pexels is skipped automatically if `PEXELS_API_KEY` is unset.

After deploying, invoke the endpoint manually with the same bearer token Vercel Cron uses:

```powershell
$headers = @{ Authorization = "Bearer $env:CRON_SECRET" }
Invoke-RestMethod -Method Get -Uri "https://YOUR_PRODUCTION_DOMAIN/api/cron/daily-blog" -Headers $headers
```

The response reports `published`, `already_published`, or `already_running`. A request without the correct bearer token returns `401`; other HTTP methods return `405`. A manually triggered success for today makes the scheduled invocation idempotently skip that UTC date.

Run the local checks with `node --test api/cron/daily-blog.test.js`. SQL contract tests cover the migration's locking, token, lease, payload, and uniqueness guards, but they do not execute PostgreSQL or simulate real concurrent transactions or transaction rollback after a failed final update. Those cases require PostgreSQL (preferably a disposable Supabase project) for an integration test before production. `npm run dev` does not serve Vercel API functions; use `vercel dev` with server environment variables for local endpoint testing.

The `crons` entry is registered by Vercel only when this configuration is deployed to Production. Verify it in the project’s Cron Jobs dashboard after deployment. No deployment or live provider/database call is performed by this change.
