"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, Search, SlidersHorizontal } from "lucide-react";
import ProductCard from "./product-card";
import { initialProducts, publicProducts, effectivePrice, isOnSale, type CatalogProduct, type CatalogCategory } from "@/lib/catalog";
import { getSupabase, isSupabaseConfigured } from "@/lib/supabase";

export default function ProductList() {
  const [products, setProducts] = useState<CatalogProduct[]>(isSupabaseConfigured ? [] : initialProducts);
  const [categories, setCategories] = useState<CatalogCategory[]>([]);
  const [loading, setLoading] = useState(isSupabaseConfigured);
  const [error, setError] = useState("");
  const [active, setActive] = useState("all");
  const [search, setSearch] = useState("");

  useEffect(() => {
    const db = getSupabase();
    if (!db) return;
    let alive = true;
    async function load() {
      const [productsResponse, categoriesResponse] = await Promise.all([
        db!.from("products")
          .select("id,name,description,price,promotional_price,promotion_enabled,image_url,category,is_available,is_visible,is_featured,sort_order")
          .eq("is_visible", true).order("sort_order").order("id"),
        db!.from("categories").select("name,sort_order,is_active").eq("is_active", true).order("sort_order").order("name"),
      ]);
      if (!alive) return;
      if (productsResponse.error) {
        setError("Não foi possível carregar o cardápio. Tente novamente.");
      } else {
        setProducts((productsResponse.data || []) as CatalogProduct[]);
        setError("");
      }
      if (!categoriesResponse.error) setCategories((categoriesResponse.data || []) as CatalogCategory[]);
      setLoading(false);
    }
    void load();
    return () => { alive = false; };
  }, []);

  const visible = useMemo(() => publicProducts(products), [products]);
  const categoryNames = useMemo(() =>
    categories.length ? categories.map(c => c.name) : Array.from(new Set(visible.map(p => p.category))).sort((a,b) => a.localeCompare(b,"pt-BR")),
    [categories, visible]
  );
  const filtered = useMemo(() => visible.filter(p => {
    const inCategory = active === "all" || (active === "promotions" ? isOnSale(p) : p.category === active);
    const query = search.trim().toLocaleLowerCase("pt-BR");
    return inCategory && (!query || (p.name + " " + p.description + " " + p.category).toLocaleLowerCase("pt-BR").includes(query));
  }), [visible, active, search]);
  const saleCount = visible.filter(isOnSale).length;

  return (
    <section id="cardapio" className="scroll-mt-24 border-t border-white/[0.06] bg-[#101010] px-5 py-24 sm:px-8 lg:px-12 lg:py-28">
      <div className="mx-auto max-w-[1320px]">
        <div className="mb-9 text-center">
          <p className="section-kicker justify-center">ESCOLHAS QUE ENCANTAM</p>
          <h2 className="mt-5 text-[clamp(2.35rem,4.5vw,4rem)] font-semibold leading-tight tracking-[-0.045em]">
            Nossa coleção de <span className="text-[#d9904e]">sabores</span>
          </h2>
          <p className="mx-auto mt-4 max-w-lg text-sm leading-7 text-[#aaa29b] sm:text-base">
            Descubra nossos doces, escolha seus favoritos e monte sua sacola com praticidade.
          </p>
        </div>

        {!loading && !error && (
          <div className="mb-9 rounded-2xl border border-[#684730]/70 bg-[#1b1a19] p-4 sm:p-5">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[.12em] text-[#c89970]">
                <SlidersHorizontal size={17}/> Encontre seu doce
              </div>
              <label className="relative block w-full sm:max-w-[310px]">
                <Search className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#ae9b8c]" size={18}/>
                <span className="sr-only">Buscar doces</span>
                <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Buscar pelo nome..." type="search"
                  className="w-full rounded-lg border border-[#765438] bg-[#111] py-2.5 pl-10 pr-3 text-sm text-white placeholder:text-[#8f8074] outline-none focus:border-[#d9904e]"/>
              </label>
            </div>
            <div className="mt-4 flex flex-wrap gap-2" aria-label="Filtrar por categoria">
              <button type="button" aria-pressed={active === "all"} onClick={() => setActive("all")}
                className={"rounded-full border px-4 py-2 text-xs font-semibold transition " + (active === "all" ? "border-[#d9904e] bg-[#bd753e] text-white" : "border-[#5e4837] text-[#dfc1a5] hover:border-[#d9904e]")}>
                Todos ({visible.length})
              </button>
              {saleCount > 0 && <button type="button" aria-pressed={active === "promotions"} onClick={() => setActive("promotions")}
                className={"rounded-full border px-4 py-2 text-xs font-semibold transition " + (active === "promotions" ? "border-[#d9904e] bg-[#bd753e] text-white" : "border-[#5e4837] text-[#dfc1a5] hover:border-[#d9904e]")}>
                Ofertas ({saleCount})
              </button>}
              {categoryNames.map(name => (
                <button key={name} type="button" aria-pressed={active === name} onClick={() => setActive(name)}
                  className={"rounded-full border px-4 py-2 text-xs font-semibold transition " + (active === name ? "border-[#d9904e] bg-[#bd753e] text-white" : "border-[#5e4837] text-[#dfc1a5] hover:border-[#d9904e]")}>
                  {name}
                </button>
              ))}
            </div>
            <p className="mt-4 text-xs text-[#a6998d]" aria-live="polite">{filtered.length} {filtered.length === 1 ? "produto encontrado" : "produtos encontrados"}</p>
          </div>
        )}

        {loading && <p role="status" className="py-12 text-center text-[#c9b6a5]">Carregando cardápio...</p>}
        {error && <p role="alert" className="py-12 text-center text-red-300">{error}</p>}
        {!loading && !error && filtered.length === 0 &&
          <div className="py-16 text-center text-[#c9b6a5]">
            <p>Nenhum doce encontrado para este filtro.</p>
            <button type="button" className="mt-4 text-sm font-semibold text-[#d9904e] underline" onClick={() => { setActive("all"); setSearch(""); }}>Limpar filtros</button>
          </div>}
        {!error && <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filtered.map(p => <ProductCard key={p.id} id={p.id} productName={p.name} category={p.category}
            description={p.description} price={effectivePrice(p)} originalPrice={isOnSale(p) ? Number(p.price) : undefined}
            imageUrl={p.image_url} available={p.is_available} />)}
        </div>}
        <div className="mt-12 flex justify-center">
          <Link href="#como-pedir" className="inline-flex items-center gap-3 rounded-md border border-[#775134] px-6 py-3 text-xs font-semibold uppercase tracking-[0.09em] text-[#f1d1b8] transition hover:border-[#d9904e] hover:bg-[#d9904e]/10">
            Como fazer seu pedido <ArrowRight size={16} />
          </Link>
        </div>
      </div>
    </section>
  );
}
