# Demo: dental implants in Vietnam (clinic directory), v2

Одна нова сесія Claude Code на фазу, /clear між фазами.

## Фаза 0. Вручну (5 хвилин)

1. Новий Supabase-проєкт для демо.
2. Порожній GitHub-репо `clinic-directory-demo` і Vercel-проєкт, підключений до нього.
3. У Vercel і в `.env.local`: NEXT_PUBLIC_SUPABASE_URL, NEXT_PUBLIC_SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY.
4. У Supabase Auth один користувач (email + пароль) для адмінки, окремий пароль, який більше ніде не використовується.
5. У Supabase Storage публічний bucket `clinic-photos`.

## Фаза 1. Проєкт і схема

```
Create a Next.js App Router project in the current directory with TypeScript strict, Tailwind and the Supabase SSR client. Use the latest stable versions and check the official docs for the current Supabase SSR setup instead of guessing APIs.

Create supabase/migrations/0001_init.sql with these tables:
- treatments: id, slug (unique), name, summary, body, created_at
- clinics: id, slug (unique), name, city, country, description, years_experience int, languages text[], is_published bool default false, created_at
- clinic_treatments: clinic_id, treatment_id, price_from numeric, price_to numeric nullable, currency text default 'AUD', price_unit text (for example 'per jaw', 'per implant'), inclusions text[] default '{}', primary key (clinic_id, treatment_id)
- clinic_photos: id, clinic_id, storage_path, sort_order
- enquiries: id, clinic_id nullable, treatment_id nullable, name, email, phone, preferred_channel (whatsapp, viber, telegram, email), message, status ('new','contacted','closed') default 'new', created_at

RLS: public can select only published clinics and their related rows; public can insert into enquiries only; everything else requires an authenticated user. No ratings or reviews tables.

Do not build any UI. Do not add packages beyond Next.js, Tailwind and the Supabase client packages.

After done: build, lint, run tests, verify in browser.
```

## Фаза 2. Демо-дані

```
Create supabase/seed.sql with one treatment (slug dental-implants, name Dental Implants) and 4 clearly fictional clinics in Ho Chi Minh City, Hanoi and Da Nang (invented names, no real brands). Each clinic: 2 short description paragraphs, years_experience, languages, a dental-implants price in AUD with price_unit, and 3 to 5 inclusions (for example hotel nights, airport transfer, CT scan). Use plausible prices.

Do not invent ratings, review counts, awards, accreditation claims, discounts or savings percentages. Put a comment at the top saying this is demo data.

Do not touch the migration.

After done: build, lint, run tests, verify in browser.
```

## Фаза 3. Публічні сторінки

```
Build the public pages, server-rendered:
- /treatments/[slug]: heading, summary, grid of published clinics offering the treatment. Each card shows one photo, name, city, languages, years of experience, "from A$X per jaw" price, 3 inclusions, and a "Get a free quote" button linking to the enquiry form on the clinic profile.
- /clinics/[slug]: photo gallery, description, treatments with price and unit and the full inclusions list, enquiry form.
- Enquiry form: server action with validation (name, email, phone optional, preferred channel, message) that inserts into enquiries with clinic_id and treatment_id. Clear success state and clear error messages.
- generateMetadata with title and description on both pages.
- Home page redirects to /treatments/dental-implants.

Before writing any UI, invoke the /frontend-design skill and create the design with it. Direction for the skill: warm, reassuring medical-travel look. Light background, one accent colour, large photography, generous whitespace. Clinic card layout in the spirit of Bookimed. No animations, no extra pages, no reviews, no doctor profiles, no chat widget, no discount banners.

After done: build, lint, run tests, verify in browser.
```

## Фаза 4. Адмінка

```
Build /admin protected by Supabase Auth (email + password login page; server-side check that redirects unauthenticated users to login). Pages:
- /admin/clinics: table of all clinics with a published toggle and an edit link
- /admin/clinics/new and /admin/clinics/[id]: one form with clinic fields, a prices section (one row per treatment with price_from, price_to, currency, price_unit and an inclusions list the user can add to and remove from), and multi-photo upload to the Supabase Storage bucket clinic-photos with reorder and delete
- /admin/enquiries: list with a status filter, detail view, status dropdown (new, contacted, closed)
- After saving a clinic, revalidate the affected /treatments and /clinics paths so the change appears on the public page immediately.

Server actions with validation and clear error messages. Before writing any UI, invoke the /frontend-design skill and create the admin design with it, reusing the accent colour and type from the public pages. Keep it plain and simple, with labels written for a non-technical user. No roles, no teams, no extra admin features.

After done: build, lint, run tests, verify in browser.
```

## Фаза 5. Деплой і запис для клієнта

```
Deploy state check against the Vercel production URL (provided as env var DEMO_URL). With Playwright:
1. Log in to /admin with the demo account.
2. Add a new clinic with a name, city, description, a dental-implants price with unit and inclusions, and two uploaded photos, published.
3. Open /treatments/dental-implants and confirm the new clinic appears.
4. Submit an enquiry from the new clinic's profile and confirm it appears in /admin/enquiries.
Record the run as a GIF with a pause before and after each step and save it as demo-admin-flow.gif. Report any failing step. Do not change tests to make them pass.

After done: build, lint, run tests, verify in browser.
```

## Після фази 5, вручну

- Перевір RLS: запит без авторизації не повертає неопубліковані клініки.
- Видали тестову клініку, яку створив Playwright, або залиш її як приклад "додано через адмінку".
- Демо-логін для клієнта: окремий користувач, видалити після демо.
- Підготуй відповідь клієнтові: посилання, логін для адмінки і GIF.
