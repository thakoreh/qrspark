-- Demo data after creating a real auth user. Replace the UUID below with your user id.
insert into public.folders (id, owner_id, name) values
('11111111-1111-1111-1111-111111111111', '00000000-0000-0000-0000-000000000000', 'Retail'),
('22222222-2222-2222-2222-222222222222', '00000000-0000-0000-0000-000000000000', 'Real estate');

insert into public.qr_codes (id, owner_id, folder_id, name, kind, is_dynamic, payload, slug, style) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', '00000000-0000-0000-0000-000000000000', '11111111-1111-1111-1111-111111111111', 'Cafe loyalty launch', 'url', true, 'https://example.com/latte', 'cafe-loyalty', '{"dark":"#18181b","light":"#ffffff","shape":"rounded"}'),
('bbbbbbbb-bbbb-bbbb-bbbb-bbbbbbbbbbbb', '00000000-0000-0000-0000-000000000000', '22222222-2222-2222-2222-222222222222', 'Open house lead card', 'url', true, 'https://example.com/open-house', 'open-house', '{"dark":"#0f766e","light":"#ffffff","shape":"dots"}');

insert into public.redirect_variants (qr_id, url, weight, utm, conversion_pixel) values
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://example.com/latte-a', 60, '{"campaign":"latte_launch","variant":"a"}', 'lead_submit'),
('aaaaaaaa-aaaa-aaaa-aaaa-aaaaaaaaaaaa', 'https://example.com/latte-b', 40, '{"campaign":"latte_launch","variant":"b"}', 'lead_submit');
