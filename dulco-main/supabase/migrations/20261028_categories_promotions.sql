-- Categorias editáveis e promoções, mantendo os produtos existentes.
begin;

create table if not exists public.categories (
  name text primary key check (char_length(trim(name)) between 1 and 60),
  sort_order integer not null default 0,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

alter table public.categories enable row level security;
grant select on public.categories to anon, authenticated;
grant insert, update, delete on public.categories to authenticated;

drop policy if exists "Active categories visible to public" on public.categories;
create policy "Active categories visible to public" on public.categories
  for select to anon, authenticated using (is_active = true);

drop policy if exists "Admins see all categories" on public.categories;
create policy "Admins see all categories" on public.categories
  for select to authenticated using ((select public.is_admin()));

drop policy if exists "Admins insert categories" on public.categories;
create policy "Admins insert categories" on public.categories
  for insert to authenticated with check ((select public.is_admin()));

drop policy if exists "Admins update categories" on public.categories;
create policy "Admins update categories" on public.categories
  for update to authenticated
  using ((select public.is_admin())) with check ((select public.is_admin()));

drop policy if exists "Admins delete categories" on public.categories;
create policy "Admins delete categories" on public.categories
  for delete to authenticated using ((select public.is_admin()));

-- Importa automaticamente até as categorias de produtos cadastrados pelo administrador.
insert into public.categories (name, sort_order)
select category, min(sort_order) from public.products group by category
on conflict (name) do nothing;

-- Renomear uma categoria atualiza seus produtos automaticamente.
-- Excluir uma categoria em uso é bloqueado pelo FK, preservando os produtos.
alter table public.products
  add constraint products_category_reference
  foreign key (category) references public.categories(name)
  on update cascade on delete restrict;

alter table public.products
  add column if not exists promotional_price numeric(10,2),
  add column if not exists promotion_enabled boolean not null default false;

alter table public.products
  add constraint promotional_price_valid
  check (promotional_price is null or (promotional_price > 0 and promotional_price < price));

alter table public.products
  add constraint active_promotion_has_price
  check (not promotion_enabled or promotional_price is not null);

commit;
