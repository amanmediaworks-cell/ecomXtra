update public.blog_posts
set
  cover_image = case category
    when 'AI Automation' then 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'
    when 'Marketplace SEO' then 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    when 'CRO & Growth' then 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80'
    else 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
  end,
  social_image = case category
    when 'AI Automation' then 'https://images.unsplash.com/photo-1677442136019-21780ecad995?auto=format&fit=crop&w=1200&q=80'
    when 'Marketplace SEO' then 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&w=1200&q=80'
    when 'CRO & Growth' then 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1200&q=80'
    else 'https://images.unsplash.com/photo-1556761175-b413da4baf72?auto=format&fit=crop&w=1200&q=80'
  end,
  image_metadata = jsonb_build_object(
    'provider', 'Unsplash',
    'alt', case category
      when 'AI Automation' then 'Abstract artificial intelligence visualization'
      when 'Marketplace SEO' then 'Analytics dashboard displayed on a laptop'
      when 'CRO & Growth' then 'Online checkout using a payment terminal'
      else 'Team collaborating around a table'
    end
  ),
  updated_at = now()
where cover_image ilike '%pixabay.com%'
   or social_image ilike '%pixabay.com%'
   or image_metadata->>'provider' = 'Pixabay'
   or cover_image like 'blob:%'
   or social_image like 'blob:%';

update public.site_content
set
  content = jsonb_set(
    content,
    '{imageUrl}',
    to_jsonb(case content_key
      when 'about' then 'https://images.unsplash.com/photo-1523726491678-bf852e717f6a?auto=format&fit=crop&w=1600&q=80'
      else 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=1600&q=80'
    end),
    true
  ),
  updated_at = now()
where content->>'imageUrl' ilike '%pixabay.com%'
   or content->>'imageUrl' like 'blob:%';
