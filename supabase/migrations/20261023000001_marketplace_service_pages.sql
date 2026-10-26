alter table public.services
  add column if not exists slug text,
  add column if not exists details jsonb not null default '{}'::jsonb;

create unique index if not exists services_slug_unique_idx
  on public.services (slug)
  where slug is not null;

update public.site_content
set content = jsonb_set(
  jsonb_set(
    jsonb_set(coalesce(content, '{}'::jsonb), '{eyebrow}', '"[ MARKETPLACE ACCOUNT OPERATIONS ]"'::jsonb, true),
    '{heading}',
    '"Marketplace Account Management"'::jsonb,
    true
  ),
  '{description}',
  '"Hands-on marketplace support for product listings, catalogue updates, seller claims, returns, refunds, account health, and everyday operations."'::jsonb,
  true
)
where content_key = 'services_section';

insert into public.services (title, description, category, slug)
values
  (
    'Amazon Account Management Services',
    'Hands-on Amazon marketplace account support for Indian sellers, from product catalogue work to seller cases and routine account operations.',
    'Marketplace Account Management',
    'amazon-account-management'
  ),
  (
    'Flipkart Account Management Services',
    'Practical Flipkart account-management support for sellers who need consistent listing, catalogue, claim, return, and day-to-day operational assistance.',
    'Marketplace Account Management',
    'flipkart-account-management'
  ),
  (
    'Meesho Account Management Services',
    'Meesho seller account support that helps organize catalogue updates, operational requests, returns, and recurring supplier-panel tasks.',
    'Marketplace Account Management',
    'meesho-account-management'
  ),
  (
    'Blinkit Account Management Services',
    'Support for brands and eligible partners coordinating product information and ongoing operational tasks related to Blinkit.',
    'Marketplace Account Management',
    'blinkit-account-management'
  ),
  (
    'JioMart Account Management Services',
    'JioMart marketplace account assistance for sellers who need help maintaining product information and coordinating routine account operations.',
    'Marketplace Account Management',
    'jiomart-account-management'
  ),
  (
    'Swiggy Instamart Account Management Services',
    'Operational account support for brands and eligible partners managing product information and recurring coordination for Swiggy Instamart.',
    'Marketplace Account Management',
    'swiggy-instamart-account-management'
  ),
  (
    'Zepto Account Management Services',
    'Zepto account-management support for brands and eligible partners who need help coordinating product information and ongoing operational work.',
    'Marketplace Account Management',
    'zepto-account-management'
  )
on conflict (slug) where slug is not null do nothing;
