# Technical SEO and crawl rendering

## Rendering and URLs

Production Vercel rewrites route requests through `api/render-page.js`. The handler server-renders the existing React app into the initial HTML and hydrates that markup in the browser. Blog pages are loaded from the published-only Supabase rows on each request; an unknown or unpublished article receives HTTP 404, and an ID-based legacy URL redirects to its stored slug. The canonical hostname is `https://ecomxtra.in`; trailing slashes and duplicate route aliases redirect to the normalized route. Tracking/query parameters are omitted from canonical links.

Run `npm run build` to produce both the public Vite build and the server renderer in `dist/server`. Vercel must run that build command and include `dist/**` in the page-render function deployment. The sitemap handler at `/api/sitemap` is exposed as `/sitemap.xml` and reads currently published article slugs and persisted `updated_at` timestamps from Supabase. Its short cache allows newly published, edited, and deleted posts to appear without a manual URL list.

## Search metadata and structured data

The shared route metadata module defines unique titles and descriptions for public pages and article-specific metadata from the published article title and excerpt. It also sets the canonical URL, robots policy, Open Graph fields, and Twitter card fields. The same metadata is emitted into the initial server response and kept in sync during client-side navigation.

Organization and WebSite JSON-LD are included on public pages. Article pages add BlogPosting and BreadcrumbList JSON-LD using the actual article URL, author, publication/modification timestamps, and an absolute HTTPS image. No ratings, addresses, or other unverified business claims are synthesized.

`public/robots.txt` allows public content and assets, disallows only `/admin` and `/api/`, and declares the sitemap URL. Published blog pages are linked from the blog listing with HTML anchors; its Previous/Next pagination links expose older pages to crawlers.

## Image providers

Automated blog posts use curated, stable Unsplash image URLs directly, without an image API or browser object URLs. Blog images reserve 1200×675 dimensions, use title/category-based alt text, load eagerly when featured, and lazy-load below the fold. Apply `supabase/migrations/20261022000000_replace_pixabay_images.sql` to replace legacy Pixabay and `blob:` blog/site-content image values already stored in Supabase.

## Deployment and checks

1. Apply `supabase/migrations/20261022000000_replace_pixabay_images.sql` to the production Supabase project.
2. Deploy the updated Vercel configuration and confirm its production domains include `ecomxtra.in`. Configure `www.ecomxtra.in` as a Vercel domain alias that redirects to the preferred hostname if it is currently enabled; hostname and HTTPS redirects are also affected by the Vercel domain configuration.
3. Check `/`, `/blog`, a published `/blog/{slug}`, `/sitemap.xml`, and `/robots.txt`. Confirm article requests return rendered HTML and 200, removed/draft slugs return 404, and sitemap requests return XML with 200.
4. Run `npm run build`, `npm run lint`, and `node --test api/sitemap.test.js api/cron/daily-blog.test.js`.

Search engines make their own crawl and indexing decisions; correct metadata and crawlable HTML do not guarantee indexing.
