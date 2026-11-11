# Daily AI blog publishing

The production-only Vercel Cron currently calls `/api/cron/daily-blog` at 01:30 UTC and 07:00 UTC. Both calls share an atomic per-date run claim, so only one run can publish for a UTC date. The topic queue must contain an approved, distinct topic; with no approved topic, the run is recorded as skipped and no article is generated or published.

## Database setup

Apply all unapplied migrations in `supabase/migrations` in timestamp order before applying `supabase/migrations/20261111000000_keyword_first_blog_topic_queue.sql`. This includes the intervening daily-blog migrations; in particular, `20261029000000_daily_blog_full_error_reason.sql` must run before the queue migration because the queue migration replaces one of its functions. Do not rerun migrations that have already been applied. Before applying the topic-queue migration, replace `REPLACE_WITH_EXISTING_ADMIN_AUTH_UID` with the same Auth UID already authorized by the existing `blog_posts` and `site_content` write policies. The queue is editable only by that admin through the protected dashboard; the cron receives service-role access. The migration seeds GSC-backed `update_existing` recommendations, not automatically approved topics. Review them before setting a topic to `approved`.

The original automation migration adds image metadata and run-ID columns to `blog_posts`, creates the restricted `automation_runs` table and service-role-only claim, publish, and failure functions, and adds unique indexes. Each run gets a unique lease token; topic-claim, publish, and failure operations require the current token, and publishing also requires an unexpired lease. The ten-minute lease exceeds the Vercel function's configured 300-second maximum. The migration checks the existing `blog_posts.id` type/default, `created_at` automatic value, and columns/types used by publishing; the ID is stored in `automation_runs.post_id` as text. It does not change blog RLS policies.

If generation fails, the current attempt records an error and returns its claimed topic to `approved`. A timed-out process may leave a topic in `generating`; after the ten-minute lease it can be reclaimed safely. To retry a failed run, invoke the protected endpoint with its original UTC scheduled date. The endpoint rejects future or malformed dates. A retry gets a new token; the old token cannot publish or alter run state. A date skipped because no topic was approved is complete for that date; approve a topic for a later scheduled run.

If the migration stops because of duplicate slugs, resolve those duplicates first and rerun it. Do not expose the service-role key to the browser.

## Environment variables

Set these in local `.env.local` for a `vercel dev` test, and in the Vercel Project Settings for Production:

| Name | Purpose |
| --- | --- |
| `CRON_SECRET` | Random secret of at least 32 bytes; Vercel also uses it to authorize Cron requests. |
| `GEMINI_API_KEY` | Google AI Studio API key; server only. |
| `GEMINI_MODEL` | Optional. If set, must be exactly `gemini-3.1-flash-lite`; when unset, the function uses that model. The function will not silently switch models. |
| `SUPABASE_URL` | Existing project URL, server variable without the Vite prefix. |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase service-role key; server only, never use a `VITE_` name. |

Generate a strong cron token, for example with Node:

```sh
node -e "console.log(require('node:crypto').randomBytes(32).toString('hex'))"
```

The code pins generation to `gemini-3.1-flash-lite` and makes at most three attempts; quota exhaustion or provider errors fail closed and are recorded when Supabase is reachable. Google’s model availability, free-tier eligibility, pricing, and per-project quotas can change; this code cannot inspect the project’s billing configuration or guarantee that requests are free. Before enabling scheduled publishing, confirm the model’s current pricing and the project’s billing state in the [Gemini pricing docs](https://ai.google.dev/gemini-api/docs/pricing), confirm availability in the [Gemini model list](https://ai.google.dev/gemini-api/docs/models), and check [active rate limits](https://aistudio.google.com/rate-limit). Do not enable billing if paid usage is not authorized. Free-tier prompts and outputs may be used to improve Google products under its terms.

The cron only claims a topic whose editorial status is `approved`, ordered by priority and age. Each queue entry stores the exact primary keyword, marketplace, search intent, target audience, content type, proposed title, related keywords, any competing URL, verified service URL, evidence source, priority, and review date. The prompt cannot choose or replace the keyword. Existing overlapping titles are moved to `update_existing` instead of generating another article. With no approved topic, the cron safely records a skip.

The topic lifecycle uses `proposed`, `approved`, `generating`, `generated`, `needs_review`, `published`, `rejected`, and `update_existing`. The current cron transitions an approved topic through `generating` to `published` in the same database transaction as article publication; failed attempts release the topic back to `approved`. Topics need manual evidence review before approval. GSC observations are not search-volume or difficulty estimates.

The prompt receives only canonical service/blog URLs verified from the current service configuration and published article records. Generated Markdown links are rejected unless they match those URLs, and each article must link to its approved target service page. The article must answer the exact primary keyword in its title/opening and preserve the existing 700–1,800-word validator range. Platform policy claims still require editorial verification; AI validation cannot certify current platform rules.

Automated posts use one cover-image URL, stored in `blog_posts.cover_image`; social-preview metadata reuses that same cover image rather than storing a duplicate URL. Before publishing, the cron fetches the generated Unsplash image URL and requires an exact HTTP 200 response with an `image/*` content type. If the model URL cannot be verified, a curated category image is checked and used as a fallback; the post is not published unless an image is verified. Image delivery does not call Pixabay, Pexels, or any image API. The database stores the verified HTTPS URL and descriptive alt text.

Apply `supabase/migrations/20261026000000_single_blog_cover_image.sql` after the daily-blog migrations to preserve any social-only image URL in `cover_image` and remove the redundant `social_image` column. The admin editor also exposes only one cover-image field.

The cron function is configured for a 300-second maximum duration. Vercel Cron schedule and plan limits depend on the deployed plan; verify the current account plan before relying on these two schedules. Check [Vercel Cron pricing and limits](https://vercel.com/docs/cron-jobs/usage-and-pricing) and [Hobby plan terms](https://vercel.com/docs/plans/hobby).

## Testing

### Local smoke test

1. Keep the root `.env.local` file private and do not paste its contents into chat or terminal output. The server-only variables in it should be `CRON_SECRET`, `GEMINI_API_KEY`, `SUPABASE_URL`, and `SUPABASE_SERVICE_ROLE_KEY`. `VITE_SUPABASE_URL` and `VITE_SUPABASE_PUBLISHABLE_KEY` are for the browser client; never put the service-role key in a `VITE_` variable.
2. Run `node --test api/cron/daily-blog.test.js api/sitemap.test.js src/data/seoMetadata.test.js`. This runs local topic-queue, blog-validation, image, sitemap, and metadata checks.
3. Install/use the Vercel CLI if needed, then run `npx vercel dev` from the repository root. If prompted to link a project, choose the EcomXtra Vercel project. Do not use `vercel env pull` if it would overwrite your existing `.env.local`.
4. In a second PowerShell window, verify the endpoint rejects a request with no authorization (expected `401`) and a non-GET method (expected `405`):

   ```powershell
   Invoke-WebRequest -Method Get -Uri "http://localhost:3000/api/cron/daily-blog"
   ```

   PowerShell may display an error object for the expected `401`; it must not contain secrets. A request with a wrong bearer token also returns `401` and does not contact Supabase or Gemini.
5. Do not send a valid bearer token yet unless the required database migrations have been applied to the Supabase project named in `SUPABASE_URL`, an editorial topic has been reviewed and approved, and you intend to create/publish a real blog post. A valid authorized request invokes Gemini and writes a published post directly to that database; it is not a dry run.

After deploying, invoke the endpoint manually with the same bearer token Vercel Cron uses:

```powershell
$headers = @{ Authorization = "Bearer $env:CRON_SECRET" }
Invoke-RestMethod -Method Get -Uri "https://YOUR_PRODUCTION_DOMAIN/api/cron/daily-blog" -Headers $headers
```

The response reports `published`, `already_published`, or `already_running`. A request without the correct bearer token returns `401`; other HTTP methods return `405`. A manually triggered success for today makes the scheduled invocation idempotently skip that UTC date.

SQL contract tests cover the migration's locking, token, lease, payload, and uniqueness guards, but they do not execute PostgreSQL or simulate real concurrent transactions or transaction rollback after a failed final update. Those cases require PostgreSQL (preferably a disposable Supabase project) for an integration test before production. `npm run dev` does not serve Vercel API functions; use `vercel dev` with server environment variables for local endpoint testing.

The `crons` entry is registered by Vercel only when this configuration is deployed to Production. Verify it in the project’s Cron Jobs dashboard after deployment. No deployment or live provider/database call is performed by this change.
