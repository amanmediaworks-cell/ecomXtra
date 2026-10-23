update public.site_content
set content = jsonb_set(
  jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{badge}',
    '"Marketplace Account Management for Indian Sellers"'::jsonb,
    true
  ),
  '{subheading}',
  '"EcomXtra manages your ecommerce marketplace operations—from product listings and catalogue updates to seller claims, returns, refunds, and account support."'::jsonb,
  true
)
where content_key = 'hero';

update public.site_content
set content = jsonb_set(
  jsonb_set(
    coalesce(content, '{}'::jsonb),
    '{buttons,1,label}',
    '"WhatsApp Us"'::jsonb,
    true
  ),
  '{buttons,1,href}',
  '"https://wa.me/918700259557?text=Hi%20EcomXtra%2C%20I%20need%20help%20with%20marketplace%20account%20management."'::jsonb,
  true
)
where content_key = 'hero';

update public.site_content
set content = jsonb_set(
  coalesce(content, '{}'::jsonb),
  '{title}',
  '"Marketplace Account Management India | EcomXtra"'::jsonb,
  true
)
where content_key = 'seo';

update public.site_content
set content = jsonb_set(
  coalesce(content, '{}'::jsonb),
  '{description}',
  '"EcomXtra manages Amazon, Flipkart, Meesho and more for Indian sellers—listings, catalogues, returns, claims and day-to-day marketplace operations."'::jsonb,
  true
)
where content_key = 'seo';

update public.site_content
set content = jsonb_set(
  coalesce(content, '{}'::jsonb),
  '{description}',
  '"Need help managing product listings, catalogue updates, seller claims, returns, refunds, or day-to-day marketplace account operations? Talk to EcomXtra about support for your business."'::jsonb,
  true
)
where content_key = 'contact';
