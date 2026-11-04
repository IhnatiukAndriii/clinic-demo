-- DEMO DATA: all clinics, names, prices and descriptions below are fictional and
-- exist only to illustrate the directory. They do not describe real businesses.

insert into public.treatments (slug, name, summary, body) values (
  'dental-implants',
  'Dental Implants',
  'Replace missing teeth with titanium implants placed by experienced implant dentists in Vietnam, with clear all-inclusive packages.',
  'A dental implant is a small titanium post placed in the jawbone to support a crown, bridge or denture. Many patients combine treatment with a short stay, so packages below list exactly what is included.'
) on conflict (slug) do nothing;

insert into public.clinics (slug, name, city, country, description, years_experience, languages, is_published) values
(
  'saigon-smile-studio', 'Saigon Smile Studio', 'Ho Chi Minh City', 'Vietnam',
  E'A boutique implant practice in District 1, built around a single-visit planning day and a calm, unhurried consultation.\n\nThe team plans each case from a 3D scan and walks you through the steps before treatment begins, in English and Vietnamese.',
  12, array['English','Vietnamese'], true
),
(
  'lotus-dental-care', 'Lotus Dental Care', 'Ho Chi Minh City', 'Vietnam',
  E'A larger clinic near the airport with its own imaging suite, suited to patients who want treatment and travel logistics handled together.\n\nCoordinators help with accommodation and transfers so you can focus on your appointments.',
  9, array['English','Vietnamese','Korean'], true
),
(
  'hanoi-old-quarter-dental', 'Hanoi Old Quarter Dental', 'Hanoi', 'Vietnam',
  E'A family-run practice in Hanoi''s Old Quarter, known for careful bone assessment and a measured approach to treatment planning.\n\nPatients stay within walking distance of the clinic, which keeps follow-up visits simple.',
  15, array['English','Vietnamese','French'], true
),
(
  'danang-bay-implant-centre', 'Da Nang Bay Implant Centre', 'Da Nang', 'Vietnam',
  E'A modern implant centre a short drive from the beach, combining treatment with a relaxed recovery stay.\n\nThe team offers clear written quotes and keeps the same dentist with you from consultation to final crown.',
  7, array['English','Vietnamese'], true
)
on conflict (slug) do nothing;

insert into public.clinic_treatments (clinic_id, treatment_id, price_from, price_to, currency, price_unit, inclusions)
select c.id, t.id, v.price_from, v.price_to, 'AUD', v.price_unit, v.inclusions
from (values
  ('saigon-smile-studio',       1200, 1800, 'per implant', array['CT scan','Porcelain crown','Airport transfer','2 hotel nights']),
  ('lotus-dental-care',         1100, 1600, 'per implant', array['CT scan','Titanium implant','Porcelain crown','Airport transfer','3 hotel nights']),
  ('hanoi-old-quarter-dental',  1300, 1900, 'per implant', array['3D scan','Titanium implant','Crown fitting','Follow-up check']),
  ('danang-bay-implant-centre', 9500, 12500, 'per jaw',    array['CT scan','Full-arch prosthesis','Airport transfer','4 hotel nights','Follow-up check'])
) as v(slug, price_from, price_to, price_unit, inclusions)
join public.clinics c on c.slug = v.slug
cross join public.treatments t
where t.slug = 'dental-implants'
on conflict (clinic_id, treatment_id) do nothing;
