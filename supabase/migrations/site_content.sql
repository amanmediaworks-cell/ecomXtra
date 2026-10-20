-- Replace every REPLACE_WITH_EXISTING_ADMIN_AUTH_UID token with the Auth UID
-- already allowed by the write policies on services/showcases/testimonials/blog_posts.
create table if not exists public.site_content (
  id uuid primary key default gen_random_uuid(),
  content_key text not null unique,
  content jsonb not null default '{}'::jsonb,
  is_public boolean not null default true,
  display_order integer not null default 0,
  updated_at timestamptz not null default now()
);

alter table public.site_content enable row level security;

grant select on public.site_content to anon, authenticated;
grant insert, update, delete on public.site_content to authenticated;

drop policy if exists "Public can read visible site content" on public.site_content;
create policy "Public can read visible site content"
  on public.site_content
  for select
  to anon, authenticated
  using (
    is_public = true
    or auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid
  );

drop policy if exists "Authorized admin can insert site content" on public.site_content;
create policy "Authorized admin can insert site content"
  on public.site_content
  for insert
  to authenticated
  with check (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

drop policy if exists "Authorized admin can update site content" on public.site_content;
create policy "Authorized admin can update site content"
  on public.site_content
  for update
  to authenticated
  using (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid)
  with check (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

drop policy if exists "Authorized admin can delete site content" on public.site_content;
create policy "Authorized admin can delete site content"
  on public.site_content
  for delete
  to authenticated
  using (auth.uid() = 'REPLACE_WITH_EXISTING_ADMIN_AUTH_UID'::uuid);

insert into public.site_content (content_key, content, is_public, display_order)
values
  ('hero', '{"badge":"High-Converting Storefronts & AI Automation","heading":"ECOMXTRA","subheading":"We build high-converting ecommerce storefronts, custom integrations, and smart Hinglish AI automation that automatically closes sales for growth-minded brands.","description":"","imageUrl":"","buttons":[{"label":"Book Consultation","href":"/contact"},{"label":"Chat With AI Agent","href":"https://wa.me/918700259557?text=Hi%20EcomXtra%2C%20I%20want%20to%20chat%20with%20an%20AI%20agent%20and%20get%20a%20quote"}]}'::jsonb, true, 10),
  ('about', '{"eyebrow":"[ PHILOSOPHY ]","heading":"We design systems where digital efficiency and raw automation align to drive commerce.","description":"We reject standard, bloated templates. EcomXtra operates on precision principles: heavy typography, high-contrast layouts, and robust backend integrations that require zero manual upkeep.","imageUrl":"","highlights":["High-speed storefronts","Automated catalog syncs","AI-driven WhatsApp conversations"]}'::jsonb, true, 20),
  ('why_choose_us', '{"heading":"The 4 Core Pillars of EcomXtra","description":"Purpose-built commerce systems for measurable growth.","features":[{"icon":"Zap","title":"Sub-Second Speed Architecture","description":"Speed directly dictates conversion rate. We engineer headless storefronts and optimized Shopify setups with instant page load times to eliminate bounce rates."},{"icon":"Cpu","title":"Hinglish AI Conversational Closers","description":"Indian buyers convert when spoken to in natural language. Our custom WhatsApp AI chatbots engage leads, resolve COD queries, and recover abandoned carts 24/7."},{"icon":"BarChart3","title":"Algorithmic Marketplace Dominance","description":"From Amazon IN to Flipkart & Meesho, we optimize listing keywords, A+ content, and fulfillment pipelines to improve marketplace performance."},{"icon":"ShieldCheck","title":"Enterprise Backend Reliability","description":"Reliable architecture helps keep commerce systems resilient during high-volume sales events."}]}'::jsonb, true, 25),
  ('process', '{"heading":"Our 3-Phase Marketplace Growth Framework","steps":[{"title":"Algorithm & Keyword Audit","description":"We evaluate search indexing, competitor ranking gaps, and buy-box ownership rates across target marketplace platforms."},{"title":"Listing & Creative Optimization","description":"We improve A+ content, bullet points, mobile-first carousel images, and localized search tags for organic click-through."},{"title":"Automated Conversions & PPC","description":"Deploying conversational automation and targeted campaigns to continuously scale sales volume."}]}'::jsonb, true, 30),
  ('stats', '{"metrics":[{"value":"2.4x","label":"Average Client Conversion Boost","description":"Optimizing product visibility and search queries across Amazon and Shopify stores."},{"value":"45%","label":"AI Whatsapp Deal Closures","description":"Trained to communicate fluidly in English, Hindi, and Hinglish like a human support representative."},{"value":"15h+","label":"Admin Hours Saved Weekly","description":"Automating inventory synchronization, fulfillment channels, and marketing lists."}]}'::jsonb, true, 40),
  ('showcase_section', '{"eyebrow":"[ METRIC SHOWCASE ]","heading":"App Store & Marketplace Ranking Audits","description":"We don''t guess — we audit, optimize, and measure. These are real client results across four of India''s largest commerce platforms, achieved within 30–90 days.","metric":"Average 2.4× revenue lift across audited accounts","ctaText":"Want results like these for your brand?","ctaButton":"Get a Free Audit","ctaHref":"/contact"}'::jsonb, true, 50),
  ('services_section', '{"eyebrow":"[ AGENCY CAPABILITIES ]","heading":"Bespoke eCommerce Solutions","description":""}'::jsonb, true, 60),
  ('testimonials_section', '{"eyebrow":"[ CLIENT REVIEWS ]","heading":"What eCommerce Brands Say"}'::jsonb, true, 70),
  ('contact', '{"eyebrow":"[ GET IN TOUCH ]","heading":"Scale Your Marketplace Presence","description":"Whether you are looking to audit your marketplace rankings, automate deals via Hinglish WhatsApp chatbots, or build a custom headless Shopify storefront—we can help.","email":"info@ecomxtra.in","phone":"+91 8700259557","whatsappNumber":"918700259557","parentCompany":"Quadranex IT Solutions","parentCompanyUrl":"https://quadranex-seven.vercel.app/","consultationButton":"Book Consultation","careersButton":"Apply for Careers"}'::jsonb, true, 80),
  ('footer', '{"companyDescription":"High-converting custom store design, catalog automation, and custom Hinglish AI closers.","parentCompany":"Quadranex IT Solutions","parentCompanyUrl":"https://quadranex-seven.vercel.app/","email":"info@ecomxtra.in","phone":"+91 8700259557","navigationLinks":[{"label":"Home","path":"/"},{"label":"Philosophy","path":"/philosophy"},{"label":"Showcase","path":"/showcase"},{"label":"Services","path":"/services"},{"label":"Blog","path":"/blog"},{"label":"Testimonials","path":"/testimonials"},{"label":"Contact","path":"/contact"}],"socialLinks":[{"label":"GitHub","url":"https://github.com"},{"label":"LinkedIn","url":"https://linkedin.com"},{"label":"X / Twitter","url":"https://x.com"}],"copyright":"EcomXtra. All rights reserved."}'::jsonb, true, 90),
  ('seo', '{"title":"EcomXtra | eCommerce Growth & AI Automation","description":"High-converting ecommerce storefronts, custom integrations, and smart AI automation for growth-minded brands.","socialImage":"/logo.png"}'::jsonb, true, 100)
on conflict (content_key) do nothing;
